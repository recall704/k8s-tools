'use client';

import { useState } from 'react';
import { Card, Typography, Space, Form } from 'antd';
import yaml from 'js-yaml';
import { NFSPVCForm, ConfigValues, MountOptions } from '../components/NFSPVCForm';
import { YamlDisplay } from '../components/YamlDisplay';
import { i18n } from '../i18n/locales';
import { useAppContext } from '../contexts/AppContext';

const { Title } = Typography;

const defaultMountOptions: MountOptions = {
  nolock: '-',
  proto: '-',
  hard: '-',
  retrans: '',
  noresvport: true,
  nfsvers: '3',
} as const;

export default function NFSPage() {
  const [yamlConfig, setYamlConfig] = useState('');
  const [form] = Form.useForm<ConfigValues>();
  const { lang, isDarkMode } = useAppContext();
  const t = i18n[lang];

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

    const pv = {
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
    };

    const pvc = {
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
    };

    setYamlConfig(yaml.dump(pv) + '---\n' + yaml.dump(pvc));
  };

  const handleReset = () => {
    form.resetFields();
    setYamlConfig('');
  };

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Card>
        <Title level={2}>{t.title}</Title>
        <NFSPVCForm
          form={form}
          onGenerate={generateConfig}
          onReset={handleReset}
          t={t}
          defaultMountOptions={defaultMountOptions}
        />
      </Card>

      <YamlDisplay yamlConfig={yamlConfig} isDarkMode={isDarkMode} t={t} />
    </Space>
  );
}
