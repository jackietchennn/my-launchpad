export const mergeClassName = (classList: Array<string | false | undefined>) => classList.filter((_) => _).join(" ");

/**
 * 拆分目标为千分位的数字显示
 * 
 * @param _target 拆分目标，默认转换成字符串
 * 
 * @returns 千分位拆分后的数字显示，如 `1,000,000`
 * 
 * @example
 *  seperateWithComma(1000000); // "1,000,000"
 */
export const seperateWithComma = (_target: number | string) => {
  const target = _target + ""

  return /\d/.test(target) && target.replace(/\B(?=(?:\d{3})+(?!\d))/g, ",") || ''
}
