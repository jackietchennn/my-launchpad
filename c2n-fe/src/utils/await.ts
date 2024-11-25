import type { AxiosError } from 'axios'

/**
 * async/await 容错处理
 * @param {Promise} promise 异步函数
 * @param {Error} errorExt 额外错误对象
 * @returns {Promise}
 */
type PromiseResponse<T, E = AxiosError> = [err: E | null, data?: T]

export const to = <T>(promise: Promise<T>, errorExt?: Error): Promise<PromiseResponse<T>> => {
  if (!promise) return Promise.resolve([null, undefined])

  return promise
    .then<PromiseResponse<T>>((data) => [null, data])
    .catch<PromiseResponse<T>>((err) => {
      if (errorExt) {
        return [Object.assign(err, errorExt), undefined]
      }

      return [err, undefined]
    })
}
