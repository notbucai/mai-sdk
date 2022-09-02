import { IEventCore, IEventCoreListenType, IEventPlugin } from '@/types/IEvent'

export class PerformancePlugin implements IEventPlugin {
  private core: IEventCore
  private recordEntries: PerformanceEntryList = []

  constructor () {

  }

  apply (core: IEventCore): void {
    this.core = core
    this.init()
  }

  private init () {
    // 监听数据
    this.listen()
    this.reportPerformance()
  }

  private listen () {
    // this.reportPerformance()
    this.core.on(IEventCoreListenType.UNLOAD, () => {
      this.reportPerformance()
    })
  }
  // 页面数据
  private reportPerformance () {
    // performance.time
    // 重定向耗时：redirectEnd - redirectStart
    // DNS查询耗时：domainLookupEnd - domainLookupStart
    // TCP链接耗时：connectEnd - connectStart
    // HTTP请求耗时：responseEnd - responseStart
    // 解析dom树耗时：domComplete - domInteractive
    // 白屏时间：responseStart - navigationStart
    // DOM ready时间：domContentLoadedEventEnd - navigationStart
    // onload时间：loadEventEnd - navigationStart
    // performance.timing
    // 可以统计到页面性能和资源/接口加载时间
    const entries = performance.getEntries()
    entries
      .filter(item => !this.recordEntries.includes(item))
      .forEach(item => {
        this.core.report('PERFORMANCE', item.entryType.toUpperCase(), item.toJSON())
      })

    this.recordEntries = entries
  }
}
