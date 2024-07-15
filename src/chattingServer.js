import http from "http"; // http 모듈을 임포트
import { Server } from "socket.io"; // socket.io 모듈에서 Server 클래스를 임포트
import { instrument } from "@socket.io/admin-ui"; // socket.io admin-ui 모듈에서 instrument 함수를 임포트
import express from "express"; // express 모듈을 임포트
import { SocketAddress } from "net"; // net 모듈에서 SocketAddress 클래스를 임포트

const app = express(); // express 애플리케이션 생성

app.set("view engine", "pug"); // 뷰 엔진을 pug로 설정
app.set("views", __dirname + "/views"); // 뷰 디렉토리를 설정
app.use("/public", express.static(__dirname + "/public")); // public 디렉토리를 정적 파일 서비스로 설정
app.get("/", (_, res) => res.render("home")); // 루트 경로에 대한 요청이 들어오면 home 템플릿 렌더링
app.get("/*", (_, res) => res.redirect("/")); // 모든 다른 경로에 대한 요청은 루트 경로로 리디렉션

const handleListen = () => console.log(`Listening on http://localhost:3000`); // 서버가 시작되면 콘솔에 출력할 메시지

const httpServer = http.createServer(app); // http 서버 생성
const wsServer = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"], // CORS 설정
        credentials: true,
    },
});
instrument(wsServer, {
    auth: false
}); // socket.io admin-ui 설정

// 공개된 방 목록을 반환하는 함수
function publicRooms() {
    const {
        sockets: {
            adapter: { sids, rooms },
        },
    } = wsServer;

    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) { // sids에 없는 키만 공개된 방으로 간주
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

// 특정 방의 사용자 수를 반환하는 함수
function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName).size;
}

// 소켓 연결 시 실행되는 함수
wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anon"; // 기본 닉네임 설정
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`); // 모든 소켓 이벤트를 콘솔에 출력
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName); // 방에 입장
        done(); // 프론트엔드에서 실행할 콜백 함수 호출
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName)); // 방에 있는 모든 사람에게 환영 메시지 전송
        wsServer.sockets.emit("room_change", publicRooms()); // 모든 클라이언트에게 방 목록 변경 알림
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room =>
            socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
        ); // 방을 떠날 때 각 방에 알림
        wsServer.sockets.emit("room_change", publicRooms()); // 모든 클라이언트에게 방 목록 변경 알림
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`); // 방에 있는 모든 사람에게 새 메시지 전송
        done(); // 프론트엔드에서 실행할 콜백 함수 호출
    });
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname)); // 닉네임 설정
});

// 소켓이 닫힐 때 실행되는 함수
function onSocketClose() {
    console.log("Disconnected from the Browser X"); // 브라우저와의 연결이 끊겼음을 콘솔에 출력
}

const sockets = []; // 소켓 배열 초기화

httpServer.listen(3000, handleListen); // http 서버를 3000번 포트에서 시작하고 handleListen 함수 실행

/* JSON 메시지 타입 예시 */
{
    type: "message",
    payload: "hello everyone!"
}

{
    type: "nickname",
    payload: "sihyun"
}