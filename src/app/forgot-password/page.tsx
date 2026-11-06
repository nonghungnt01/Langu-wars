import type { Metadata } from 'next';
import PasswordForm from '@/features/auth/password-form';
export const metadata: Metadata = { title: 'Khôi phục mật khẩu • LINGUA WARS' };
export default function ForgotPasswordPage() { return <PasswordForm mode="request" />; }
