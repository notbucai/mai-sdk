
import { IExceptionMessage } from '@/types/IException'

import {
  ExceptionType
} from '../constant/error'
import { IEventCore, IEventPlugin } from '../types/IEvent'
import {
  formatError
} from '../util'

export interface IMonitorPluginConfig {}

export class MonitorPlugin implements IEventPlugin {
  private core: IEventCore
  private config: any = {}

  public apply (core: IEventCore): void {
    this.core = core
    this.init()
  }

  constructor (config?: IMonitorPluginConfig) {
    this.config = Object.assign(this.config, config || {})
  }

  private init () {
    // 监听 JavaScript 报错异常(JavaScript runtime error)
    window.onerror = (...args) => {
      const message = this.formatRuntimerError(...args)
      this.handleError(ExceptionType.ERROR_RUNTIME, message)
    }

    // 监听资源加载错误(JavaScript Scource failed to load)
    window.addEventListener('error', (event) => {
      // 过滤 target 为 window 的异常，避免与上面的 onerror 重复
      const errorTarget = event.target
      if (errorTarget !== window && (errorTarget as HTMLElement).nodeName){
        const message = this.formatLoadError(event)
        this.handleError(ExceptionType.ERROR_STATIC, message)
      }
    }, true)

    // ExceptionType.ERROR_RUNTIME_PROMISE Promise
    window.addEventListener('unhandledrejection', async event => {
      if (event.reason instanceof Error){
        const message = await formatError(event.reason)
        this.handleError(ExceptionType.ERROR_RUNTIME_PROMISE, message)
      }
    }, false)

    // 针对 vue 报错重写 console.error
    // TODO TEST
    console.error = ((origin, self) => {
      return function (info) {
        if (info instanceof Error){
          formatError(info).then(res => {
            self.handleError(ExceptionType.ERROR_CONSOLE, res)
          })
        }
        origin.call(console, info)
      }
    })(console.error, this)

  }

  /**
   * 生成 runtime 错误日志
   *
   * @param  {String} message 错误信息
   * @param  {String} source  发生错误的脚本 URL
   * @param  {Number} lineno  发生错误的行号
   * @param  {Number} colno   发生错误的列号
   * @param  {Object} error   error 对象
   * @return {Object}
   */
  formatRuntimerError (message: string | Event, source: string, lineno: number, colno: number, error: Error): IExceptionMessage {
    return {
      type: ExceptionType.ERROR_RUNTIME,
      message: error?.message || (message + ' at ' + source + ':' + lineno + ':' + colno),
      stack: error && error.stack ? error.stack : undefined,
      source: source,
      colno: colno,
      lineno: lineno,
      fileName: source
    }
  }
  /**
   * 生成 laod 错误日志
   *
   */
  formatLoadError (errorEvent: ErrorEvent): IExceptionMessage {
    const errorTarget = errorEvent.target as {
      src?: string
      data?: string
      href?: string
      baseURI?: string
    }
    const source = (errorTarget?.src || errorTarget?.data || errorTarget?.href)
    return {
      type: ExceptionType.ERROR_STATIC,
      message: errorTarget.baseURI + '@' + source,
      stack: '',
      colno: errorEvent.colno,
      lineno: errorEvent.lineno,
      source: source
    }
  }
  /**
   * 错误数据预处理
   * @param  {Object} errorLog    错误日志
   */
  private handleError (eventType: ExceptionType, errorLog: IExceptionMessage) {
    this.core?.report?.('EXCEPTION', eventType, errorLog)
  }
}
