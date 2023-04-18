Chat Service
===

使用 etcd 作為儲存控制的聊天服務實作。

安裝
--
* 安裝 etcd 並加入到 PATH，確保可直接在命令列執行 `etcd`
* 安裝 Node.js 與 Yarn
* 執行 `yarn` 安裝套件

啟動
---
* 在至少三台機器上執行 `node server.js` 啟動，或通過設定環境變數 `PORT=<web port>` 啟動多個網站
  * 例如分別執行 `PORT=3000 node server.js`、`PORT=3001 node server.js`、`PORT=3002 node server.js`
* 開啟網頁 `/admin`（如：`http://127.0.0.1:3000/admin`）
* 找到 `Spawn Server` 段落，依據需要輸入，並點擊 Spawn 按鈕啟動 ETCD，單機器三節點參考輸入如下
  - 節點 1（`http://127.0.0.1:3000/admin`）
    * Name: server1
    * Peer URL: http://127.0.0.1:2380
    * Client URL: http://127.0.0.1:2379
    * Cluster: server1=http://127.0.0.1:2380,server2=http://127.0.0.1:2381,server3=http://127.0.0.1:2382
    * State: **new**
  - 節點 2（`http://127.0.0.1:3001/admin`）
    * Name: server2
    * Peer URL: http://127.0.0.1:2381
    * Client URL: http://127.0.0.1:2378
    * Cluster: server1=http://127.0.0.1:2380,server2=http://127.0.0.1:2381,server3=http://127.0.0.1:2382
    * State: **new**
  - 節點 3（`http://127.0.0.1:3002/admin`）
    * Name: server3
    * Peer URL: http://127.0.0.1:2382
    * Client URL: http://127.0.0.1:2377
    * Cluster: server1=http://127.0.0.1:2380,server2=http://127.0.0.1:2381,server3=http://127.0.0.1:2382
    * State: **new**
* 開啟網頁 `/` 即可正常聊天

新增機器
---
* 啟動新的網站後，先於任意原有網站開啟 `/admin`，找到 `Cluster Add` 段落
* 填寫新的機器預計使用的 Peer URL 後點擊 `Add`，如 `http://127.00.1:2383`
* 於新的機器上，進入 `/admin` 並找到 `Spawn Server` 後，依據需要輸入，如
  * Name: server4
  * Peer URL: http://127.0.0.1:2383
  * Client URL: http://127.0.0.1:2376
  * Cluster: server1=http://127.0.0.1:2380,server2=http://127.0.0.1:2381,server3=http://127.0.0.1:2382,server4=http://127.0.0.1:2383
  * State: **existing**
* 於新的機器上，進入 `/` 後可看見原有網站的聊天紀錄

暫時移除機器並重新加入
---
* 於任意原有網站開啟 `/admin`，找到 `Stop Server` 段落
* 點擊 `Stop` 後便會停用該機器上的 etcd，同時該機器的聊天服務也會失效，但不影響其他機器
* 使用原有參數重新 Spawn Server 便會恢復運作

永久移除機器
---
* 於非目標機器的網站開啟 `/admin`，透過 `Cluster Status` 找到目標機器
* 於 `Cluster Delete` 段落中，填入目標機器的 `Member ID` 並送出
* 該台機器將自 Cluster 移除，並且需要依據新增機器的方法重新加入