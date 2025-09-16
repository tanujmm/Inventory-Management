// server.js
// import express from "express";
// import fetch from "node-fetch"; // if using Node <18, install with: npm install node-fetch
const express = require("express");
// const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
// Proxy endpoint to forward requests to JPDB
app.post("/jpdb", async (req, res) => {
  try {
    const response = await fetch("http://api.login2explore.com:5577/api/irl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy error", details: err.toString() });
  }
});

app.listen(3000, () => {
  console.log("✅ Proxy running on http://127.0.0.1:3000");
});
