'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main><section className="panel placeholder"><h1>Hành trình tạm gián đoạn</h1><p>Không thể tải màn hình này. Vui lòng thử lại.</p><button className="primary" onClick={reset}>Thử lại</button></section></main>}
