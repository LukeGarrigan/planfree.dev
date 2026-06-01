import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import * as Sentry from '@sentry/vue'

const app = createApp(App)

// No-op when VITE_SENTRY_DSN is unset (e.g. local dev).
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
        Sentry.browserTracingIntegration({ router }),
        Sentry.replayIntegration(),
        Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    tracesSampleRate: 1.0,
    enableLogs: true,
  })
}

app.use(router)
app.mount('#planfree');
