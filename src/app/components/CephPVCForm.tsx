import React from "react";
import { Form, Input, Button, Switch, Space, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useAppContext } from "../contexts/AppContext";
import { i18n } from "../i18n/locales";

interface CephPVCFormProps {
  onSubmit: (values: {
    namespace: string;
    pvcName: string;
    cephAuthKey: string;
    cephSize: string;
    monitors: string;
    cephUser: string;
    pvcReadonly: boolean;
  }) => void;
}

const defaultValues = {
  namespace: "dev",
  pvcName: "finfs",
  cephSize: "100Gi",
  cephUser: "admin",
  monitors: "192.168.10.128:6789,192.168.10.128:6789,192.168.10.128:6789",
  pvcReadonly: false,
};

const CephPVCForm: React.FC<CephPVCFormProps> = ({ onSubmit }) => {
  const { lang } = useAppContext();
  const t = i18n[lang];
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onSubmit({
      ...values,
      pvcReadonly: values.pvcReadonly || false,
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ gap: '8px' }}
      initialValues={defaultValues}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Form.Item
          label={t.namespace}
          name="namespace"
          rules={[{ required: true, message: t.required }]}
        >
          <Input placeholder={t.namespacePlaceholder} />
        </Form.Item>

        <Form.Item
          label={t.cephPvcName}
          name="pvcName"
          rules={[{ required: true, message: t.required }]}
        >
          <Input placeholder={t.cephPvcNamePlaceholder} />
        </Form.Item>
        <Form.Item
          label={t.cephUser}
          name="cephUser"
          rules={[{ required: true, message: t.required }]}
        >
          <Input placeholder={t.cephUserPlaceholder} />
        </Form.Item>
        <Form.Item
          label={
            <Space>
              {t.cephAuthKey}
              <Tooltip title={t.cephAuthKeyTooltip}>
                <QuestionCircleOutlined />
              </Tooltip>
            </Space>
          }
          name="cephAuthKey"
          rules={[{ required: true, message: t.required }]}
        >
          <Input.Password placeholder={t.cephAuthKeyPlaceholder} />
        </Form.Item>

        <Form.Item
          label={t.cephMonitors}
          name="monitors"
          rules={[{ required: true, message: t.required }]}
        >
          <Input placeholder={t.cephMonitorsPlaceholder} />
        </Form.Item>

        <Form.Item
          label={t.cephSize}
          name="cephSize"
          rules={[{ required: true, message: t.required }]}
        >
          <Input placeholder={t.cephSizePlaceholder} />
        </Form.Item>

        <Form.Item label={t.readonly} name="pvcReadonly" valuePropName="checked">
          <Switch />
        </Form.Item>
      </div>
      <Form.Item style={{ marginBottom: '16px' }}>
        <Space style={{ width: '100%', justifyContent: 'center', gap: '16px' }}>
          <Button type="primary" htmlType="submit" style={{ width: '120px' }}>
            {t.generate}
          </Button>
          <Button onClick={() => form.resetFields()} style={{ width: '120px' }}>{t.reset}</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CephPVCForm;
