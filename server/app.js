import  express  from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt  from "jsonwebtoken";
import cookieParser from "cookie-parser";

const port  = 3000;
const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin : "*",
        methods : ["GET","POST"],
        credentials : true

    }
});
app.use(cors());
const user = false;
const secretKeyJWT = "ankurisamystery"
io.use((socket,next)=>{
    cookieParser()(socket.request,socket.request.res,(err)=>{
        if(err)return next(err);

        const token = socket.request.cookies.token;
        if(!token)return next (new Error ("Authentication error"));

        const decoded = jwt.verify(token,secretKeyJWT);

        if(!decoded)return next (new Error ("Authentication error"));
        next();

    })
    if(user) next();
})
app.get('/', (req, res) => {
    res.send("Hello world!");
});

app.get('/login', (req, res) => {
    // res.send("Hello world!");
    const token = jwt.sign({_id :"adsfbgnhsadsf"  },secretKeyJWT);

    res.cookie("token",token, {httpOnly:true , secure:true ,sameSite:"none"})
    .json({
        message:"Login Success",
    })
})
io.on("connection",(socket)=>{


    console.log("User connected",socket.id);
    // console.log("Id",);
    // socket.emit("welcome","welcome to the server");
    // socket.broadcast.emit("welcome",`${socket.id} joined the server`); 
    socket.on("message",({room , message})=>{
        console.log({room,message});
        // socket.broadcast.emit("recieve-message",data);
        io.to(room).emit("recieve-message",message);

    }) 
    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id);
    })
    socket.on("join-room",(room)=>{
        socket.join(room);
        console.log(`User joined the room: ${room}`);
    })
 
});

server.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});