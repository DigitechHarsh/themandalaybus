import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-frames-dir',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/frames/')) {
            const filename = decodeURIComponent(req.url.slice('/frames/'.length).split('?')[0])
            const filepath = path.resolve(process.cwd(), 'frames', filename)
            if (fs.existsSync(filepath)) {
              const ext = path.extname(filepath).slice(1).toLowerCase()
              const mimeTypes = {
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                png: 'image/png',
                webp: 'image/webp',
              }
              res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
              res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
              fs.createReadStream(filepath).pipe(res)
              return
            }
          }
          next()
        })
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap', '@gsap/react'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
