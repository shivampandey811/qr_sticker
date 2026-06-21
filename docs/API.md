# Scan2Owner API

The API is versioned under `/api/v1`. Interactive OpenAPI documentation is available at `/docs` and ReDoc at `/redoc` while the backend is running.

## Authentication

Authenticated routes require `Authorization: Bearer <access_token>`. Access tokens expire after 30 minutes by default; refresh tokens are valid for 30 days.

| Area | Method | Endpoint | Purpose |
| --- | --- | --- | --- |
| Auth | POST | `/auth/register` | Create owner account |
| Auth | GET | `/auth/verify-email?token=` | Verify email address |
| Auth | POST | `/auth/login` | Issue access and refresh tokens |
| Auth | POST | `/auth/refresh` | Rotate session tokens |
| Auth | POST | `/auth/forgot-password` | Request password reset |
| Auth | POST | `/auth/reset-password` | Complete password reset |
| Auth | POST | `/auth/change-password` | Change authenticated password |
| Vehicles | GET/POST | `/vehicles` | List or create vehicles |
| Vehicles | PATCH/DELETE | `/vehicles/{id}` | Update or remove a vehicle |
| Stickers | GET | `/stickers` | List owner's stickers |
| Stickers | POST | `/stickers/activate` | Claim a one-time activation code |
| Public | GET | `/public/stickers/{qr_id}` | Validate sticker and record scan |
| Public | POST | `/public/stickers/{qr_id}/contact` | Create anonymous contact request |
| Dashboard | GET | `/dashboard/summary` | Owner KPI and recent activity |
| Dashboard | GET | `/dashboard/analytics` | Daily, weekly, or monthly series |
| Dashboard | GET | `/dashboard/contact-requests` | Paginated request history |
| Dashboard | POST | `/dashboard/fcm-token` | Register push notification token |
| Admin | POST | `/admin/stickers/batch` | Generate stickers and activation codes |
| Admin | GET | `/admin/users` | List users |
| Admin | GET | `/admin/vehicles` | List all vehicles |
| Admin | PATCH | `/admin/stickers/{qr_id}/status` | Enable or disable sticker |
| Admin | POST | `/admin/stickers/{qr_id}/transfer` | Transfer sticker ownership |
| Admin | GET | `/admin/audit-logs` | Review audit trail |
| Future | POST | `/integrations/{channel}/requests` | Reserved adapter contract |

Supported future channels are `whatsapp`, `voice`, `sms`, and `mobile-app`.

## Public request example

```json
{
  "message_type": "headlights",
  "custom_message": null,
  "captcha_token": "turnstile-client-token"
}
```

Public endpoints are IP rate-limited. In production, `TURNSTILE_SECRET_KEY` is required and the frontend should provide a Cloudflare Turnstile client token.

