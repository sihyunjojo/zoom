const socket = io(); // 알아서 socket.io를 찾아서 실행시킴. 소켓 초기화
// socket의 정보에서 socket의 id를 볼 수 있다.
const welcome = document.getElementById("welcome"); // 환영 화면 요소 가져오기
const form = welcome.querySelector("form"); // 환영 화면 폼 요소 가져오기
const room = document.getElementById("room"); // 방 화면 요소 가져오기

room.hidden = true; // 처음에는 방 화면을 숨김

let roomName = room.innerHTML; // 방 이름 변수 초기화

// 메시지를 추가하는 함수
function addMessage(message) {
    const ul = room.querySelector("ul"); // 메시지 목록 요소 가져오기
    const li = document.createElement("li"); // 새로운 리스트 아이템 생성
    li.innerText = message; // 리스트 아이템에 메시지 설정
    ul.appendChild(li); // 메시지 목록에 리스트 아이템 추가
}

// 메시지 제출 핸들러
function handleMessageSubmit(event) {
    event.preventDefault(); // 기본 폼 제출 동작 막기
    const input = room.querySelector("#msg input"); // 메시지 입력 필드 가져오기
    const value = input.value; // 입력 값 가져오기 (미리 저장해두지 않으면 나중에 값이 사라짐)
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`); // 나의 메시지를 메시지 목록에 추가
    });
    input.value = ""; // 입력 필드 초기화
}

// 닉네임 제출 핸들러
function handleNickSubmit(event) {
    event.preventDefault(); // 기본 폼 제출 동작 막기
    const input = room.querySelector("#name input"); // 닉네임 입력 필드 가져오기
    const value = input.value; // 입력 값 가져오기
    socket.emit("nickname", input.value); // 닉네임을 서버로 전송
}

// 방 화면을 표시하는 함수
function showRoom() {
    welcome.hidden = true; // 환영 화면 숨김
    room.hidden = false; // 방 화면 표시
    const h3 = room.querySelector("h3"); // 방 제목 요소 가져오기
    h3.innerText = `Room ${roomName}`; // 방 제목 설정
    const msgForm = room.querySelector("#msg"); // 메시지 폼 요소 가져오기
    const nameForm = room.querySelector("#name"); // 닉네임 폼 요소 가져오기
    msgForm.addEventListener("submit", handleMessageSubmit); // 메시지 제출 이벤트 리스너 추가
    nameForm.addEventListener("submit", handleNickSubmit); // 닉네임 제출 이벤트 리스너 추가
}

// 방 제출 핸들러
function handleRoomSubmit(event) {
    event.preventDefault(); // 기본 폼 제출 동작 막기
    const input = form.querySelector("input"); // 방 이름 입력 필드 가져오기
    socket.emit("enter_room", input.value, showRoom); // 방 입장 요청을 서버로 전송하고 성공 시 showRoom 함수 실행
    roomName = input.value; // 방 이름 변수에 입력 값 설정
    input.value = ""; // 입력 필드 초기화
}

form.addEventListener("submit", handleRoomSubmit); // 폼 제출 이벤트 리스너 추가

// 새 사용자가 방에 입장했을 때
socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3"); // 방 제목 요소 가져오기
    h3.innerText = `Room ${roomName} (${newCount})`; // 방 제목 업데이트
    addMessage(`${user} arrived~~`); // 메시지 목록에 사용자 입장 메시지 추가
});

// 사용자가 방을 떠났을 때
socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector("h3"); // 방 제목 요소 가져오기
    h3.innerText = `Room ${roomName} (${newCount})`; // 방 제목 업데이트
    addMessage(`${left} left ㅠㅠ`); // 메시지 목록에 사용자 퇴장 메시지 추가
});

// 방 목록이 변경되었을 때
socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul"); // 방 목록 요소 가져오기
    if (rooms.length === 0) {
        roomList.innerHTML = ""; // 방 목록이 없으면 목록을 비움
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement("li"); // 새로운 리스트 아이템 생성
        li.innerText = room; // 리스트 아이템에 방 이름 설정
        roomList.append(li); // 방 목록에 리스트 아이템 추가
    });
});