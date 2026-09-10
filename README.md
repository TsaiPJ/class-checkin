# 課堂簽到簿（QR Code 點名與課堂互動）

以「靜態網頁 + Firebase」重建的課堂簽到系統，可直接放在 GitHub Pages（例如 `https://tsaipj.github.io/class-checkin/`）。

| 頁面 | 用途 |
|---|---|
| `index.html` | **老師管理**：登入、建立每週簽到、投影 QR Code、即時名單、發問計數（＋／－）、關閉／重新開放簽到、匯出本週／全學期 CSV |
| `student.html` | **學生報到**：掃描 QR Code 自動帶入代碼，輸入學號、姓名即完成簽到（同一週每個學號僅能簽到一次） |
| `firebase-config.js` | Firebase 設定與系統名稱（**唯一需要修改的檔案**） |
| `firestore.rules` | Firestore 安全規則（貼到 Firebase Console） |
| `style.css` | 樣式 |

---

## 一、建立 Firebase 專案（約 5 分鐘）

1. 到 <https://console.firebase.google.com> →「新增專案」，名稱例如 `class-checkin`（Google Analytics 可關閉）。
2. 左側 **建構 → Authentication** → 開始使用 → **Sign-in method** 分頁：
   - 啟用 **電子郵件/密碼**
   - 啟用 **匿名**（學生用）
3. **Authentication → Users** 分頁 →「新增使用者」：輸入老師的 Email 與密碼（這就是登入管理頁的帳號）。
4. 左側 **建構 → Firestore Database** → 建立資料庫 → 位置選 `asia-east1`（台灣）→ 以「正式版模式」建立。
5. Firestore →「規則」分頁：把 `firestore.rules` 的**全部內容**貼上並「發布」。
6. 專案設定（左上齒輪）→「一般」→ 往下捲到「您的應用程式」→ 點 **`</>`（網頁）** → 註冊應用程式（名稱隨意，不用勾 Hosting）→ 複製畫面上的 `firebaseConfig = { ... }`。
7. 打開 `firebase-config.js`，把第 5–12 行的 `firebaseConfig` 換成剛剛複製的內容。

> 之後 Firestore 需要一個複合索引嗎？**不需要**。本系統的查詢都是單一欄位（`sessionNumber` 排序、`code` / `sessionId` 等於查詢），Firestore 會自動建立。

---

## 二、部署到 GitHub Pages

1. 在 GitHub（帳號 `tsaipj`）建立新的 **public** repo，名稱例如 `class-checkin`。
2. 把這個資料夾內的 5 個檔案（`index.html`、`student.html`、`firebase-config.js`、`firestore.rules`、`style.css`）上傳到 repo 根目錄（網頁上 **Add file → Upload files** 即可）。
3. repo → **Settings → Pages** → Source 選 `Deploy from a branch`，Branch 選 `main` / `(root)` → Save。
4. 約 1 分鐘後網址即為 `https://tsaipj.github.io/class-checkin/`。
5. 回到 Firebase Console → **Authentication → Settings → 授權網域**，確認 `tsaipj.github.io` 在清單中（不在就新增）。

---

## 三、上課流程

1. 老師開 `https://tsaipj.github.io/class-checkin/` 登入 → **建立第一週**（輸入課程名稱、日期、時間）。
2. 系統產生本週簽到碼（例如 `0909-1-29DE`）與 QR Code；按「放大投影」可全螢幕投影。
3. 學生掃描 QR Code → 自動開啟 `student.html?code=...` → 輸入學號、姓名 → 完成簽到，老師畫面即時出現。
4. 學生發問時，老師在該生列按「＋」；按錯按「－」。
5. 下週上課按 **建立下一週**：上一週自動關閉，並產生新的代碼與 QR Code（舊 QR Code 失效）。
6. **匯出本週**：本週名單 CSV。**匯出全學期**：會下載兩個檔案——
   - `_全學期總表.csv`：每位學生一列，含出席次數、發問總數、各週出席（1/0）與各週發問次數，可直接算成績。
   - `_全學期明細.csv`：所有簽到紀錄的長表。
   CSV 含 BOM，Excel 直接開啟中文不會亂碼。

---

## 資料結構（Firestore）

```
sessions/{autoId}
  courseName, sessionNumber, classDate, startTime, endTime,
  code ("0909-1-29DE"), status ("open" | "closed"), createdAt

attendees/{sessionId}_{studentId}
  sessionId, sessionCode, studentId, name, questions, uid, checkedInAt
```

安全規則重點：週次只有老師（Email 登入）能建立／修改；學生（匿名登入）只能在「開放中」且代碼正確的週次**新增一筆**，文件 id 固定為 `週次_學號`，因此無法重複簽到，也無法修改別人的資料或自己的發問次數。

---

## 常見問題

- **登入失敗 `auth/invalid-credential`**：帳號密碼錯誤，或尚未在 Authentication → Users 建立老師帳號。
- **學生簽到失敗 `permission-denied`**：本週已關閉、代碼不對、或同一學號已簽到過；也請確認規則已發布、匿名登入已啟用。
- **老師頁面一直「正在讀取」**：多半是 `firebase-config.js` 尚未填入正確設定，或規則未發布。開瀏覽器主控台（F12）看錯誤訊息。
- **想改系統名稱／預設課程**：改 `firebase-config.js` 內的 `APP_NAME`、`APP_SUBTITLE`、`DEFAULT_COURSE`。
- **多門課共用**：同一個 Firebase 專案可以放多門課。每門課一個資料夾（例如根目錄＝專題討論、`medbiotech/`＝醫學生物技術概論），資料夾內放同一套 `index.html`、`student.html`、`style.css`，只有 `firebase-config.js` 的 `COURSE_ID`、`APP_SUBTITLE`、`DEFAULT_COURSE` 不同。`COURSE_ID` 是資料庫區分課程的代號，建立後請勿更改。老師帳號共用，登入任一門課的網址即可管理該課。
  - 專題討論：`https://tsaipj.github.io/class-checkin/`
  - 醫學生物技術概論：`https://tsaipj.github.io/class-checkin/medbiotech/`
  - 再加一門課：複製 `medbiotech/` 資料夾改名，修改其中 `firebase-config.js` 的三個課程欄位即可。
