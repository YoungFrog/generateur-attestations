import { defineConfig } from "vite"

export default defineConfig({
    server: {
        allowedHosts: ["nri.intranet.he2b.be"] // defined locally in my /etc/hosts file
    },
    base: '/generateur-attestations'  
})