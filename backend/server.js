import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import app from './src/app.js'
import dbConnect from './src/config.js/db.js'

dbConnect()

app.listen(5000,()=>{
    console.log("Server is running on port 5000")
})