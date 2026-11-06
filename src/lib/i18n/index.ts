export type Locale='vi'|'en';
const dictionaries={
 vi:{home:'Tổng quan',world:'Thế giới',learn:'Học viện',kingdom:'Vương quốc',leaderboard:'Xếp hạng',profile:'Nhân vật'},
 en:{home:'Overview',world:'World',learn:'Academy',kingdom:'Kingdom',leaderboard:'Leaderboard',profile:'Character'}
} as const;
// Navigation is the first migrated namespace; expand dictionaries before exposing a locale picker.
export function dictionary(locale:Locale='vi'){return dictionaries[locale];}
