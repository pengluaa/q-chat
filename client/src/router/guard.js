import { getSession } from '../service/session';

export default function (to, from, next) {
  next( getSession() ? true : '/login');
}