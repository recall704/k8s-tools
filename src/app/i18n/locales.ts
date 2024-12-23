export type Language = 'zh-CN' | 'en-US';

export const i18n: Record<Language, Record<string, string>> = {
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
