'use client';

import { useState } from 'react';
import { Typography, Card, Space } from 'antd';
import yaml from 'js-yaml';
import { i18n } from '../i18n/locales';
import { useAppContext } from '../contexts/AppContext';
import CephPVCForm from '../components/CephPVCForm';
import { YamlDisplay } from '../components/YamlDisplay';

const { Title } = Typography;

export default function CephPage() {
  const { lang, isDarkMode } = useAppContext();
  const t = i18n[lang];
  const [yamlConfig, setYamlConfig] = useState('');

  const generateYAML = (values: any) => {
    const {
      namespace,
      pvcName,
      cephAuthKey,
      cephSize,
      monitors,
      cephUser,
      pvcReadonly,
    } = values;

    const finalPvcName = pvcReadonly ? `${pvcName}-readonly` : pvcName;

    const secret = {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: {
        name: `secret-cephfs-${finalPvcName}`,
        namespace: namespace,
      },
      data: {
        key: cephAuthKey,
      },
    };

    const pv = {
      apiVersion: 'v1',
      kind: 'PersistentVolume',
      metadata: {
        name: `pv-cephfs-${namespace}-${finalPvcName}`,
        labels: {
          pv: `pv-cephfs-${namespace}-${finalPvcName}`,
        },
      },
      spec: {
        capacity: {
          storage: cephSize,
        },
        accessModes: ['ReadWriteMany'],
        cephfs: {
          user: cephUser,
          path: '/',
          secretRef: {
            name: `secret-cephfs-${finalPvcName}`,
          },
          monitors: monitors.split(',').map(m => m.trim()),
        },
      },
    };

    const pvc = {
      kind: 'PersistentVolumeClaim',
      apiVersion: 'v1',
      metadata: {
        name: `pvc-cephfs-${finalPvcName}`,
        namespace: namespace,
        labels: {
          "z-onesoft-storage-volume-type": "common",
          "z-onesoft-storage-pvc-readonly": pvcReadonly ? "true" : "false",
        },
      },
      spec: {
        accessModes: ['ReadWriteMany'],
        resources: {
          requests: {
            storage: cephSize,
          },
        },
        selector: {
          matchLabels: {
            pv: `pv-cephfs-${namespace}-${finalPvcName}`,
          },
        },
      },
    };

    setYamlConfig(yaml.dump(secret) + '---\n' + yaml.dump(pv) + '---\n' + yaml.dump(pvc));
  };

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Card>
        <Title level={2}>{t.cephTitle || 'Ceph 存储'}</Title>
        <CephPVCForm onSubmit={generateYAML} />
      </Card>

      <YamlDisplay yamlConfig={yamlConfig} isDarkMode={isDarkMode} t={t} />
    </Space>
  );
}
