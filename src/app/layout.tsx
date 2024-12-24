import './globals.css';
import { Inter } from 'next/font/google';
import { ClientLayout } from './components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'K8S 工具集',
  description: 'Kubernetes 存储配置生成工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
