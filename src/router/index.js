import Vue from 'vue'
import Router from 'vue-router'

import Recommend from '@/components/Recommend'
import Singer from '@/components/Singer'
import Rank from '@/components/Rank'
import Search from '@/components/Search'
import SingerDetail from '@/components/SingerDetail'
import Disc from '@/components/Disc'
import RankList from '@/components/RankList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend,
      children:[{
        path:':id',
        component:Disc
      }]
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank,
      children:[{
        path:":id",
        component:RankList
      }]
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children:[
        {
          path:":id",
          component:SingerDetail
        }
      ]
    }
  ]
})
