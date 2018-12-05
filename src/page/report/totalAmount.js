/**
* @Author: wfm
* @Date:   2018-12-04
*/
'use strict'

export default function treeSum(data) {
  let tmp = []

  Array.from(data).forEach(function(record) {

    tmp.push(record)
    if (record.children && record.children.length > 0) {
      const children = treeSum(record.children)
      tmp = tmp.concat(children)
    }
  })

  return tmp
}
