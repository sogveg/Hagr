import { cookies } from 'next/headers'
import type { Locale } from './i18n'
import { getT } from './i18n'

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('lang')?.value
  return (lang === 'en' ? 'en' : 'no') as Locale
}

export async function getServerT() {
  const locale = await getLocale()
  return { t: getT(locale), locale }
}
