# Dr-He AI Face Analysis 🎯

> 智能皮肤与面部分析应用 - 通过一张照片获得个性化的美学和健康见解

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-blue.svg)](https://tailwindcss.com/)

## ✨ 功能特性

- 🤖 **AI 智能分析**: 基于 Google Gemini 2.5 Flash 的先进面部分析
- 📊 **多维度分析**: 肤色、气色、形色三个维度的专业评估
- 💬 **智能助手**: 个性化 AI 对话，支持 MBTI 性格适配
- 🎨 **多主题支持**: 浅色/深色/玫瑰金/丁香/薄荷主题
- 📱 **响应式设计**: 完美适配各种设备尺寸
- 📤 **报告导出**: 支持分析报告图片导出
- 🔍 **术语解释**: 智能术语解释功能
- ⚙️ **个性化设置**: 丰富的用户自定义选项

## 🚀 快速开始

### 前置要求

- Node.js (推荐 18.x 或更高版本)
- npm 或 yarn
- Google Gemini API Key

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/YOUR_USERNAME/dr-he-ai-face-analysis.git
   cd dr-he-ai-face-analysis
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   
   创建 `.env.local` 文件并添加您的 Gemini API Key:
   ```bash
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
   
   > 💡 获取 API Key: 访问 [Google AI Studio](https://aistudio.google.com/) 获取免费的 Gemini API Key

4. **启动开发服务器**
   ```bash
   npm run dev
   ```
   
   应用将在 `http://localhost:5173` 启动

5. **构建生产版本**
   ```bash
   npm run build
   ```

## 🏗️ 技术架构

### 核心技术栈

- **前端框架**: React 19.1.1 + TypeScript
- **构建工具**: Vite 6.2.0
- **样式框架**: Tailwind CSS
- **AI 服务**: Google Gemini 2.5 Flash
- **其他库**: React Markdown, html2canvas

### 项目结构

```
dr-he/
├── components/           # React 组件
│   ├── AIChat.tsx       # AI 对话组件
│   ├── AnalysisResult.tsx # 分析结果展示
│   ├── ImageUploader.tsx # 图像上传组件
│   ├── Settings.tsx     # 设置页面
│   └── ...             # 其他 UI 组件
├── services/            # 服务层
│   └── geminiService.ts # Gemini AI 服务集成
├── App.tsx             # 主应用组件
├── types.ts            # TypeScript 类型定义
├── package.json        # 项目依赖
└── vite.config.ts      # Vite 构建配置
```

## 📋 分析维度

### 1. 肤色分析 (Skin Tone Analysis)
- 检测肌肤问题：斑点、敏感、痘痘、疤痕、疣
- 提供针对性美学建议和护理方案

### 2. 气色分析 (Complexion Analysis)  
- 评估肌肤状态：干燥、暗黄、粗糙、松弛、皱纹
- 分析整体健康状况和活力指数

### 3. 形色分析 (Facial Form Analysis)
- 面部8个区域的美学分析
- 物象、意象、意境三层次深度解析
- 基于格式塔美学的整体评估

## 🔧 开发指南

### 环境变量

```bash
# .env.local
GEMINI_API_KEY=your_gemini_api_key
```

### 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建

## 📝 使用说明

1. 上传清晰的面部照片或使用摄像头拍摄
2. 等待 AI 分析完成（通常需要几秒钟）
3. 查看详细的分析报告
4. 与 AI 助手交互获取个性化建议
5. 导出分析报告保存结果

## ⚠️ 重要声明

- 本应用提供的分析结果仅供参考，不构成医疗诊断
- 如有健康疑虑，请咨询专业医疗人士
- 请确保上传的照片符合隐私和使用条款

## 🤝 贡献指南

欢迎提交 Issues 和 Pull Requests！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🏢 关于我们

由重庆联合丽格科技有限公司开发和维护

---

**⭐ 如果这个项目对您有帮助，请给我们一个星标！**
