import { createApp } from 'vue'
import { createPinia } from 'pinia'
// @ts-expect-error Ignore a tipagem pois é usado no build
import { registerSW } from 'virtual:pwa-register'

import App from '@/App.vue'
import router from '@/router'

import "@/styles.css"
import 'nprogress/nprogress.css'

import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const updateSW = registerSW({
    onNeedRefresh() {
        toast.info('Nova atualização disponível!', {
            duration: 10000,
            action: {
                label: 'Atualizar',
                onClick: () => {
                    updateSW(true)
                }
            },
        })
    },
    onOfflineReady() {
        console.log('App pronto para uso offline')
    },
})

const app = createApp(App)

app.use(createPinia())

const authStore = useAuthStore()

authStore.fetchUser().finally(async () => {
    app.use(router)
    app.mount('#app')

    await router.isReady()

    const loader = document.getElementById('boot-loading')
    if (loader) {
        loader.classList.add('hide')
        setTimeout(() => loader.remove(), 300)
    }
})