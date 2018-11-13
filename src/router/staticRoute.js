const Layout = () => import(/* webpackChunkName: 'index' */ '../page/layout')

const staticRoute = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/error',
        component: () => import(/* webpackChunkName: 'error' */ '../page/error'),
        children: [
            {
                path: '401',
                component: () => import(/* webpackChunkName: 'error' */ '../page/error/401')
            },
            {
                path: '403',
                component: () => import(/* webpackChunkName: 'error' */ '../page/error/403')
            },
            {
                path: '404',
                component: () => import(/* webpackChunkName: 'error' */ '../page/error/404')
            },
            {
                path: '500',
                component: () => import(/* webpackChunkName: 'error' */ '../page/error/500')
            }
        ]
    },
    {
        path: '/login',
        component: () => import(/* webpackChunkName: 'login' */ '../page/login')
    },
    {
        path: '/home',
        component: Layout,
        children: [
            {
                path: '',
                component: () => import(/* webpackChunkName: 'home' */ '../page/home'),
            }
        ]
    },
    {
        path: '/tabs',
        component: Layout,
        children: [
            {
                path: '',
                component: () => import(/* webpackChunkName: 'home' */ '../page/message'),
            }
        ]
    },
    {
        path: '/components',
        component: Layout,
        children: [
            {
                path: '',
                component: () => import(/* webpackChunkName: 'components' */ '../page/components')
            },
            {
                path: 'pageNotes',
                component: () => import(/* webpackChunkName: 'components' */ '../page/components/assist/pageNotes')
            },
            {
                path: 'permission',
                component: () => import(/* webpackChunkName: 'components' */ '../page/components/function/permission')
            },
            {
                path: 'pageTable',
                component: () => import(/* webpackChunkName: 'components' */ '../page/components/function/pageTable')
            },
            {
                path: 'pageSearch',
                component: () => import(/* webpackChunkName: 'components' */ '../page/components/ui/pageSearch')
            },
            {
                path: 'pageSection',
                component: () => import(/* webpackChunkName: 'components' */ '../page/components/ui/pageSection')
            },
            {
                path: 'pageTitle',
                component: () => import(/* webpackChunkName: 'components' */ '../page/components/ui/pageTitle')
            },
            {
                path: 'pageToolbar',
                component: () => import(/* webpackChunkName: 'components' */ '../page/components/ui/pageToolbar')
            },
        ]
    },
    {
        path: '/example',
        component: Layout,
        children: [
            {
                path: 'table',
                //component: () => import(/* webpackChunkName: 'example' */ '../page/example/table')
                component: () => import(/* webpackChunkName: 'example' */ '@/page/admin/environment/manage'),
                redirect: '/admin/environment/basic',
                children:[
                  {
                    path:'union',
                    component:()=>import('@/page/admin/environment/union'),
                },
                {
                  path:'basic',
                  component:()=>import('@/page/admin/environment/basicUnion'),
                },
                {
                  path:'look',
                  component:()=>import('@/page/admin/environment/lookUnion'),
                }
                ]
            },
            {
                path: 'charts',
                component: () => import(/* webpackChunkName: 'example' */ '../page/example/charts')
            },
            {
                path: 'map',
                component: () => import(/* webpackChunkName: 'example' */ '../page/example/map')
            }
        ]
    },
    {
        path: '/i18n',
        component: Layout,
        children: [
            {
                path: '',
                component: () => import(/* webpackChunkName: 'i18n' */ '../page/example/table')
            }
        ]
    },
    {
        path: '/theme',
        component: Layout,
        children: [
            {
                path: '',
                component: () => import(/* webpackChunkName: 'themeChange' */ '../page/admin/user/AdminUserList')
                //component: () => import(/* webpackChunkName: 'themeChange' */ '../page/admin/user/userList')
            }
        ]
    },
    {
        path: '/admin',
        component: () => import('../page/admin/login')
    },
    {
        path: '/admin/User',
        component: Layout,
        children: [
            {
                path: '',
                component: () => import(/* webpackChunkName: 'themeChange' */ '../page/admin/user/AdminUserList')
            }
        ]
    },
    {
        path: '/admin/environment',
        component: ()=>import('@/page/admin/environment/manage'),
        redirect: '/admin/environment/basic',
        children:[
          {
            path:'union',
            component:()=>import('@/page/admin/environment/union'),
        },
        {
          path:'basic',
          component:()=>import('@/page/admin/environment/basicUnion'),
        },
        {
          path:'look',
          component:()=>import('@/page/admin/environment/lookUnion'),
        }
        ]
      },
      {
        path: '/admin/environment/add',
        component:()=>import('@/page/admin/environment/manageAdd'),
      },
      {
        path: '/admin/environment/update',
        component:()=>import('@/page/admin/environment/manageUpdate'),
      },
      {
        path: '/admin/finance',
        component:()=>import('@/page/finance/addVoucher'),
      },
      {
        path: '/admin/role',
        component:()=>import('@/page/admin/roleManage/role'),
      },
      {
        path: '/admin/role/add',
        component:()=>import('@/page/admin/roleManage/roleAdd'),
      },



    {
        path: '*',
        redirect: '/error/404'
    }
]

export default staticRoute