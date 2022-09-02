import { IEvent, IEventBasic, IEventCore, IEventCoreListenFunction, IEventCoreListenType, IEventPlugin, IURLChangeType } from '@/types/IEvent'
import { throttle } from '@/util'
import Token from './token'

export interface IAppConfig {
  // 防抖间隔默认3000ms
  delay: number
  // 上报地址 可用于解决同域
  url: string
}
// 加载插件 汇总事件
export class App implements IEventCore {
  private config: IAppConfig = {
    delay: 3000,
    url: 'https://re.com'
  }
  private eventList: IEvent[] = []
  private basic?: IEventBasic
  private token?: Token
  private plugins: IEventPlugin[] = []
  private listens: { [key: string]: IEventCoreListenFunction[]; } = {}
  private handleReport: (...args: any[]) => void

  constructor (config: Partial<IAppConfig> = {}) {
    this.config = Object.assign(this.config, config)
    this.init()
  }

  private init () {
    this.initToken()
    this.initReportHandle()
    this.initListens()
    this.refreshBasic()
  }
  /**
   * 初始化用户token，目前随机
   */
  private initToken () {
    this.token = new Token('__MAI_TOKEN')
  }
  /**
   * 初始化上报机制
   */
  private initReportHandle () {
    this.handleReport = throttle(() => {
      this.sendReport()
    }, 1000)
  }

  private execListen (key: IEventCoreListenType, event: Event, params: any = {}) {
    try {
      const listens = this.listens[key]
      if (listens){
        listens.forEach((listen) => {
          listen?.({ origin: event, params })
        })
      }
    } catch (error){
      console.log(error)
    }
  }
  /**
   * 初始化监听器
   */
  private initListens () {
    window.addEventListener('beforeunload', (evt) => {
      // 执行事件
      this.execListen(IEventCoreListenType.UNLOAD, evt)
      // 上报
      this.sendReport()
    })
  }
  /**
   * 刷新基础数据，用于页面切换等场景
   */
  private refreshBasic () {
    // 获取并解析 basic 信息
    const token = this.token.getToken()
    const referrer = document.referrer
    const { href, hash } = location
    const { language, userAgent, platform, appVersion } = window.navigator
    // 组装basic数据
    this.basic = {
      token,
      platform,
      userAgent,
      language,
      appVersion,
      page: {
        href,
        referrer,
        hash
      }
    }
  }
  /**
   * 格式化参数，将非基础类型转为字符串
   * @param params 参数
   * @returns
   */
  private formatParams<P> (params: P) {

    if (typeof params !== 'object') params

    const newParams = Object.keys(params).reduce((pv, key) => {
      const value = params[key]
      pv[key] = (typeof value === 'object' && value !== null) ? `${value}` : value
      return pv
    }, {})

    return newParams
  }
  /**
   * 发送事件
   */
  private sendReport () {
    fetch('/ttt', {
      method: 'POST',
      body: JSON.stringify({
        basic: this.basic,
        events: this.eventList
      }),
      keepalive: true
    }).then(() => {
      // 成功后清空事件
      this.eventList = []
    })
  }
  /**
   * 上报事件
   * @param type 事件类型
   * @param event 事件名
   * @param params 事件参数
   * @returns 返回是否缓存事件
   */
  report<P> (type: string, event: string, params: P): boolean | Promise<boolean> {
    const newParams = this.formatParams(params)
    this.eventList.push({
      type,
      event,
      now: Date.now(),
      params: newParams
    })
    this.handleReport()
    return true
  }

  /**
   * 监听事件，一般用于聚合后处理上报
   * @param event 事件名
   * @param listen 事件函数
   */
  on (event: IEventCoreListenType, listen: IEventCoreListenFunction): void {
    this.listens[event] = this.listens[event] || []
    this.listens[event].push(listen)
  }

  /**
   * 绑定插件
   * @param plugin 插件
   * @return 返回App实例
   */
  use (plugin: IEventPlugin) {
    plugin.apply(this)
    this.plugins.push(plugin)
    return this
  }

}

