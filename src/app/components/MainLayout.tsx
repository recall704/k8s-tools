'use client';

import { Layout, Menu } from 'antd';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Header } from './Header';
import { useAppContext } from '../contexts/AppContext';

const { Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { isDarkMode } = useAppContext();

  const menuItems = [
    {
      key: '/nfs',
      label: <Link href="/nfs" style={{ color: 'inherit' }}>NFS</Link>,
    },
    {
      key: '/ceph',
      label: <Link href="/ceph" style={{ color: 'inherit' }}>Ceph</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme={isDarkMode ? 'dark' : 'light'}
        style={{
          borderRight: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
        }}
      >
        <div 
          style={{ 
            height: 32, 
            margin: 16, 
            background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
          }} 
        />
        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          selectedKeys={[pathname]}
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout>
        <div 
          style={{ 
            padding: '16px',
            background: isDarkMode ? '#141414' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
            borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`
          }}
        >
          <Header />
        </div>
        <Content 
          style={{ 
            margin: '16px',
            background: isDarkMode ? '#141414' : '#fff',
            padding: '16px',
            borderRadius: '8px',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
