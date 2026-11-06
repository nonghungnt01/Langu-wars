import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'LINGUA WARS • Đại chiến ngôn ngữ',description:'Master Languages. Build Empires. Conquer the World.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi"><body>{children}</body></html>}
