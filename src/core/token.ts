import { getCookie, setCookie } from '@/util'

// 多位置存放，避免丢失
export default class Token {
  private token: string
  constructor (
    private readonly key: string
  ) {
    this.token = this.initToken()
    this.setToken()
  }

  public getToken () {
    return this.token
  }

  private initToken () {
    const localV = localStorage.getItem(this.key)
    const sessionV = sessionStorage.getItem(this.key)
    const cookieV = getCookie(this.key)
    return localV || sessionV || cookieV || this.genToken()
  }

  private setToken () {
    const token = this.token
    const key = this.key
    localStorage.setItem(key, token)
    sessionStorage.setItem(key, token)
    setCookie(key, token, 365)
  }

  private genToken () {
    return [1, 3, 5, 7, 9]
      .map(item =>
        Number(`${Math.random() * item}${Date.now() * item}`)
          .toString(36)
      )
      .join('')
      .replaceAll('.', '')
      .substring(0, 36)
  }
}
