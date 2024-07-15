import http from "http"; // http 모듈을 임포트
import SocketIO from "socket.io"; // socket.io 모듈을 임포트
import express from "express"; // express 모듈을 임포트

const app = express(); // express 애플리케이션 생성

app.set("view engine", "pug"); // 뷰 엔진을 pug로 설정
app.set("views", __dirname + "/views"); // 뷰 디렉토리를 설정
app.use("/public", express.static(__dirname + "/public")); // public 디렉토리를 정적 파일 서비스로 설정
app.get("/", (_, res) => res.render("home")); // 루트 경로에 대한 요청이 들어오면 home 템플릿 렌더링
app.get("/*", (_, res) => res.redirect("/")); // 모든 다른 경로에 대한 요청은 루트 경로로 리디렉션

const httpServer = http.createServer(app); // http 서버 생성
const wsServer = SocketIO(httpServer); // socket.io 서버 생성

// 소켓 연결 시 실행되는 함수
wsServer.on("connection", (socket) => {
    // 방에 참여할 때 실행되는 이벤트 핸들러
    socket.on("join_room", (roomName) => {
        socket.join(roomName); // 방에 참여
        socket.to(roomName).emit("welcome"); // 방에 있는 다른 사용자에게 환영 메시지 전송
    });
    // 오퍼(초대장)를 보낼 때 실행되는 이벤트 핸들러
    socket.on("offer", (offer, roomName) => {
        socket.to(roomName).emit("offer", offer); // 방에 있는 다른 사용자에게 오퍼 전송
    });
    // 응답을 보낼 때 실행되는 이벤트 핸들러
    socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit("answer", answer); // 방에 있는 다른 사용자에게 응답 전송
    });
    // ICE 후보자를 보낼 때 실행되는 이벤트 핸들러
    socket.on("ice", (ice, roomName) => {
        socket.to(roomName).emit("ice", ice); // 방에 있는 다른 사용자에게 ICE 후보자 전송
    });
});

// 서버가 시작되면 콘솔에 출력할 메시지
const handleListen = () => console.log(`Listening on http://localhost:3000`);

// 3000번 포트에서 서버 실행
httpServer.listen(3000, handleListen);
