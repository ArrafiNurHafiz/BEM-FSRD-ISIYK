import React from 'react';

const BackgroundEffects = () => {
  // Background image - prioritas gambar lokal, jika tidak ada gunakan URL berkualitas tinggi
  // Anda bisa mengubah index untuk memilih gambar lain, atau menambahkan gambar ke folder /public/images/
  const backgroundOptions = [
    '/images/bg1.jpg', // Gambar lokal 1
    '/images/bg3.jpg', // Gambar lokal 2
    // Opsi gambar elegan dari internet (jika gambar lokal tidak ada):
    'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80', // Elegant gradient
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80', // Modern abstract
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&q=80', // Artistic pattern
  ];

  // Pilih background image (ubah index 0, 1, 2, dll untuk mengganti gambar)
  const selectedBackground = backgroundOptions[0];

  return (
    <>
      {/* Solid Dark Blue Background - seperti gambar */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Solid dark blue background - warna seperti gambar */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: '#0a1628', // Dark navy blue solid
            background: '#0a1628', // Fallback
          }}
        />
      </div>
    </>
  );
};

export default BackgroundEffects;

