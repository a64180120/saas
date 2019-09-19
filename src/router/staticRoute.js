/**
 * 在打包的时候，chunk包名字都是乱的，如果我们指定命名，该怎么办呢？webpack3提供了Magic Comments（魔法注释）
 */

const Layout = () => import(/* webpackChunkName: 'layout' */ "../page/layout");

const staticRoute = [
  {
    path: "/",
    redirect: "/index"
  },
  {
    path: "/login",
    component: () => import(/* webpackChunkName:'login'*/"../page/login/index")
  },
  {
    path: "/register",
    component: () => import(/* webpackChunkName:'register'*/"../page/register")
  },
  {
    path: '/index',
    component: () => import(/* webpackChunkName:'index'*/"../page/index")
  },
  {
    path: "/home",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import(/* webpackChunkName:'home'*/"../page/home/index"),
        meta: { requireAuth: true, type: 'page', name: '首页' }
        // component: () =>import( "../page/finance/voucherAdd"),
        // meta:{ requireAuth:true,type:'page',name:'新增凭证'}
      },
        {
            path: "newsList_zc",
            component: () => import(/* webpackChunkName:'home'*/"../page/home/article/ListView_zc"),
            meta: { requireAuth: true, type: 'page', name: '法规政策制度' }
            // component: () =>import( "../page/finance/voucherAdd"),
            // meta:{ requireAuth:true,type:'page',name:'新增凭证'}
        },
        {
            path: "newsList_gz",
            component: () => import(/* webpackChunkName:'home'*/"../page/home/article/ListView_gz"),
            meta: { requireAuth: true, type: 'page', name: '工作通知' }
            // component: () =>import( "../page/finance/voucherAdd"),
            // meta:{ requireAuth:true,type:'page',name:'新增凭证'}
        },
        {
            path: "newsList_xt",
            component: () => import(/* webpackChunkName:'home'*/"../page/home/article/ListView_xt"),
            meta: { requireAuth: true, type: 'page', name: '系统消息' }
            // component: () =>import( "../page/finance/voucherAdd"),
            // meta:{ requireAuth:true,type:'page',name:'新增凭证'}
        }
    ]
  },
  {
    path: '/news/view',
    component: () => import(/* webpackChunkName:'news'*/"../page/news/View")
  },
  {
    path: '/news/list',
    component: () => import(/* webpackChunkName:'news'*/"../page/news/ListView")
  },
  {
    //系统管理
    path: "/admin",
    component: Layout,
    children: [
      {
        //备份与恢复
        path: "copyandreset",
        component: () => import(/* webpackChunkName:'copyandreset'*/"../page/admin/copyandreset"),

        meta: { requireAuth: true, type: 'page', name: '备份与恢复' }
      },
      {
        //组织管理
        path: "orgin",
        component: () => import(/* webpackChunkName:'admin'*/"../page/admin/organize/manage"),
        //redirect: "/admin/orgin/union",
        meta: { requireAuth: true, type: 'page', name: '组织管理' }
      },
      {
        //组织管理 -新增
        path: "orgin/add",
        component: () => import(/* webpackChunkName:'admin'*/"../page/admin/organize/manageAdd"),
        meta: { requireAuth: true, type: 'button', name: '组织新增' }
      },
      {
        //组织管理 -编辑
        path: "orgin/edit",
        component: () => import(/* webpackChunkName:'admin'*/"../page/admin/organize/manageUpdate"),
        meta: { requireAuth: true, type: 'button', name: '组织编辑' }
      },
      {
        //组织审核 -编辑
        path: "orgin/ver",
        component: () => import(/* webpackChunkName:'admin'*/"../page/admin/organize/manageVerify"),
        meta: { requireAuth: true, type: 'button', name: '组织审核' }
      },
      {
        //角色管理
        path: "role",
        component: () => import(/* webpackChunkName:'admin'*/"../page/admin/role"),
        meta: { requireAuth: true, type: 'page', name: '角色管理' }
      },
      {
        //用户管理
        path: "user",
        component: () => import(/* webpackChunkName:'admin'*/"../page/admin/user"),
        meta: { requireAuth: true, type: 'page', name: '用户管理' }
      },
      {
        //菜单管理
        path: "menu",
        component: () => import(/* webpackChunkName:'admin'*/"../page/admin/menu"),
        meta: { requireAuth: true, type: 'page', name: '菜单管理' }
      },
      {
        //文章管理
        path: "article",
        component: () => import(/* webpackChunkName:'admin'*/"../page/admin/article/List"),
        meta: { requireAuth: true, type: 'page', name: '新闻管理' }
      },
      {
        //文章管理 -新增
        name: "article_add",
        path: "article/add",
        component: () => import(/* webpackChunkName:'admin'*/"../page/admin/article/Add"),
        meta: { requireAuth: true, type: 'button', name: '新闻编辑' }
      },
      {
        //文章管理 -预览
        path: "article/preview",
        component: () => import(/* webpackChunkName:'admin'*/"../page/admin/article/Preview"),
        meta: { requireAuth: true, type: 'button', name: '信息预览' }
      },
      {
        //图片管理
        path: "picture",
        component: () => import(/* webpackChunkName:'admin'*/"../page/admin/picture"),
        meta: { requireAuth: true, type: 'page', name: '轮播图管理' }
      },
      {
        //图片新闻管理
        path: "new",
        component: () => import(/* webpackChunkName:'admin'*/"../page/admin/picture/new"),
        meta: { requireAuth: true, type: 'page', name: '图片新闻管理' }
      },

      {
        //留言管理
        path: "message",
        component: () => import("../page/admin/message/index"),
        meta: { requireAuth: true, type: 'page', name: '留言管理' }
      },
      {
        //留言管理 -未读
        path: "message/unread",
        component: () => import("../page/admin/message/unread"),
        meta: { requireAuth: true, type: 'button', name: '未读留言' }
      },
      {
        //留言管理 -已读
        path: "message/read",
        component: () => import("../page/admin/message/read"),
        meta: { requireAuth: true, type: 'button', name: '已读留言' }
      },
      {
        //其他设置
        path: "othersetting",
        component: () => import("../page/admin/othersetting/index"),
        meta: { requireAuth: true, type: 'page', name: '其他设置' }
      },
      {
        //首页设置
        path: "indexsetting",
        component: () => import("../page/admin/indexsetting/indexSetting"),
        meta: { requireAuth: true, type: 'page', name: '首页设置' }
      },
    ]
  },
  {
    //财务管理
    path: "/finance",
    component: Layout,
    children: [
      {
        //新增凭证
        name: 'voucherAdd',
        path: "voucherAdd",
        component: () => import( /* webpackChunkName:'finance'*/"../page/finance/voucherAdd"),
        meta: { requireAuth: true, type: 'page', name: '凭证录入' }
      },
      {
        //凭证管理
        name: "voucherList",
        path: "voucherList",
        component: () => import(/* webpackChunkName:'finance'*/"../page/finance/voucherList"),
        meta: { requireAuth: true, type: 'page', name: '凭证管理' }
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
        component: () => import(/* webpackChunkName:'setting'*/"../page/basicSetting/subjectSetting"),
        meta: { requireAuth: true, type: 'page', name: '科目设置' }
      },
      {
        //科目期初
        path: "subjectstart",
        component: () => import(/* webpackChunkName:'setting'*/"../page/basicSetting/subjectInit"),
        meta: { requireAuth: true, type: 'page', name: '科目期初' }
      },
      {
        //辅助核算
        path: "auxiliary",
        component: () => import(/* webpackChunkName:'setting'*/"../page/basicSetting/auxiliary/auxiliary"),
        meta: { requireAuth: true, type: 'page', name: '辅助核算' }
      },
      {
        //辅助项目余额表
        path: "residue",
        component: () => import(/* webpackChunkName:'setting'*/"../page/assistdetail/residue"),
        meta: { requireAuth: true, type: 'page', name: '辅助项目余额表' }
      },
      {
        //辅助项目明细表
        path: "assist",
        component: () => import(/* webpackChunkName:'setting'*/"../page/assistdetail/assist"),
        meta: { requireAuth: true, type: 'page', name: '辅助项目明细表' }
      },
      {
        //凭证模板
        path: "vouchertemp",
        component: () => import(/* webpackChunkName:'setting'*/"../page/basicSetting/vouchertemp"),
        meta: { requireAuth: true, type: 'page', name: '凭证模板' }
      },
      {
        //套打格式
        path: "print",
        component: () => import(/* webpackChunkName:'setting'*/"../page/message"),
        meta: { requireAuth: true, type: 'page', name: '套打格式' }
      },
      {
        //参数设置
        path: "config",
        component: () => import(/* webpackChunkName:'setting'*/"../page/basicSetting/config/index"),
        meta: { requireAuth: true, type: 'page', name: '参数设置' }
      },
      {
        //外部数据导入
        path: "upload",
        component: () => import('../page/upload/index'),
        meat: { requireAuth: true, type: 'page', name: '外部数据导入' }
      }

    ]
  },
  {
    //账簿管理
    path: "/accountbooks",
    component: Layout,
    children: [
      // {
      //     //科目余额
      //     path: "subjectbalance",
      //     component: () =>import( "../page/message"),
      //     meta:{ requireAuth:true,type:'page' }
      // },
      // {
      //     //总分账
      //     path: "totalaccounts",
      //     component: () =>import("../page/message"),
      //     meta:{ requireAuth:true,type:'page' }
      // },
      {
        //明细账
        path: "detailaccount",
        component: () => import(/* webpackChunkName:'accountbooks'*/"../page/accountbooks/detailaccount/details"),
        meta: { requireAuth: true, type: 'page', name: '明细账' }
      }, {
        //科目余额
        path: "balance",
        component: () => import(/* webpackChunkName:'accountbooks'*/"../page/accountbooks/subjectbalance/balance"),
        meta: { requireAuth: true, type: 'page', name: '科目余额表' }
      },
      {
        //总分类账
        path: "classify",
        component: () => import(/* webpackChunkName:'accountbooks'*/"../page/accountbooks/classify/classify"),
        meta: { requireAuth: true, type: 'page', name: '总分类账' }
      },
      /*{
          //多栏账
          path: "multiaccount",
          component: () =>import("../page/message"),
          meta:{ requireAuth:true,type:'page'}
      }*/
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
        component: () => import( /* webpackChunkName:'report'*/"../page/report/assets"),
        meta: { requireAuth: true, type: 'page', name: '资产负债表' }
      },
      {
        //收入支出表
        path: "expenses",
        component: () => import(/* webpackChunkName:'report'*/"../page/report/expenses"),
        meta: { requireAuth: true, type: 'page', name: '收入支出表' }
      },
      {
        //往来明细款项表
        path: "intercourse",
        component: () => import(/* webpackChunkName:'report'*/"../page/report/intercourse"),
        meta: { requireAuth: true, type: 'page', name: '往来款项明细表' }
      },{
            path: 'reportaccount',
            component: () => import(/* webpackChunkName:'accountprogress'*/"../page/reportCount"),
            meta: { requireAuth: true, type: 'page', name: '报表汇总' }
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
        component: () => import( /* webpackChunkName:'carrydown'*/"../page/checkOut/end"),
        meta: { requireAuth: true, type: 'page', name: '期末结转' }
      },
      {
        //结账
        path: "checkout",
        component: () => import(/* webpackChunkName:'carrydown'*/"../page/checkOut/checkOut"),
        meta: { requireAuth: true, type: 'page', name: '结账' }
      }
    ]
  },
  {
    //预算管理
    path: "/budget",
    component: Layout,
    children: [
      {
        //预算汇总
        name: "budgetcount",
        path: "budgetcount",
        component: () => import( /* webpackChunkName:'budget'*/"../page/budget/budgetcount"),
        meta: { requireAuth: true, type: 'page', name: '预/决算汇总' }
      },
      {
        //预算编制
        path: "plan",
        component: () => import( /* webpackChunkName:'budget'*/"../page/budget/plan"),
        meta: { requireAuth: true, type: 'page', name: '预算编制' }
      },
      {
        //预算执行
        path: "execute",
        component: () => import(/* webpackChunkName:'budget'*/"../page/budget/execute"),
        meta: { requireAuth: true, type: 'page', name: '预算执行' }
      },
      {
        //收支预算表
        path: "budget",
        component: () => import(/* webpackChunkName:'budget'*/ "../page/budget/budget"),
        meta: { requireAuth: true, type: 'page', name: '年初申报' }
      },
      {
        //收支调整表
        path: "adjustbudget",
        component: () => import( /* webpackChunkName:'budget'*/"../page/budget/adjustbudget"),
        meta: { requireAuth: true, type: 'page', name: '年中调整' }
      },
      {
        //收支决算表
        path: "actualbudget",
        component: () => import( /* webpackChunkName:'budget'*/"../page/budget/actualbudget"),
        meta: { requireAuth: true, type: 'page', name: '决算核算' }
      },
    ]
  },
  {//数据看板
    path: "/dataKanban",
    component: Layout,
    children: [
        {
          path: 'progress',
          component: () => import(/* webpackChunkName:'accountprogress'*/"../page/accountingProgress"),
          meta: { requireAuth: true, type: 'page', name: '做账进度' }
        },
        {
            path: 'reportdialog',
            component: () => import(/* webpackChunkName:'accountprogress'*/"../page/reportCount/reportdialog"),
            meta: { requireAuth: true, type: 'page', name: '报表汇总' }
        }

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
        component: () => import( /* webpackChunkName:'datareport'*/"../page/message"),
        meta: { requireAuth: true, type: 'page', name: '上报任务' }
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
        component: () => import( /* webpackChunkName:'system'*/"../page/system/user"),
        meta: { requireAuth: true, type: 'page', name: '工作账号管理' }
      },
      {
        //组织账套管理
        path: "organization",
        component: () => import("../page/system/Organize"),
        meta: { requireAuth: true, type: 'page', name: '组织账套管理' }
      }
    ]
  },
  {
    //事物管理
    path: "/transaction",
    component: Layout,
    children: [
      {
        //单位基本情况
        path: "situation",
        component: () => import(/* webpackChunkName:'setting'*/"../page/situation"),
        meta: { requireAuth: true, type: 'page', name: '事物管理' }
      }
    ]
  },
  {
    //出纳管理
    path: "/cashier",
    component: Layout,
    children: [
      {
        //日记账
        path: "dayaccount",
        component: () => import( /* webpackChunkName:'system'*/"../page/cashierManage/dayAccount"),
        meta: { requireAuth: true, type: 'page', name: '日记账' }
      },
      {
        //账户
        path: "account",
        component: () => import("../page/cashierManage/accountTable"),
        meta: { requireAuth: true, type: 'page', name: '账户' }
      },
      {
        //核对总账
        path: "checkallaccount",
        component: () => import("../page/cashierManage/accountAll"),
        meta: { requireAuth: true, type: 'page', name: '核对总账' }
      },
      {
        //银行对账单
        path: "bankbill",
        component: () => import("../page/cashierManage/bankBillImg"),
        meta: { requireAuth: true, type: 'page', name: '银行对账单' }
      }
    ]
  },
  {
    path: "/datadriver",
    component: () => import( /* webpackChunkName:'datadriver'*/ "../page/datadriver"),
    children: [
      {
        //财务运行
        path: "finance",
        component: () => import( /* webpackChunkName:'datadriver_finance'*/"../page/datadriver/finance"),
        meta: { requireAuth: true, type: 'page', name: '财务运行' }
      },
      {
        //做账监督
        path: "accounting",
        component: () => import( /* webpackChunkName:'datadriver_accounting'*/"../page/datadriver/accounting"),
        meta: { requireAuth: true, type: 'page', name: '做账监督' }
      },
      {
        //收支排名
        path: "rank",
        component: () => import( /* webpackChunkName:'datadriver_rank'*/"../page/datadriver/rank"),
        meta: { requireAuth: true, type: 'page', name: '收支排名' }
      },
      {
        //报表仓库
        path: "store",
        component: () => import( /* webpackChunkName:'datadriver_store'*/"../page/datadriver/store"),
        meta: { requireAuth: true, type: 'page', name: '报表仓库' }
      }
    ]
  },
  // {
  //     //网页管理
  //     path: "/webpage",
  //     component: Layout,
  //     children: [
  //         {
  //             //文章管理
  //             path: "article",
  //             component: () => import(/* webpackChunkName:'admin'*/"../page/admin/article/List"),
  //             meta: { requireAuth: true, type: 'page', name: '新闻管理' }
  //         },
  //         {
  //             //文章管理 -新增
  //             path: "article/add",
  //             component: () => import(/* webpackChunkName:'admin'*/"../page/admin/article/Add"),
  //             meta: { requireAuth: true, type: 'button', name: '新闻编辑' }
  //         },
  //         {
  //             //图片管理
  //             path: "picture",
  //             component: () => import(/* webpackChunkName:'admin'*/"../page/admin/picture"),
  //             meta: { requireAuth: true, type: 'page', name: '轮播图管理' }
  //         },
  //         {
  //             //图片新闻管理
  //             path: "new",
  //             component: () => import(/* webpackChunkName:'admin'*/"../page/admin/picture/new"),
  //             meta: { requireAuth: true, type: 'page', name: '图片新闻管理' }
  //         },
  //     ]
  // },
  // {
  //     path: "/i18n",
  //     component: Layout,
  //     children: [
  //         {
  //             path: "",
  //             component: () =>import(/* webpackChunkName: 'i18n' */ "../page/example/table")
  //         }
  //     ]
  // },
  {
    path: "/error",
    component: () => import(/* webpackChunkName: 'error' */ "../page/error/break"),
    meta: {
      title: '错误页面',
      icon: 'el-icon-lx-home'
    },
    children: [
      {
        path: "401",
        component: () => import(/* webpackChunkName: 'error' */ "../page/error/401"),
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
        component: () => import(/* webpackChunkName: 'error' */ "../page/error/500"),
        name: 'page500',
        meta: { title: 'page500', noCache: true }
      },
      {
        path: "break",
        component: () => import(/* webpackChunkName: 'error' */ "../page/error/break"),
        name: 'pageError',
        meta: { title: 'pageError', noCache: true }
      }
    ]
  },

  {
    path: "/demo/supcan",
    component: () => import(/* webpackChunkName:'supcan'*/"../page/example/supcan")
  },

  //服务协议
  // {
  //     path: "/serviceInfo",
  //     component: () => import("../page/home/serviceInfo")
  // },
];

export default staticRoute;
