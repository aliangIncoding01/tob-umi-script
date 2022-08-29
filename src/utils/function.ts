/**
 * @description: 生成自动重试方法
 * 返回的方法在调用时候，将执行传入的方法fn，并在失败时候自动重试
 *
 * @param {Function} fn 返回值为thenable对象的方法
 * @param {Number} times 重试的次数
 * @param {Number} delay 重试时间间隔
 * @return {Function} 生成的自动重试方法
 */
interface RetryerOptions {
  fn: Function
  delay?: number
  limit?: number
}
export const creatRetryer = (options: RetryerOptions) => {
  const { fn, delay = 1000, limit = 3 } = options

  const wrappedFN = (...args: any) =>
    new Promise((resolve: Function, reject: Function) => {
      const run = (error?: any) => {
        if (wrappedFN.retryTimes === limit) {
          reject(error)
          return
        }
        fn(args).then(resolve, (error: any) => {
          setTimeout(() => {
            wrappedFN.retryTimes++
            run(error)
          }, delay)
        })
      }
      run()
    })

  wrappedFN.retryTimes = 0

  return wrappedFN
}

/**
 * @description: 处理 async/await 异常
 * 返回的方法在调用时候，resolve时将执行传入的方法fn，在失败的时候返回原因
 *
 * @param {Function} fn 返回值为thenable对象的方法
 * @return {Function} 生成数组，第一个元素为失败的原因，第二个元素是结果
 *
 */
export const catchAwait =
  (fn: Function) =>
  async (...args: any) => {
    try {
      return [null, await fn(args)]
    } catch (e) {
      return [e]
    }
  }

/**
 * @description: 判断空对象处理
 * @param {any} variable
 * @return {boolean}
 */
export const isNonemptyObject = (variable: any): boolean =>
  Object.prototype.toString.call(variable) === '[object Object]' &&
  JSON.stringify(variable) !== '{}'

/**
 * @description: 判断空数组处理
 * @param {any} variable
 * @return {boolean}
 */
export const isNonemptyArray = (variable: any): boolean =>
  Array.isArray(variable) && variable?.length > 0
