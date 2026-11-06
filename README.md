# LINGUA WARS — Đại chiến ngôn ngữ

Nền tảng Phase 1. Next.js 16 App Router, React, TypeScript, Tailwind CSS 4, Framer Motion, Lucide; Supabase Auth + PostgreSQL. Giao diện tiếng Việt, ưu tiên iPhone. Không gọi API AI trả phí.

## Chạy trên máy phát triển

Yêu cầu Node.js >= 22, npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Mở http://localhost:3000. Không có Supabase vẫn luyện tập được 8 bài nhập môn. Kết quả được server chấm; lịch sử luyện tập có thể lưu trong trình duyệt. XP/Gold trong chế độ này chỉ là phần thưởng dự kiến, không phải số dư tài khoản. Lịch sử cục bộ có thể bị sửa, không bao giờ dùng cho xếp hạng hoặc nhận thưởng.

## Kết nối Supabase thật

1. Tạo project Supabase Free tại khu vực gần người chơi; bật Email/Password, giữ xác nhận email.
2. Chạy toàn bộ `supabase/migrations/202611060001_core.sql` bằng SQL Editor, sau đó `supabase/seed.sql`. Migration chạy một lần; seed chạy lại được. Luôn backup trước khi áp dụng lên database có dữ liệu.
3. Điền `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` từ Supabase Project Settings/API vào `.env.local`. Dùng anon/publishable key, **không dùng service role key**.
4. Đặt `QUIZ_SIGNING_SECRET` thành chuỗi ngẫu nhiên ít nhất 32 ký tự (dùng cho luyện tập khách). Nếu bỏ trống, tiến trình dùng secret tạm thời; khởi động lại hoặc đổi instance có thể làm hết hiệu lực bài đang học. Production nên cấu hình secret ổn định.
5. Supabase Authentication/URL Configuration: đặt Site URL thành domain Vercel. Thêm domain localhost vào Redirect URLs khi phát triển. Luồng email xác nhận dùng Site URL, sau đó đăng nhập bằng mật khẩu.
6. Tạo tài khoản trong giao diện; xác nhận email; đăng nhập; vào Nhân vật lưu tên và nền văn minh; vào Học viện hoàn thành bài. Xem `resource_transactions` để kiểm tra ledger.

Không cần service role key ở backend. RPC dùng `auth.uid()`, SECURITY DEFINER và search_path cố định; quyền mutation trực tiếp bị thu hồi. Đáp án nằm trong bảng không cấp SELECT cho client và snapshot nằm trong schema private.

## Triển khai từ iPhone

- Đưa thư mục này lên repository GitHub riêng, gồm package-lock.json, migration và seed; không đưa `.env.local` lên Git.
- Trên Vercel: Add New Project → Import GitHub repository → chọn framework Next.js → thêm ba biến ở `.env.example` → Deploy. Chọn root directory chứa package.json nếu repository có thư mục cha.
- Điền domain Vercel vào Supabase Site URL, kiểm tra email xác nhận và đăng nhập trên Safari iPhone.
- Mỗi lần push GitHub, Vercel build tự động. Migration vẫn phải áp dụng có kiểm soát, không chạy mỗi request.

Chưa có GitHub remote, Vercel credentials hoặc Supabase project được cung cấp, nên phiên bản này chưa được phát hành công khai.

## Kiểm tra

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Test PostgreSQL dùng PGlite (PostgreSQL chạy WASM), mô phỏng auth.uid và auth.users; không thay thế kiểm tra Supabase hosted/Auth/email thật. Không cần Docker.

## Phạm vi sử dụng

Có: dashboard, 8 nền văn minh hư cấu, chuyển ngôn ngữ, đọc mẫu bằng speech synthesis của thiết bị, quiz trắc nghiệm, chấm server, tài khoản email, tạo hồ sơ bằng trigger, đổi tên/nền văn minh bằng RPC, XP/Gold/level, ledger, nhiệm vụ hàng ngày tự cộng thưởng, lịch sử và xếp hạng dữ liệu thật khi kết nối Supabase.

Bài nhập môn chỉ có 1 câu/ngôn ngữ. Mỗi ngôn ngữ thưởng tối đa một lần/ngày UTC. Luyện tập lại vẫn được chấm nhưng nhận 0 XP/Gold. Nhiệm vụ chỉ tính bài có XP; thưởng tự động là 10 Gold cho 1 bài và 25 Gold cho 3 bài. Danh sách nhiệm vụ trong UI phản ánh dữ liệu tài khoản khi đăng nhập. Không có mua sức mạnh, thanh toán, chiến tranh hay người chơi giả.

Chưa có: đánh giá trình độ, thư viện bài phong phú, chấm nói, bài nghe chuyên biệt, grammar/reading, streak server, khôi phục mật khẩu, social login, realtime, Kingdom/War/Guild, và i18n đầy đủ. Các mục này được ghi rõ trong UI hoặc không mở nút. Cần thẩm định học thuật, kiểm thử thiết bị thật và chống bot nâng cao trước khi phát hành rộng.

Chi phí ban đầu: Supabase Free + Vercel Hobby để thử nghiệm cá nhân phi thương mại; kiểm tra điều khoản gói và nâng cấp phù hợp trước vận hành thương mại. Chưa mua domain hoặc dùng dịch vụ trả phí. Không bảo đảm free tier đáp ứng traffic công khai.

Xem [kiến trúc và kế hoạch](docs/ARCHITECTURE.md).
