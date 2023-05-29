import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import basicSsl from "@vitejs/plugin-basic-ssl"
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/short/",
  plugins: [
    react(),
    VitePWA({
      scope: "/short/",
      base: "/short/",
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Short",
        short_name: "Short",
        description: "A simple URL shortener built on top of short.io",
        background_color: "#242424",
        icons: [
          { src: "/short/Short.png", sizes: "128x128", type: "image/png" },
          { src: "/short/Short@0.5.png", sizes: "64x64", type: "image/png" },
          { src: "/short/Short@2x.png", sizes: "256x256", type: "image/png" },
          { src: "/short/Short@3x.png", sizes: "384x384", type: "image/png" },
        ],
        "share_target": {
          action: "/short/",
          enctype: "application/x-www-form-urlencoded",
          method: "GET",
          params: {
            url: "url",
            title: "title",
            text: "text"
          }
        }
      }
    })
  ],

  // hack to make @rehooks/local-storage work
  define: {
    global: {
      window: {}
    }
  }
})
