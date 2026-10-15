export const RECEIVE_TIMEOUT_SEC = 20
export const RETRY_DELAY_MS = 5000

export const httpErrors: Record<number, string> = {
  401: 'Неверный idInstance или apiTokenInstance',
  403: 'Неверный idInstance или apiTokenInstance',
  429: 'Слишком много запросов, попробуйте позже',
  466: 'Исчерпан лимит тарифа Developer',
}

export const instanceStateErrors: Record<string, string> = {
  notAuthorized: 'Инстанс не авторизован. Отсканируйте QR-код в личном кабинете GREEN-API',
  blocked: 'Аккаунт заблокирован',
  starting: 'Инстанс запускается, попробуйте через пару минут',
  yellowCard: 'На аккаунт наложены ограничения',
}

export const checkAccountErrors: Record<string, string> = {
  rate_limit_exceeded: 'Слишком много проверок номеров, попробуйте позже',
  'Rate limited by messenger': 'Telegram временно ограничил поиск по номеру, попробуйте позже',
  'instance is starting or not authorized': 'Инстанс запускается или не авторизован',
}
