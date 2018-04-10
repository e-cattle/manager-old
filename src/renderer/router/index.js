import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'welcome-view',
      component: require('@/components/WelcomeView').default
    },
    {
      path: '/device',
      name: 'device',
      component: require('@/components/DeviceView').default
    },
    {
      path: '/sync',
      name: 'sync',
      component: require('@/components/SyncView').default
    },
    {
      path: '/config',
      name: 'config',
      component: require('@/components/ConfigurationView').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
