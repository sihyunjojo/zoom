const socket = io() /* 알아서 socket.io를 찾아서 실행시킴 */
    /* socket의 정보에서 socket의 id를 볼 수 있다. */
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function backendDone() {
    console.log("backend done");
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, backendDone); /* 마지막 arguement에는 반드시 보내고 싶은 함수가 와야함. */
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);