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
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName); //방이 있어야함.  방만듬
        done();
        /* backend에서 실행시키는 것이 아니라 done 함수를 실행시키면 front에서 함수를 실행시킴 
         front에서 실행 버튼을 눌러주면 front에 있는 이 함수를 backend가 실행시킨다. */
        socket.to(roomName).emit("welcome", socket.nickname);
        //welcome이라는 이벤트를 roomname에 있는 모든 사람들에게 emit를 한것이다.

    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room =>
            socket.to(room).emit("bye", socket.nickname)
        );
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done(); //이 코드는 백앤드에서 실행되지 않는다 프론트에서 코드를 실행된다.
    });
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
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