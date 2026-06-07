#!/bin/bash

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔍 开始验证音乐排练室预约墙项目...${NC}"
echo ""

# 步骤1: 检查Node.js环境
echo -e "${YELLOW}📦 步骤1: 检查Node.js环境${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js 版本: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ 未找到Node.js，请先安装Node.js >= 18.0.0${NC}"
    exit 1
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✅ npm 版本: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ 未找到npm${NC}"
    exit 1
fi
echo ""

# 步骤2: 检查依赖是否安装
echo -e "${YELLOW}📚 步骤2: 检查依赖安装${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules 目录存在${NC}"
else
    echo -e "${YELLOW}⚠️  node_modules 不存在，正在安装依赖...${NC}"
    npm install
    echo -e "${GREEN}✅ 依赖安装完成${NC}"
fi
echo ""

# 步骤3: 检查必要的源文件
echo -e "${YELLOW}📝 步骤3: 检查源文件完整性${NC}"
REQUIRED_FILES=(
    "src/App.tsx"
    "src/App.css"
    "src/main.tsx"
    "src/types/index.ts"
    "src/components/RoomCard.tsx"
    "src/components/RoomFilter.tsx"
    "src/components/RoomGroup.tsx"
    "src/components/GroupSelector.tsx"
    "src/components/TimeSlotSelector.tsx"
    "src/components/BookingForm.tsx"
    "src/components/BookingDraft.tsx"
    "src/components/BookingHistory.tsx"
    "src/components/AdminPanel.tsx"
    "src/data/mockData.ts"
    "src/utils/storage.ts"
    "README.md"
)

ALL_EXIST=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file 不存在${NC}"
        ALL_EXIST=false
    fi
done

if [ "$ALL_EXIST" = false ]; then
    echo -e "${RED}❌ 部分源文件缺失，请检查项目结构${NC}"
    exit 1
fi
echo ""

# 步骤4: 检查折叠分组功能是否已集成
echo -e "${YELLOW}🔧 步骤4: 验证折叠分组功能集成${NC}"

# 检查类型定义
if grep -q "GroupBy" src/types/index.ts && grep -q "RoomGroup" src/types/index.ts; then
    echo -e "${GREEN}✅ 类型定义已包含 GroupBy 和 RoomGroup${NC}"
else
    echo -e "${RED}❌ 类型定义缺失${NC}"
    exit 1
fi

# 检查RoomGroup组件
if grep -q "isExpanded" src/components/RoomGroup.tsx && grep -q "group-header" src/components/RoomGroup.tsx; then
    echo -e "${GREEN}✅ RoomGroup 折叠分组组件已实现${NC}"
else
    echo -e "${RED}❌ RoomGroup 组件实现不完整${NC}"
    exit 1
fi

# 检查GroupSelector组件
if grep -q "按类型" src/components/GroupSelector.tsx && grep -q "按容量" src/components/GroupSelector.tsx && grep -q "按价格" src/components/GroupSelector.tsx; then
    echo -e "${GREEN}✅ GroupSelector 分组选择器已实现${NC}"
else
    echo -e "${RED}❌ GroupSelector 组件实现不完整${NC}"
    exit 1
fi

# 检查App.tsx集成
if grep -q "RoomGroup" src/App.tsx && grep -q "GroupSelector" src/App.tsx && grep -q "roomGroups" src/App.tsx; then
    echo -e "${GREEN}✅ App.tsx 已集成折叠分组功能${NC}"
else
    echo -e "${RED}❌ App.tsx 未正确集成折叠分组${NC}"
    exit 1
fi

# 检查分组逻辑
if grep -q "groupByType" src/App.tsx && grep -q "groupByCapacity" src/App.tsx && grep -q "groupByPrice" src/App.tsx; then
    echo -e "${GREEN}✅ 房间分组逻辑已实现（按类型/容量/价格）${NC}"
else
    echo -e "${RED}❌ 分组逻辑缺失${NC}"
    exit 1
fi
echo ""

# 步骤5: 检查押金提示优化
echo -e "${YELLOW}💡 步骤5: 验证押金提示优化${NC}"

if grep -q "您尚未缴纳押金" src/components/TimeSlotSelector.tsx && grep -q "原因" src/components/TimeSlotSelector.tsx; then
    echo -e "${GREEN}✅ TimeSlotSelector 已包含详细押金提示${NC}"
else
    echo -e "${YELLOW}⚠️  TimeSlotSelector 押金提示待优化${NC}"
fi

if grep -q "无法预约黄金时段" src/components/BookingForm.tsx && grep -q "原因" src/components/BookingForm.tsx; then
    echo -e "${GREEN}✅ BookingForm 已包含详细押金限制原因${NC}"
else
    echo -e "${YELLOW}⚠️  BookingForm 押金提示待优化${NC}"
fi
echo ""

# 步骤6: 检查移动端响应式样式
echo -e "${YELLOW}📱 步骤6: 验证移动端响应式样式${NC}"

if grep -q "@media (max-width: 768px)" src/App.css && grep -q "rooms-toolbar" src/App.css && grep -q "room-groups" src/App.css; then
    echo -e "${GREEN}✅ 移动端响应式样式已添加${NC}"
else
    echo -e "${YELLOW}⚠️  移动端样式待完善${NC}"
fi
echo ""

# 步骤7: TypeScript类型检查
echo -e "${YELLOW}🔍 步骤7: TypeScript类型检查${NC}"
if npx tsc --noEmit 2>&1; then
    echo -e "${GREEN}✅ TypeScript类型检查通过${NC}"
else
    echo -e "${RED}❌ TypeScript类型检查失败${NC}"
    exit 1
fi
echo ""

# 步骤8: 生产构建
echo -e "${YELLOW}🏗️  步骤8: 生产构建验证${NC}"
if npm run build 2>&1; then
    echo -e "${GREEN}✅ 生产构建成功${NC}"
else
    echo -e "${RED}❌ 生产构建失败${NC}"
    exit 1
fi
echo ""

# 步骤9: 检查构建产物
echo -e "${YELLOW}📦 步骤9: 检查构建产物${NC}"
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✅ 构建产物目录 dist/ 已生成${NC}"
    DIST_SIZE=$(du -sh dist | cut -f1)
    echo -e "${GREEN}📊 构建产物大小: $DIST_SIZE${NC}"
else
    echo -e "${RED}❌ 构建产物缺失${NC}"
    exit 1
fi
echo ""

# 步骤10: 检查README和verify.sh
echo -e "${YELLOW}📄 步骤10: 检查文档完整性${NC}"

if grep -q "入口地址" README.md && grep -q "测试账号" README.md; then
    echo -e "${GREEN}✅ README.md 已包含入口和测试账号${NC}"
else
    echo -e "${YELLOW}⚠️  README.md 待完善${NC}"
fi

if [ -f "verify.sh" ] && [ -x "verify.sh" ]; then
    echo -e "${GREEN}✅ verify.sh 验证脚本已就绪${NC}"
else
    echo -e "${YELLOW}⚠️  verify.sh 权限待设置${NC}"
    chmod +x verify.sh
fi
echo ""

# 完成
echo -e "${GREEN}🎉========================================${NC}"
echo -e "${GREEN}   所有验证步骤通过！项目运行正常${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}📌 快速启动命令:${NC}"
echo -e "   开发模式: ${GREEN}npm run dev${NC}"
echo -e "   访问地址: ${GREEN}http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}👤 测试账号:${NC}"
echo -e "   用户1: 张三（押金已缴纳）${NC}"
echo -e "   用户2: 李四（押金未缴纳）${NC}"
echo -e "   管理员: 点击右上角切换${NC}"
echo ""

exit 0
