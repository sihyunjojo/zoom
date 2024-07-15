```javascript
const messageList = document.querySelector("ul"); // 메시지 목록 요소 가져오기
const nickForm = document.querySelector("#nick"); // 닉네임 폼 요소 가져오기
const messageForm = document.querySelector("#message"); // 메시지 폼 요소 가져오기
const socket = new WebSocket(`ws://${window.location.host}`); // 현재 호스트를 기반으로 WebSocket 연결 생성

// 메시지 객체를 생성하는 함수
function makeMessage(type, payload) {
    const msg = { type, payload }; // 메시지 타입과 페이로드 설정
    return JSON.stringify(msg); // JSON 문자열로 변환하여 반환
}

// 서버와 연결되었을 때 실행되는 함수
function handleOpen() {
    console.log("Connected to Server"); // 서버에 연결되었음을 콘솔에 출력
}
socket.addEventListener("open", handleOpen); // 연결이 되면 handleOpen 함수 실행

// 서버로부터 메시지를 받을 때 실행되는 함수
socket.addEventListener("message", (message) => {
    const li = document.createElement("li"); // 새로운 리스트 아이템 생성
    li.innerText = message.data.toString('utf8'); // 수신한 메시지를 텍스트로 설정
    messageList.append(li); // 메시지 목록에 리스트 아이템 추가
});

// 서버와의 연결이 끊겼을 때 실행되는 함수
socket.addEventListener("close", () => {
    console.log("Disconnected from Server X"); // 서버와의 연결이 끊겼음을 콘솔에 출력
});

// 메시지 폼 제출 핸들러
function handleSubmit(event) {
    event.preventDefault(); // 기본 폼 제출 동작 막기
    const input = messageForm.querySelector("input"); // 메시지 입력 필드 가져오기
    socket.send(makeMessage("new_message", input.value)); // 서버로 새 메시지 전송
    const li = document.createElement("li"); // 새로운 리스트 아이템 생성
    li.innerText = `You: ${input.value}`; // 리스트 아이템에 나의 메시지 설정
    messageList.append(li); // 메시지 목록에 리스트 아이템 추가
    input.value = ""; // 입력 필드 초기화
}

// 닉네임 폼 제출 핸들러
function handleNickSubmit(event) {
    event.preventDefault(); // 기본 폼 제출 동작 막기
    const input = nickForm.querySelector("input"); // 닉네임 입력 필드 가져오기
    socket.send(makeMessage("nickname", input.value)); // 서버로 닉네임 전송
    input.value = ""; // 입력 필드 초기화
}

// 메시지 폼 제출 이벤트 리스너 추가
messageForm.addEventListener("submit", handleSubmit);

// 닉네임 폼 제출 이벤트 리스너 추가
nickForm.addEventListener("submit", handleNickSubmit);
```