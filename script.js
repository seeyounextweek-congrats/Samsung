// ===================================================================
// 1) 幫離職同事改名字：改這裡就好，標題會自動套用
// ===================================================================
const COLLEAGUE_NAME = "민지"; // 例如 "민지"，會顯示成「민지님을 위한 롤링페이퍼」（因為同事是韓國人，網頁畫面文字都改成韓文了，這裡也請填韓文名字）

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

// 把同事的名字套進標題、副標與各區塊小標（畫面文字是韓文，因為離職同事是韓國人）
document.getElementById("page-title").textContent = `${COLLEAGUE_NAME}님을 위한 롤링페이퍼`;
document.getElementById("hero-title").textContent = `${COLLEAGUE_NAME}님을 위한 롤링페이퍼`;
document.getElementById("hero-subtitle").textContent =
  `그동안 고생 많으셨어요. 모두가 ${COLLEAGUE_NAME}님께 전하고 싶은 이야기들을 이곳에 담았습니다 — 감사와 응원, 그리고 진한 아쉬움까지, 새로운 여정을 시작하기 전에 마음 편히 받아주세요.`;
document.getElementById("wall-heading").textContent = `모두가 ${COLLEAGUE_NAME}님께 전하고 싶은 말 💌`;
document.getElementById("form-heading").textContent = `${COLLEAGUE_NAME}님께 하고 싶은 말을 남겨주세요 ✍️`;

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
    showError("이름과 메시지를 모두 입력해주세요");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "보내는 중…";

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
    showError("전송에 실패했습니다. 네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "응원 보내기 🎁";
  }
});

function formatTime(timestamp) {
  if (!timestamp) return "방금 전";
  return timestamp.toDate().toLocaleString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderMessages(snapshot) {
  wallEl.innerHTML = "";

  if (snapshot.empty) {
    wallStatusEl.textContent = "아직 메시지가 없어요. 첫 번째 메시지를 남겨보세요!";
    return;
  }

  wallStatusEl.textContent = `현재 총 ${snapshot.size}개의 메시지가 있습니다`;

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
    wallStatusEl.textContent = "메시지를 불러오지 못했습니다. firebaseConfig가 올바르게 입력되었는지 확인해주세요";
  }
);

// 留言時間結束後，把留言表單換成感謝提示，不再讓人送出新留言
// （這段一定要放在檔案最後面，前面所有東西都設定好之後才執行，
//   不然會把表單元素提早清掉，導致上面留言牆的程式跟著壞掉）
if (MESSAGES_CLOSED) {
  const noteFormSection = document.querySelector(".note-form");
  if (noteFormSection) {
    noteFormSection.innerHTML = `
      <h2 class="note-form__title">메시지 작성 시간이 종료되었습니다 🙏</h2>
      <p class="note-form__closed-text">
        그동안 남겨주신 축하와 추억에 감사드립니다. 메시지 작성은 종료되었지만, 위의 롤링페이퍼는 ${COLLEAGUE_NAME}님을 위해 계속 남아있을 거예요.
      </p>
    `;
  }
}
