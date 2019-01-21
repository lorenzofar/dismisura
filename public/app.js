const socket = io();

socket.on("welcome", (data) => {
    // the server should provide some data
    // store them and use them randomly to build UI

    // invoke UI builder
})

window.addEventListener("click", function (event) {
    socket.emit("click", null);
});

function buildUI(){
    // here we start adding random stuff to the website
}