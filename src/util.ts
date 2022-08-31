import { fromError } from 'stacktrace-js'
import { ExceptionType } from './constant/error'
import { IExceptionMessage } from './types/IException'
import uaParser from 'ua-parser-js';
/**
 * debounce
 *
 * @param {Function} func 实际要执行的函数
 * @param {Number} delay 延迟时间，单位是 ms
 * @param {Function} callback 在 func 执行后的回调
 *
 * @return {Function}
 */
export function debounce(func: any, delay: any, callback: any) {
  let timer: any

  return function () {
    let context = this
    let args = arguments

    clearTimeout(timer)

    timer = setTimeout(function () {
      func.apply(context, args)

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
export function merge(src: any, dest: any) {
  for (let item in src) {
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
export function isFunction(func: any) {
  return typeof func === 'function'; //Object.prototype.toString.call(func) === '[object Function]'
}

/**
 * 将类数组转化成数组
 *
 * @param  {Object} arrayLike 类数组对象
 * @return {Array} 转化后的数组
 */
export function arrayFrom(arrayLike: any) {
  return [].slice.call(arrayLike)
}

export async function formatError(error: Error): Promise<IExceptionMessage> {
  try {
    const [res] = await fromError(error)
    return {
      type: error?.name || 'UnknownError',
      message: `${error.message || error.stack}`,
      stack: `${error.stack}`,
      lineno: res.lineNumber,
      colno: res.columnNumber,
      source: res.source,
      fileName: res.fileName,
    }
  } catch (e) {
    try {
      const [res_1] = await fromError(e)
      return {
        type: e?.name || 'UnknownError',
        message: e?.message,
        stack: e?.stack,
        lineno: res_1.lineNumber,
        colno: res_1.columnNumber,
        source: res_1.source,
        fileName: res_1.fileName,
        origin
      }
    } catch (e) {
      return {
        type: e?.name || 'UnknownError',
        message: `${e?.message}`,
        stack: `${(e?.stack)}`,
        origin: origin
      }
    }
  }
}

export function setCookie(name: string, value: string, time: number = 60) { // 设置cookie方法
  var d = new Date();
  d.setTime(d.getTime() + (time * 24 * 60 * 60 * 1000)); // 设置cookie到期时间
  var expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + "; " + expires;
}

export function getCookie(cname: string) { // 获取cookie方法
  const name = cname + "=";
  var res = document.cookie.split(';');
  for (var i = 0; i < res.length; i++) {
    var data = res[i].trim();
    if (data.indexOf(name) == 0) { return data.substring(name.length, data.length); }
  }
  return "";
}