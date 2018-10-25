var data = [
    {
        path: '/home',
        name: '首页',
        icon: 'el-icon-lx-home'
    },
    {
        name: '系统组件',
        icon: 'el-icon-lx-home',
        child: [
            {
                name: '介绍',
                path: '/components'
            },
            {
                name: '功能类',
                child: [
                    {
                        path: '/components/permission',
                        name: '详细鉴权'
                    },
                    {
                        path: '/components/pageTable',
                        name: '表格分页'
                    }
                ]
            },
            {
                name: '布局类',
                child: [
                    {
                        path: '/components/pageTitle',
                        name: '页面标题'
                    },
                    {
                        path: '/components/pageSection',
                        name: '子区域'
                    },
                    {
                        path: '/components/pageSearch',
                        name: '搜索条'
                    },
                    {
                        path: '/components/pageToolbar',
                        name: '工具条'
                    },
                    {
                        path: '/components/pageTitle',
                        name: '页面标题'
                    },
                    {
                        path: '/components/pageSection',
                        name: '子区域'
                    },
                    {
                        path: '/components/pageSearch',
                        name: '搜索条'
                    },
                    {
                        path: '/components/pageToolbar',
                        name: '工具条'
                    }
                ]
            },
            {
                name: '辅助类',
                child: [
                    {
                        path: '/components/pageNotes',
                        name: '引用说明'
                    }
                ]
            }
        ]
    },
    {
        name: '完整示例',
        icon: 'el-icon-lx-home',
        child: [
            {
                path: '/example/table',
                name: '列表页面',
                permission: ['edit']
            },
            {
                path: '/example/charts',
                name: '图表页面'
            },
            {
                path: '/example/map',
                name: '地图页面'
            }
        ]
    },
    {
        path: '/i18n',
        name: '国际化',
        icon: 'el-icon-lx-home'
    },
    {
        path: '/theme',
        name: '主题切换',
        icon: 'el-icon-lx-home'
    }
]

// var data = [
//     {
//         path: '/home',
//         name: '首页',
//         icon: 'el-icon-lx-home'
//     },
//     {
//         name: '系统组件',
//         icon: 'el-icon-lx-cascades',
//         child: [
//             {
//                 name: '介绍',
//                 path: '/components',
//                 permission: ['view']
//             },
//             {
//                 name: '功能类',
//                 child: [
//                     {
//                         path: '/components/permission',
//                         name: '详细鉴权'
//                     },
//                     {
//                         path: '/components/pageTable',
//                         name: '表格分页',
//                         permission: ['outport', 'edit']
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         name: '系统组件',
//         icon: 'el-icon-lx-warn',
//         child: [
//             {
//                 name: '介绍',
//                 path: '/components'
//             },
//             {
//                 name: '功能类',
//                 child: [
//                     {
//                         path: '/components/permission',
//                         name: '详细鉴权'
//                     },
//                     {
//                         path: '/components/pageTable',
//                         name: '表格分页'
//                     }
//                 ]
//             },
//             {
//                 name: '布局类',
//                 child: [
//                     {
//                         path: '/components/pageTitle',
//                         name: '页面标题'
//                     },
//                     {
//                         path: '/components/pageSection',
//                         name: '子区域'
//                     },
//                     {
//                         path: '/components/pageSearch',
//                         name: '搜索条'
//                     },
//                     {
//                         path: '/components/pageToolbar',
//                         name: '工具条'
//                     }
//                 ]
//             },
//             {
//                 name: '辅助类',
//                 child: [
//                     {
//                         path: '/components/pageNotes',
//                         name: '引用说明'
//                     }
//                 ]
//             }
//         ]
//     }
// ]

export default [{
    path: '/user/navlist',
    data: data
}]