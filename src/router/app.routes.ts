const AppViews = {
    default: () => import("@/pages/app/HomePage.vue"),
    sidebar: () => import("@/components/ReferenceDetailSidebar.vue")
}

const routes = [
    {
        path: "/app",
        name: "home",
        meta: { breadcrumb: "Todas as referências" },
        components: AppViews,
        children: [
            {
                path: "tags/:tagId",
                name: "tag",
                meta: { breadcrumb: 'tag' },
                components: AppViews
            },
            {
                path: "collections/:collectionId",
                name: "collection",
                meta: { breadcrumb: 'collection' },
                components: AppViews
            },
            {
                path: "favorites",
                name: "favorites",
                meta: { breadcrumb: 'Favoritos' },
                components: AppViews
            },
            {
                path: "archived",
                name: "archived",
                meta: { breadcrumb: 'Arquivados' },
                components: AppViews
            },
            {
                path: "reading",
                name: "reading",
                meta: { breadcrumb: 'Lendo' },
                components: AppViews
            },
            {
                path: "finished",
                name: "finished",
                meta: { breadcrumb: 'Finalizados' },
                components: AppViews
            },
            {
                path: "unread",
                name: "unread",
                meta: { breadcrumb: 'Não lidos' },
                components: AppViews
            },
        ]
    }
]

export default routes
