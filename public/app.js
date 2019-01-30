const socket = io();

const randomContent = [];
const TIME_LB = 750;
const TIME_UP = 2500;

const MAIN_CONTENT_WAIT = 2000;

const ALIGNMENTS = ["left", "center", "right"];
const FONTSIZES = ["1.5vh", "2vh", "2.5vh", "3vh", "3.5vh", "1vw", "2vw", "3vw"];

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
randomContent.push(["<div> su questa pagina sono stati trascorsi <span id='spent-time-counter'/> secondi </div>",
    () => {
        updateElementValue("spent-time-counter", totalTime);
    }
]);

/* SOCKET LISTENERS */
socket.on("click", (data) => {
    updateElementValue("daily-clicks-counter", data.dailyClicks);
});

socket.on("userconnected", (connectedUsers) => {
    connectedCount = connectedUsers;
    updateElementValue("connected-users-counter", connectedCount);
});

socket.on("time", (time) => {
    updateElementValue("spent-time-counter", time);
})

/* EVENT LISTENERS */
window.addEventListener("click", function (event) {
    socket.emit("click", null);
});
window.addEventListener("pointermove", function (event) {
    calculateDistance(event.movementX, event.movementY);
});
window.addEventListener("wheel", handleScroll);

function calculateDistance(deltax, deltay) {
    mouseDistance += Math.sqrt(Math.pow(deltax, 2) + Math.pow(deltay, 2));
    updateElementValue("distance-counter", Math.round(mouseDistance));
}

var previousAlign;
var previousSize;

function buildUI(firstStart) {
    let index = firstStart ? 0 : Math.floor(Math.random() * (randomContent.length - 1));
    let element = randomContent[index];
    let alignment;
    let fontSize
    // pick a random alignment and font size
    do {
        alignment = ALIGNMENTS[Math.floor(Math.random() * (ALIGNMENTS.length - 1))];
    } while (alignment == previousAlign);
    do {
        fontSize = FONTSIZES[Math.floor(Math.random() * (FONTSIZES.length - 1))];
    } while (fontSize == previousSize);
    previousAlign = alignment;
    previousSize = fontSize;

    // increase entropy
    ALIGNMENTS.reverse();
    FONTSIZES.reverse();

    $(element[0]).hide().appendTo("#random-container").fadeIn("slow")
        .css({ "text-align": alignment, "font-size": fontSize });;
    if (element[1]) element[1]();
    let newTime = Math.random() * (TIME_UP, TIME_LB) + TIME_LB;
    randomContent.splice(index, 1);
    if (randomContent.length) setTimeout(buildUI, newTime);
}

function handleScroll(e) {
    if (randomContent.length) return;

    if (e.deltaY > 0 && $("#main-container").is(":hidden")) {
        $("#random-container").hide();
        $("#main-container").fadeIn("fast");
    }
    else if (e.deltaY < 0 && $("#random-container").is(":hidden")) {
        $("#main-container").hide();
        $("#random-container").fadeIn("slow");
    }
}

/* DOM elements manager */
function updateElementValue(elementId, value) {
    let e = document.getElementById(elementId);
    if (!e) return false;
    e.innerHTML = value;
    return true;
}

window.onload = () => {
    setTimeout(buildUI.bind(this, true), Math.random() * (TIME_UP - TIME_LB) + TIME_LB);
};