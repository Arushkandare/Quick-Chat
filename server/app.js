const express = require("express");
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB } = require("./lib/db");
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require("./routes/messageRoutes");
const { Server } = require("socket.io");
const { initSocket } = require('./lib/socket');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
});

// Initialize socket handling
initSocket(io);

app.use(express.json({ limit: "4mb" }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use('/api/status', (req, res) => {
    res.send("Server is live !");
});

app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes);

(async () => {
    await connectDB();
})();

if(process.env.NODE_ENV !== "production") {
    (async () => {
        try {
            const PORT = process.env.PORT;
            server.listen(PORT, () => {
                console.log("Server is running on PORT:", PORT);
            });
        } catch (err) {
            console.error("Failed to start server:", err);
            process.exit(1);
        }
    })();
}

export default server;