'use client';

import { useState } from 'react';
import { Card, Typography, Space, Switch, ConfigProvider, theme, Form } from 'antd';
import yaml from 'js-yaml';
import { ConfigForm, ConfigValues, MountOptions } from './components/ConfigForm';
import { YamlDisplay } from './components/YamlDisplay';
import { i18n, Language } from './i18n/locales';

const { Title } = Typography;

const defaultMountOptions: MountOptions = {
  nolock: '-',
  proto: '-',
  hard: '-',
  retrans: '',
  noresvport: true,
  nfsvers: '3',
} as const;

export default function Home() {
  const [yamlConfig, setYamlConfig] = useState('');
  const [form] = Form.useForm<ConfigValues>();
  const [lang, setLang] = useState<Language>('zh-CN');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const t = i18n[lang];
  const { defaultAlgorithm, darkAlgorithm } = theme;

  const generateMountOptions = (options: MountOptions) => {
    const opts = options || defaultMountOptions;
    const mountOptions = [];

    if (opts.nolock && opts.nolock !== '-') mountOptions.push(opts.nolock);
    if (opts.hard && opts.hard !== '-') mountOptions.push(opts.hard);
    if (opts.noresvport) mountOptions.push('noresvport');
    if (opts.proto && opts.proto !== '-') mountOptions.push(`proto=${opts.proto}`);
    if (opts.nfsvers) mountOptions.push(`nfsvers=${opts.nfsvers}`);
    const retransValue = opts.retrans !== '' ? Number(opts.retrans) : null;
    if (retransValue !== null && Number.isInteger(retransValue) && retransValue > 0) {
      mountOptions.push(`retrans=${retransValue}`);
    }

    return mountOptions;
  };

  const generateConfig = (values: ConfigValues) => {
    const { namespace, name, nfs_server, nfs_path, size, readonly, mountOptions } = values;
    if (!namespace || !name || !nfs_server || !nfs_path || !size) return;

    const suffix = readonly ? '-readonly' : '';
    const pvName = `pv-nfs-${namespace}-${name}${suffix}`;
    const pvcName = `pvc-nfs-${name}${suffix}`;

    const config = [
      {
        apiVersion: 'v1',
        kind: 'PersistentVolume',
        metadata: {
          name: pvName,
          labels: {
            pv: pvName,
          },
        },
        spec: {
          capacity: {
            storage: size,
          },
          accessModes: ['ReadWriteMany'],
          nfs: {
            server: nfs_server,
            path: nfs_path,
          },
          mountOptions: generateMountOptions(mountOptions),
        },
      },
      {
        apiVersion: 'v1',
        kind: 'PersistentVolumeClaim',
        metadata: {
          name: pvcName,
          namespace: namespace,
          labels: {
            "z-onesoft-storage-volume-type": "common",
            "z-onesoft-storage-pvc-readonly": readonly ? "true" : "false",
          },
        },
        spec: {
          accessModes: ['ReadWriteMany'],
          resources: {
            requests: {
              storage: size,
            },
          },
          selector: {
            matchLabels: {
              pv: pvName,
            },
          },
        },
      },
    ];

    const yamlOpts = {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      sortKeys: false,
    };

    const yamlString = config.map(doc => {
      const yamlDoc = yaml.dump(doc, yamlOpts);
      return yamlDoc.replace(/^(\s*)(- )/gm, (match, space, dash) => {
        const indent = space.length;
        return ' '.repeat(indent) + dash;
      });
    }).join('---\n');

    setYamlConfig(yamlString);
  };

  const handleReset = () => {
    form.resetFields();
    setYamlConfig('');
    setLang('zh-CN');
    setIsDarkMode(false);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <div className="min-h-screen" style={{ background: isDarkMode ? '#141414' : '#f0f2f5', minHeight: '100vh' }}>
        <div className="p-8">
          <Card style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Title level={2} style={{ margin: 0 }}>{t.title}</Title>
              <Space direction="vertical" align="end" size="small">
                <Space align="center">
                  <span style={{ fontSize: '14px' }}>English</span>
                  <Switch
                    checked={lang === 'zh-CN'}
                    onChange={(checked) => setLang(checked ? 'zh-CN' : 'en-US')}
                    checkedChildren="中"
                    unCheckedChildren="En"
                  />
                  <span style={{ fontSize: '14px' }}>中文</span>
                </Space>
                <Space align="center">
                  <span style={{ fontSize: '14px' }}>{t.lightMode}</span>
                  <Switch
                    checked={isDarkMode}
                    onChange={setIsDarkMode}
                    checkedChildren="🌙"
                    unCheckedChildren="☀️"
                  />
                  <span style={{ fontSize: '14px' }}>{t.darkMode}</span>
                </Space>
              </Space>
            </div>

            <ConfigForm
              form={form}
              t={t}
              defaultMountOptions={defaultMountOptions}
              onGenerate={generateConfig}
              onReset={handleReset}
            />

            {yamlConfig && (
              <YamlDisplay
                yamlConfig={yamlConfig}
                t={t}
                isDarkMode={isDarkMode}
              />
            )}
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
}
