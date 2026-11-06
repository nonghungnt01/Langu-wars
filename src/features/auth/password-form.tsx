'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import { browserDb } from '@/lib/supabase';
import { recoveryError, validatePassword } from './password';

export default function PasswordForm({ mode }: { mode: 'request' | 'reset' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(mode === 'reset');
  const [allowed, setAllowed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (mode !== 'reset') return;
    let active = true;
    async function checkSession() {
      try {
        const db = browserDb();
        if (!db) throw new Error('unconfigured');
        if (new URLSearchParams(window.location.search).has('recovery_error')) {
          if (active) setMessage('Liên kết đã hết hạn, đã được dùng hoặc được mở trên trình duyệt khác. Hãy yêu cầu email mới trên trình duyệt này.');
          return;
        }
        const { data: { user }, error } = await db.auth.getUser();
        if (active) {
          setAllowed(!error && !!user);
          if (error || !user) setMessage('Chưa có phiên đặt lại mật khẩu. Hãy mở liên kết trong email hoặc yêu cầu email mới.');
        }
      } catch {
        if (active) setMessage('Không thể kiểm tra phiên đăng nhập. Kiểm tra cấu hình Supabase và kết nối rồi tải lại trang.');
      } finally {
        if (active) setChecking(false);
      }
    }
    void checkSession();
    return () => { active = false; };
  }, [mode]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setMessage('');
    if (mode === 'reset') {
      const validation = validatePassword(password, confirmation);
      if (validation) { setMessage(validation); return; }
      if (!allowed) { setMessage('Hãy yêu cầu liên kết đặt lại mật khẩu mới.'); return; }
    }
    setBusy(true);
    try {
      const db = browserDb();
      if (!db) { setMessage('Chưa cấu hình Supabase. Vui lòng liên hệ chủ game.'); return; }
      if (mode === 'request') {
        const { error } = await db.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth/callback`,
        });
        if (error) { setMessage(recoveryError(error)); return; }
        // Do not reveal whether an address belongs to a registered account.
        setSuccess(true);
        setMessage('Nếu email có tài khoản, bạn sẽ nhận được liên kết đặt lại mật khẩu. Kiểm tra cả thư rác và mở liên kết trong cùng trình duyệt đã gửi yêu cầu.');
      } else {
        const { error } = await db.auth.updateUser({ password });
        if (error) { setMessage(recoveryError(error)); return; }
        setPassword('');
        setConfirmation('');
        setSuccess(true);
        setAllowed(false);
        // Clear this browser session after the change. The password is already saved if sign-out fails.
        const { error: signOutError } = await db.auth.signOut({ scope: 'local' });
        setMessage(signOutError
          ? 'Mật khẩu đã được cập nhật. Phiên trình duyệt chưa đăng xuất được; hãy trở về game và đăng xuất trước khi thử mật khẩu mới.'
          : 'Đã cập nhật mật khẩu. Trở về game và đăng nhập bằng mật khẩu mới.');
      }
    } catch {
      setMessage('Kết nối bị gián đoạn. Vui lòng thử lại.');
    } finally {
      setBusy(false);
    }
  }

  return <main className="recovery-page">
    <section className="panel recovery-card" aria-labelledby="recovery-title">
      <Link className="recovery-back" href="/"><ArrowLeft size={16} /> Trở về LINGUA WARS</Link>
      {mode === 'request' ? <Mail className="gold" size={34} /> : <KeyRound className="gold" size={34} />}
      <h1 id="recovery-title">{mode === 'request' ? 'Tìm lại chìa khóa đế chế' : 'Đặt mật khẩu mới'}</h1>
      <p className="muted">{mode === 'request' ? 'Nhập email đã đăng ký để nhận liên kết khôi phục mật khẩu.' : 'Dùng mật khẩu riêng cho tài khoản của bạn, ít nhất 8 ký tự.'}</p>
      {checking ? <p role="status">Đang kiểm tra liên kết…</p> : !success && (mode === 'request' || allowed) ? <form onSubmit={submit}>
        {mode === 'request' ? <label htmlFor="recovery-email">Email đăng ký
          <input id="recovery-email" type="email" autoComplete="email" inputMode="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} disabled={busy} />
        </label> : <>
          <label htmlFor="new-password">Mật khẩu mới
            <input id="new-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} disabled={busy} />
          </label>
          <label htmlFor="confirm-password">Nhập lại mật khẩu mới
            <input id="confirm-password" type="password" autoComplete="new-password" minLength={8} required value={confirmation} onChange={e => setConfirmation(e.target.value)} disabled={busy} />
          </label>
        </>}
        <button className="primary" type="submit" disabled={busy}>{busy ? 'Đang xử lý…' : mode === 'request' ? 'Gửi email khôi phục' : 'Lưu mật khẩu mới'}</button>
      </form> : null}
      {message && <p className="auth-message" role="status" aria-live="polite">{message}</p>}
      {mode === 'reset' && !checking && !allowed && !success && <Link className="secondary" href="/forgot-password">Yêu cầu email mới</Link>}
      {success && <Link className="secondary" href="/">{mode === 'reset' ? 'Trở về game để đăng nhập' : 'Trở về game'}</Link>}
    </section>
  </main>;
}
