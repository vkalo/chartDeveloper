/**
 * 进入时的动画
 * @param {Dom} el transition对象
 */
export function enter(el) {
  el.style.height = 'auto';
  const endHeight = window.getComputedStyle(el).height;
  el.style.height = '0px';
  el.offsetHeight;
  el.style.height = endHeight;
  el.style.overflow = 'hidden';
}

/**
 * 进入后的动画
 * @param {Dom} el transition对象
 */
export function afterEnter(el) {
  el.style.height = null;
  el.style.overflow = 'visible';
}

/**
 * 离开时的动画
 * @param {Dom} el transition对象
 */
export function leave(el) {
  el.style.height = window.getComputedStyle(el).height;
  el.offsetHeight;
  el.style.height = '0px';
  el.style.overflow = 'hidden';
}

/**
 * 离开后的动画
 * @param {Dom} el transition对象
 */
export function afterLeave(el) {
  el.style.height = null;
}
