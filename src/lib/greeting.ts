/** Time-of-day salutation key for i18n. */
export function greetingKey(): 'greetingMorning' | 'greetingAfternoon' | 'greetingEvening' {
  const hour = new Date().getHours()
  if (hour < 12) return 'greetingMorning'
  if (hour < 18) return 'greetingAfternoon'
  return 'greetingEvening'
}
