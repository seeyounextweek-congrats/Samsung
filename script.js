// ===================================================================
// 1) 幫離職同事改名字：改這裡就好，標題會自動套用
// ===================================================================
const COLLEAGUE_NAME = "小美"; // 例如 "小美"，會顯示成「給小美的留言牆」

// ===================================================================
// 2) 貼上 Firebase 主控台給你的設定物件（在「新增網頁應用程式」那步拿到）
// ===================================================================
const firebaseConfig = {
  apiKey: "AIzaSyB3QiDnkwy9Fc4iMEm24gdG4VHDcidTo2Y",
  authDomain: "samsung-ed531.firebaseapp.com",
  projectId: "samsung-ed531",
  storageBucket: "samsung-ed531.firebasestorage.app",
  messagingSenderId: "401855586679",
  appId: "1:401855586679:web:7301cd73e3af18a0240172",
};

// ===================================================================
// 3) 想關閉留言功能時，把這裡改成 true，畫面上的留言表單就會換成
//    「留言時間已結束」的提示，大家還是看得到留言牆，但不能再新增留言
//    改完這裡之後，記得也要到 Firebase 主控台把 Firestore 規則裡的
//    allow create 改成 if false（詳見 README 最後一步），兩個都做才算真的關閉
// ===================================================================
const MESSAGES_CLOSED = false;

// ===================================================================
// 以下不用改，是留言板的運作邏輯
// ===================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 把同事的名字套進標題、副標與各區塊小標
document.getElementById("page-title").textContent = `給${COLLEAGUE_NAME}的留言牆`;
document.getElementById("hero-title").textContent = `給${COLLEAGUE_NAME}的留言牆`;
document.getElementById("hero-subtitle").textContent =
  `這段時間辛苦你了。這裡集滿了大家想對${COLLEAGUE_NAME}說的話——謝謝、祝福，還有滿滿的不捨，都在下一段旅程開始前，好好收下。`;
document.getElementById("wall-heading").textContent = `大家想對${COLLEAGUE_NAME}說的話 💌`;
document.getElementById("form-heading").textContent = `留下你想對${COLLEAGUE_NAME}說的話 ✍️`;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesRef = collection(db, "messages");

const form = document.getElementById("message-form");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const errorEl = document.getElementById("form-error");
const submitBtn = document.getElementById("submit-btn");
const wallEl = document.getElementById("messages");
const wallStatusEl = document.getElementById("wall-status");

// 每則留言右上角的小貼圖，依序循環使用
const STICKERS = ["🌸", "🦋", "🌻", "🐝", "🍃", "🌼"];

function showError(text) {
  errorEl.textContent = text;
  errorEl.hidden = false;
}

function clearError() {
  errorEl.hidden = true;
  errorEl.textContent = "";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !message) {
    showError("請填寫姓名與留言內容");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "祝福送出中…";

  try {
    await addDoc(messagesRef, {
      name,
      message,
      createdAt: serverTimestamp(),
    });
    form.reset();
    nameInput.focus();
  } catch (err) {
    console.error(err);
    showError("送出失敗，請確認網路連線或稍後再試一次");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "送出祝福 🎁";
  }
});

function formatTime(timestamp) {
  if (!timestamp) return "剛剛";
  return timestamp.toDate().toLocaleString("zh-TW", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderMessages(snapshot) {
  wallEl.innerHTML = "";

  if (snapshot.empty) {
    wallStatusEl.textContent = "目前還沒有留言，成為第一個留言的人吧！";
    return;
  }

  wallStatusEl.textContent = `目前共有 ${snapshot.size} 則留言`;

  let index = 0;
  snapshot.forEach((doc) => {
    const data = doc.data();

    const card = document.createElement("article");
    card.className = "note-card";

    const stickerEl = document.createElement("span");
    stickerEl.className = "note-card__sticker";
    stickerEl.setAttribute("aria-hidden", "true");
    stickerEl.textContent = STICKERS[index % STICKERS.length];

    const nameEl = document.createElement("p");
    nameEl.className = "note-card__name";
    nameEl.textContent = data.name;

    const messageEl = document.createElement("p");
    messageEl.className = "note-card__message";
    messageEl.textContent = data.message;

    const timeEl = document.createElement("p");
    timeEl.className = "note-card__time";
    timeEl.textContent = formatTime(data.createdAt);

    card.append(stickerEl, nameEl, messageEl, timeEl);
    wallEl.appendChild(card);
    index += 1;
  });
}

const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"));

onSnapshot(
  messagesQuery,
  (snapshot) => renderMessages(snapshot),
  (err) => {
    console.error(err);
    wallStatusEl.textContent = "留言載入失敗，請確認 firebaseConfig 是否已填寫正確";
  }
);

// 留言時間結束後，把留言表單換成感謝提示，不再讓人送出新留言
// （這段一定要放在檔案最後面，前面所有東西都設定好之後才執行，
//   不然會把表單元素提早清掉，導致上面留言牆的程式跟著壞掉）
if (MESSAGES_CLOSED) {
  const noteFormSection = document.querySelector(".note-form");
  if (noteFormSection) {
    noteFormSection.innerHTML = `
      <h2 class="note-form__title">留言時間已經結束 🙏</h2>
      <p class="note-form__closed-text">
        謝謝大家這段時間留下的祝福與回憶，留言蒐集已經停止了，不過上面的留言牆會繼續保留給${COLLEAGUE_NAME}慢慢回味。
      </p>
    `;
  }
}
