#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DB_PATH="$ROOT_DIR/src/TaskSchedule.Api/task-schedule.db"

if ! command -v sqlite3 >/dev/null 2>&1; then
  echo "sqlite3 is required but not installed."
  exit 1
fi

if [ ! -f "$DB_PATH" ]; then
  echo "Database not found at: $DB_PATH"
  echo "Run migrations first:"
  echo "  dotnet ef database update --project src/TaskSchedule.Api/TaskSchedule.Api.csproj --startup-project src/TaskSchedule.Api/TaskSchedule.Api.csproj"
  exit 1
fi

sqlite3 "$DB_PATH" <<'SQL'
DELETE FROM Notifications;
DELETE FROM Bookings;
DELETE FROM AvailabilitySlots;
DELETE FROM PortfolioItems;
DELETE FROM ProviderProfiles;
DELETE FROM ClientProfiles;
DELETE FROM AspNetUserRoles;
DELETE FROM AspNetUserLogins;
DELETE FROM AspNetUserClaims;
DELETE FROM AspNetUserTokens;
DELETE FROM AspNetRoleClaims;
DELETE FROM AspNetUsers WHERE Email LIKE '%@demo.local';
DELETE FROM AspNetRoles WHERE Name IN ('Admin','Provider','Client');

INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp) VALUES
('11111111-1111-1111-1111-111111111111', 'Admin', 'ADMIN', 'seed-admin'),
('22222222-2222-2222-2222-222222222222', 'Provider', 'PROVIDER', 'seed-provider'),
('33333333-3333-3333-3333-333333333333', 'Client', 'CLIENT', 'seed-client');

INSERT INTO AspNetUsers (Id, DisplayName, TimeZone, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Alex Chen', 'Asia/Taipei', 'alex@demo.local', 'ALEX@DEMO.LOCAL', 'alex@demo.local', 'ALEX@DEMO.LOCAL', 1, '', 'seed', 'seed', 0, 0, 0, 0),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Bella Lin', 'Asia/Taipei', 'bella@demo.local', 'BELLA@DEMO.LOCAL', 'bella@demo.local', 'BELLA@DEMO.LOCAL', 1, '', 'seed', 'seed', 0, 0, 0, 0),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Chris Wu', 'Asia/Taipei', 'chris@demo.local', 'CHRIS@DEMO.LOCAL', 'chris@demo.local', 'CHRIS@DEMO.LOCAL', 1, '', 'seed', 'seed', 0, 0, 0, 0),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Demo Client', 'Asia/Taipei', 'client@demo.local', 'CLIENT@DEMO.LOCAL', 'client@demo.local', 'CLIENT@DEMO.LOCAL', 1, '', 'seed', 'seed', 0, 0, 0, 0);

INSERT INTO AspNetUserRoles (UserId, RoleId) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '22222222-2222-2222-2222-222222222222'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '22222222-2222-2222-2222-222222222222'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '22222222-2222-2222-2222-222222222222'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '33333333-3333-3333-3333-333333333333');

INSERT INTO ProviderProfiles (Id, UserId, DisplayName, Headline, Bio, ServiceArea, PricingNotes, IsPublished) VALUES
('p0000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Alex Chen', 'Full-stack .NET 顧問', '專注於 .NET、Angular 與企業內部系統建置。', 'Taipei', '每小時 NT$1,500，專案可議', 1),
('p0000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Bella Lin', 'UI/UX 與前端工程師', '擅長 React、設計系統、互動體驗優化。', 'New Taipei', '每案 NT$20,000 起', 1),
('p0000000-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Chris Wu', '雲端架構與 DevOps 顧問', '提供 Azure / GCP 架構設計、CI/CD 與監控規劃。', 'Remote', '每小時 NT$2,000', 1);

INSERT INTO ClientProfiles (Id, UserId, DisplayName, CompanyName) VALUES
('c0000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Demo Client', 'Demo Studio');

INSERT INTO PortfolioItems (Id, ProviderProfileId, Title, Description, ImageUrl, ExternalUrl, SortOrder) VALUES
('f0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', '企業排程系統', '協助企業建立內部排程與簽核平台。', '', 'https://example.com/alex-1', 1),
('f0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000001', 'HR 管理後台', '整合簽核、排班、報表與權限管理。', '', 'https://example.com/alex-2', 2),
('f0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000002', 'SaaS 設計系統', '建立元件庫與一致化的 UI 規範。', '', 'https://example.com/bella-1', 1),
('f0000000-0000-0000-0000-000000000004', 'p0000000-0000-0000-0000-000000000002', '預約平台前端重構', '優化預約流程與手機版操作體驗。', '', 'https://example.com/bella-2', 2),
('f0000000-0000-0000-0000-000000000005', 'p0000000-0000-0000-0000-000000000003', 'Azure Landing Zone', '建立多環境 Azure landing zone 與治理策略。', '', 'https://example.com/chris-1', 1),
('f0000000-0000-0000-0000-000000000006', 'p0000000-0000-0000-0000-000000000003', 'CI/CD 平台化', '設計多 repo 共用的部署流程與監控告警。', '', 'https://example.com/chris-2', 2);

INSERT INTO AvailabilitySlots (Id, ProviderProfileId, StartAt, EndAt, TimeZone, IsBooked) VALUES
('s0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', '2026-04-06T09:00:00+08:00', '2026-04-06T10:00:00+08:00', 'Asia/Taipei', 0),
('s0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000001', '2026-04-06T14:00:00+08:00', '2026-04-06T15:00:00+08:00', 'Asia/Taipei', 0),
('s0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000002', '2026-04-07T10:00:00+08:00', '2026-04-07T11:00:00+08:00', 'Asia/Taipei', 0),
('s0000000-0000-0000-0000-000000000004', 'p0000000-0000-0000-0000-000000000002', '2026-04-07T16:00:00+08:00', '2026-04-07T17:00:00+08:00', 'Asia/Taipei', 0),
('s0000000-0000-0000-0000-000000000005', 'p0000000-0000-0000-0000-000000000003', '2026-04-08T13:00:00+08:00', '2026-04-08T14:00:00+08:00', 'Asia/Taipei', 0),
('s0000000-0000-0000-0000-000000000006', 'p0000000-0000-0000-0000-000000000003', '2026-04-09T09:00:00+08:00', '2026-04-09T10:00:00+08:00', 'Asia/Taipei', 0);
SQL

echo "Demo data seeded into: $DB_PATH"
echo "Providers:"
sqlite3 "$DB_PATH" "SELECT DisplayName || ' | ' || ServiceArea || ' | ' || PricingNotes FROM ProviderProfiles ORDER BY DisplayName;"
