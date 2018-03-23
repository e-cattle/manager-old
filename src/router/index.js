import Vue from 'vue'
import Router from 'vue-router'

import HelloWorld from '@/components/HelloWorld'
import Devices from '@/components/Devices'
import Measures from '@/components/Measures'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/devices',
      name: 'Devices',
      component: Devices
    },
    {
      path: '/measures',
      name: 'Measures',
      component: Measures
    }
  ]
})
