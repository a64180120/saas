//import md5 from 'js-md5'
import CryptoJS from 'crypto-js'
//let Base64 = require("js-base64").Base64;


export default {
    _KEY : "12345678900000001234567890000000",//32位
    _IV : "1234567890000000",//16位

    //加密
    Encrypt(str, keyStr){ 
    //   keyStr = keyStr ? keyStr : 'abcdefgabcdefg12';
    //   var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    //   var srcs = CryptoJS.enc.Utf8.parse(word);
    //   var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    //   return encrypted.toString();

      if (keyStr.length >= 32)  {
          keyStr = keyStr.substring(0,32);
      }
      else
      {
          keyStr = this._KEY;
      }

      var key = CryptoJS.enc.Utf8.parse(keyStr); 
      var iv = CryptoJS.enc.Utf8.parse(this._IV);

      var encrypted = '';

      var srcs = CryptoJS.enc.Utf8.parse(str);
      encrypted = CryptoJS.AES.encrypt(srcs, key, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });

      return encrypted.ciphertext.toString();
    },

    //解密
    Decrypt(str, keyStr){  
    //   keyStr = keyStr ? keyStr : 'abcdefgabcdefg12';
    //   var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    //   var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    //   return CryptoJS.enc.Utf8.stringify(decrypt).toString();

        if (keyStr.length >= 32)  {
            keyStr = keyStr.substring(0,32);
        }
        else
        {
            keyStr = this._KEY;
        }
        var key = CryptoJS.enc.Utf8.parse(keyStr);
        var iv = CryptoJS.enc.Utf8.parse(this._IV);
        var encryptedHexStr = CryptoJS.enc.Hex.parse(str);
        var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        var decrypt = CryptoJS.AES.decrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr.toString();
    }  
  }