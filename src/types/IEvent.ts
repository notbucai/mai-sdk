export interface IEventBasic {
  token: string // 本地 token
  userAgent: string
  language: string
  appVersion?: string
  platform?: string
  page: IEventBasicPage
}

export interface IEventBasicPage {
  href: string
  referrer: string
  hash: string
}

export interface IEvent<P extends Record<string, keyof any> = any> {
  type: string
  event: string
  now: number
  params: P
}

export enum IEventCoreListenType {
  UNLOAD = 'UNLOAD',
  CHANGE_URL = 'CHANGE_URL'
}

export enum IURLChangeType {
  HASH = 'hash',
  HISTORY = 'history'
}

export interface IEventCoreListenFunctionEvent {
  origin: Event
  params: Record<string, any>
}

export interface IEventCoreListenFunction {
  (event: IEventCoreListenFunctionEvent): (void | Promise<void>)
}

export interface IEventCore {
  report<P>(type: string, event: string, params: P): boolean | Promise<boolean>
  on(event: IEventCoreListenType, listen: IEventCoreListenFunction): void
}

export interface IEventPlugin {
  apply(core: IEventCore): void
}
