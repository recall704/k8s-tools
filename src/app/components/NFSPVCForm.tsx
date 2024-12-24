import React from 'react';
import { Form, Input, Switch, Collapse, Select, InputNumber, Button, Space, FormInstance } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

export interface MountOptions {
  nolock: string;
  proto: string;
  hard: string;
  retrans: string | number;
  noresvport: boolean;
  nfsvers: string;
}

export interface ConfigValues {
  namespace: string;
  name: string;
  nfs_server: string;
  nfs_path: string;
  size: string;
  readonly: boolean;
  mountOptions: MountOptions;
}

interface NFSPVCFormProps {
  form: FormInstance<ConfigValues>;
  t: Record<string, string>;
  defaultMountOptions: MountOptions;
  onGenerate: (values: ConfigValues) => void;
  onReset: () => void;
}

export const NFSPVCForm: React.FC<NFSPVCFormProps> = React.memo(({ 
  form, 
  t, 
  defaultMountOptions, 
  onGenerate, 
  onReset 
}) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onGenerate}
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
          <Button onClick={onReset} style={{ width: '120px' }}>
            {t.reset}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
});
