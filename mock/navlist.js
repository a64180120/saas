var data = [
    {
        path: '/home',
        name: '首页',
        icon: 'el-icon-lx-home'
    },
    {
        name: '系统管理',
        icon: 'el-icon-lx-home',
        child: [
            {
                name: '组织管理',
                path: '/admin/orgin'
            },
            {
                name: '角色管理',
                path: '/admin/role'
            },
            {
                name: '用户管理',
                path: '/admin/user'
            }
        ]
    },
    {
        name: '财务管理',
        icon: 'el-icon-lx-home',
        child: [
            {
                name: '新增凭证',
                path: '/finance/voucherAdd'
               
            },
            {
                path: '/finance/voucherList',
                name: '凭证管理'
            }
        ]
    },
    {
        name: '账簿管理',
        icon: 'el-icon-lx-home',
        child: [
            {
                name: '科目余额',
                path: '/accountbooks/subjectbalance'
               
            },
            {
                name: '总分账',
                path: '/accountbooks/totalaccounts'
            },
            {
                name: '明细账',
                path: '/accountbooks/detailaccount'
                
            },
            {
                name: '多栏账',
                path: '/accountbooks/multiaccount'
            }
        ]
    },
    {
        name: '会计报表',
        icon: 'el-icon-lx-home',
        child: [
            {
                name: '资产负债表',
                path: '/report/assets'
               
            },
            {
                name: '收入支出表',
                path: '/report/expenses',
                
            },
            {
                name: '往来明细款项表',
                path: '/report/intercourse'
            }
        ]
    },
    {
        name: '结转处理',
        icon: 'el-icon-lx-home',
        child: [
            {
                name: '期末结转',
                path: '/carrydown/end'
               
            },
            {
                name: '结账',
                path: '/carrydown/checkout',
                
            }
        ]
    },
    {
        name: '预算管理',
        icon: 'el-icon-lx-home',
        child: [
            {
                name: '预算编制',
                path: '/budget/plan'
               
            },
            {
                name: '预算执行',
                path: '/budget/execute',
                
            }
        ]
    },
    {
        name: '预算管理',
        icon: 'el-icon-lx-home',
        child: [
            {
                name: '预算编制',
                path: '/budget/setting'
               
            },
            {
                name: '预算执行',
                path: '/budget/execute',
                
            }
        ]
    },
    {
        name: '基础设置',
        icon: 'el-icon-lx-home',
        child: [
            {
                name: '科目设置',
                path: '/setting/subject'
               
            },
            {
                name: '科目期初',
                path: '/setting/subjectstart',
                
            },
            {
                name: '辅助核算',
                path: '/setting/auxiliary',
                
            },
            {
                name: '凭证模板',
                path: '/setting/vouchertemp',
                
            },
            {
                name: '套打格式',
                path: '/setting/print',
                
            },
            {
                name: '参数设置',
                path: '/setting/config',
                
            }
        ]
    },
    {
        name: '数据直报',
        icon: 'el-icon-lx-home',
        child: [
            {
                name: '预算编制',
                path: '/datareport/reporting'
               
            }
        ]
    },
    {
        name: '系统管理',
        icon: 'el-icon-lx-home',
        child: [
            {
                name: '工作账号管理',
                path: '/system/account'
            },
            {
                name: '组织账套管理',
                path: '/system/organization'
            }
        ]
    },
    {
        path: '/i18n',
        name: '国际化',
        icon: 'el-icon-lx-home'
    }
]

export default [{
    path: '/user/navlist',
    data: data
}]