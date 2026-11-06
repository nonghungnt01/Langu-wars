import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {createQuiz,verifyQuiz,grade} from '@/lib/quiz';
import {serverDb} from '@/lib/server-db';
export async function POST(request:Request){try{if(request.headers.get('origin')!==new URL(request.url).origin)return NextResponse.json({error:'Origin không hợp lệ'},{status:403});const body=await request.json();const jar=await cookies();const existing=jar.get('lw_quiz');if(body.action==='start'){
 if(existing){try{const old=verifyQuiz(existing.value);if(Date.now()-old.started<2000)return NextResponse.json({error:'Vui lòng chờ trước khi tạo bài mới.'},{status:429});}catch{}}
 const db=await serverDb();if(db){const {data:{user}}=await db.auth.getUser();if(user){const {data,error}=await db.rpc('start_learning_attempt',{p_language:body.language});if(error)throw error;return NextResponse.json({mode:'account',...data});}}
 const quiz=createQuiz(body.language);jar.set('lw_quiz',quiz.token,{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',maxAge:900,path:'/'});return NextResponse.json({id:quiz.id,questions:quiz.questions,mode:'practice'});
 }if(body.action==='submit'){
 if(body.mode==='account'){const db=await serverDb();if(!db)throw new Error('Chưa cấu hình Supabase');const {data,error}=await db.rpc('finish_learning_attempt',{p_attempt:body.id,p_answers:body.answers});if(error)throw error;return NextResponse.json({...data,persisted:true});}
 if(!existing)throw new Error('Hãy bắt đầu bài học mới');const ticket=verifyQuiz(existing.value);if(ticket.id!==body.id)throw new Error('Sai mã bài học');if(Date.now()-ticket.started<1500)throw new Error('Vui lòng đọc câu hỏi trước khi trả lời');const result=grade(ticket,body.answers);jar.delete('lw_quiz');return NextResponse.json({...result,persisted:false});}throw new Error('Thao tác không hợp lệ');
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Không thể xử lý bài học. Vui lòng thử lại.'},{status:400});}}
