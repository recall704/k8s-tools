'use client';

import React from 'react';
import { Space, Switch } from 'antd';
import { useAppContext } from '../contexts/AppContext';

/**
 * Header component that contains language and theme switches
 * @component
 */
export const Header: React.FC = () => {
  const { lang, setLang, isDarkMode, setIsDarkMode } = useAppContext();

  return (
    <Space>
      <Switch
        checked={lang === 'en-US'}
        onChange={(checked) => setLang(checked ? 'en-US' : 'zh-CN')}
        checkedChildren="EN"
        unCheckedChildren="中"
      />
      <Switch
        checked={isDarkMode}
        onChange={setIsDarkMode}
        checkedChildren="🌙"
        unCheckedChildren="☀️"
      />
    </Space>
  );
};
