# Task Schedule 頁面與 Demo 專案說明

## 這個頁面 / 專案是什麼？

這是一個 **Task Schedule 接案排程平台** 的 MVP（最小可行產品）展示版本。

核心目標是：

- 讓 **接案者（Provider）** 建立個人資料、作品集與可預約時段
- 讓 **發案者（Client）** 瀏覽接案者、查看可預約時間，並建立預約
- 讓雙方都能透過 **Booking 狀態** 與 **Notifications** 追蹤流程進度

目前這個專案已具備一套可以 demo 的前後端流程，適合：

- 產品展示
- 流程驗證
- MVP 方向確認
- 後續正式產品規劃基礎

---

## Demo MVP 是什麼意思？

頁面上看到的 **Demo MVP**，意思是：

- **Demo**：目前版本已經可以用來展示主要流程
- **MVP（Minimum Viable Product）**：最小可行產品

也就是說，這不是最終完整版產品，而是：

> 一個已經具備核心功能、可以實際操作、可以驗證方向的最小版本。

### 對這個專案來說，MVP 包含：

- 註冊 / 登入
- Provider / Client 角色切分
- Provider 建立 Profile
- Provider 管理 Schedule
- Provider 管理 Portfolio
- Client 瀏覽 Providers
- Client 建立 Booking
- Provider 更新 Booking 狀態
- Notifications 通知機制

### 還不是完整版的部分：

- UI / UX 還可再優化
- 權限與流程可再更細緻
- 尚未進入正式上線等級部署
- 仍缺少更多測試、例外處理、資料初始化與管理功能

---

## 目前專案狀態

### 前端

技術：

- React
- TypeScript
- Vite
- Tailwind CSS

目前已完成：

- Home
- Login / Register
- Dashboard
- Profile
- Schedule
- Portfolio
- Providers 列表 / 詳情
- My Bookings
- My Jobs
- Notifications

並已完成：

- 角色化 Navigation
- Dashboard onboarding checklist
- Booking 成功回流
- Notifications unread badge
- Top bar / Home demo 展示優化

### 後端

技術：

- .NET 9
- ASP.NET Core Web API
- ASP.NET Identity
- Entity Framework Core
- SQLite（Demo 版本）

目前已完成：

- 註冊 / 登入 API
- 角色與授權基礎
- Profile API
- Schedule API
- Portfolio API
- Marketplace API
- Booking API
- Notifications API
- SQLite migration 與 demo database

---

## 目前主要角色流程

## 1. Provider（接案者）

操作流程：

1. Register 建立 Provider 帳號
2. Login
3. 到 Dashboard 查看 onboarding checklist
4. 到 Profile 填寫個人資料並設為 published
5. 到 Schedule 建立可預約時段
6. 到 Portfolio 建立作品集
7. 到 My Jobs 處理 booking 狀態
8. 到 Notifications 查看通知

## 2. Client（發案者）

操作流程：

1. Register 建立 Client 帳號
2. Login
3. 到 Dashboard 查看建議操作
4. 到 Providers 瀏覽接案者
5. 到 Provider Detail 查看作品集與可預約時段
6. 建立 Booking
7. 自動回到 My Bookings 查看預約狀態
8. 到 Notifications 查看 booking 更新

---

## Demo 假資料（Seed Script）

目前已提供一個 SQLite demo seed script：

- `scripts/seed-demo-sqlite.sh`

用途：

- 清除既有 demo.local 假資料
- 重建 Provider / Client demo 帳號資料
- 建立 Provider profile / portfolio / availability slots
- 讓 Client 端可以直接 browse provider 資訊

### 使用方式

```bash
cd /Users/strollist/.openclaw/workspace
./scripts/seed-demo-sqlite.sh
```

### 腳本建立的 demo 資料

會建立：

- Alex Chen
- Bella Lin
- Chris Wu
- Demo Client

> 注意：這份腳本目前是為了 demo browse / flow 驗證而設計，資料會直接寫入 SQLite。

---

## 本機 Demo 環境

目前本機 demo 採用：

- **前端**：Vite dev server
- **後端**：ASP.NET Core API
- **資料庫**：SQLite

SQLite 目前是為了讓 demo 更容易啟動與測試。

### 為什麼先用 SQLite？

因為它適合：

- 本機快速啟動
- 不用額外安裝資料庫服務
- 適合 MVP / demo 階段

### 之後切回正式 SQL 會不會很難？

不會太難。

因為目前系統架構已經是：

- EF Core
- DbContext
- Provider 可替換
- Migration 可重建

之後若要切回正式環境，通常只需要：

1. 更換 provider（如 SQL Server / PostgreSQL）
2. 修改 connection string
3. 重建對應 migrations

---

## 接下來建議優先補強的內容

依目前 Notion 流程規劃，下一步比較值得優先處理的是：

1. Loading / Empty / Error 狀態整理
2. Notifications badge 更即時刷新
3. Provider Detail CTA 再更明確
4. Booking 與 Dashboard 體驗再 polish
5. Demo 資料初始化與假資料建立流程

---

## 總結

這個專案目前不是最終版產品，而是：

> 一個已經能完整跑通主要流程、可以展示、可以說明、可以驗證商業邏輯的 Demo MVP。

如果後續要往正式產品發展，現在這個版本已經是很好的基礎。

