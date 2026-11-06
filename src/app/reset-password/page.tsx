import type { Metadata } from 'next';
import PasswordForm from '@/features/auth/password-form';
export const metadata: Metadata = { title: 'Đặt mật khẩu mới • LINGUA WARS' };
export default function ResetPasswordPage() { return <PasswordForm mode="reset" />; }
