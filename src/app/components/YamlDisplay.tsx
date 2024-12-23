import React from 'react';
import { Button, Typography, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface YamlDisplayProps {
  yamlConfig: string;
  t: Record<string, string>;
  isDarkMode: boolean;
}

export const YamlDisplay: React.FC<YamlDisplayProps> = React.memo(({ yamlConfig, t, isDarkMode }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(yamlConfig)
      .then(() => message.success(t.copySuccess))
      .catch(() => message.error(t.copyError));
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <Title level={4} style={{ margin: 0 }}>{t.generatedConfig}</Title>
        <Button
          icon={<CopyOutlined />}
          onClick={handleCopy}
        >
          {t.copy}
        </Button>
      </div>
      <div
        style={{
          position: 'relative',
          fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',
          fontSize: '14px',
          lineHeight: '1.5',
          backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
          border: isDarkMode ? '1px solid #444' : '1px solid #e8e8e8',
          borderRadius: '6px',
          padding: '16px',
        }}
      >
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          <code style={{ color: isDarkMode ? '#eee' : '#333' }}>
            {yamlConfig.split('---\n').map((doc, index) => (
              <div key={index} style={{ marginBottom: index < yamlConfig.split('---\n').length - 1 ? '16px' : 0 }}>
                {index > 0 && (
                  <span style={{ color: isDarkMode ? '#999' : '#999', fontWeight: 'bold' }}>---</span>
                )}
                {doc.split('\n').map((line, lineIndex) => {
                  const indent = line.match(/^\s*/)[0].length;
                  const listMatch = line.match(/^(\s*)(- )(.*)/);
                  const keyMatch = line.match(/^(\s*)([\w-]+):(.*)/);

                  if (listMatch) {
                    const [, space, dash, value] = listMatch;
                    return (
                      <div key={lineIndex} style={{ paddingLeft: indent * 8 }}>
                        <span style={{ color: isDarkMode ? '#d4d4d4' : '#999' }}>{dash}</span>
                        <span style={{ color: isDarkMode ? '#9cdcfe' : '#07a' }}>{value}</span>
                      </div>
                    );
                  }

                  if (keyMatch) {
                    const [, space, key, value] = keyMatch;
                    return (
                      <div key={lineIndex} style={{ paddingLeft: indent * 8 }}>
                        <span style={{ color: isDarkMode ? '#c586c0' : '#905' }}>{key}</span>
                        <span style={{ color: isDarkMode ? '#d4d4d4' : '#333' }}>:</span>
                        <span style={{ color: isDarkMode ? '#9cdcfe' : '#07a' }}>{value}</span>
                      </div>
                    );
                  }

                  return (
                    <div key={lineIndex} style={{ paddingLeft: indent * 8 }}>
                      {line}
                    </div>
                  );
                })}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
});
