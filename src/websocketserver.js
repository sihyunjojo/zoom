```javascript
import http from "http"; // http 모듈을 임포트
import SocketIO from "socket.io"; // socket.io 모듈을 임포트
import express from "express"; // express 모듈을 임포트
/* import WebSocket from "ws"; // WebSocket 모듈을 임포트 (주석 처리) */

const app = express(); // express 애플리케이션 생성

app.set("view engine", "pug"); // 뷰 엔진을 pug로 설정
app.set("views", __dirname + "/views"); // 뷰 디렉토리를 설정
app.use("/public", express.static(__dirname + "/public")); // public 디렉토리를 정적 파일 서비스로 설정
app.get("/", (_, res) => res.render("home")); // 루트 경로에 대한 요청이 들어오면 home 템플릿 렌더링
app.get("/*", (_, res) => res.redirect("/")); // 모든 다른 경로에 대한 요청은 루트 경로로 리디렉션

const handleListen = () => console.log(`Listening on http://localhost:3000`); // 서버가 시작되면 콘솔에 출력할 메시지
/* app.listen(3000, handleListen); // http 서버를 3000번 포트에서 시작 (주석 처리) */

const httpServer = http.createServer(app); // http 서버 생성
const wsServer = SocketIO(httpServer); // socket.io 서버 생성
/* const wss = new WebSocket.Server({ server }); // WebSocket 서버 생성 (주석 처리) */

// 소켓 연결 시 실행되는 함수
wsServer.on("connection", socket => {
    console.log(socket); // 소켓 객체를 콘솔에 출력
})

// 소켓이 닫힐 때 실행되는 함수
function onSocketClose() {
    console.log("Disconnected from the Browser X"); // 브라우저와의 연결이 끊겼음을 콘솔에 출력
}

const sockets = []; /* 가짜 데이터베이스 */

// WebSocket 서버의 연결 이벤트 핸들러 (주석 처리)
/* wss.on("connection", (socket) => {
    sockets.push(socket); // 소켓을 배열에 추가
    socket["nickname"] = "Anon"; // 기본 닉네임 설정
    console.log("Connected to Browser"); // 브라우저와 연결되었음을 콘솔에 출력
    socket.on("close", onSocketClose); // 소켓이 닫힐 때 이벤트 핸들러 설정
    socket.on("message", (msg) => {
        const message = JSON.parse(msg); // 메시지를 파싱
        switch (message.type) {
            case "new_message": // 새 메시지 타입일 경우
                sockets.forEach((aSocket) =>
                    aSocket.send(`${socket.nickname} : ${message.payload}`)
                ); // 모든 소켓에 메시지 전송
            case "nickname": // 닉네임 타입일 경우
                socket["nickname"] = message.payload; // 닉네임 설정
        }
    });
}); */

httpServer.listen(3000, handleListen); // http 서버를 3000번 포트에서 시작하고 handleListen 함수 실행

/* 여기에서는 express를 import 하고 express 애플리케이션을 구성하고
view engine을 pug로 설정하고 views 디렉토리를 설정하고
public 파일들에 대해서도 같은 작업을 해주고 있다.

public 파일들은 frontend에서 구동되는 코드고 아주 중요한 부분이다.
 */

/* JSON 메시지 타입 예시 */
{
    type: "message", // 메시지 타입
    payload: "hello everyone!" // 메시지 내용
}

{
    type: "nickname", // 닉네임 타입
    payload: "sihyun" // 닉네임 내용
}
/* 
json */
```