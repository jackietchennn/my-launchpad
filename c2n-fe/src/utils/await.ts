type ToResponse<D = any> = [err: Error | null, data: D | undefined];

/**
 * capture error
 * @param promise client promise
 * @param errorExt client error
 * @returns Promise<ToResponse<T>>
 */
export const to = <T = any>(promise: Promise<T>, errorExt?: Error): Promise<ToResponse<T>> => {
  if (!promise) {
    return Promise.resolve([null, undefined]);
  }

  return promise
    .then<ToResponse<T>>((res) => {
      return [null, res];
    })
    .catch((err) => {
      if (errorExt) {
        return [Object.assign(err, errorExt), undefined];
      }

      return [err, undefined];
    });
};
