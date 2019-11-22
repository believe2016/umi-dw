import { parse } from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性


export const getPageQuery = () => parse(window.location.href.split('?')[1]);


export function handleOpenedSub(id: string) {
  // 增加
  const OpenedSub = window.localStorage.getItem('openedSub');
  if (OpenedSub) {
    const formatOpenSub = new Set(OpenedSub.split(','));
    console.log(1, formatOpenSub);
    formatOpenSub.add(id);
    console.log(2, formatOpenSub);
    localStorage.setItem('openedSub', JSON.stringify([...formatOpenSub]));
  } else {
    localStorage.setItem('openedSub', id);
  }
}

export function deleteOpenSub(id: string) {
  // 删除
  const OpenedSub = window.localStorage.getItem('openedSub');
  if (!!OpenedSub) {
    const formatOpenSub = new Set(OpenedSub.split(','));
    formatOpenSub.delete(id);
    const newSub = [...formatOpenSub];
    localStorage.setItem('openedSub', JSON.stringify(newSub));
  }
}

export function getOpenSub() {
  const OpenedSub = window.localStorage.getItem('openedSub');
  if (OpenedSub) {
    return OpenedSub.split(',');
  } else {
    return [];
  }
}

export const isOpenedSub = (id: string) => getOpenSub().includes(id);

export function noop() {}
