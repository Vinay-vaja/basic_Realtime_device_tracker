const express = require("express")
const app=express()
const ejs = require("ejs")
const path=require("path")


const http = require("http")
const soketio= require("socket.io")
const { connected } = require("process")

const server = http.createServer(app)
const io=soketio(server)

app.use(express.json())

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));


app.get("/",(req,res)=>{
    res.render("index")
})

io.on("connection", (socket) => {

   socket.on("Send-location", (data) => {
        io.emit("receive-location", {
            id: socket.id,
            latitude: data.latitude,
            longitude: data.longitude
        });
    socket.on("disconnect",(id)=>{
        io.emit("user-disconnect",socket.id);
    });
    });
});
let PORT=3000

server.listen(PORT,"0.0.0.0",()=>{
         console.log(`Your server was running on the port localhost://${PORT}`);
});