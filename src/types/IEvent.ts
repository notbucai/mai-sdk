export interface IEventBasic {
  token: string; // 本地 token
  userAgent: string;
  language: string;
  appVersion?: string;
  platform?: string;
  page: IEventBasicPage;
}

export interface IEventBasicPage {
  href: string;
  referrer: string;
  hash: string;
}

export interface IEvent<P extends Record<string, keyof any> = {}> {
  type: string;
  event: string;
  params: P;
}

export interface IEventCore {
  report<P extends {}>(type: string, event: string, params: P): boolean | Promise<boolean>;
}

export interface IEventPlugin {
  apply(core: IEventCore): void;
}
