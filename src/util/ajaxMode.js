// import md5 from 'js-md5'
// const ajaxMode = {
//   Ajax(page){
//     var appKey = 'D31B7F91-3068-4A49-91EE-F3E13AE5C48C',
//     appSecret = '103CB639-840C-4E4F-8812-220ECE3C4E4D',
//     url = "http://10.0.45.51:7758",
//     reqTimeStamp = Date.parse(new Date());
//     var sign = md5((url + reqTimeStamp + appKey + appSecret).toLowerCase());
//     var items = [sign, url, reqTimeStamp, appKey];
//     var appinfo = {
//       'DbName': 'NG0001',
//       'OrgId': '521180820000002',
//       'OrgName': '',
//       'OCode': '',
//       'UserId': '521180820000001',
//       'UserKey': '0001',
//       'UserName': '',
//       'TokenKey': '',
//       'AppKey': appKey,
//       'AppSecret': appSecret,
//       'DbServerName': '',
//       'SessionKey': '',
//       'UName': ''
//     };
//     var data = {
//       uid: "0",
//       orgid: "0",
//       infoData: page
//     };
//     var config={
//       headers: {
//         'Accept': "application/json; charset=utf-8",
//         'AppInfo': Base64.encode(JSON.stringify(appinfo)),
//         //'Sign': JSON.stringify(items)
//         'Sign':items[0]+','+items[1]+','+items[2]+','+items[3]
//       },
//     }
//     return {data:data,config:config};
//   }
// }

// export default ajaxMode.Ajax
