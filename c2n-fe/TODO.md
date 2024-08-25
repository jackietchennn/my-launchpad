# C2N-FE 基本拆解

1. Next.js 目录结构理解
2. Next.js 路由模式理解（The App Router | The Pages Router）
3. Next.js 入口文件理解（_document.tsx & _app.tsx）
4. 构建并提供全局Web3ReactProvider全局Context
5. 构建并提供全局react-redux全局Context
6. 构建并提供_app.tsx布局内需要的子组件（Header、Footer）
7. 提供页面组件（index.tsx、farming.tsx、project.tsx、stake.tsx）

> TIP：上述内容已基本构建完成，剩下的就是第**5**点中提供的`reducer`需要熟悉业务内容。

>>

# 业务内容步骤

1. 构建Header组件
         - 组件UI绘制
         - WalletSelectModal钱包选择功能
         - WalletConnect钱包登录功能
    > 先去进一步查看整个组件、关联reducer、关联hook逻辑，把reducer和hook理解清楚并复制进项目中，再完善Header组件功能
2. 构建Footer组件（没什么逻辑，直接搬过来就是）
3. 构建Index页面
         - Claim Token 功能
         - Add Token 功能
4. 构建Farming页面
         - 质押功能
         - 提款功能（包含rewards）
         - 紧急提款功能（全量提款、无rewards）
5. 构建Project和Stake页面（包含合约工程以及透明升级代理）

> 上述内容都是水磨工夫，需要一点一点慢慢写出来，并不是有什么难点。
> **记住：开发过程中要有阶段性记录过程以及当中遇到的问题！！！方便回顾。**