import { createRouter, createWebHashHistory } from 'vue-router'
import Accueil from './views/Accueil.vue'
import EnConstruction from './views/EnConstruction.vue'
import { calculateurs } from './calculateurs'

// Historique « hash » (#/semis) : compatible avec GitHub Pages, sans configuration serveur
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'accueil', component: Accueil },
    ...calculateurs.map((c) => ({
      path: `/${c.slug}`,
      name: c.slug,
      component: EnConstruction,
      props: { slug: c.slug },
    })),
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
