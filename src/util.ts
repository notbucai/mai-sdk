import { fromError } from 'stacktrace-js'
import { IExceptionMessage } from './types/IException'
/**
 * debounce
 *
 * @param {Function} func 实际要执行的函数
 * @param {Number} delay 延迟时间，单位是 ms
 * @param {Function} callback 在 func 执行后的回调
 *
 * @return {Function}
 */
export function debounce (func: any, delay: any, callback: any) {
  let timer: any

  return function (...args: any[]) {
    const self = this

    clearTimeout(timer)

    timer = setTimeout(function () {
      func.apply(self, args)

      !callback || callback()
    }, delay)
  }
}

/**
 * merge
 *
 * @param  {Object} src
 * @param  {Object} dest
 * @return {Object}
 */
export function merge (src: any, dest: any) {
  for (const item in src){
    dest[item] = src[item]
  }

  return dest
}

/**
 * 是否是函数
 *
 * @param  {Any} func 判断对象
 * @return {Boolean}
 */
export function isFunction (func: any) {
  return typeof func === 'function' //Object.prototype.toString.call(func) === '[object Function]'
}

/**
 * 将类数组转化成数组
 *
 * @param  {Object} arrayLike 类数组对象
 * @return {Array} 转化后的数组
 */
export function arrayFrom (arrayLike: any) {
  return [].slice.call(arrayLike)
}

export async function formatError (error: Error): Promise<IExceptionMessage> {
  try {
    const [res] = await fromError(error)
    return {
      type: error?.name || 'UnknownError',
      message: `${error.message || error.stack}`,
      stack: `${error.stack}`,
      lineno: res.lineNumber,
      colno: res.columnNumber,
      source: res.source,
      fileName: res.fileName
    }
  } catch (e){
    try {
      const [res] = await fromError(e)
      return {
        type: e?.name || 'UnknownError',
        message: e?.message,
        stack: e?.stack,
        lineno: res.lineNumber,
        colno: res.columnNumber,
        source: res.source,
        fileName: res.fileName,
        origin
      }
    } catch (e){
      return {
        type: e?.name || 'UnknownError',
        message: `${e?.message}`,
        stack: `${(e?.stack)}`,
        origin: origin
      }
    }
  }
}

export function setCookie (name: string, value: string, time = 60) { // 设置cookie方法
  const d = new Date()
  d.setTime(d.getTime() + (time * 24 * 60 * 60 * 1000)) // 设置cookie到期时间
  const expires = 'expires=' + d.toUTCString()
  document.cookie = name + '=' + value + '; ' + expires
}

export function getCookie (cname: string) { // 获取cookie方法
  const name = cname + '='
  const res = document.cookie.split(';')
  for (let i = 0; i < res.length; i++){
    const data = res[i].trim()
    if (data.indexOf(name) == 0){ return data.substring(name.length, data.length) }
  }
  return ''
}
