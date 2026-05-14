# Audit Kode Kabut Tipis

Tanggal audit: 2026-05-14
Lokasi repo: `/Users/bbbadry/Downloads/kabut-tipis`
Scope: seluruh source code aplikasi web, API, DB, env, infra Cloudflare/Alchemy, UI package, dependency, build output, dan smoke test produksi.

## Ringkasan Eksekutif

Status umum: aplikasi masih bisa dibuild dan route produksi utama saat audit mengembalikan HTTP 200. Tetapi repo belum bersih. Ada beberapa masalah yang perlu ditangani sebelum dianggap stabil:

- Build produksi lulus, tetapi bundle `contact` sangat besar karena `maplibre-gl`.
- `bun run check-types` hijau palsu karena hanya package UI yang punya script `check-types`.
- TypeScript manual gagal di `apps/web` dan `packages/env`.
- `biome check` gagal dengan 19 error, 29 warning, 62 info.
- `bun audit` menemukan 7 vulnerability dependency: 3 high, 4 moderate.
- Ada mismatch data paket antara halaman harga dan seed database, sehingga CTA harga dapat membuka form reservasi dengan `packageId` tidak valid.
- Generated Wrangler config menyimpan binding database sebagai environment variable di artifact lokal `dist/server/wrangler.json`. Nilainya tidak saya tulis di laporan ini, tetapi token terlihat di dry-run dan harus diperlakukan sebagai sensitif.
- Tidak ada test otomatis untuk flow utama gallery/reservation/API.

## Status Pengerjaan

Update terakhir: 2026-05-14

| Item | Status | Catatan |
| --- | --- | --- |
| 1. Binding database sensitif di generated Wrangler config | Selesai | `DATABASE_AUTH_TOKEN` sudah tidak muncul di `dist/server/wrangler.json` dan output `wrangler deploy --dry-run --keep-vars`. Rotasi token DB tetap disarankan secara manual karena token sempat terlihat di output audit sebelumnya. |
| 2. `QueryClient` dan tRPC client global di SSR | Selesai | Instance sekarang dibuat di dalam `getRouter()`, bukan singleton module-global. |
| 3. CTA harga memakai `packageId` yang tidak ada di DB | Selesai | Pricing sekarang memakai mapping `RESERVATION_PACKAGE_IDS` yang cocok dengan seed DB, dan query `paket` invalid di form reservation diabaikan. |
| 4. Validasi tanggal reservasi hanya di client | Selesai | Server sudah memvalidasi format tanggal, tanggal kalender valid, dan tanggal tidak lampau berdasarkan timezone `Asia/Makassar`. |
| 5. Endpoint public reservation belum punya anti-spam | Selesai sebagian | Sudah ada in-memory rate limit dan dedupe 10 menit. Turnstile/durable rate limit dan kebijakan retensi data masih rekomendasi lanjutan. |
| 6. Data `features` package tidak konsisten | Belum dikerjakan | Masih perlu diperbaiki di seed/parser package. |
| 7. Root `check-types` tidak mencakup semua package | Sebagian | Error TypeScript di `apps/web` dan `packages/env` sudah diperbaiki, tetapi root script masih perlu dibuat eksplisit untuk semua package. |
| 8. TypeScript error aktif | Selesai | Manual typecheck `apps/web`, `api`, `db`, `env`, dan `ui` sudah lulus setelah patch. |
| 9. `biome check` gagal secara repo-wide | Sebagian | File yang disentuh sudah diformat/lulus Biome, tetapi repo-wide Biome belum dibersihkan semua. |
| 10. Bundle contact terlalu besar | Belum dikerjakan | Masih perlu lazy-load MapLibre atau alternatif map ringan. |
| 11. Tidak ada test otomatis flow utama | Sebagian | Sudah ditambah regression test untuk validasi reservation dan package ID pricing; test gallery/API smoke penuh belum ada. |
| 12. `createDb()` membuat client baru per request | Belum dikerjakan | Masih perlu evaluasi caching client DB. |
| 13. WhatsApp `window.open` bisa terkena popup blocker | Belum dikerjakan | Masih perlu perubahan UX submit reservation. |
| 14. Deploy path Wrangler dan Alchemy belum konsisten | Belum dikerjakan | Masih perlu keputusan jalur deploy resmi. |
| 15. `today` form date memakai UTC | Belum dikerjakan | Belum diubah di client form. |
| 16. Copy address tidak menangani clipboard error | Belum dikerjakan | Belum ditambah fallback/try-catch. |
| 17. Lightbox video tidak punya captions | Belum dikerjakan | Belum ditambah track/caption. |
| 18. `public` berisi `.DS_Store` dan asset besar | Belum dikerjakan | Belum dibersihkan/dioptimasi. |
| 19. Knip menemukan unused code/dependency | Belum dikerjakan | Belum ada cleanup dependency/code. |

## Command Yang Dijalankan

| Command | Status | Catatan |
| --- | --- | --- |
| `bun run build` | PASS | Client dan SSR build selesai. Ada warning chunk besar. |
| `bun run check-types` | PASS menyesatkan | Hanya menjalankan `@kabut-tipis/ui check-types`, bukan semua package. |
| `bunx tsc -p apps/web/tsconfig.json --noEmit` | FAIL | `apps/web/src/routes/contact.tsx(30,7): 'EMAIL' is declared but its value is never read.` |
| `bunx tsc -p packages/api/tsconfig.json --noEmit` | PASS | Tidak ada error. |
| `bunx tsc -p packages/db/tsconfig.json --noEmit` | PASS | Tidak ada error. |
| `bunx tsc -p packages/env/tsconfig.json --noEmit` | FAIL | `cloudflare-local.ts` URL type mismatch dan `web.ts` import `z` unused. |
| `bunx tsc -p packages/ui/tsconfig.json --noEmit` | PASS | Tidak ada error. |
| `bunx biome check . --max-diagnostics=300` | FAIL | 19 errors, 29 warnings, 62 infos. |
| `bun audit` | FAIL | 7 vulnerability: 3 high, 4 moderate. |
| `bunx knip --reporter json` | FAIL | Menemukan unused file/deps/exports. Beberapa butuh verifikasi karena ada false positive untuk virtual module Cloudflare. |
| `bunx wrangler deploy --dry-run --keep-vars --route 'kabuttipis.badry.asia/*'` | PASS | Dry-run deploy sukses, tetapi binding DB token muncul sebagai Environment Variable di output. |
| Smoke test produksi `https://kabuttipis.badry.asia/*` | PASS | `/`, `/about`, `/services`, `/gallery`, `/reservation`, `/contact`, `/api/trpc/healthCheck` semua HTTP 200. |

## Temuan Prioritas Tinggi

Update perbaikan 2026-05-14: item 1-5 sudah dipatch terlebih dahulu. Detail implementasi dan verifikasi dicatat di `specs/bugfixes/audit-items-1-5/report.md`.

### 1. Binding database sensitif muncul di generated Wrangler config

Severity: Tinggi

Status 2026-05-14: Fixed. `DATABASE_AUTH_TOKEN` tidak lagi muncul di `apps/web/dist/server/wrangler.json` maupun output `wrangler deploy --dry-run --keep-vars`; generated config hanya menampilkan `DATABASE_URL` dan `CORS_ORIGIN`.

Evidence:

- `packages/infra/alchemy.run.ts:14-16` mengisi `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, dan `CORS_ORIGIN` lewat binding Alchemy.
- `bunx wrangler deploy --dry-run --keep-vars --route 'kabuttipis.badry.asia/*'` menunjukkan `DATABASE_AUTH_TOKEN` sebagai `Environment Variable`.
- `apps/web/dist/server/wrangler.json` berisi nilai binding hasil build. File ini ignored oleh git, tetapi tetap artifact lokal yang menyimpan secret plaintext.
- `apps/web/.gitignore:18` meng-ignore `/dist/`, jadi artifact tidak tracked. Namun risiko tetap ada untuk terminal log, upload artifact, backup, atau kesalahan commit di luar git.

Dampak:

- Token database dapat bocor lewat log command, artifact build, atau copy folder `dist`.
- Kalau token sudah pernah terlihat di terminal/log audit, perlakukan sebagai exposed dan rotasi token Turso/DB.

Rekomendasi:

- Jangan simpan `DATABASE_AUTH_TOKEN` sebagai plain Wrangler `vars`.
- Gunakan Cloudflare secret binding atau mekanisme secret Alchemy yang tidak menulis nilai ke generated config.
- Rotasi token database setelah migrasi secret selesai.
- Tambahkan pengecekan secret leak sebelum deploy, minimal `rg "DATABASE_AUTH_TOKEN|eyJ" apps/web/dist packages . --glob '!node_modules/**'`.

Referensi:

- Cloudflare secrets: https://developers.cloudflare.com/workers/configuration/secrets/

### 2. `QueryClient` dan tRPC client dibuat global, berisiko shared state antar request SSR

Severity: Tinggi

Status 2026-05-14: Fixed. `QueryClient`, `trpcClient`, dan options proxy sekarang dibuat di dalam `getRouter()` sehingga instance SSR tidak lagi singleton module-global, dan toast error dibatasi client-side.

Evidence:

- `apps/web/src/router.tsx:15-27` membuat `queryClient` di module scope.
- `apps/web/src/router.tsx:43-54` membuat `trpcClient` dan `trpc` di module scope.
- `apps/web/src/router.tsx:61-74` memasukkan instance global itu ke router dan SSR integration.

Dampak:

- Pada SSR/Workers, module scope bisa hidup lama lintas request. Cache React Query dapat stale atau bocor antar request.
- Saat ini data yang dicache dominan publik, tetapi pola ini akan berbahaya jika nanti ada auth, admin, atau data personal.
- `QueryCache.onError` juga memanggil `toast.error` dari module shared yang bisa menjadi side effect browser di jalur server.

Rekomendasi:

- Buat `QueryClient`, `trpcClient`, dan `trpc` per request/router instance, bukan singleton module global.
- Untuk browser boleh singleton per hydration, tetapi server harus request-scoped.
- Pisahkan error toast client-only dari konfigurasi query server.

Referensi:

- TanStack Query SSR guide: https://tanstack.com/query/v5/docs/react/guides/ssr

### 3. CTA harga mengirim `packageId` yang tidak ada di database

Severity: Tinggi

Status 2026-05-14: Fixed. ID paket pricing sekarang memakai `RESERVATION_PACKAGE_IDS` yang cocok dengan seed DB, dan form reservation mengabaikan query `paket` yang tidak ada di hasil `packages.list`.

Evidence:

- Halaman harga memakai ID statis:
  - `apps/web/src/components/sections/pricing.tsx:15` -> `glamping-embun`
  - `apps/web/src/components/sections/pricing.tsx:39` -> `tiket-masuk`
  - `apps/web/src/components/sections/pricing.tsx:50` -> `glamping-kawa`
  - `apps/web/src/components/sections/pricing.tsx:73` -> `grill-chill`
- Seed database memakai ID berbeda:
  - `packages/db/src/seed.ts:22` -> `pkg-rekreasi`
  - `packages/db/src/seed.ts:39` -> `pkg-meja`
  - `packages/db/src/seed.ts:56` -> `pkg-camping`
  - `packages/db/src/seed.ts:73` -> `pkg-staycation`
- Form reservation langsung memakai `search.paket` sebagai `packageId` awal di `apps/web/src/routes/reservation.tsx:165-168`.
- API menolak paket yang tidak ditemukan di `packages/api/src/routers/reservation.router.ts:31-35`.

Dampak:

- Pengunjung dari tombol "Reservasi" di section harga dapat masuk ke form dengan paket invalid.
- Submit reservation akan gagal dengan "Paket reservasi tidak ditemukan".
- Ini dapat terlihat sebagai error reservasi walaupun route `/reservation` sudah HTTP 200.

Rekomendasi:

- Samakan ID halaman harga dengan ID package database.
- Lebih baik render paket harga dari `packages.list` agar UI dan DB punya satu sumber data.
- Jika `paket` query tidak ditemukan di hasil package list, reset ke kosong dan tampilkan pesan "Paket tidak tersedia".

### 4. Validasi tanggal reservasi hanya kuat di client, tidak di server

Severity: Medium-Tinggi

Status 2026-05-14: Fixed. Server sekarang memakai `createReservationInput` dengan validasi format `YYYY-MM-DD`, tanggal kalender valid, dan tanggal tidak boleh lampau berdasarkan timezone `Asia/Makassar`.

Evidence:

- Client schema menolak tanggal lampau di `apps/web/src/routes/reservation.tsx:43-48`.
- Server input hanya `date: z.string().min(1)` di `packages/api/src/routers/reservation.router.ts:15`.

Dampak:

- Request langsung ke API dapat membuat reservasi tanggal lampau atau format tanggal aneh.
- Data DB bisa kotor walaupun UI normal.

Rekomendasi:

- Tambahkan validasi server: format `YYYY-MM-DD`, tanggal valid, tidak lampau menurut timezone bisnis, dan optional batas maksimal booking.
- Jangan mengandalkan validasi client untuk rule bisnis.

### 5. Endpoint public reservation belum punya anti-spam/rate limit

Severity: Medium-Tinggi

Status 2026-05-14: Fixed sebagian. Server sekarang punya in-memory per-IP rate limit dan dedupe 10 menit berdasarkan normalized phone + date + package. Turnstile/retensi data masih rekomendasi lanjutan.

Evidence:

- `packages/api/src/routers/reservation.router.ts:21-56` adalah `publicProcedure` yang menerima nama, nomor telepon, catatan, dan jumlah tamu.
- Tidak ada Turnstile, rate limit, honeypot, throttling IP, atau deduplication.

Dampak:

- Bot dapat membanjiri tabel `reservations` dan membuka WhatsApp flow secara massal.
- Data PII seperti nama dan nomor telepon tersimpan tanpa kontrol abuse yang jelas.

Rekomendasi:

- Tambahkan Cloudflare Turnstile atau rate limiting untuk mutation `reservation.create`.
- Tambahkan rule dedupe sederhana, misalnya kombinasi phone+date+package dalam window tertentu.
- Tambahkan kebijakan retensi data reservasi.

## Temuan Medium

### 6. Data `features` package tidak konsisten dan sebagian hilang

Severity: Medium

Evidence:

- Parser hanya menerima JSON array string di `packages/api/src/routers/packages.router.ts:7-21`.
- Seed `pkg-meja` memakai `.join("|")`, bukan JSON, di `packages/db/src/seed.ts:44-50`.

Dampak:

- Feature list untuk "Meja Keluarga" akan menjadi `[]`.
- Error data disembunyikan karena parser catch mengembalikan array kosong.

Rekomendasi:

- Simpan semua `features` sebagai `JSON.stringify([...])`.
- Jika parsing gagal, log structured error atau validasi seed sebelum insert.

### 7. Typecheck root tidak benar-benar mengaudit semua package

Severity: Medium

Evidence:

- Root script `package.json:27` menjalankan `bun run --filter '*' check-types`.
- Hanya `packages/ui/package.json:13-15` yang punya `check-types`.
- Manual tsc menemukan error di `apps/web` dan `packages/env`.

Dampak:

- CI/local bisa terlihat hijau walaupun aplikasi web/env gagal typecheck.

Rekomendasi:

- Tambahkan `check-types` di `apps/web`, `packages/api`, `packages/db`, `packages/env`, dan `packages/infra`.
- Atau buat root script eksplisit:
  - `bunx tsc -p apps/web/tsconfig.json --noEmit`
  - `bunx tsc -p packages/api/tsconfig.json --noEmit`
  - `bunx tsc -p packages/db/tsconfig.json --noEmit`
  - `bunx tsc -p packages/env/tsconfig.json --noEmit`
  - `bunx tsc -p packages/ui/tsconfig.json --noEmit`

### 8. TypeScript error yang saat ini aktif

Severity: Medium

Evidence:

- `apps/web/src/routes/contact.tsx:30`: `EMAIL` unused.
- `packages/env/src/cloudflare-local.ts:5`: `fileURLToPath(new URL(...))` mengalami mismatch type `URL` karena konflik tipe URL Node/Workers.
- `packages/env/src/web.ts:2`: import `z` unused.

Rekomendasi:

- Hapus `EMAIL` atau tampilkan email di UI.
- Perbaiki `cloudflare-local.ts`, misalnya dengan pattern URL yang tidak konflik tipe Workers/Node.
- Hapus import `z` dari `web.ts` jika client env memang kosong.

### 9. `biome check` gagal di correctness, a11y, format, dan import ordering

Severity: Medium

Evidence utama:

- `packages/ui/src/components/ui/map.tsx` punya banyak `useExhaustiveDependencies` di hook map/marker/popup/cluster.
- `packages/ui/src/components/ui/map.tsx:169` component bernama `Map` shadow global `Map`.
- `packages/ui/src/components/ui/map.tsx:914` SVG compass tidak punya title.
- `packages/ui/src/components/label.tsx:6` `label` tidak selalu punya control.
- `apps/web/src/components/sections/lightbox.tsx:92` video tidak punya caption.
- `apps/web/src/routes/contact.tsx:59` SVG Instagram tidak punya title/label.
- Banyak format/class ordering di `pricing.tsx`, `contact.tsx`, `hero.tsx`, `vite.config.ts`, `components.json`, dan CSS.

Dampak:

- Risiko stale props/event listener pada komponen map.
- CI lint akan gagal kalau Biome dijadikan gate.
- Aksesibilitas belum rapi.

Rekomendasi:

- Jalankan `bunx biome check . --write` setelah memastikan tidak menimpa perubahan manual.
- Perbaiki hook dependencies map secara manual, bukan hanya mematikan rule.
- Untuk komponen `Label`, gunakan `htmlFor` pada form field atau ubah wrapper field agar input punya `id`.

### 10. Bundle halaman contact terlalu besar

Severity: Medium

Evidence:

- Build client memperingatkan chunk besar.
- `apps/web/dist/client/assets/contact-*.js` sekitar 1.0 MB.
- `apps/web/dist/client/assets/index-*.js` sekitar 732 KB.
- Contact route hanya memakai map di `apps/web/src/routes/contact.tsx:167-180`.

Dampak:

- Pengunjung halaman contact mengunduh bundle besar hanya untuk peta.
- MapLibre juga membuat SSR contact chunk besar.

Rekomendasi:

- Lazy-load komponen map hanya di client.
- Pertimbangkan fallback link/static embed untuk Google Maps bila interaktif penuh tidak diperlukan.
- Pisahkan vendor maplibre dengan dynamic import.

### 11. Tidak ada test otomatis untuk flow utama

Severity: Medium

Evidence:

- Tidak ditemukan file `*.test.*`, `*.spec.*`, `vitest.config.*`, atau `playwright.config.*`.
- Dependency testing ada di `apps/web/package.json`, tetapi belum dipakai.

Dampak:

- Bug gallery/reservation/deploy hanya ketahuan lewat manual smoke.
- Tidak ada regression guard untuk mismatch package ID, date validation, atau parser features.

Rekomendasi:

- Tambahkan unit test untuk router API:
  - `packages.list` harus parse semua features.
  - `reservation.create` menolak package invalid.
  - `reservation.create` menolak tanggal lampau.
- Tambahkan Playwright smoke untuk `/gallery`, `/reservation`, dan submit form happy path/mock API.

### 12. `createDb()` membuat client baru per request

Severity: Medium-Rendah

Evidence:

- `packages/api/src/context.ts:3-9` memanggil `createDb()` untuk setiap context.
- `packages/db/src/index.ts:7-13` membuat `createClient()` baru setiap pemanggilan.

Dampak:

- Overhead koneksi/client meningkat pada traffic.
- Di Workers, lebih efisien cache client per isolate jika env tidak berubah.

Rekomendasi:

- Cache libsql client/drizzle instance di module scope pada package DB, tetapi tetap pastikan tidak menyimpan data request/user.

### 13. Flow WhatsApp bisa terkena popup blocker

Severity: Medium-Rendah

Evidence:

- `apps/web/src/routes/reservation.tsx:185` memanggil `window.open(url, "_blank")` di `onSuccess` mutation async, bukan langsung dari click event.

Dampak:

- Beberapa browser dapat memblokir tab WhatsApp karena dibuka setelah async network response.
- User melihat success card, tetapi WhatsApp mungkin tidak terbuka otomatis.

Rekomendasi:

- Setelah mutation sukses, tampilkan tombol/link WhatsApp yang jelas.
- Atau buka blank window pada click lalu set location setelah API sukses.

### 14. Deploy path Wrangler dan Alchemy belum konsisten

Severity: Medium-Rendah

Evidence:

- Root `package.json:34` deploy memakai `@kabut-tipis/infra deploy` atau Alchemy.
- `apps/web/wrangler.toml:21-22` hanya berisi `CORS_ORIGIN`, sedangkan DB vars datang dari generated config.
- Dry-run memakai redirected config `dist/server/wrangler.json`.

Dampak:

- Direct `wrangler deploy` tanpa build/redirect/`--keep-vars` bisa memakai konfigurasi yang berbeda dari deploy Alchemy.
- Mudah terjadi drift antara route, worker name, dan vars.

Rekomendasi:

- Tetapkan satu jalur deploy resmi.
- Jika memakai Wrangler manual, dokumentasikan urutan:
  - `bun run build`
  - `cd apps/web`
  - `bunx wrangler deploy --keep-vars --route 'kabuttipis.badry.asia/*'`
- Pastikan secret DB tidak masuk plain vars.

## Temuan Rendah dan Cleanup

### 15. `today` di form date memakai UTC, bukan timezone lokal

Severity: Rendah

Evidence:

- `apps/web/src/routes/reservation.tsx:222` memakai `new Date().toISOString().split("T")[0]`.

Dampak:

- Pada timezone Asia/Makassar, sebelum jam tertentu nilai UTC bisa berbeda dari tanggal lokal.
- UI `min` date bisa mengizinkan/menolak tanggal yang tidak sesuai hari lokal.

Rekomendasi:

- Format tanggal lokal manual dengan `getFullYear()`, `getMonth() + 1`, `getDate()`.

### 16. Copy address tidak menangani error clipboard

Severity: Rendah

Evidence:

- `apps/web/src/routes/contact.tsx:80-83` memanggil `navigator.clipboard.writeText` tanpa try/catch.

Dampak:

- Jika permission clipboard ditolak atau context tidak secure, user tidak mendapat feedback error.

Rekomendasi:

- Tambahkan try/catch dan fallback toast.

### 17. Lightbox video tidak punya captions

Severity: Rendah

Evidence:

- `apps/web/src/components/sections/lightbox.tsx:92-99` merender `<video controls>` tanpa `<track>`.

Dampak:

- Aksesibilitas video belum memenuhi rule Biome.

Rekomendasi:

- Tambahkan caption track jika ada, atau dokumentasikan pengecualian jika video dekoratif.

### 18. `public` berisi `.DS_Store` dan asset besar

Severity: Rendah

Evidence:

- `apps/web/public/kabut-tipis-asset/.DS_Store` ikut masuk ke `apps/web/dist/client/kabut-tipis-asset/.DS_Store`.
- Asset besar:
  - foto sekitar 1.5 MB sampai 4.9 MB per file.
  - video sekitar 8.8 MB.
  - PDF price guide sekitar 1.6 MB.

Dampak:

- File macOS metadata ikut terdeploy.
- Asset besar dapat memperlambat load jika dipakai langsung.

Rekomendasi:

- Hapus `.DS_Store` dari `public`.
- Optimasi gambar ke WebP/AVIF dan gunakan ukuran responsif.
- Kompres video atau host dengan streaming/CDN bila dipakai di halaman.

### 19. Knip menemukan sinyal unused code/dependency

Severity: Rendah

Evidence dari `bunx knip --reporter json`:

- Unused file: `apps/web/src/components/header.tsx`.
- Root dependencies terindikasi unused: `@kabut-tipis/env`, `dotenv`, `zod`.
- `apps/web` dependencies/devDependencies terindikasi unused: `@kabut-tipis/env`, `dotenv`, `libsql`, `next-themes`, `tailwindcss`, `@kabut-tipis/config`, `@testing-library/dom`, `@testing-library/react`, `jsdom`, `web-vitals`.
- `packages/api` terindikasi unused: `@kabut-tipis/env`, `@trpc/client`, `dotenv`.
- `packages/db` terindikasi unused: `libsql`, `zod`, binary `turso`.
- `packages/infra` terindikasi unused: `zod`, `@kabut-tipis/config`.
- Unused exports: `queryClient` di `apps/web/src/router.tsx`, `useTRPCClient` di `apps/web/src/utils/trpc.ts`.
- False positive yang mungkin valid untuk diabaikan: `cloudflare` unlisted di `packages/env/src/server.ts` karena `cloudflare:workers` adalah virtual module Workers.

Rekomendasi:

- Jangan hapus massal tanpa verifikasi runtime.
- Bersihkan dependency testing jika belum akan dipakai, atau tambahkan test agar dependency tersebut benar-benar digunakan.
- Hapus `header.tsx` jika sudah digantikan `components/layout/navbar.tsx`.

## Catatan Produksi Terkini

Smoke test produksi dengan absolute tool path karena `curl` tidak ada di PATH default shell:

| Route | HTTP | Bytes |
| --- | ---: | ---: |
| `/` | 200 | 57293 |
| `/about` | 200 | 21988 |
| `/services` | 200 | 49483 |
| `/gallery` | 200 | 18929 |
| `/reservation` | 200 | 22352 |
| `/contact` | 200 | 20080 |
| `/api/trpc/healthCheck` | 200 | 24 |

Kesimpulan: error lama `Unexpected token 'e', "error code: 1003" is not valid JSON` tidak muncul ulang pada smoke test route publik saat audit ini. Namun masih ada risiko runtime dari mismatch `packageId`, validasi server, dan shared SSR query cache.

## Prioritas Perbaikan

1. [x] Hilangkan `DATABASE_AUTH_TOKEN` dari generated Wrangler config/dry-run. Catatan: rotasi token DB masih perlu dilakukan manual jika token dianggap sudah terekspos.
2. [x] Ubah QueryClient/tRPC client agar request-scoped untuk SSR.
3. [x] Samakan data paket harga dengan package DB.
4. [x] Tambahkan validasi server untuk tanggal reservasi dan anti-spam dasar.
5. [ ] Perbaiki root `check-types` agar mencakup semua package.
6. [ ] Benahi seed/parser `features`.
7. [ ] Bersihkan Biome error repo-wide yang berpotensi bug, terutama hook dependency map dan a11y dasar.
8. [ ] Tambahkan test minimal untuk package list, gallery list, dan smoke route penuh.
9. [ ] Optimasi bundle contact dengan lazy map.
10. [ ] Bersihkan unused code/dependency dan file `.DS_Store` di public.

## Status Git Saat Audit

Saat laporan ini ditulis, worktree sudah memiliki perubahan di:

- `apps/web/src/components/sections/pricing.tsx`
- `plan/audit.md`

Saya hanya menulis laporan audit ke `plan/audit.md`. Perubahan di `pricing.tsx` sudah ada di worktree saat audit dan tidak saya revert.
