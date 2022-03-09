const messages = document.getElementById("messages");
const participants = document.getElementById("participants");
const createRoom = document.getElementById("create-room");
const inputRoomId = document.getElementById("input-room-id");
const userName = document.getElementById("user-name");
const joinRoom = document.getElementById("join-room");
const h1RoomId = document.getElementById("room-id");
const form = document.getElementById("form");
const socket = io();
let ROOM_ID;
socket.on("new-participant", (userName, roomId) => {
  ROOM_ID = roomId;
  const p = document.createElement("p");
  p.textContent = userName;
  participants.append(p);
});

joinRoom.addEventListener("click", () => {
  socket.emit("join-room", inputRoomId.value, userName.value ?? "Anonimo");
});

createRoom.addEventListener("click", () => {
  socket.emit("create-room");
  socket.on("new-room", (roomId) => {
    h1RoomId.textContent = `Room Id: ${roomId}`;
    ROOM_ID = roomId;
  });
});
console.log(messages);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const { value } = form.message;
  console.log(value);
  if (value) {
    socket.emit("chat message", value, ROOM_ID);
    form.message.value = "";
  }
});

socket.on("chat message", (msg) => {
  const p = document.createElement("p");
  p.textContent = msg;
  messages.append(p);
  window.scrollTo(0, document.body.scrollHeight);
});
