// socket.js - Socket manager to avoid circular dependencies
let io = null;
const userSocketMap = {}; // { userId: socketId }

const initSocket = (socketInstance) => {
    io = socketInstance;
    
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        console.log("User connected", userId);
        
        if(userId) userSocketMap[userId] = socket.id;

        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        socket.on("disconnect", () => {
            console.log("User disconnected", userId);
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    });
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

const getUserSocketMap = () => userSocketMap;

module.exports = { 
    initSocket, 
    getIO, 
    getUserSocketMap 
};