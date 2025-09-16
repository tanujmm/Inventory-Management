# 📦 Stock Management Dashboard

A simple **Stock Management Dashboard** built using **HTML, CSS, JavaScript (jQuery)** and **JSONPowerDB (JPDB)** for database operations.

This project demonstrates a lightweight inventory management system where you can:

* Add new items
* Update stock quantities
* Issue items (decrease stock)
* Generate item reports for a given range of Item IDs

---

## ✨ Features

* 📋 **Dashboard Layout**

  * Common header & footer
  * Left-side navigation menu
  * Main content area that dynamically loads pages

* ➕ **Add Item**

  * Add new inventory items with **Item ID, Item Name, and Opening Stock**

* ♻️ **Update Stock**

  * Update stock levels of existing items

* 📤 **Issue Item**

  * Issue items and automatically deduct stock

* 📑 **Item Report**

  * Generate reports for a range of Item IDs
  * Displays **Item ID, Item Name, and Current Stock** in tabular format

---

## 🛠️ Tech Stack

* **Frontend:** HTML, CSS, JavaScript, jQuery
* **Database:** JSONPowerDB (JPDB)
* **Server (Proxy for CORS):** Node.js + Express

---

## ⚙️ Setup & Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-username/stock-management-dashboard.git
cd stock-management-dashboard
```

### 2. Install Dependencies (for proxy server)

```bash
npm install express node-fetch
```

### 3. Start Proxy Server

Create `server.js` (if not already) and run:

```bash
node server.js
```

Server will run on:

```
http://127.0.0.1:3000
```

### 4. Run Frontend

* Open `dashboard.html` in browser (use VS Code Live Server or any local server).
* Dashboard will connect to JPDB via the proxy.

---

## 🔑 JPDB Configuration

Update these values inside `dashboard.html`:

```js
const connToken = "your-jpdb-token";
const dbName = "INVENTORYdb";
const relName = "ITEMSDATA";
const apiUrl = "http://127.0.0.1:3000/jpdb"; // Proxy server URL
```

---

