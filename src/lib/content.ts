export const civilizations = [
 {id:'britannia',name:'BRITANNIA',language:'English',symbol:'♌',color:'#77b8ff',capital:'Lionhold',word:'Hello',meaning:'Xin chào',wrong:['Tạm biệt','Cảm ơn','Xin lỗi']},
 {id:'dragon',name:'DRAGON EMPIRE',language:'Chinese',symbol:'龍',color:'#ed866e',capital:'Longcheng',word:'你好',meaning:'Xin chào',wrong:['Tạm biệt','Cảm ơn','Xin lỗi']},
 {id:'sakura',name:'SAKURA KINGDOM',language:'Japanese',symbol:'✿',color:'#f4accc',capital:'Hanamori',word:'ありがとう',meaning:'Cảm ơn',wrong:['Xin chào','Tạm biệt','Xin lỗi']},
 {id:'hanguk',name:'HANGUK EMPIRE',language:'Korean',symbol:'虎',color:'#88b9e2',capital:'Horang',word:'안녕하세요',meaning:'Xin chào',wrong:['Tạm biệt','Cảm ơn','Xin lỗi']},
 {id:'lumiere',name:'LUMIÈRE',language:'French',symbol:'⚜',color:'#c4a1ee',capital:'Clairval',word:'Merci',meaning:'Cảm ơn',wrong:['Xin chào','Tạm biệt','Xin lỗi']},
 {id:'germania',name:'GERMANIA',language:'German',symbol:'🦅',color:'#dbca87',capital:'Adlerburg',word:'Guten Morgen',meaning:'Chào buổi sáng',wrong:['Chúc ngủ ngon','Cảm ơn','Tạm biệt']},
 {id:'hispania',name:'HISPANIA',language:'Spanish',symbol:'♉',color:'#eea168',capital:'Solterra',word:'Adiós',meaning:'Tạm biệt',wrong:['Xin chào','Cảm ơn','Xin lỗi']},
 {id:'daiviet',name:'ĐẠI VIỆT',language:'Vietnamese',symbol:'🐉',color:'#f3cd7d',capital:'Kim Long',word:'Cảm ơn',meaning:'Thank you',wrong:['Hello','Goodbye','Sorry']},
];
export type Civilization = typeof civilizations[number];
export const skills = ['Từ vựng','Ngữ pháp','Nghe','Nói','Đọc'];
export const levels = ['Beginner','Elementary','Intermediate','Upper Intermediate','Advanced'];
export function levelForXp(xp:number){return Math.min(100,1+Math.floor(Math.sqrt(Math.max(0,xp)/100)));}
