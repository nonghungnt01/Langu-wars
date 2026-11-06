import { createHmac, timingSafeEqual, randomUUID, randomInt } from 'node:crypto';
import { civilizations } from './content';
const fallback = randomUUID()+randomUUID();
function secret(){return process.env.QUIZ_SIGNING_SECRET || fallback;}
export type Ticket={id:string;language:string;questions:{prompt:string;choices:string[];answer:number}[];started:number;expires:number};
export function createQuiz(language:string){
 const c=civilizations.find(c=>c.id===language); if(!c)throw new Error('Ngôn ngữ không hợp lệ');
 const choices=[c.meaning,...c.wrong];for(let i=choices.length-1;i>0;i--){const j=randomInt(i+1);[choices[i],choices[j]]=[choices[j],choices[i]];}
 const ticket:Ticket={id:randomUUID(),language,questions:[{prompt:`“${c.word}” có nghĩa là gì?`,choices,answer:choices.indexOf(c.meaning)}],started:Date.now(),expires:Date.now()+15*60*1000};
 const body=Buffer.from(JSON.stringify(ticket)).toString('base64url');
 // Encrypted answers are unnecessary here: the ticket stays in an HttpOnly cookie.
 return {token:body+'.'+createHmac('sha256',secret()).update(body).digest('base64url'),id:ticket.id,questions:ticket.questions.map(({prompt,choices})=>({prompt,choices}))};
}
export function verifyQuiz(token:string){const [body,sig]=token.split('.');if(!body||!sig)throw new Error('Phiên học không hợp lệ');const expected=createHmac('sha256',secret()).update(body).digest();const actual=Buffer.from(sig,'base64url');if(actual.length!==expected.length||!timingSafeEqual(actual,expected))throw new Error('Phiên học không hợp lệ');const ticket=JSON.parse(Buffer.from(body,'base64url').toString()) as Ticket;if(ticket.expires<Date.now())throw new Error('Phiên học đã hết hạn');return ticket;}
export function grade(ticket:Ticket,answers:number[]){if(answers.length!==ticket.questions.length||answers.some((a,i)=>!Number.isInteger(a)||a<0||a>=ticket.questions[i].choices.length))throw new Error('Đáp án không hợp lệ');const score=answers.reduce((sum,a,i)=>sum+Number(a===ticket.questions[i].answer),0);return {score,total:ticket.questions.length,xp:score*30,gold:score*15};}
