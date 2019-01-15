const socket = io();

window.addEventListener("click", function (event) {
    socket.emit("click", null);
});