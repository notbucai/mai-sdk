export interface IExceptionMessage {
  type: string
  message: string
  stack: string
  lineno?: number
  colno?: number
  source?: string
  fileName?: string
  origin?: string
}
