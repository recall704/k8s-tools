'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Collapse, Space, Select, message, Switch, InputNumber, theme, ConfigProvider } from 'antd';
import yaml from 'js-yaml';
import { CopyOutlined, PlusOutlined, MinusOutlined, GlobalOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Panel } = Collapse;

const i18n = {
  'zh-CN': {
    title: 'K8S NFS 配置生成器',
    namespace: '命名空间',
    namespacePlaceholder: '例如：default',
    name: '名称',
    namePlaceholder: '例如：data',
    size: '存储大小',
    sizePlaceholder: '例如：100Gi',
    nfsServer: 'NFS 服务器地址',
    nfsServerPlaceholder: '例如：10.10.10.10',
    nfsPath: 'NFS 路径',
    nfsPathPlaceholder: '例如：/share',
    readonly: '只读模式',
    yes: '是',
    no: '否',
    advancedOptions: '高级选项',
    nfsVersion: 'NFS 版本',
    nfsVersionTip: '指定 NFS 协议版本',
    protocol: '传输协议',
    protocolTip: '指定传输协议，默认使用系统默认值',
    default: '默认',
    retrans: '重传次数',
    retransTip: 'NFS 请求重试次数',
    fileLock: '文件锁',
    fileLockTip: '是否禁用 NFS 文件锁',
    enable: '启用',
    disable: '禁用',
    hardMount: '硬挂载',
    hardMountTip: '使用硬挂载，IO 操作会一直重试直到成功或手动中断',
    noresvport: '非保留端口',
    noresvportTip: '是否使用非保留端口连接 NFS 服务器',
    generate: '生成配置',
    reset: '重置',
    generatedConfig: '生成的配置：',
    copy: '复制配置',
    copySuccess: '配置已复制到剪贴板',
    copyError: '复制失败，请手动复制',
    required: '请输入',
    darkMode: '暗黑模式',
    lightMode: '明亮模式',
  },
  'en-US': {
    title: 'K8S NFS Configuration Generator',
    namespace: 'Namespace',
    namespacePlaceholder: 'e.g. default',
    name: 'Name',
    namePlaceholder: 'e.g. data',
    size: 'Storage Size',
    sizePlaceholder: 'e.g. 100Gi',
    nfsServer: 'NFS Server',
    nfsServerPlaceholder: 'e.g. 10.10.10.10',
    nfsPath: 'NFS Path',
    nfsPathPlaceholder: 'e.g. /share',
    readonly: 'Read Only',
    yes: 'Yes',
    no: 'No',
    advancedOptions: 'Advanced Options',
    nfsVersion: 'NFS Version',
    nfsVersionTip: 'Specify NFS protocol version',
    protocol: 'Protocol',
    protocolTip: 'Specify transport protocol, use system default if not set',
    default: 'Default',
    retrans: 'Retransmission',
    retransTip: 'NFS request retry count',
    fileLock: 'File Lock',
    fileLockTip: 'Whether to disable NFS file lock',
    enable: 'Enable',
    disable: 'Disable',
    hardMount: 'Hard Mount',
    hardMountTip: 'Use hard mount, IO operations will keep retrying until success or manual interrupt',
    noresvport: 'Non-reserved Port',
    noresvportTip: 'Whether to use non-reserved port to connect NFS server',
    generate: 'Generate',
    reset: 'Reset',
    generatedConfig: 'Generated Configuration:',
    copy: 'Copy',
    copySuccess: 'Configuration copied to clipboard',
    copyError: 'Copy failed, please copy manually',
    required: 'Please input',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
  }
};

type Language = 'zh-CN' | 'en-US';

type ConfigValues = {
  namespace: string;
  name: string;
  nfs_server: string;
  nfs_path: string;
  size: string;
  readonly: boolean;
  mountOptions: {
    nolock: string;
    proto: string;
    hard: string;
    retrans: string | number;
    noresvport: boolean;
    nfsvers: string;
  };
};

const defaultMountOptions = {
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

  const generateMountOptions = (options: ConfigValues['mountOptions']) => {
    const opts = options || defaultMountOptions;
    const mountOptions = [];

    if (opts.nolock && opts.nolock !== '-') mountOptions.push(opts.nolock);
    if (opts.hard && opts.hard !== '-') mountOptions.push(opts.hard);
    if (opts.noresvport) mountOptions.push('noresvport');
    if (opts.proto && opts.proto !== '-') mountOptions.push(`proto=${opts.proto}`);
    if (opts.nfsvers) mountOptions.push(`nfsvers=${opts.nfsvers}`);
    // 检查 retrans 是否为有效值（不为空且为正整数）
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

            <Form
              form={form}
              layout="vertical"
              onFinish={generateConfig}
              style={{ gap: '8px' }}
              initialValues={{
                namespace: 'default',
                name: 'data',
                nfs_server: '10.10.10.10',
                nfs_path: '/share',
                size: '100Gi',
                readonly: false,
                mountOptions: defaultMountOptions,
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Form.Item
                  label={t.namespace}
                  name="namespace"
                  rules={[{ required: true, message: `${t.required}${t.namespace}` }]}
                  style={{ marginBottom: '8px' }}
                >
                  <Input placeholder={t.namespacePlaceholder} />
                </Form.Item>

                <Form.Item
                  label={t.name}
                  name="name"
                  rules={[{ required: true, message: `${t.required}${t.name}` }]}
                  style={{ marginBottom: '8px' }}
                >
                  <Input placeholder={t.namePlaceholder} />
                </Form.Item>

                <Form.Item
                  label={t.nfsServer}
                  name="nfs_server"
                  rules={[{ required: true, message: `${t.required}${t.nfsServer}` }]}
                  style={{ marginBottom: '8px' }}
                >
                  <Input placeholder={t.nfsServerPlaceholder} />
                </Form.Item>

                <Form.Item
                  label={t.nfsPath}
                  name="nfs_path"
                  rules={[{ required: true, message: `${t.required}${t.nfsPath}` }]}
                  style={{ marginBottom: '8px' }}
                >
                  <Input placeholder={t.nfsPathPlaceholder} />
                </Form.Item>
                <Form.Item
                  label={t.size}
                  name="size"
                  rules={[{ required: true, message: `${t.required}${t.size}` }]}
                  style={{ marginBottom: '8px' }}
                >
                  <Input placeholder={t.sizePlaceholder} />
                </Form.Item>
                <Form.Item
                  label={t.readonly}
                  name="readonly"
                  valuePropName="checked"
                  style={{ marginBottom: '8px', gridColumn: '1 / -1' }}
                >
                  <Switch checkedChildren={t.yes} unCheckedChildren={t.no} />
                </Form.Item>
              </div>

              <Collapse ghost style={{ marginBottom: '16px' }}>
                <Panel header={t.advancedOptions} key="1">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Form.Item
                      label={t.nfsVersion}
                      name={['mountOptions', 'nfsvers']}
                      tooltip={t.nfsVersionTip}
                      style={{ marginBottom: '8px' }}
                    >
                      <Select
                        defaultValue={defaultMountOptions.nfsvers}
                        options={[
                          { label: 'NFSv3', value: '3' },
                          { label: 'NFSv4', value: '4' },
                          { label: 'NFSv4.0', value: '4.0' },
                          { label: 'NFSv4.1', value: '4.1' },
                          { label: 'NFSv4.2', value: '4.2' },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item
                      label={t.protocol}
                      name={['mountOptions', 'proto']}
                      tooltip={t.protocolTip}
                      style={{ marginBottom: '8px' }}
                    >
                      <Select
                        defaultValue={defaultMountOptions.proto}
                        options={[
                          { label: t.default, value: '-' },
                          { label: 'TCP', value: 'tcp' },
                          { label: 'UDP', value: 'udp' },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item
                      label={t.retrans}
                      name={['mountOptions', 'retrans']}
                      tooltip={t.retransTip}
                      style={{ marginBottom: '8px' }}
                    >
                      <InputNumber
                        min={0}
                        defaultValue={defaultMountOptions.retrans === '' ? undefined : Number(defaultMountOptions.retrans)}
                        controls={{
                          upIcon: <PlusOutlined />,
                          downIcon: <MinusOutlined />
                        }}
                        style={{ width: '100%' }}
                        onChange={(value) => {
                          // 当值为 null 时，表示输入框为空
                          form.setFieldValue(['mountOptions', 'retrans'], value === null ? '' : value);
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      label={t.fileLock}
                      name={['mountOptions', 'nolock']}
                      tooltip={t.fileLockTip}
                      style={{ marginBottom: '8px' }}
                    >
                      <Select
                        defaultValue={defaultMountOptions.nolock}
                        options={[
                          { label: t.default, value: '-' },
                          { label: t.enable, value: 'lock' },
                          { label: t.disable, value: 'nolock' },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item
                      label={t.hardMount}
                      name={['mountOptions', 'hard']}
                      tooltip={t.hardMountTip}
                      style={{ marginBottom: '8px' }}
                    >
                      <Select
                        defaultValue={defaultMountOptions.hard}
                        options={[
                          { label: t.default, value: '-' },
                          { label: t.enable, value: 'hard' },
                          { label: t.disable, value: 'soft' },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item
                      label={t.noresvport}
                      name={['mountOptions', 'noresvport']}
                      tooltip={t.noresvportTip}
                      style={{ marginBottom: '8px', gridColumn: '1 / -1' }}
                      valuePropName="checked"
                    >
                      <Switch checkedChildren={t.yes} unCheckedChildren={t.no} />
                    </Form.Item>
                  </div>
                </Panel>
              </Collapse>

              <Form.Item style={{ marginBottom: '16px' }}>
                <Space style={{ width: '100%', justifyContent: 'center', gap: '16px' }}>
                  <Button type="primary" htmlType="submit" style={{ width: '120px' }}>
                    {t.generate}
                  </Button>
                  <Button onClick={handleReset} style={{ width: '120px' }}>
                    {t.reset}
                  </Button>
                </Space>
              </Form.Item>
            </Form>

            {yamlConfig && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <Title level={4} style={{ margin: 0 }}>{t.generatedConfig}</Title>
                  <Button
                    icon={<CopyOutlined />}
                    onClick={() => {
                      navigator.clipboard.writeText(yamlConfig)
                        .then(() => message.success(t.copySuccess))
                        .catch(() => message.error(t.copyError));
                    }}
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
                            // 缩进级别
                            const indent = line.match(/^\s*/)[0].length;
                            // 列表项匹配
                            const listMatch = line.match(/^(\s*)(- )(.*)/);
                            // 键值对匹配
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
            )}
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
}
