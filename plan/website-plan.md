# Website Plan: Kabut Tipis — Company Profile

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

## 1. Homepage (`/`)

**Sections:**
- **Hero** — Full-screen background image/video, tagline, dua CTA button: "Lihat Galeri" + "Reservasi Sekarang"
- **About Snippet** — 2–3 kalimat singkat + tombol "Pelajari Lebih Lanjut"
- **Services Preview** — Grid 3 kartu layanan unggulan (icon + nama + deskripsi singkat)
- **Gallery Preview** — Masonry grid 6 foto terbaik + tombol "Lihat Semua"
- **Reservation CTA Banner** — Background foto, ajakan reservasi + tombol ke `/reservation`
- **Testimonials** — Carousel 3–5 ulasan tamu (static dari database)
- **Footer** — Logo, navigasi, sosmed, alamat, copyright

---

## 2. About (`/about`)

**Sections:**
- **Story Section** — Foto besar + teks narasi asal-usul tempat
- **Vision & Mission** — Cards dengan icon
- **Stats** — Angka pencapaian (tahun berdiri, tamu dilayani, rating, dll)
- **Team** (opsional) — Grid foto + nama + jabatan

---

## 3. Gallery (`/gallery`)

**Fitur:**
- Tab filter: Semua / Foto / Video / Event
- Masonry grid layout responsif
- Klik foto → Lightbox (full-screen viewer, prev/next navigation)
- Lazy loading dengan skeleton placeholder
- Upload dikelola via database (nama file + URL + kategori)

**Database schema:**
```typescript
gallery_items {
  id, title, description, url, thumbnail_url,
  type: "photo" | "video",
  category: string,
  sort_order, created_at
}
```

---

## 4. Services (`/services`)

**Sections:**
- **Packages Grid** — Kartu tiap paket: nama, harga, deskripsi, fitur list, tombol "Reservasi"
- **Facilities** — Icon grid fasilitas yang tersedia
- **FAQ** — Accordion pertanyaan umum tentang pemesanan

**Database schema:**
```typescript
packages {
  id, name, description, price, duration,
  features: string[], // JSON array
  is_featured, is_active, sort_order
}
```

---

## 5. Reservation (`/reservation`) — Fitur Utama

**Flow:**
```
Isi Form → Preview Ringkasan → Klik "Konfirmasi via WhatsApp"
  → Redirect ke wa.me dengan pesan terformat otomatis
```

**Form fields:**
- Nama lengkap
- Nomor WhatsApp
- Tanggal kunjungan (date picker)
- Jumlah tamu (number input)
- Pilih paket (dropdown dari data packages)
- Catatan tambahan (textarea, opsional)

**WhatsApp message yang digenerate:**
```
Halo, saya ingin reservasi di Kabut Tipis:
• Nama: [nama]
• Tanggal: [tanggal]
• Jumlah Tamu: [jumlah]
• Paket: [nama paket]
• Catatan: [catatan]

Mohon konfirmasinya, terima kasih!
```

**Database schema:**
```typescript
reservations {
  id, name, phone, date, guest_count,
  package_id, notes,
  status: "pending" | "confirmed" | "cancelled",
  created_at
}
```

---

## 6. Contact (`/contact`)

**Sections:**
- **Info Cards** — Alamat, nomor WA, email, jam operasional
- **Google Maps Embed** — Iframe lokasi
- **Quick Contact Buttons** — Tombol langsung ke WhatsApp + tombol salin nomor

---

## Arsitektur Teknis

### tRPC Routers

```
packages/api/src/routers/
├── gallery.ts       → list, getById (public)
├── packages.ts      → list, getById (public)
└── reservation.ts   → create (public, simpan ke DB)
```

### Route Files

```
apps/web/src/routes/
├── index.tsx          → Homepage
├── about.tsx          → About
├── gallery.tsx        → Gallery
├── services.tsx       → Services
├── reservation.tsx    → Reservation form
└── contact.tsx        → Contact
```

### Komponen Baru

```
apps/web/src/components/
├── layout/
│   ├── navbar.tsx              → Navigation dengan mobile menu
│   └── footer.tsx              → Footer
├── sections/
│   ├── hero.tsx
│   ├── gallery-grid.tsx
│   ├── lightbox.tsx
│   ├── package-card.tsx
│   └── testimonial-carousel.tsx
└── reservation/
    └── reservation-form.tsx    → Form + WA redirect logic
```

---

## Urutan Implementasi

| Tahap | Pekerjaan |
|-------|-----------|
| 1 | Setup DB schema (gallery_items, packages, reservations) + tRPC routers |
| 2 | Layout global: Navbar + Footer |
| 3 | Homepage (Hero + semua sections) |
| 4 | Halaman Gallery + Lightbox |
| 5 | Halaman Services + Packages |
| 6 | Halaman Reservation + WhatsApp redirect |
| 7 | Halaman About + Contact |
| 8 | Polish: animasi, responsif, SEO meta tags |
