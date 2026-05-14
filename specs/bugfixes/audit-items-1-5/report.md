# Bugfix Report: Audit Items 1-5

**Date:** 2026-05-14
**Status:** Fixed

## Description of the Issue

Audit `plan/audit.md` menemukan lima masalah awal yang berdampak ke keamanan deploy, stabilitas SSR, dan flow reservasi:

1. `DATABASE_AUTH_TOKEN` muncul sebagai plaintext di generated Wrangler config/dry-run.
2. `QueryClient` dan tRPC client dibuat global di module scope.
3. CTA pricing mengirim `packageId` yang tidak ada di database.
4. Validasi tanggal reservasi hanya kuat di client.
5. Endpoint public reservation belum punya anti-spam dasar.

**Reproduction steps:**
1. Build aplikasi dengan `bun run build`.
2. Jalankan `bunx wrangler deploy --dry-run --keep-vars --route 'kabuttipis.badry.asia/*'` dari `apps/web`.
3. Klik CTA pricing yang membawa `?paket=glamping-embun`, lalu submit reservation.
4. Kirim request tRPC langsung dengan tanggal lampau atau beberapa request reservation identik.

**Impact:** Tinggi untuk secret exposure dan SSR shared state; medium-tinggi untuk reservasi invalid, data kotor, dan spam reservation.

## Investigation Summary

- **Symptoms examined:** generated Wrangler config mencetak DB token, SSR router memakai singleton query cache, CTA pricing punya ID berbeda dari seed DB, server menerima `date` string kosong-format, dan mutation public tidak membatasi request.
- **Code inspected:** `packages/infra/alchemy.run.ts`, `apps/web/src/router.tsx`, `apps/web/src/components/sections/pricing.tsx`, `apps/web/src/routes/reservation.tsx`, `packages/api/src/routers/reservation.router.ts`, dan Alchemy generated Wrangler behavior.
- **Hypotheses tested:** `wrangler.secrets=false` menghapus plaintext token dari generated config; ID pricing dapat distabilkan lewat mapping eksplisit; validation/rate-limit dapat diuji di utility API.

## Discovered Root Cause

Audit item 1-5 berasal dari kombinasi konfigurasi default dan rule bisnis yang hanya dipasang di UI:

- Alchemy menulis secret bindings ke generated Wrangler config ketika `wrangler.secrets` default aktif.
- Router app membuat query/tRPC client di module scope, sehingga Worker SSR dapat memakai cache yang sama lintas request.
- Pricing menyimpan ID statis lama, sementara seed DB memakai `pkg-*`.
- Server schema belum memvalidasi format/tanggal reservasi.
- Endpoint reservation public tidak punya throttle/dedupe.

**Defect type:** Secret handling, SSR state sharing, data contract mismatch, missing server validation, missing abuse control.

**Why it occurred:** Implementasi awal mengejar flow publik cepat dan mengandalkan UI/deploy defaults. Tidak ada regression test untuk contract pricing-reservation atau validasi server.

**Contributing factors:** Tidak ada test otomatis dan root `check-types` sebelumnya tidak mencakup semua package.

## Resolution for the Issue

**Changes made:**
- `packages/infra/alchemy.run.ts` - `DATABASE_AUTH_TOKEN` tetap secret dan tidak ditulis ke generated Wrangler config; `DATABASE_URL` tetap var biasa.
- `apps/web/src/router.tsx` - `QueryClient`, tRPC client, dan tRPC options proxy dibuat per `getRouter()` call; toast error client-only.
- `apps/web/src/components/sections/pricing.data.ts` - mapping package ID reservasi yang sesuai seed DB.
- `apps/web/src/components/sections/pricing.tsx` - CTA pricing memakai mapping package ID valid.
- `apps/web/src/routes/reservation.tsx` - query `paket` invalid tidak dipakai sebagai selected package.
- `packages/api/src/routers/reservation.validation.ts` - validasi server date, normalisasi phone, signature dedupe, dan rate-limit helper.
- `packages/api/src/routers/reservation.router.ts` - menerapkan rate-limit, validasi server, dedupe 10 menit, dan menyimpan nomor normalized.
- `apps/web/tsconfig.json` dan `packages/api/tsconfig.json` - exclude test files dari production typecheck.
- `packages/env/src/cloudflare-local.ts` dan `packages/env/src/web.ts` - membersihkan error TypeScript yang menghalangi validasi package.

**Approach rationale:** Patch langsung dipilih karena root cause jelas dan perubahan dapat dibatasi pada infra/router/reservation/pricing.

**Alternatives considered:**
- Cloudflare Turnstile penuh - lebih kuat, tetapi butuh site key/secret baru dan perubahan UI lebih besar.
- Render seluruh pricing dari API - lebih ideal jangka panjang, tetapi akan mengubah desain pricing saat ini lebih luas.
- Cloudflare Secrets Store binding - lebih aman, tetapi runtime binding bukan string langsung dan butuh perubahan akses env yang lebih besar.

## Regression Test

**Test files:**
- `packages/api/src/routers/reservation.validation.test.ts`
- `apps/web/src/components/sections/pricing.test.ts`

**Test names:**
- `rejects reservation dates in the past on the server`
- `rejects impossible date strings`
- `normalizes duplicate reservation signatures`
- `uses package ids that exist in the seeded reservation database`

**What it verifies:** Server tidak menerima tanggal lampau/impossible, dedupe phone signature stabil, dan CTA pricing memakai ID DB yang valid.

**Run command:** `bun test packages/api/src/routers/reservation.validation.test.ts apps/web/src/components/sections/pricing.test.ts`

## Affected Files

| File | Change |
|------|--------|
| `packages/infra/alchemy.run.ts` | Secret handling Wrangler/Alchemy |
| `apps/web/src/router.tsx` | Per-router QueryClient/tRPC instances |
| `apps/web/src/components/sections/pricing.data.ts` | Valid package ID mapping |
| `apps/web/src/components/sections/pricing.tsx` | Pricing CTA uses valid mapping |
| `apps/web/src/routes/reservation.tsx` | Ignore invalid package query |
| `packages/api/src/routers/reservation.validation.ts` | Server validation/rate-limit helpers |
| `packages/api/src/routers/reservation.router.ts` | Date validation, rate-limit, dedupe |
| `packages/api/src/routers/reservation.validation.test.ts` | Regression tests for server validation |
| `apps/web/src/components/sections/pricing.test.ts` | Regression test for package IDs |
| `apps/web/src/routes/contact.tsx` | Removed stale unused constant and fixed touched-file lint |
| `apps/web/tsconfig.json` | Exclude tests from production typecheck |
| `packages/api/tsconfig.json` | Exclude tests from production typecheck |
| `packages/env/src/cloudflare-local.ts` | Fixed URL/path type issue |
| `packages/env/src/web.ts` | Removed unsafe `any` runtime env access |

## Verification

**Automated:**
- [x] Regression test passes: `bun test packages/api/src/routers/reservation.validation.test.ts apps/web/src/components/sections/pricing.test.ts`
- [x] Web typecheck passes: `bunx tsc -p apps/web/tsconfig.json --noEmit`
- [x] API typecheck passes: `bunx tsc -p packages/api/tsconfig.json --noEmit`
- [x] DB typecheck passes: `bunx tsc -p packages/db/tsconfig.json --noEmit`
- [x] Env typecheck passes: `bunx tsc -p packages/env/tsconfig.json --noEmit`
- [x] UI typecheck passes: `bunx tsc -p packages/ui/tsconfig.json --noEmit`
- [x] Changed-file Biome pass: `bunx biome check --write <changed files>`
- [x] Production build passes: `bun run build`
- [x] Wrangler dry-run passes: `bunx wrangler deploy --dry-run --keep-vars --route 'kabuttipis.badry.asia/*'`

**Manual verification:**
- Confirmed `apps/web/dist/server/wrangler.json` no longer contains `DATABASE_AUTH_TOKEN` or JWT-looking token text.
- Confirmed dry-run output no longer prints `env.DATABASE_AUTH_TOKEN`.
- Confirmed dry-run still includes `DATABASE_URL` and `CORS_ORIGIN`.

## Prevention

**Recommendations to avoid similar bugs:**
- Keep `--keep-vars` on manual Wrangler deploy until secret binding strategy is finalized.
- Add a CI check that scans generated deploy artifacts for `DATABASE_AUTH_TOKEN` and JWT-like values.
- Keep package ID contract covered by tests whenever pricing/reservation data changes.
- Add Turnstile or durable Cloudflare rate limiting for stronger spam protection.
- Make root `check-types` cover every package so hidden errors do not recur.

## Related

- `plan/audit.md` item 1-5.
