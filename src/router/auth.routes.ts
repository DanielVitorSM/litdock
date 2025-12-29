const routes = [
    {
        path: "/login",
        name: "login",
        component: () => import("@/pages/auth/LoginPage.vue"),
        meta: { guest: true }
    },
    {
        path: "/register",
        name: "register",
        component: () => import("@/pages/auth/RegisterPage.vue"),
        meta: { guest: true }
    },
]

export default routes
