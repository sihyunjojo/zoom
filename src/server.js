import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket.on("enter_room", (roomName, done) => {
        console.log(roomName);
        setTimeout(() => {
            done();
            /* backend에서 실행시키는 것이 아니라 done 함수를 실행시키면 front에서 함수를 실행시킴 
                       front에서 실행 버튼을 눌러주면 front에 있는 이 함수를 backend가 실행시킨다. */
        }, 15000);
    });
});

function onSocketClose() {
    console.log("Disconnected from the Browswer X");
}

const sockets = [];


httpServer.listen(3000, handleListen);



{
    type: "message"
    payload: "hello everyone!"
}

{
    type: "nickname"
    payload: "sihyun"
}
/* 
json */