import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import app from "./src/app.js";
import dotenv from "dotenv";
import dbConnect from "./src/config.js/db.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

dbConnect()

app.get("/", (req, res) => {
  res.json({ message: "TransitOps API is running 🚛" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
