# Konfigurasi Environment Variables

## File .env

Buat file `.env` di folder `frontend/` dengan isi:

```
VITE_API_URL=http://localhost:5000/api
```

## Cara Membuat File .env

### Di Terminal:
```bash
cd frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### Atau Manual:
1. Buat file baru bernama `.env` di folder `frontend/`
2. Tambahkan baris: `VITE_API_URL=http://localhost:5000/api`
3. Simpan file

## Catatan

- File `.env` tidak akan di-commit ke Git (sudah di-ignore)
- Jika tidak ada file `.env`, aplikasi akan menggunakan default: `http://localhost:5000/api`
- Setelah membuat atau mengubah `.env`, **restart development server** (Ctrl+C lalu `npm run dev` lagi)
- Vite hanya membaca environment variables yang dimulai dengan `VITE_`

## Troubleshooting

Jika masih error setelah membuat `.env`:
1. Pastikan file `.env` ada di folder `frontend/` (bukan di root)
2. Restart frontend server: `npm run dev`
3. Periksa apakah backend berjalan di port 5000
4. Test endpoint: `curl http://localhost:5000/api/health`

