import { defineConfig } from "vite"
import vue from '@vitejs/plugin-vue'


export default defineConfig({
    server: {
        allowedHosts: ["nri.intranet.he2b.be"] // defined locally in my /etc/hosts file
    },
    plugins: [vue()],
    base: '/generateur-attestations'  
})
