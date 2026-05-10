# Website Plan: Kabut Tipis — Company Profile

## Tentang Kabut Tipis

Tempat rekreasi / coffeeshop / penginapan dengan pemandangan gunung, sawah, dan aliran sungai.
Pengunjung bisa reservasi meja/paket via form yang langsung redirect ke WhatsApp.

---

## Design System

### Font
- **Poppins** (Google Fonts) — semua teks
- Import via `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap')`
- Set di CSS global: `font-family: 'Poppins', sans-serif`

### Warna
| Token | Nilai | Keterangan |
|-------|-------|------------|
| `--primary` | `#288008` | Hijau alam — tombol utama, aksen |
| `--primary-foreground` | `#ffffff` | Teks di atas primary |
| `--background` | `#ffffff` | Background halaman |
| `--foreground` | `#1a1a1a` | Teks utama |
| `--muted` | `#f5f5f0` | Background card/section alt |
| `--muted-foreground` | `#6b7280` | Teks sekunder |
| `--border` | `#e5e7eb` | Garis pembatas |

### Mode
- **Light-only** — tidak perlu dark mode (website publik untuk wisatawan)

---

## Struktur Halaman

```
/                    → Homepage
/about               → Tentang Kami
/gallery             → Galeri Foto & Video
/services            → Layanan & Paket
/reservation         → Formulir Reservasi (→ WhatsApp)
/contact             → Kontak & Lokasi
```

---

## Komponen Utama (dari plan/)

### 1. Navbar — `plan/navbar.md`

**Komponen:** `PillBase` (3D Adaptive Navigation Pill)
- Floating pill navbar, expand on hover
- Collapsed: tampilkan nama section aktif
- Expanded: tampilkan semua nav item dengan stagger animation
- **Adaptasi:** ganti font ke Poppins, warna active ke `#288008`
- **Deps:** `framer-motion`
- **Nav items:** Home, Galeri, Layanan, Reservasi, Kontak

```
apps/web/src/components/layout/navbar.tsx
```

### 2. Hero — `plan/hero-section.md`

**Komponen:** `ScrollExpandMedia` (Scroll Expansion Hero)
- Video/gambar kecil di tengah, expand ke fullscreen saat scroll
- Background foto alam (gunung/sawah) memudar saat video expand
- Title split: "Kabut" + "Tipis" masing-masing bergerak dari sisi berlawanan
- **Adaptasi:** hapus `next/image` → pakai `<img>`, hapus `'use client'` directive
- **Deps:** `framer-motion`
- **Asset:** video drone pemandangan Kabut Tipis (atau Unsplash placeholder alam)
- **Teks:** title "Kabut Tipis", scrollToExpand "Scroll untuk Menjelajahi"

```
apps/web/src/components/sections/hero.tsx
```

### 3. Price Section — `plan/price-section.md`

**Komponen:** `BentoPricing` (Bento Grid Pricing)
- Grid asimetris: satu kartu besar (featured) + 3 kartu kecil
- Kartu besar featured = paket paling populer (col-span-5)
- Kartu kecil sisanya (col-span-3/4)
- **Adaptasi:** ganti harga ke Rupiah, ganti teks ke nama paket Kabut Tipis
- **Deps:** `lucide-react`, `class-variance-authority`, `@radix-ui/react-slot`
- **Tombol:** "Reservasi Sekarang" → navigate ke `/reservation?paket=xxx`

```
apps/web/src/components/sections/pricing.tsx
```

### 4. Testimonials — `plan/testimonial-section.md`

**Komponen:** `StaggerTestimonials` (Stagger Card Carousel)
- Kartu di-stack secara diagonal, kartu aktif di tengah dengan background primary
- Klik kartu untuk memindahkan ke posisi aktif
- Prev/Next button di bawah
- **Adaptasi:** isi data testimonial nyata dari tamu Kabut Tipis
- **Deps:** `lucide-react`
- Warna kartu aktif menggunakan `bg-primary` (#288008) dengan teks putih

```
apps/web/src/components/sections/testimonials.tsx
```

### 5. Footer — `plan/footer.md`

**Komponen:** `CinematicFooter` (Motion Footer dengan GSAP)
- Fixed footer dengan "curtain reveal" saat scroll
- Giant background text "KABUT TIPIS"
- Diagonal marquee di atas: "Alam yang Asri ✦ Udara Segar ✦ Pemandangan Gunung ✦ Aliran Sungai ✦"
- Magnetic pill buttons untuk WhatsApp, Instagram, Maps
- Back to top button
- **Adaptasi:** ganti konten marquee, ganti CTA pills ke sosmed/kontak, hapus "Download iOS/Android"
- **Deps:** `gsap`

```
apps/web/src/components/layout/footer.tsx
```

---

## Halaman Detail

### Homepage (`/`)

**Sections (urutan dari atas):**
1. `<Hero />` — ScrollExpandMedia dengan video/foto alam
2. `<AboutSnippet />` — 2 kolom: foto + teks singkat + tombol "Selengkapnya"
3. `<ServicesPreview />` — 3 kartu icon: Coffeeshop, Penginapan, Area Rekreasi
4. `<GalleryPreview />` — Grid 6 foto terbaik + tombol "Lihat Galeri"
5. `<Pricing />` — BentoPricing dengan paket Kabut Tipis
6. `<Testimonials />` — StaggerTestimonials
7. `<ReservationCTA />` — Banner foto full-width + tombol reservasi WhatsApp
8. `<Footer />` — CinematicFooter

---

### About (`/about`)

**Sections:**
1. **Story** — Foto panorama + narasi asal-usul Kabut Tipis
2. **Keunggulan** — 4 icon card: Pemandangan Gunung, Sawah Hijau, Aliran Sungai, Udara Segar
3. **Stats** — Angka: Tahun Berdiri, Total Tamu, Rating Google, Luas Area
4. **Fasilitas** — Grid icon: WiFi, Parkir, Mushola, Toilet Bersih, dll

---

### Gallery (`/gallery`)

**Fitur:**
- Tab filter: **Semua / Foto / Video / Area Rekreasi / Coffeeshop / Penginapan**
- Masonry grid 3 kolom (desktop), 2 kolom (tablet), 1 kolom (mobile)
- Klik item → Lightbox fullscreen dengan prev/next + close button
- Lazy loading dengan skeleton placeholder
- Data dari DB: `gallery_items` table

**Database schema:**
```typescript
gallery_items {
  id: text (PK),
  title: text,
  description: text,
  url: text,           // URL gambar/video
  thumbnail_url: text, // Thumbnail untuk video
  type: "photo" | "video",
  category: text,      // "rekreasi" | "coffeeshop" | "penginapan"
  sort_order: integer,
  created_at: timestamp
}
```

---

### Services (`/services`)

**Sections:**
1. **Packages Grid** — BentoPricing (sama seperti di homepage, standalone page)
2. **Facilities** — Icon grid: semua fasilitas detail
3. **FAQ** — Accordion: pertanyaan umum reservasi, jam buka, harga, lokasi

**Database schema:**
```typescript
packages {
  id: text (PK),
  name: text,
  description: text,
  price: integer,        // dalam Rupiah
  duration: text,        // "per orang", "per malam", dll
  features: text,        // JSON string array
  is_featured: integer,  // boolean
  is_active: integer,    // boolean
  sort_order: integer
}
```

---

### Reservation (`/reservation`) — Fitur Utama

**Flow:**
```
Isi Form → Klik "Konfirmasi via WhatsApp"
  → Encode data ke URL → window.open("https://wa.me/62xxx?text=...")
```

**Form fields:**
| Field | Tipe | Validasi |
|-------|------|----------|
| Nama lengkap | text | required, min 3 char |
| Nomor WhatsApp | text | required, format 08xx/62xx |
| Tanggal kunjungan | date | required, min = hari ini |
| Jumlah tamu | number | required, min 1, max 100 |
| Pilih paket | select | required, dari data packages |
| Catatan tambahan | textarea | opsional |

**WhatsApp message:**
```
Halo Kabut Tipis! 👋

Saya ingin melakukan reservasi:
• Nama: [nama]
• Tanggal: [tanggal]
• Jumlah Tamu: [jumlah] orang
• Paket: [nama paket] ([harga])
• Catatan: [catatan]

Mohon konfirmasinya, terima kasih! 🙏
```

**Database schema (opsional — simpan lead):**
```typescript
reservations {
  id: text (PK),
  name: text,
  phone: text,
  date: text,
  guest_count: integer,
  package_id: text,     // FK ke packages
  notes: text,
  status: "pending" | "confirmed" | "cancelled",
  created_at: timestamp
}
```

---

### Contact (`/contact`)

**Sections:**
1. **Info Cards** — 4 kartu: Alamat, WhatsApp, Email, Jam Operasional
2. **Google Maps Embed** — Iframe lokasi Kabut Tipis
3. **Quick Actions** — Tombol: Chat WhatsApp, Telepon, Salin Alamat

---

## Arsitektur Teknis

### File Structure

```
apps/web/src/
├── routes/
│   ├── __root.tsx              → Root layout (Navbar + Footer)
│   ├── index.tsx               → Homepage
│   ├── about.tsx               → About
│   ├── gallery.tsx             → Gallery
│   ├── services.tsx            → Services
│   ├── reservation.tsx         → Reservation form
│   └── contact.tsx             → Contact
├── components/
│   ├── layout/
│   │   ├── navbar.tsx          → PillBase (adapted)
│   │   └── footer.tsx          → CinematicFooter (adapted)
│   ├── sections/
│   │   ├── hero.tsx            → ScrollExpandMedia (adapted)
│   │   ├── pricing.tsx         → BentoPricing (adapted)
│   │   ├── testimonials.tsx    → StaggerTestimonials (adapted)
│   │   ├── gallery-grid.tsx    → Masonry grid
│   │   ├── lightbox.tsx        → Fullscreen viewer
│   │   └── reservation-cta.tsx → CTA banner
│   └── reservation/
│       └── reservation-form.tsx → Form + WA redirect
│
packages/api/src/routers/
├── gallery.ts      → list (public)
├── packages.ts     → list, getById (public)
└── reservation.ts  → create (public)

packages/db/src/schema/
├── gallery.ts
├── packages.ts
└── reservations.ts
```

### tRPC Procedures

```typescript
// gallery.list → GET all gallery items (by category filter)
// packages.list → GET all active packages
// packages.getById → GET single package
// reservation.create → POST new reservation (save to DB, then FE redirects to WA)
```

### Dependencies Tambahan

```bash
bun add framer-motion gsap
```

---

## Urutan Implementasi

| Tahap | Pekerjaan | Status |
|-------|-----------|--------|
| 1 | Setup global: font Poppins + CSS variables warna di `index.css` | ⬜ |
| 2 | DB schema (packages, gallery_items, reservations) + tRPC routers | ⬜ |
| 3 | Navbar (PillBase adapted) + Footer (CinematicFooter adapted) di `__root.tsx` | ⬜ |
| 4 | Homepage: Hero + AboutSnippet + ServicesPreview | ⬜ |
| 5 | Homepage: BentoPricing + StaggerTestimonials + ReservationCTA | ⬜ |
| 6 | Halaman Gallery + Lightbox | ⬜ |
| 7 | Halaman Services (full pricing + FAQ) | ⬜ |
| 8 | Halaman Reservation (form + WA redirect) | ⬜ |
| 9 | Halaman About + Contact | ⬜ |
| 10 | Polish: animasi transisi halaman, SEO meta tags, responsif mobile | ⬜ |

---

## Catatan Adaptasi Next.js → TanStack Start

Komponen dari plan/ ditulis untuk Next.js. Perlu adaptasi:

| Next.js | TanStack Start |
|---------|----------------|
| `'use client'` | Hapus — semua komponen sudah client-side |
| `import Image from 'next/image'` | Ganti dengan `<img>` biasa |
| `import { useRouter } from 'next/navigation'` | Ganti dengan `import { useNavigate } from '@tanstack/react-router'` |
| `Link` dari next/link | `Link` dari `@tanstack/react-router` |
