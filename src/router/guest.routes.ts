const routes = [
    {
        path: "/",
        name: "landing",
        component: () => import("@/pages/guest/LandingPage.vue"),
        meta: { guest: true }
    },
    {
        path: "/terms-of-use",
        name: "terms-of-use",
        component: () => import("@/pages/guest/TermsOfUse.vue"),
    },
    {
        path: "/privacy-policy",
        name: "privacy-policy",
        component: () => import("@/pages/guest/PrivacyPolicy.vue"),
    },
]

export default routes
