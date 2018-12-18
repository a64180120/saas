const Layout = () => import(/* webpackChunkName: 'index' */ "../page/layout");

const staticRoute = [
    {
        path: "/",
        redirect: "/index"
    },
    {
        path: "/login",
        component: () => import("../page/login")
    },
    {
        path: "/register",
        component: () => import("../page/register")
    },
    {
        path:'/indexfinance',
        component: () =>import("../page/finance/voucherAdd")
    },
    {
        path:'/index',
        component: () =>import("../page/index")
    },
    {
        path: "/home",
        component: Layout,
        children: [
            {
                path: "",
                component: () =>import("../page/home/index"),
                meta:{ requireAuth:true,type:'page',isMenu:true,name:'首页' }
            }
        ]
    },
    {
        //系统管理
        path: "/admin",
        component: Layout,
        children: [
            {
                //组织管理
                path: "orgin",
                component: () => import("../page/admin/organize/manage"),
                //redirect: "/admin/orgin/union",
                meta:{ requireAuth:true,type:'page',isMenu:true}
            },
            {
                //组织管理 -新增
                path: "orgin/add",
                component: () => import("../page/admin/organize/manageAdd"),
                meta:{ requireAuth:true,type:'button',name:'组织新增'}
            },
            {
                //组织管理 -编辑
                path: "orgin/edit",
                component: () => import("../page/admin/organize/manageUpdate"),
                meta:{ requireAuth:true,type:'button',name:'组织编辑'}
            },
            {
                //角色管理
                path: "role",
                component: () =>import("../page/admin/role"),
                meta:{ requireAuth:true ,isMenu:true}
            },
            {
                //用户管理
                path: "user",
                component: () =>import("../page/admin/user"),
                meta:{ requireAuth:true ,isMenu:true}
            },
            {
                //菜单管理
                path: "menu",
                component: () =>import("../page/admin/menu"),
                meta:{ requireAuth:true ,isMenu:true}
            }
        ]
    },
    {
        //财务管理
        path: "/finance",
        component: Layout,
        children: [
            {
                //新增凭证
                path: "voucherAdd",
                component: () =>import( "../page/finance/voucherAdd"),
                meta:{ requireAuth:true,isMenu:true,type:'page'}
            },
            {
                //凭证管理
                path: "voucherList",
                component: () =>import("../page/finance/voucherList"),
                meta:{ requireAuth:true,isMenu:true,type:'page',name:'凭证管理'}
            }
            // {
            //     //查看凭证
            //     name:"voucherDel",
            //     path: "voucherDel/:list",
            //     component: () =>import("../page/finance/voucherDel"),
            //     meta:{ requireAuth:true,type:'button',name:'查看凭证'}
            // }
        ]
    },
    {
        //基础设置
        path: "/setting",
        component: Layout,
        children: [
            {
                //科目设置
                path: "subject",
                component: () =>import( "../page/basicSetting/subjectSetting"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            },
            {
                //科目期初
                path: "subjectstart",
                component: () =>import("../page/basicSetting/subjectInit"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            },
            {
                //辅助核算
                path: "auxiliary",
                component: () =>import("../page/basicSetting/auxiliary/auxiliary"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            },
            {
                //凭证模板
                path: "vouchertemp",
                component: () =>import("../page/message"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            },
            {
                //套打格式
                path: "print",
                component: () =>import("../page/message"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            },
            {
                //参数设置
                path: "config",
                component: () =>import("../page/basicSetting/config/index"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            }
        ]
    },
    {
        //账簿管理
        path: "/accountbooks",
        component: Layout,
        children: [
            {
                //科目余额
                path: "subjectbalance",
                component: () =>import( "../page/message"),
                meta:{ requireAuth:true,isMenu:true,type:'page' }
            },
            {
                //总分账
                path: "totalaccounts",
                component: () =>import("../page/message"),
                meta:{ requireAuth:true,isMenu:true,type:'page' }
            },
            {
                //明细账
                path: "detailaccount",
                component: () =>import("../page/accountbooks/detailaccount/index"),
                meta:{ requireAuth:true,isMenu:true,type:'page' }
            },
            {
                //多栏账
                path: "multiaccount",
                component: () =>import("../page/message"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            }
        ]
    },
    {
        //会计报表
        path: "/report",
        component: Layout,
        children: [
            {
                //资产负债表
                path: "assets",
                component: () =>import( "../page/report/assets"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            },
            {
                //收入支出表
                path: "expenses",
                component: () =>import("../page/report/expenses"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            },
            {
                //往来明细款项表
                path: "intercourse",
                component: () =>import("../page/report/intercourse"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            }
        ]
    },
    {
        //结转处理
        path: "/carrydown",
        component: Layout,
        children: [
            {
                //期末结转
                path: "end",
                component: () =>import( "../page/checkOut/end"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            },
            {
                //结账
                path: "checkout",
                component: () =>import("../page/checkOut/checkOut"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            }
        ]
    },
    {
        //预算管理
        path: "/budget",
        component: Layout,
        children: [
            {
                //预算编制
                path: "plan",
                component: () =>import( "../page/budget/plan"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            },
            {
                //预算执行
                path: "execute",
                component: () =>import("../page/budget/execute"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            },
            {
                //收支预算表
                path: "budget",
                component: () =>import( "../page/budget/budget"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            },
            {
                //收支调整表
                path: "adjustbudget",
                component: () =>import( "../page/budget/adjustbudget"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            },
            {
                //收支决算表
                path: "actualbudget",
                component: () =>import( "../page/budget/actualbudget"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            },
        ]
    },
    {
        //数据直报
        path: "/datareport",
        component: Layout,
        children: [
            {
                //上报任务
                path: "reporting",
                component: () =>import( "../page/message"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            }
        ]
    },
    {
        //系统管理
        path: "/system",
        component: Layout,
        children: [
            {
                //工作账号管理
                path: "account",
                component: () =>import( "../page/system/user"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            },
            {
                //组织账套管理
                path: "organization",
                component: () =>import( "../page/system/Organize"),
                meta:{ requireAuth:true,isMenu:true ,type:'page'}
            }
        ]
    },
    {
        path: "/i18n",
        component: Layout,
        children: [
            {
                path: "",
                component: () =>import(/* webpackChunkName: 'i18n' */ "../page/example/table")
            }
        ]
    },
    {
        path: "/error",
        component: () => import(/* webpackChunkName: 'error' */ "../page/error"),
        meta:{
            title:'错误页面',
            icon:'el-icon-lx-home'
        },
        children: [
            {
                path: "401",
                component: () =>import(/* webpackChunkName: 'error' */ "../page/error/401"), 
                name: 'page401', 
                meta: { title: 'page401', noCache: true }
            },
            {
                path: "403",
                component: () => import(/* webpackChunkName: 'error' */ "../page/error/403"),
                name: 'page403', 
                meta: { title: 'page403', noCache: true }
            },
            {
                path: "404",
                component: () => import(/* webpackChunkName: 'error' */ "../page/error/404"),
                name: 'page404', 
                meta: { title: 'page404', noCache: true }
            },
            {
                path: "500",
                component: () =>import(/* webpackChunkName: 'error' */ "../page/error/500"),
                name: 'page500', 
                meta: { title: 'page500', noCache: true }
            }
        ]
    }
];

export default staticRoute;
