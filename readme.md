


nfs 配置生成器

1. nfs_server: 比如 10.10.10.10
2. nfs_path: 比如 /share

根据 nfs server 和 nfs path 生成 k8s 的 pv 和 pvc yaml

例如:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
    name: nfs-pv
    labels:
        pv: nfs-pv
spec:
    capacity:
        storage: 1Gi
    accessModes:
    - ReadWriteMany
    nfs:
        server: 10.10.10.10
        path: /share
    options:
        nfsvers: 3
        rsize: 1048576
        wsize: 1048576
        timeo: 600
        retrans: 2
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
    name: nfs-pvc
spec:
    accessModes:
    - ReadWriteMany
    resources:
        requests:
            storage: 1Gi
    selector:
        matchLabels:
            pv: nfs-pv  
```


1. namespace: 比如 default
2. name: 比如 data
3. size: 比如 100Gi
4. nfs_server: 比如 10.10.10.10, 使用带下拉列表的可编辑框，下拉列表中显示常见的内网 IP 地址，用户选择后可以编辑
5. nfs_path: 比如 /share
6. readonly: 使用 Switch 开关，选中后生成 pv 和 pvc 名称加上 -readonly 后缀
7. 高级可选项
7.1 nfsvers: nfs 协议版本, 使用 Select ，值为 3, 4, 4.0，4.1，4.2，默认值为 3
7.2 proto: 协议，值为 `-`, `tcp`, `udp`，默认值为 `-`，`-` 表示使用默认协议
7.3 retrans: 重传次数，默认值为空，使用 加号 和 减号 来设置值，可编辑
7.4 nolock: 使用 Select, 值为 `-`, true, false, 默认值为 `-`，`-` 表示使用默认值
7.5 hard: 使用 Select, 值为 `-`, true, false, 默认值为 `-`，`-` 表示使用默认值
7.6 noresvport: 使用 Select, 值为 `-`, true, false, 默认值为 `-`，`-` 表示使用默认值
