import { createRouter, createWebHashHistory } from 'vue-router'
import Accueil from './views/Accueil.vue'
import EnConstruction from './views/EnConstruction.vue'
import Semis from './views/Semis.vue'
import Chaulage from './views/Chaulage.vue'
import Fumure from './views/Fumure.vue'
import Conversions from './views/Conversions.vue'
import { calculateurs } from './calculateurs'

// Historique « hash » (#/semis) : compatible avec GitHub Pages, sans configuration serveur
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'accueil', component: Accueil },
    { path: '/semis', name: 'semis', component: Semis },
    { path: '/chaulage', name: 'chaulage', component: Chaulage },
    { path: '/fumure', name: 'fumure', component: Fumure },
    { path: '/conversions', name: 'conversions', component: Conversions },
    ...calculateurs
      .filter((c) => !c.disponible)
      .map((c) => ({
      path: `/${c.slug}`,
      name: c.slug,
      component: EnConstruction,
      props: { slug: c.slug },
    })),
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
