/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // genera /out con index.html para Firebase
  images: { unoptimized: true }, // evita errores con imágenes
  trailingSlash: true // asegura rutas terminadas en /
};

module.exports = nextConfig;
