const socket = io();

const randomContent = [];
const TIME_LB = 750;
const TIME_UP = 2500;

var mouseDistance = 0;
var connectedCount = 0;

/* JACK'S GIBBERISH */
randomContent.push(["<div>ciao, io sono Jack</div>", null]);

/* DATA */
randomContent.push(["<div>hai percorso <span id='distance-counter'/> pixel</div>",
    () => {
        updateElementValue("distance-counter", Math.round(mouseDistance));
    }
]);
randomContent.push(["<div>oggi sono stati fatti <span id='daily-clicks-counter'/> click </div>",
    () => {
        updateElementValue("daily-clicks-counter", dailyClicks);
    }
]);
randomContent.push(["<div> ora ci sono <span id='connected-users-counter'/> persone connesse </div>",
    () => {
        updateElementValue("connected-users-counter", connectedCount);
    }
]);


/* SOCKET LISTENERS */
socket.on("click", (data) => {
    updateElementValue("daily-clicks-counter", data.dailyClicks);
});

socket.on("userconnected", (connectedUsers) => {
    connectedCount = connectedUsers;
    updateElementValue("connected-users-counter", connectedCount);
})

/* EVENT LISTENERS */
window.addEventListener("click", function (event) {
    socket.emit("click", null);
});
window.addEventListener("pointermove", function (event) {
    calculateDistance(event.movementX, event.movementY);
})

function calculateDistance(deltax, deltay) {
    mouseDistance += Math.sqrt(Math.pow(deltax, 2) + Math.pow(deltay, 2));
    updateElementValue("distance-counter", Math.round(mouseDistance));
}

function buildUI() {
    let index = Math.floor(Math.random() * (randomContent.length - 1));
    let element = randomContent[index];
    $(element[0]).hide().appendTo("#random-container").fadeIn("slow");
    if (element[1]) element[1]();
    let newTime = Math.random() * (TIME_UP, TIME_LB) + TIME_LB;
    randomContent.splice(index, 1);
    if (randomContent.length) setTimeout(buildUI, newTime);
    else; // show main content
}

/* DOM elements manager */
function updateElementValue(elementId, value) {
    let e = document.getElementById(elementId);
    if (!e) return false;
    e.innerHTML = value;
    return true;
}

window.onload = () => {
    setTimeout(buildUI, Math.random() * (TIME_UP - TIME_LB) + TIME_LB);
};