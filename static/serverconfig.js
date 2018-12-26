import Mock from 'mockjs'

var data={
    'baseUrl': 'http://218.108.53.111/g6capi'
};
Mock.mock('/data/index', 'post', data)

export default Mock