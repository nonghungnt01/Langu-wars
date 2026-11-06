export function validatePassword(password: string, confirmation: string): string | null {
  if (password.length < 8) return 'Mật khẩu cần ít nhất 8 ký tự.';
  if (password !== confirmation) return 'Hai mật khẩu chưa khớp. Vui lòng nhập lại.';
  return null;
}

export function recoveryError(error: { message: string; code?: string }): string {
  if (error.code === 'over_email_send_rate_limit' || error.code === 'over_request_rate_limit') {
    return 'Bạn đã gửi nhiều yêu cầu. Vui lòng chờ vài phút rồi thử lại.';
  }
  if (error.code === 'same_password') return 'Hãy chọn mật khẩu khác mật khẩu hiện tại.';
  if (error.code === 'weak_password') return 'Mật khẩu chưa đủ mạnh. Hãy dùng mật khẩu dài hơn, có chữ và số.';
  if (error.code === 'otp_expired' || error.code === 'session_not_found' || error.code === 'bad_code_verifier') {
    return 'Liên kết đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu email mới trên thiết bị này.';
  }
  return 'Không thể xử lý yêu cầu. Hãy kiểm tra kết nối và thử lại.';
}
