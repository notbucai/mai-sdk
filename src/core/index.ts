import { IEvent, IEventBasic, IEventCore, IEventPlugin } from '@/types/IEvent'
import Token from './token'

// 加载插件 汇总事件
export class App implements IEventCore {
  private eventList: IEvent[] = []
  private basic?: IEventBasic
  private token?: Token
  private plugins: IEventPlugin[] = []

  constructor () {
    this.init()
  }

  private init () {
    this.initToken()
    this.refreshBasic()
  }

  private initToken () {
    this.token = new Token('__MAI_TOKEN')
  }

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

  report<P> (type: string, event: string, params: P): boolean | Promise<boolean> {
    this.eventList.push({
      type,
      event,
      params
    })
    return true
  }

  use (plugin: IEventPlugin) {
    plugin.apply(this)
    this.plugins.push(plugin)
    return this
  }

}

