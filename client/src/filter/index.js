import dayjs from 'dayjs'

export function dateTime(value) {
  return dayjs(value).format('YYYY-MM-DD hh:mm');
}

export function time(value) {
  return dayjs(value).format('hh:mm');
}

export function birthday(value) {
  if(!value) return '-'
  return dayjs(value).format('YYYY-MM-DD');
}

export function decodeContent(value) {
  return decodeURIComponent(value || '-');
}

export function sex(value) {
  switch (value) {
    case 1:
      value = '男'
      break;
    case 2:
      value = '女'
      break;

    default:
      value = '未知'
      break;
  }
  return value;
}
