import { IEventCore, IEventCoreListenType, IEventPlugin } from '@/types/IEvent'

export enum SitePluginConfigRouteType {
  HASH = 'hash',
  HISTORY = 'history',
  VUE_ROUTER = 'vue-router'
}

export enum EnumSiteEventType {
  ENTRY = 'ENTRY',
  LEAVE = 'LEAVE',
  SWITCH = 'SWITCH'
}

export interface ISitePluginConfig {
  routeType?: SitePluginConfigRouteType
  listener?: any
}

export class SitePlugin implements IEventPlugin {
  private core: IEventCore
  private config: ISitePluginConfig = {}

  constructor (config: Partial<ISitePluginConfig> = {}) {
    this.config = Object.assign(this.config, config || {})
  }

  apply (core: IEventCore): void {
    this.core = core
    this.init()
  }
  // TODO: 暂不做实现
  private handleInitChangeRouterListener () {
    // TODO: 后期实现
  }
  private getData () {
    const { host, hash, hostname, href, origin, port, protocol } = location
    const { referrer } = document
    return {
      host, hash, hostname, href, origin, port, protocol, referrer, now: Date.now()
    }
  }
  private sendData (type: string) {
    const d = this.getData()
    this.core.report('PERFORMANCE', type, d)
  }
  private init () {
    // 绑定监听事件
    // - 进入 无需绑定事件 直接获取的数据上报
    this.sendData(EnumSiteEventType.ENTRY)
    // - 路由变化
    this.handleInitChangeRouterListener()
    //  - 外部依赖 vue-router history hash
    // - 离开
    this.core.on(IEventCoreListenType.UNLOAD, () => {
      // 发送数据
      this.sendData(EnumSiteEventType.LEAVE)
    })
  }

}
