import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

import Singer from "../views/singer/Singer";
import Recommend from "../views/recommend/Recommend";
import Search from "../views/search/Search";
import Rank from "../views/rank/Rank";
import SingerDetail from "../views/singer/children/SingerDetail";
import Disc from "../views/recommend/disc/Disc";
import TopList from "../views/rank/toplist/TopList";

const routes = [
  {
    path:'/',
    redirect:'/recommend'
  },
  {
    path:"/singer",
    component:Singer,
    children:[
      {
        path:':id',
        component:SingerDetail
      }
    ]
  },
  {
    path:"/recommend",
    component:Recommend,
    children:[
      {
        path:':id',
        component:Disc
      }
    ]
  },
  {
    path:"/search",
    component:Search,
    children:[
      {
        path:':id',
        component:SingerDetail
      }
    ]
  },
  {
    path:"/rank",
    component:Rank,
    children:[
      {
        path:':id',
        component:TopList
      }
    ]
  }
]

export default new Router({
  routes,
  mode:'history'
})
