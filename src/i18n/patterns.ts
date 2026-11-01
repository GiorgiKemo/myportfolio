// Templated strings that repeat with a changing name or number. Tried only when no exact
// translation exists; $1, $2 … are the captured parts (themselves translated when known).
import type { Pattern } from './engine.ts';

export const patterns: Pattern[] = [
  { re: /^(.+) · Case study by Giorgi Kemoklidze$/, ka: '$1 · ქეისი — გიორგი კემოკლიძე', ru: '$1 · кейс Гиорги Кемоклидзе' },
  { re: /^(.+) website preview$/, ka: '$1 — საიტის გადახედვა', ru: '$1 — превью сайта' },
  { re: /^(.+) homepage screenshot$/, ka: '$1 — მთავარი გვერდის სკრინშოტი', ru: '$1 — скриншот главной страницы' },
  { re: /^(.+) preview$/, ka: '$1 — გადახედვა', ru: '$1 — превью' },
  { re: /^(\d+) entries$/, ka: '$1 ჩანაწერი', ru: '$1 записей' },
  { re: /^\+(\d+) more$/, ka: '+$1 სხვა', ru: '+$1 ещё' },
  { re: /^Project index · (\d+)$/, ka: 'პროექტების სია · $1', ru: 'Список проектов · $1' },
  { re: /^Selected work · (\d+)$/, ka: 'შერჩეული ნამუშევრები · $1', ru: 'Избранные работы · $1' },
  { re: /^Browse all (\d+) guides ⟨0⟩↗⟨1⟩$/, ka: 'ყველა $1 გზამკვლევი ⟨0⟩↗⟨1⟩', ru: 'Все гиды ($1) ⟨0⟩↗⟨1⟩' },
  { re: /^Browse all (\d+) guides$/, ka: 'ყველა $1 გზამკვლევი', ru: 'Все гиды ($1)' },
  { re: /^Browse (\d+) guides$/, ka: '$1 გზამკვლევის ნახვა', ru: 'Смотреть гиды ($1)' },
  { re: /^(\d+) guides$/, ka: '$1 გზამკვლევი', ru: 'Гидов: $1' },
  { re: /^(\d+) min read$/, ka: '$1 წთ საკითხავი', ru: '$1 мин чтения' },
  { re: /^Checklist · (\d+) steps$/, ka: 'ჩეკლისტი · $1 ნაბიჯი', ru: 'Чек-лист · шагов: $1' },
  { re: /^Checklist · (\d+) checks$/, ka: 'ჩეკლისტი · $1 შემოწმება', ru: 'Чек-лист · проверок: $1' },
  { re: /^Field Guide ⟨0⟩№ (\d+)⟨1⟩ \/ (\d+)$/, ka: 'გზამკვლევი ⟨0⟩№ $1⟨1⟩ / $2', ru: 'Гид ⟨0⟩№ $1⟨1⟩ / $2' },
  { re: /^Updated (\w+) (\d{4})$/, ka: 'განახლდა: $1*, $2', ru: 'Обновлено: $1* $2' },
  { re: /^Updated (\w+) (\d+), (\d{4})$/, ka: 'განახლდა: $2 $1, $3', ru: 'Обновлено: $2 $1 $3' },
  { re: /^(.+) · (\w+) (\d+), (\d{4})$/, ka: '$1 · $3 $2, $4', ru: '$1 · $3 $2 $4' },
  { re: /^(.+) ↗$/, ka: '$1 ↗', ru: '$1 ↗' },
];
