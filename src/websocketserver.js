import http from "http";
import SocketIO from "socket.io";
import express from "express";
/* import WebSocket from "ws"; */

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
/* app.listen(3000, handleListen);
 */
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);
/* const wss = new WebSocket.Server({ server }); */

wsServer.on("connection", socket => {
    console.log(socket);
})

function onSocketClose() {
    console.log("Disconnected from the Browswer X");
}

const sockets = []; /* 가짜 database */




/* wss.on("connection", (socket) => {
    sockets.push(socket); sockets에 넣어줌 
    socket["nickname"] = "Anon";
    console.log("Connected to Browser");
    socket.on("close", onSocketClose);
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch (message.type) {
            case "new_message":
                sockets.forEach((aSocket) =>
                    aSocket.send(`${socket.nickname} : ${message.payload}`)
                );
            case "nickname":
                socket["nickname"] = message.payload;
        }
    });
});*/

httpServer.listen(3000, handleListen);

/* 여기에서는 express를 import 하고 express 어플리케이션을 구성하고
view engine을 pug로 설정하고 views 디렉토리가 설정되고
public파일들에 대해서도 똑같은 작업을 해주고 있다.

public 파일들은 frontend에서 구동되는 코드고 아주 중요한 부분이다.
 */


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