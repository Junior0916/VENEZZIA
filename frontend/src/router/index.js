import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TerminosCondiciones from '../views/TerminosCondiciones.vue'
import PoliticasCambioDevolucion from '../views/PoliticasCambioDevolucion.vue'
import LibroReclamaciones from '../views/LibroReclamaciones.vue'
import ImageOptimizerView from '../views/ImageOptimizerView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/terminos-y-condiciones',
    name: 'terminos',
    component: TerminosCondiciones,
    alias: ['/terminos', '/terms']
  },
  {
    path: '/politicas-de-cambio',
    name: 'politicas',
    component: PoliticasCambioDevolucion,
    alias: ['/politicas-de-devolucion', '/politicas', '/devoluciones']
  },
  {
    path: '/libro-de-reclamaciones',
    name: 'libro-reclamaciones',
    component: LibroReclamaciones,
    alias: ['/reclamaciones', '/reclamos']
  },
  {
    path: '/optimizador-imagenes',
    name: 'optimizador-imagenes',
    component: ImageOptimizerView,
    alias: ['/recortador', '/herramientas/recortador', '/optimizador']
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const el = document.querySelector(to.hash)
          if (el) {
            resolve({ el: to.hash, behavior: 'smooth' })
          } else {
            resolve({ top: 0, behavior: 'smooth' })
          }
        }, 150)
      })
    }
    return { top: 0, behavior: 'smooth' }
  }
})

export default router
