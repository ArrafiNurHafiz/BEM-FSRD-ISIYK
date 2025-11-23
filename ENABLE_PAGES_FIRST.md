# ⚠️ PENTING: Enable GitHub Pages Dulu!

Workflow masih gagal karena **GitHub Pages belum di-enable dengan benar**.

## 🔴 Masalah

Workflow gagal dengan error karena environment `github-pages` belum dibuat. Environment ini hanya dibuat otomatis setelah Anda enable GitHub Pages di Settings.

## ✅ Solusi (Lakukan SEBELUM workflow jalan)

### Langkah 1: Enable GitHub Pages

1. **Buka**: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK/settings/pages

2. **Di bagian "Source"**:
   - Pilih **"GitHub Actions"** (BUKAN "Deploy from a branch")
   - Klik **"Save"**

3. **Verifikasi**:
   - Setelah save, refresh halaman
   - Seharusnya ada pesan bahwa environment `github-pages` sudah dibuat
   - Atau cek di tab **Environments**: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK/settings/environments

### Langkah 2: Check Workflow Permissions

1. **Buka**: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK/settings/actions

2. **Di bagian "Workflow permissions"**:
   - Pilih **"Read and write permissions"**
   - Centang **"Allow GitHub Actions to create and approve pull requests"**

3. **Save**

### Langkah 3: Re-run Workflow

Setelah enable GitHub Pages:

1. **Buka**: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK/actions
2. **Klik** pada workflow yang gagal (red X)
3. **Klik** "Re-run jobs" → "Re-run failed jobs"

Atau push perubahan baru:

```bash
cd /home/arrafinur/gabut
git push
```

## 🎯 Checklist

Sebelum workflow bisa jalan:

- [ ] **Settings → Pages → Source**: Sudah di-set ke **"GitHub Actions"**
- [ ] **Settings → Pages**: Sudah di-klik **"Save"**
- [ ] **Settings → Actions → Workflow permissions**: Sudah **"Read and write"**
- [ ] Environment `github-pages` sudah dibuat (cek di Settings → Environments)

## 🔍 Verify Environment

Cek apakah environment sudah dibuat:

1. Buka: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK/settings/environments
2. Seharusnya ada environment **"github-pages"**
3. Jika tidak ada, kembali ke Settings → Pages dan enable dulu

## 🚀 Setelah Enable

Setelah enable GitHub Pages:

1. Workflow akan otomatis jalan saat ada push baru
2. Atau re-run workflow yang gagal
3. Tunggu 2-3 menit
4. Website akan tersedia di: https://arrafinurhafiz.github.io/BEM-FSRD-ISIYK/

---

**⚠️ PENTING: Enable GitHub Pages di Settings dulu sebelum workflow bisa berjalan!**

