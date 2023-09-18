export class DateUtil {
  /**
   * 格式化日期
   */
  static format(date: Date, format?: string): string {
    format ??= 'yyyy-MM-dd HH:mm:ss'

    let dateObj: { [key: string]: any } = {
      yyyy: date.getFullYear(),
      MM: date.getMonth() + 1,
      dd: date.getDate(),
      HH: date.getHours(),
      mm: date.getMinutes(),
      ss: date.getSeconds(),
    }

    for (let key in dateObj) {
      if (dateObj[key] < 10) {
        dateObj[key] = '0' + dateObj[key]
      }
    }

    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (match) => dateObj[match])
  }

  /**
   * 格式化时间差
   */
  static formatTimeDiff(timeBegin: Date, timeEnd: Date): string | null {
    const timeDiff = timeEnd.getTime() - timeBegin.getTime()
    if (timeDiff < 0) {
      return null
    }

    const oneDay = 24 * 60 * 60 * 1000
    const oneWeek = oneDay * 7
    const oneMonth = oneDay * 30
    const oneYear = oneDay * 365

    return timeDiff <= oneWeek ? `${Math.ceil(timeDiff / oneDay)} 天` :
      timeDiff <= oneMonth ? `${Math.floor(timeDiff / oneWeek)} 周` :
        timeDiff <= oneYear ? `${Math.floor(timeDiff / oneMonth)} 个月` :
          `${Math.floor(timeDiff / oneYear)} 年`
  }
}
