const KO = 'ko-KR'
const TZ = { timeZone: 'Asia/Seoul' }

export function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString(KO, { ...TZ, hour: '2-digit', minute: '2-digit' })
}

export function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString(KO, { ...TZ, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export function formatFull(dateStr: string) {
  return new Date(dateStr).toLocaleString(KO, {
    ...TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}
