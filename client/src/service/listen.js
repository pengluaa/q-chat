const listenMap = new Map();
/**
 * 97-122(a-1)
 * @param {Number} len 
 */
function generateKey() {
  // method1
  return Math.random().toString(32).substr(2); // len = 11
  // method2
  // return new Array(len).fill(1).map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('');
}
export default {
  /**
   * @param {string} event
   * @param {function} cb
   */
  on: function (event, cb) {
    if (!listenMap.has(event)) {
      listenMap.set(event, new Map);
    }
    const key = generateKey();
    listenMap.get(event).set(key, cb);
    return {
      // 返回一个取消listen方法
      cancel: function () {
        listenMap.get(event).delete(key);
      },
    }
  },

  emit: function (event, ...args) {
    const maps = listenMap.get(event);
    if (maps) {
      maps.forEach((cb) => {
        cb && cb(...args);
      });
    }
  },
}
