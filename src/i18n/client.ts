// Strings that browser scripts write at runtime. Pages set <html lang>, so the
// bundle stays shared across languages and picks its words on load.
type L = 'ka' | 'ru';
const lang = (document.documentElement.lang || 'en') as L | 'en';

const dict: Record<string, Record<L, string>> = {
  'Please fill in every field with a valid email.': {
    ka: 'გთხოვთ, შეავსოთ ყველა ველი და მიუთითოთ სწორი ელფოსტა.',
    ru: 'Пожалуйста, заполните все поля и укажите корректный email.',
  },
  'Sending…': { ka: 'იგზავნება…', ru: 'Отправка…' },
  'Thank you! Your message is on its way. I will get back to you soon.': {
    ka: 'გმადლობთ! შეტყობინება გაიგზავნა. მალე გიპასუხებთ.',
    ru: 'Спасибо! Сообщение отправлено. Я скоро отвечу.',
  },
  'Something went wrong. Please email contact@giorgi.codes directly.': {
    ka: 'რაღაც შეცდომა მოხდა. გთხოვთ, მომწეროთ პირდაპირ contact@giorgi.codes-ზე.',
    ru: 'Что-то пошло не так. Напишите, пожалуйста, напрямую на contact@giorgi.codes.',
  },
  'Send message': { ka: 'გაგზავნა', ru: 'Отправить' },
  'Meridian residence · Original CleanWeb concept': {
    ka: 'რეზიდენცია Meridian · CleanWeb-ის ორიგინალური კონცეფცია',
    ru: 'Резиденция Meridian · оригинальная концепция CleanWeb',
  },
  'Interactive Meridian building. Drag to orbit.': {
    ka: 'ინტერაქტიული შენობა Meridian. გადაათრიეთ შემოსატრიალებლად.',
    ru: 'Интерактивное здание Meridian. Перетащите, чтобы вращать.',
  },
  'Interactive 3D object. Drag to rotate.': {
    ka: 'ინტერაქტიული 3D ობიექტი. გადაათრიეთ შესატრიალებლად.',
    ru: 'Интерактивный 3D-объект. Перетащите, чтобы вращать.',
  },
  'Drag to orbit · Arrow keys rotate · + / − zoom': {
    ka: 'გადაათრიეთ შემოსატრიალებლად · ისრები ატრიალებს · + / − მასშტაბი',
    ru: 'Перетащите для обзора · стрелки вращают · + / − масштаб',
  },
  'Drag to rotate · Switch the shape and material': {
    ka: 'გადაათრიეთ შესატრიალებლად · შეცვალეთ ფორმა და მასალა',
    ru: 'Перетащите для вращения · меняйте форму и материал',
  },
  tris: { ka: 'პოლიგონი', ru: 'полигонов' },
  Result: { ka: 'შედეგი', ru: 'Итог' },
  'Copied ✓': { ka: 'დაკოპირდა ✓', ru: 'Скопировано ✓' },
  'Select & copy': { ka: 'მონიშნეთ და დააკოპირეთ', ru: 'Выделите и скопируйте' },
  Copy: { ka: 'კოპირება', ru: 'Копировать' },
  checked: { ka: 'მონიშნული', ru: 'отмечено' },
};

export const tr = (en: string): string => (lang === 'en' ? en : dict[en]?.[lang] ?? en);
export const currentLang = lang;

/** "n guides" with the right plural form. */
export function guidesCount(n: number): string {
  if (lang === 'ka') return `${n} გზამკვლევი`;
  if (lang === 'ru') {
    const m10 = n % 10, m100 = n % 100;
    const w = m10 === 1 && m100 !== 11 ? 'гид' : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 'гида' : 'гидов';
    return `${n} ${w}`;
  }
  return `${n} ${n === 1 ? 'guide' : 'guides'}`;
}

export function checkedOf(n: number, total: number): string {
  if (lang === 'ka') return `${n} / ${total} მონიშნული`;
  if (lang === 'ru') return `${n} из ${total} отмечено`;
  return `${n} of ${total} checked`;
}

export function markDone(label: string): string {
  if (lang === 'ka') return `მონიშნე „${label}“ შესრულებულად`;
  if (lang === 'ru') return `Отметить «${label}» как выполненное`;
  return `Mark "${label}" as done`;
}

export function inquiry(offer: string): { subject: string; message: string } {
  if (lang === 'ka') return { subject: `მოთხოვნა: ${offer}`, message: `მაინტერესებს „${offer}“. გთხოვთ, მომწეროთ შემდეგი ნაბიჯები.` };
  if (lang === 'ru') return { subject: `Запрос: ${offer}`, message: `Меня интересует «${offer}». Подскажите, пожалуйста, следующие шаги.` };
  return { subject: `Inquiry: ${offer}`, message: `I'm interested in the ${offer}. Please let me know the next steps.` };
}
