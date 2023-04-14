const express = require('express')
const { chats } = require("./data/data")
const dotenv = require("dotenv")
const path = require("path")
const {connectDB} = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")
const {notFound, errorHandler} = require("./middlewares/errorMiddleware");
const app = express()

app.use(express.json())

const port = process.env.PORT || 5000
dotenv.config({ path: path.resolve(__dirname, '../.env') })

connectDB(process.env.MONGO_URL)

app.get('/', (req,res)=>{
    res.send("API is running")
})

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use("/api/message", messageRoutes)

app.use(notFound)
app.use(errorHandler)



const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const io = require("socket.io")(server, {
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000"
    }
})

io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageReceived) => {
        let chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id === newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});