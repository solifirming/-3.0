# 第二个生日网站：Vercel 修复版

## 如何上传
1. 解压 birthday-v3-vercel-fixed.zip。
2. 打开 GitHub 仓库 solifirming/-3.0，选择 Add file → Upload files。
3. 上传解压目录里的全部文件和文件夹到仓库根目录；不要上传 ZIP 本身，也不要再套一层目录。api、src、lib、package.json、vercel.json 应在同一级。
4. 提交到 Vercel 正在使用的分支。

## 云端存储（必须配置）
推荐给此项目创建并连接独立的 **Private Vercel Blob**。代码支持 OIDC 的 BLOB_STORE_ID，也兼容 BLOB_READ_WRITE_TOKEN；使用平台连接自动注入即可，不在聊天或仓库里手动记录值。连接后需要重新部署，私有 Blob 的读取会绕过存储层 CDN 缓存。

也可以使用原约定的 Redis 方案。若配置了完整 Redis 连接，代码优先使用 Redis，避免改用 Blob 后遗漏已有 Redis 数据。

在 Vercel 打开第二个网站项目 → Storage → 创建或连接 Upstash Redis 数据库，并连接到此项目的 Production 环境。
如果连接后没有自动出现所需变量，在项目 Settings → Environment Variables 添加：
- UPSTASH_REDIS_REST_URL：数据库的 REST URL。
- UPSTASH_REDIS_REST_TOKEN：数据库的 REST Token（具有写入权限）。
也兼容 KV_REST_API_URL 和 KV_REST_API_TOKEN。
不要使用 REDIS_URL 代替 REST URL；不要在 GitHub、聊天或 VITE_ 变量中填写密钥。
建议两个网站使用独立数据库；此项目的键前缀为 birthday-v3:card:。
配置完毕后 Redeploy。原有域名可继续使用。

## 构建设置
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Root Directory: 包含 package.json 和 api 的仓库根目录
不要只上传 dist；Vercel 必须能读取根目录 api 文件夹。

## 验证
1. Resources 中应出现 /api/cards、/api/cards/[id]、/api/cards/latest 函数。
2. 首次访问 /api/cards/latest：无卡片时返回 200 JSON，success 为 true 且 card 为 null；503 JSON 表示数据库未配置或不可用；普通 404 页面表示函数未部署。
3. 编辑名字、祝福和照片，页面左下角应显示“已保存到云端”。
4. 点击生成分享链接。只有服务器确认保存成功才显示链接。
5. 在无痕窗口或另一台设备打开链接，确认照片、文字一致。
6. 再次 Redeploy 后打开该链接，确认持久化有效。

## 修复内容与限制
- 新增 Vercel API，支持私有 Blob 或 Redis 持久化；后端文件不依赖本地 server.cjs。
- 保存检查 HTTP 状态和 success；云端失败显示原因，本机备份继续保留。
- 自动保存延迟 800ms；保存请求排队，分享等待云端确认；剪贴板等待真实完成。
- 单张卡片 JSON 上限约 900KB（包含照片的 Base64），超过时明确提示；大量照片需要后续迁移到对象存储。
- 本机已保存而未上传云端的旧卡片，需要原设备打开并重新生成分享链接，不会自动迁移所有历史记录。
- 分享地址可被持有链接的人读取；沿用原项目的无账号机制，编辑接口未增加身份认证。不要用于敏感内容。
- latest 沿用原项目语义，为此数据库最近一次保存的卡片，不是每位用户独立的最新卡片。
- 照片组件只更新主页面状态，不独立发起保存。整张卡片的照片和文字按同一顺序保存，避免部分照片请求覆盖本机完整备份。
- 本机 IndexedDB 备份写入串行执行，浏览器缓存超限时不伪造 photos 空数组。编辑页按本地、云端顺序读取；分享页从指定云端卡片读取，不让本机缓存覆盖。
- 多选属性在打开系统选择框前立即生效，支持一次选择六张及更多图片；无固定张数上限，允许删除最后一张，旧预设不会恢复。
- 分享清除尚未执行的自动保存计时器，提交完整快照，等待服务器确认并回读核对照片和文字后才显示分享链接。
- 最近卡片以 Redis 指针保存，兼容历史整卡数据；卡片和指针通过 Redis 事务更新，避免重复发送大份照片。

## 验证记录
执行 npm test：模拟 Redis，验证保存、照片与文字读取、latest、缺失卡片、无效 ID、超限、缺少配置、事务确认、串行保存和失败重试。另执行 npm run lint 与 npm run build。
真实 Vercel 和真实 Redis 必须在配置并部署后按上述步骤验证。
