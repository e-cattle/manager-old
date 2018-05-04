import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Início',
      component: require('@/components/WelcomeView').default
    },
    {
      path: '/dashboard',
      name: 'Painel de Controle',
      component: require('@/components/DashboardView').default
    },
    {
      path: '/device',
      name: 'Dispositivos',
      component: require('@/components/DeviceView').default
    },
    {
      path: '/sync',
      name: 'Sincronizar',
      component: require('@/components/SyncView').default
    },
    {
      path: '/config',
      name: 'Configurações',
      component: require('@/components/ConfigurationView').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
