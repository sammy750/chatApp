const http=require("http");
const express =require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app=express();
const port= 8000;


const users=[];

app.use(cors());
app.get("/",(req,res)=>{
    res.send("HELL ITS WORKING");
})

const server=http.createServer(app);

const io=socketIO(server);

io.on("connection",(socket)=>{
    console.log("New Connection");
// Run when client connects
    socket.on('joined',({user})=>{
          users[socket.id]=user;
          console.log(`${user} has joined `);
          // Welcome current user
          socket.emit('welcome',{user:"BOT",message:`Welcome to the chat,${users[socket.id]} `})
    })
// Broadcast when a user connects
    socket.broadcast.emit('userJoined',{user:"BOT", message:` ${users[socket.id]} has joined`});
// Listen for chatMessage
    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })
// Runs when client disconnects
    socket.on('disconnect',()=>{
        
          
        console.log(`${users[socket.id]} left the chat`);
        socket.broadcast.emit('leave',{user:"BOT",message:`${users[socket.id]} has left`});
    })

});


server.listen(port,()=>{
    console.log(`Working`);
})