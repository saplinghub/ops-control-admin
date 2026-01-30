# ops-control 迁移至 cool-admin 计划

## 1. 项目分析总结
`ops-control` 是一个基于 Go 的运维中控系统，核心功能包括：
- **Agent 管理**：维护服务器心跳、在线状态。
- **监控**：实时同步 Docker Compose 项目及服务状态。
- **控制**：远程下发 start/stop/restart 指令。
- **通信**：基于 WebSocket 的双向实时通信。
- **审计**：记录所有操作日志。

## 2. 迁移阶段计划

### 第一阶段：基础构建与数据建模 [x]
- [x] 创建 `ops` 模块基础结构 (`src/modules/ops`)
- [x] 定义 `AgentEntity`：存储服务器 ID、名称、最后在线时间等。
- [x] 定义 `ProjectEntity`：存储项目名称、路径等。
- [x] 定义 `ServiceEntity`：存储容器服务名、状态、健康度等。
- [x] 定义 `AuditLogEntity`：记录操作人、指令、结果等。

### 第二阶段：通信层开发 (WebSocket) [x]
- [x] 在 `cool-admin` 中配置 WebSocket 服务端点（如 `/ws/agent`）。
- [x] 实现 Agent 鉴权与心跳维护逻辑。
- [x] 封装指令发送助手类，确保兼容原 Go 版 Agent 的消息协议。

### 第三阶段：后端业务逻辑 [x]
- [x] 利用极速 CRUD 生成服务器与项目的管理接口。
- [x] 编写自定义 Controller 处理远程控制指令。
- [x] 实现 状态同步逻辑：当 Agent 上报状态时，更新数据库。

### 第四阶段：前端开发与联调 [ ]
- [ ] 在 `cool-admin-vue` 项目中集成运维菜单。
- [ ] 开发服务器看板、项目列表及容器控制组件。
- [ ] 全链路联调测试。

---
## 3. 进度记录
- **2026-01-30**：初始化迁移计划文档。
