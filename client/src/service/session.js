function getTimeStamp(time) {
  if (time) {
    return Math.round(new Date(time) / 1000)
  } else {
    return Math.round(new Date() / 1000)
  }
}

export function getSession() {
  if (sessionStorage) {
    const data = sessionStorage.getItem('session');
    if (data) {
      const [session, expriseTime] = data.split('-');
      if (getTimeStamp() > parseInt(expriseTime)) {
        return null;
      } else {
        return session;
      }
    }
  }

  return null;
}

export function setSession(session, expriseTime) {
  if (sessionStorage) {
    sessionStorage.setItem('session', `${session}-${getTimeStamp(expriseTime)}`);
  }
}

export function clearSession() {
  sessionStorage.removeItem("session");
}
