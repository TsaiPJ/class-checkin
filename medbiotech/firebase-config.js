// ─────────────────────────────────────────────────────────────
//  Firebase 設定（請把 Firebase Console 提供的 firebaseConfig 貼到這裡）
//  Firebase Console → 專案設定 → 一般 → 「您的應用程式」→ SDK 設定與配置
// ─────────────────────────────────────────────────────────────
export const firebaseConfig = {
  apiKey: "AIzaSyAiTBgMHMMcYLS0Qi5JhRD12-PmiSRqBqs",
  authDomain: "class-checkin-fc873.firebaseapp.com",
  projectId: "class-checkin-fc873",
  storageBucket: "class-checkin-fc873.firebasestorage.app",
  messagingSenderId: "1016775773404",
  appId: "1:1016775773404:web:39c6362b9cfe7d76ad3819"
};

// ─────────────────────────────────────────────────────────────
//  課程設定：每門課一個資料夾，只有這一段不同
//  COURSE_ID 是資料庫裡區分課程用的代號（英文/數字，建立後請勿更改）
// ─────────────────────────────────────────────────────────────
export const COURSE_ID = "medbiotech";
export const APP_NAME = "課堂簽到簿";
export const APP_SUBTITLE = "醫學生物技術概論｜QR Code 點名與課堂互動";
// 預設課程名稱（建立第一週時會帶入，之後可在建週視窗修改）
export const DEFAULT_COURSE = "醫學生物技術概論";
