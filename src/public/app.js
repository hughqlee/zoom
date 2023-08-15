const messageList = document.querySelector("ul");
const socket = new WebSocket(`ws://${window.location.host}`);
socket.addEventListener("message", (msg) => {
    const li = document.createElement("li");
    li.innerText = msg.data;
    messageList.append(li);
});

const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.querySelector("#name");
    const msg = document.querySelector("#msg");
    const nameValue = name.value;
    const msgValue = msg.value;
    socket.send(JSON.stringify({nameValue, msgValue}));
    msg.value = '';
});