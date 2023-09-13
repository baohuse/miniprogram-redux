/**
 * 从data里面获取到connect 进来的那些状态
 * @param {object} current - 当前对象 selectorData
 * @param {object} pre - 之前对象 data
 * @returns {object} - 返回包含与之前对象具有相同键的数据的对象
 */
// https://developer.tuya.com/cn/miniapp/framework/api/page#pageprototypesetdatadata-object-callback-function
export default function getStateFromData(current, pre) {
    // 获取当前对象的所有键
    const childks = Object.keys(current);
  
    // 使用 reduce 函数将之前对象中与当前对象具有相同键的数据提取出来
    return childks.reduce(
      (result, key) => ({
        ...result,
        [key]: pre[key] === undefined ? null : pre[key],
      }),
      {},
    );
  }
  