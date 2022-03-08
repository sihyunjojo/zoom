const socket = io() /* 알아서 socket.io를 찾아서 실행시킴 */
    /* socket의 정보에서 socket의 id를 볼 수 있다. */
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName = room.innerHTML;

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom); /* 마지막 arguement에는 반드시 보내고 싶은 함수가 와야함. */
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);