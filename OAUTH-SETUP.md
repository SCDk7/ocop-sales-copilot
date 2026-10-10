# Enable Google and Facebook sign-in

## Trạng thái cấu hình local (10/10/2026)

- Google: đã tạo ứng dụng `OCOP Sales Copilot` và OAuth client
  `OCOP Sales Copilot - Local Web`, lưu credentials trong `.env` được Git bỏ qua.
- Đã đăng ký origin `http://localhost:3000` và callback
  `http://localhost:3000/api/auth/oauth/google/callback`.
- Đã thêm tài khoản chủ dự án làm test user. Ứng dụng còn ở chế độ Testing.
- Đã thử đăng nhập Google thật: frontend nhận tài khoản và backend
  `GET /api/auth/me` trả HTTP 200 bằng phiên được tạo từ OAuth callback.
- Facebook: đang chờ chủ tài khoản hoàn tất xác minh SMS trong trang đăng ký
  Meta for Developers. Chưa tạo Facebook App ID/Secret, chưa bật đăng nhập Facebook.
- Những cấu hình này áp dụng cho localhost. Khi triển khai lên website HTTPS,
  cần đăng ký callback của backend thật và cấu hình môi trường trên hosting.

Không ghi Client Secret, mã SMS hoặc session token vào tài liệu này.

## Configuration reference

The OAuth routes already exist, but require credentials for your own applications.
The Gemini API key is not a Google OAuth client ID or client secret.

Put these values in the ignored local `.env` file, not browser code or chat:

```dotenv
AUTH_FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/oauth/google/callback
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/auth/oauth/facebook/callback
```

For Google, create a Web application OAuth client and configure the authorized
redirect URI to exactly match `GOOGLE_REDIRECT_URI`. Configure the consent screen
and test-user access as required by your application's publishing status.

Official Google guide: https://developers.google.com/identity/protocols/oauth2/web-server

For Facebook, create/configure your own Meta developer application with Facebook
Login and register the exact callback URI. Put its App ID in `FACEBOOK_CLIENT_ID`
and App Secret in `FACEBOOK_CLIENT_SECRET`. Development-mode access and deployment
requirements depend on the configuration in your Meta dashboard.

Meta application dashboard: https://developers.facebook.com/apps/

For a public website, replace localhost with the actual HTTPS backend callback
URLs, set `AUTH_FRONTEND_URL` to the intended HTTPS frontend, register those exact
URLs in each provider, and configure credentials in the deployed backend's
environment. Restart the server after editing `.env`.

`GET /api/auth/oauth/status` checks whether configuration is present and valid;
it does not expose credentials or verify provider approval. A complete login
still needs to be tested with a real account through the provider callback.
