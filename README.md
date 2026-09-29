# 離職同事留言牆（花園野餐版・韓文）

給同事寫留言用的網頁，留言會即時存進 Firebase，大家打開網頁就能看到全部留言，不需要重新整理。網頁一打開會先看到大頭照與問候語，接著是全體合照、兩張回憶照片，然後才是大家的留言牆與留言表單。這一版走「花園野餐」風格（森林綠＋陽光橘黃＋花朵粉，搭配🌸🦋🌻圖案），跟另一份留言牆用的配色、圖案都不一樣，方便你同時幫不同同事各架一個。

**這份說明檔（README）維持中文，方便你自己操作設定；但因為這次離職的同事是韓國人，網頁畫面上所有訪客會看到的文字（標題、問候語、留言表單、按鈕、提示訊息等）都已經改成韓文，字型也換成 Noto Sans KR／Noto Serif KR，韓文顯示會比較漂亮。程式碼裡的註解則保留中文，不影響網頁畫面。**

## 檔案說明

- `index.html`：頁面結構
- `style.css`：樣式
- `script.js`：留言送出 / 即時顯示的邏輯，**唯一需要你修改程式碼的檔案**
- `README.md`：這份說明

## 設定步驟

### 1. 改同事的名字

打開 `script.js`，最上面：

```js
const COLLEAGUE_NAME = "민지";
```

改成同事的韓文名字（韓文姓名或韓文拼音都可以，畫面上的韓文句子會自動接上這個名字），標題、副標、各區塊小標都會自動套用。

**分享到 LINE／Messenger 等軟體時顯示的預覽（標題、說明文字、縮圖）**不會跟著這裡自動變，因為那是通訊軟體直接讀取 `index.html` 裡固定的內容，不會等網頁的程式執行完才抓。打開 `index.html`，搜尋 `민지`，把裡面幾個 `<meta ...>` 標籤裡的名字換成同事的韓文名字，網址等部署好之後（見第 9 步）也記得一起換成實際網址。

### 2. 放入同事的大頭照

把你要用的照片檔案改名成 `photo.jpg`，放到跟 `index.html` 同一個資料夾裡就完成了。照片會以直式相框的樣子，用一點旋轉角度呈現在畫面左上角（有點像拍立得照片貼上去的感覺），建議挑選直式、大約半身的照片，網頁會自動裁切成合適的比例。

- 如果照片不是 `.jpg`（例如 `.png`），打開 `index.html` 搜尋 `photo.jpg`，改成你實際的檔名即可。
- 如果暫時沒有照片也沒關係，網頁會自動顯示一個可愛的預設圖示，之後有照片再放進資料夾覆蓋就好。

### 3. 放入全體合照（橫幅照片）

大頭照下方有一個長方形的橫幅區塊，適合放全體合照或活動照。把照片改名成 `team.jpg`，放進跟 `index.html` 同一個資料夾即可。

- 沒有照片時，這裡會自動顯示「放上合照吧」的可愛提示，不會顯示壞掉的圖示。
- 建議挑選較寬的橫式照片，網頁會自動裁切成合適的比例。

### 4. 放入兩張回憶照片（全體合照下方）

全體合照下方新增了一個「珍藏的畫面」區塊，並排放兩張照片，適合放同事的活動照、出遊照，或任何有紀念性的畫面。

- 把兩張照片分別改名成 `memory1.jpg`、`memory2.jpg`，放進同一個資料夾即可。
- 沒有照片時，兩邊都會自動顯示可愛的預設圖示，不影響版面。
- 想改照片下面那兩句話（預設是「那個下午的野餐時光 🧺」「一起笑到肚子痛的日子 🌸」），打開 `index.html` 搜尋 `memories__caption`，改成你想寫的文字即可。

### 5. 放入第二張個人照片（右下角）

留言表單下方、頁尾上方，有一個靠右對齊、帶點旋轉角度的小相框，適合再放一張同事的照片（例如另一個表情、另一個場合的照片），跟開頭左上角的照片頭尾呼應。

- 把照片改名成 `photo2.jpg`，放進同一個資料夾即可。
- 沒有照片時會自動顯示可愛的預設圖示，不影響版面。
- 想改照片下面那句話（預設是「帶著滿滿祝福，向下一段旅程出發 🌻」），打開 `index.html` 搜尋 `closing-photo__caption`，改成你想寫的文字即可。

### 6. 建立 Firebase 專案並取得設定金鑰

1. 到 [firebase.google.com](https://firebase.google.com)，用 Google 帳號登入，建立新專案。
2. 左側選單點「Build → Firestore Database」，按「建立資料庫」，選「以測試模式啟動」，地區選 `asia-east1`（或離你近的）。
3. 回到專案總覽頁，按「新增應用程式」選網頁（`</>` 圖示），輸入任意暱稱後註冊。
4. Firebase 會顯示一段 `firebaseConfig`，把裡面的值分別貼到 `script.js` 對應的欄位：

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

> 這組 `apiKey` 只是識別碼，公開在網頁裡是正常的，真正的存取權限是由下面的「安全規則」控制。

### 7. 本機測試

在 VS Code 安裝「Live Server」擴充套件，右鍵 `index.html` → **Open with Live Server**。試著送出一則留言，確認 Firebase 主控台的 Firestore 資料裡有出現，畫面也會即時顯示。

### 8. 加上安全規則（建議一定要做）

預設的「測試模式」是完全開放的，任何人都能改別人的留言。到 Firestore 的「規則」分頁，貼上：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{messageId} {
      allow read: if true;
      allow create: if request.resource.data.name is string
                    && request.resource.data.name.size() < 20
                    && request.resource.data.message is string
                    && request.resource.data.message.size() < 300;
      allow update, delete: if false;
    }
  }
}
```

按「發布」。這樣所有人都能讀取、新增留言，但沒有人能修改或刪除別人的留言，也限制了留言長度。

### 9. 部署上線

最簡單的方式是 GitHub Pages：

1. 把這個資料夾（含 `photo.jpg`、`team.jpg`、`memory1.jpg`、`memory2.jpg`、`photo2.jpg` 等照片）推到 GitHub 上一個新的 repository。
2. 到 repo 的 **Settings → Pages**，Source 選 `main` 分支、根目錄 `/`，儲存。
3. 等 1-2 分鐘，會拿到一個網址，例如 `https://你的帳號.github.io/repo名稱/`。

把網址分享給同事的 40-50 位同事，大家打開就能直接留言。

**不想讓網址出現自己的帳號名稱？**

用「Organization（組織）」帳號取代個人帳號建立 repository，網址就會變成 `https://組織名稱.github.io/repo名稱/`：

1. GitHub 右上角頭像 →「Your organizations」→「New organization」，方案選免費的那個。
2. 填 **Organization account name**（只能英文字母、數字、連字號，這段文字會出現在網址裡）、聯絡信箱，「This organization belongs to」選 **My personal account**，邀請成員那步可以直接跳過。
3. 進到組織頁面點「New repository」，確認 **Owner** 顯示的是組織名稱，其餘步驟（上傳檔案、開啟 Pages）跟上面一樣。

另外也可以用 [Netlify](https://app.netlify.com/drop) 拖曳整個資料夾直接部署，網址格式是 `https://自訂名稱.netlify.app`，同樣不會出現個人帳號名稱，而且不需要 GitHub 帳號。

### 10. 活動結束後，如何關閉留言功能

想留言的時間過了之後（例如當面歡送當天之後），可以把「新增留言」關閉，但留言牆本身還是會保留給同事看。要做兩步，缺一不可：

**第一步：改 `script.js`**

打開 `script.js`，找到：

```js
const MESSAGES_CLOSED = false;
```

改成：

```js
const MESSAGES_CLOSED = true;
```

存檔後，把這個檔案重新上傳覆蓋到你部署的地方（GitHub repo 或 Netlify），畫面上的留言表單就會換成「留言時間已經結束」的提示文字，其他部分（照片、留言牆）都會照常顯示。

**第二步：改 Firestore 安全性規則（真正擋住新留言的關鍵）**

只改上面那步的話，網頁畫面看起來關閉了，但如果有人知道怎麼直接呼叫 Firebase，理論上還是能繞過網頁寫入留言。要真正擋住，需要到 Firebase 主控台：

1. 打開 `https://console.firebase.google.com/project/你的專案ID/firestore/data`（把「你的專案ID」換成你實際的 `projectId`，可以直接看 `script.js` 裡 `firebaseConfig` 的 `projectId` 欄位）
2. 點「規則」分頁，把原本的 `allow create: if ...` 那幾行，改成：

```
allow create: if false;
```

也就是完整規則會變成：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{messageId} {
      allow read: if true;
      allow create: if false;
      allow update, delete: if false;
    }
  }
}
```

3. 按「發布」。

這樣一來，就算有人繞過網頁畫面，也完全無法再新增任何留言，但所有人都還是能正常讀取、瀏覽留言牆上已經有的內容。這一步隨時可以做、不需要等網頁那步也做完，兩個步驟做的順序不影響結果。

如果之後想重新開放留言（例如發現還有同事想補留言），把上面兩步都改回來（`MESSAGES_CLOSED` 改回 `false`、規則改回原本允許新增的那段）就可以了。

## 之後想調整的小地方

- 留言顯示順序：`script.js` 裡的 `orderBy("createdAt", "desc")`，改成 `"asc"` 就會變成最舊的留言在最上面。
- 留言字數上限：`index.html` 裡 textarea 的 `maxlength`，記得同時改安全規則裡的 `size() < 300`。
- 裝飾用的表情符號（🌸🦋🌻🧺🍃）都寫在 `index.html` 的 `hero__deco`／`wall__deco` 區塊和 `script.js` 的 `STICKERS`，想換成別的圖案直接改文字即可。
- 整體配色寫在 `style.css` 最上面的 `:root` 區塊（`--color-teal`、`--color-coral` 等變數），想換色系只要改這幾個色碼就好，不用動到下面其他樣式。
