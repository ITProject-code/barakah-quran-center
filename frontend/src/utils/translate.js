import { translations } from './translations'

export const t = (key, lang) => {
  if (!translations[key]) {
    console.warn(`Translation missing for: "${key}"`)
    return key
  }
  return translations[key][lang] || translations[key]['en'] || key
}