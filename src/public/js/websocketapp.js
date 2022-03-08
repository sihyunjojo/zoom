const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
}

function handleOpen() {
    console.log("Connected to Server");
}
socket.addEventListener("open", handleOpen); /* 연결이 되면 끊기 전까지 계속 연결 되어 있음 */

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data.toString('utf8');
    messageList.append(li);
});

socket.addEventListener("close", () => {
    console.log("DisConnected from Server X");
});





function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    const li = document.createElement("li");
    li.innerText = `You: ${input.value}`;
    messageList.append(li);
    input.value = ""; /* input을 비워줘야지 다음 값을 입력하기 들어가기 편함. */
}

function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);