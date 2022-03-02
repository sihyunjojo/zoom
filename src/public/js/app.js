const socket = new WebSocket(`ws://${window.location.host}`);

function handleOpen() {
    console.log("Connected to Server");
}
socket.addEventListener("open", handleOpen); /* 연결이 되면 끊기 전까지 계속 연결 되어 있음 */

socket.addEventListener("message", (message) => {
    console.log("New message:", message.data) /*  message>data를 통해서 front에서 받은 message를 back에서 사용할 수 있다. */
});

socket.addEventListener("close", () => {
    console.log("DisConnected from Server X");
});

setTimeout(() => {
    socket.send("hello from the browsers")
}, 1000)