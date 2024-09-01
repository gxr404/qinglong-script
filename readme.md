面板方式
订阅管理 -> 创建订阅，表单填写参考：

名称：lzwme/ql-scripts
链接：https://github.com/lzwme/ql-scripts.git
分支：main
定时：0 0 1 * * *
白名单：ql_|ql-
黑名单：backup|todo|deprecated
依赖文件：utils
文件后缀：js ts
依赖管理 -> nodejs 类型依赖添加：@lzwme/fe-utils commander enquirer moment json5 crypto-js axios

