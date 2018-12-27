import Mock from 'mockjs'

var data={
    //'baseUrl': 'http://218.108.53.111/g6capi'
    'baseUrl': 'http://127.0.0.1:8028'
};
Mock.mock('/data/index', data)

export default Mock