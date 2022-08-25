/*
 * @Author: yanjinliang
 * @Date: 2022-08-25 04:11:43
 * @Last Modified by: yanjinliang
 * @Last Modified time: 2022-08-Th 04:11:43
 * @Desc: 对浏览器缓存的简单封装
 *
 * 支持数据加密 这里采用 crypto-js 加密 也可使用其他方式
 */

import CryptoJS from 'crypto-js'

// 十六位十六进制数作为密钥
const SECRET_KEY = CryptoJS.enc.Utf8.parse('3333e6e143439161')
// 十六位十六进制数作为密钥偏移量
const SECRET_IV = CryptoJS.enc.Utf8.parse('e3bbe7e3ba84431a')
// 加密
const encrypt = (data) => {
  if (typeof data === 'object') {
    try {
      data = JSON.stringify(data)
    } catch (error) {
      console.log('encrypt error:', error)
    }
  }

  const dataHex = CryptoJS.enc.Utf8.parse(data)
  const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  return encrypted.ciphertext.toString()
}
// 解密
const decrypt = (data) => {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(data)
  const str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)

  return decryptedStr.toString()
}

export default class customStorage {
  constructor({ type = 'localStorage', expire, isEncrypt }) {
    this.type = type // 本地存储类型 localStorage/sessionStorage
    this.expire = expire // 过期时间 可选 单位：秒
    this.isEncrypt = isEncrypt // 是否加密，可选，开发环境下未方便调试可关闭加密
  }

  // 是否存在 hasStorage
  isSupportStorage() {
    return typeof Storage !== 'undefined' ? true : false
  }

  setStorage(key, value) {
    if (this.expire && +this.expire < 1) throw new Error('Expire must be a number!')

    if (!key) throw new Error('Key is required!')

    if (value === '' || value === null || value === void 0) {
      value = null
    }

    let data = {
      value,
      time: Date.now()
    }

    if (this.expire) {
      const expire = this.expire * 1000
      Object.assign(data, { expire })
    }

    const encryptString = this.isEncrypt ? encrypt(JSON.stringify(data)) : JSON.stringify(data)

    window[this.type].setItem(key, encryptString)
  }

  getStorage(key) {
    if (!key) throw new Error('Key is required!')

    if (
      !window[this.type].getItem(key) ||
      JSON.stringify(window[this.type].getItem(key)) === 'null'
    ) {
      return null
    }

    const storage = this.isEncrypt
      ? JSON.parse(decrypt(window[this.type].getItem(key)))
      : JSON.parse(window[this.type].getItem(key))

    const nowTime = Date.now()

    // 过期删除
    if (storage.expire && storage.expire < nowTime - storage.time) {
      this.removeStorage(key)
      return null
    } else {
      // 未过期期间调用，自动续期，保活
      this.setStorage(key, storage.value)
      return storage.value
    }
  }

  // 根据索引获取 key
  getStorageForIndex(index) {
    return window[this.type].key(index)
  }

  // 获取localStorage长度
  getStorageLength() {
    return window[this.type].length
  }

  // 删除
  removeStorage(key) {
    if (!key) throw new Error('Key is required!')
    window[this.type].removeItem(key)
  }

  // 清空存储
  clearStorage() {
    window[this.type].clear()
  }
}
