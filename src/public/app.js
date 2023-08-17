const socket = io();

const h2 = document.querySelector("h2");
const rooms = document.querySelector("#rooms");
const room = document.querySelector("#room");
const chat = document.querySelector("#chat")
const nickName = document.querySelector("#nickName");
const msg = document.querySelector("#msg");

rooms.hidden = true;
room.hidden = true;
chat.hidden = true;
msg.hidden = true;

let roomName;

nickName.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const input = nickName.querySelector("#nickName input");
    socket.emit("change_name", input.value, roomName);
    rooms.hidden = false;
    room.hidden = false;
    h2.innerText = "What room name do you wanna join?";
});

function addMessage(msg) {
    const li = document.createElement("li");
    li.innerText = msg;
    chat.append(li);
}

room.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const input = room.querySelector("#room input");
    roomName = input.value
    socket.emit("enter_room", roomName, () => {
        h2.innerText = `Say hello in ${roomName}`;
        chat.innerHTML = "";
        chat.hidden = false;
        msg.hidden = false;
    });
});

msg.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const input = msg.querySelector("#msg input");
    const value = input.value
    socket.emit("new_message", value, roomName, () => {
        addMessage(`You: ${value}`)
    });
    input.value = "";
    h2.hidden = true;
});

socket.on("notify_join", (nickname) => {
    addMessage(`${nickname} joined.`);
});

socket.on("notify_leave", (nickname) => {
    addMessage(`${nickname} left.`);
});

socket.on("new_message", addMessage);

socket.on("change_name", (msg) => {
    addMessage(msg);
});

socket.on("update_rooms", (publicRooms) => {
    rooms.innerHTML = "";
    publicRooms.forEach((publicRoom) => {
        const li = document.createElement("li");
        li.innerText = publicRoom;
        rooms.append(li);
    });
});