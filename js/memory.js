let cards = [];
let images = [
    "images/bear.jpeg",
    "images/bird.jpeg",
    "images/bunny.jpeg",
    "images/dog.jpeg",
    "images/kooala.jpeg",
    "images/monkey.jpeg",
    "images/bear.jpeg",
    "images/bird.jpeg",
    "images/bunny.jpeg",
    "images/dog.jpeg",
    "images/kooala.jpeg",
    "images/monkey.jpeg",
];

let card = {
    srcBack: "",
    srcFront: "",
}

let settings =
{
    theme: ["Animals", "Cakes"],
    board: [{ "Easy": { rows: 3, columns: 4 } }, { "Medium": { rows: 6, columns: 3 } }, { "Hard": { rows: 8, columns: 3 } }],
    wrongGuess: 0,
    rightGuess: 0,
}

function createCard(imageUrl) {
    let card = document.createElement("div");
    card.classList.add("flipCard");
    card.innerHTML =
        `<div class="flipCardInner">
                <div class="flipCardFront"></div>
                <div class="flipCardBack"></div>
              </div>`;

    card.querySelector(".flipCardInner").setAttribute("id", imageUrl);

    let back = card.querySelector(".flipCardBack");
    let front = card.querySelector(".flipCardFront");

    back.setAttribute("style", `background-image: url('${imageUrl}') ;background-repeat: no-repeat;background-position: center;background-size: cover;`);
    front.setAttribute("style", `background-image: url('images/cardFront.png')`);

    return card;
}

function placeCards(images, cards) {
    let count = 0;

    let flexContainer = document.querySelector(".flexContainer"); //container->div class=cell->imgSrc

    for (let i = 0; i < images.length; i++) {

        const card = createCard(images[i]);

        flexContainer.appendChild(card);


        card.querySelector(".flipCardInner")
            .addEventListener("click", clickCard);

        cards[i] =
        {
            srcBack: images[i],
            srcFront: "images/cardFront.png"
        };
    }
}

let compareCardsArr = [];

function clickCard() {
    //kind of remove event listener from rest||existing not to flip
    if (compareCardsArr.length === 2 || compareCardsArr.find(card => card === this))
        return;

    flipCard(this);

    compareCardsArr.push(this);

    if (compareCardsArr.length === 2)
        setTimeout(compareCards, 1000);
}

function flipCard(card) {
    if (!card.classList.contains('on')) {
        card.classList.remove('off');
        card.classList.add('on');
    }
    else {
        card.classList.remove('on');
        card.classList.add('off');
    }
}

function compareCards() {
    if (areCardsIdentical(compareCardsArr)) {
        compareCardsArr[0].removeEventListener("click", clickCard);
        compareCardsArr[1].removeEventListener("click", clickCard);
        setRightGuess();
    }
    else {
        setWrongGuess();

        flipCard(compareCardsArr[0]);
        flipCard(compareCardsArr[1]);
    }

    compareCardsArr = [];
}

//Fisher-Yates
function randomizeImages(images) {

    let currentIndex = images.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        savePlayertoBoardScore    //   // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = images[currentIndex];
      images[currentIndex] = images[randomIndex];
      images[randomIndex] = temporaryValue;
    }

    return images;
    //testing
//     return [
//         "images/bear.jpeg",
//         "images/bird.jpeg",
//         "images/bunny.jpeg",
//         "images/dog.jpeg",
//         "images/kooala.jpeg",
//         "images/monkey.jpeg",
//         "images/bear.jpeg",
//         "images/bird.jpeg",
//         "images/bunny.jpeg",
//         "images/dog.jpeg",
//         "images/kooala.jpeg",
//         "images/monkey.jpeg",
//     ];
}

placeCards(randomizeImages(images), cards = cards);

function areCardsIdentical(cards) {

    const firstCardId = cards[0].getAttribute("id");
    const secondCardId = cards[1].getAttribute("id");

    return firstCardId === secondCardId;
}


let wrongGuess = 0;
let rightGuess = 0;

function setWrongGuess() {
    let wrongGuessHtml = document.querySelector(".wrongGuess");
    wrongGuess += 1;
    wrongGuessHtml.textContent = wrongGuess.toString();
}
function setRightGuess() {
    rightGuess += 2;
    if (rightGuess >= cards.length) {
        showWinnerOverlay();
    }
}


document.addEventListener('DOMContentLoaded', initTimer, false); // window.onload=initTimer;

let minutes = 0;
let seconds = 0;
let milliseconds = 0;

function initTimer() {
    showTimer();
    updateTimer();
}

function showTimer() {
    document.querySelector(".clock").innerHTML =
        (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") +
        ":" +
        (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00") +
        ":" +
        (milliseconds > 9 ? milliseconds : "0" + milliseconds);
}

function updateTimer() {
    milliseconds++;
    if (milliseconds >= 100) {
        milliseconds = 0;
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
        }
    }

    showTimer();
    setTime();
}

let toStopTimeOut = null;

function setTime() {
    toStopTimeOut = setTimeout(updateTimer, 10);
}

let startNewGameBtn = document.querySelector(".startNewGame");
startNewGameBtn.addEventListener("click", createNewGame);

let wonStartNewGameBtn = document.querySelector(".wonStartNewGame");
wonStartNewGameBtn.addEventListener("click", removeOverlay);

function createNewGame() {
    let main = document.querySelector("main");
    main.querySelector(".flexContainer").innerHTML = "";
    doStop();
    let wrongGuessHtml = document.querySelector(".wrongGuess");
    wrongGuessHtml.textContent = 0;
    cards = [];
    wrongGuess = 0;
    rightGuess = 0;
    minutes = 0;
    seconds = 0;
    milliseconds = 0;
    initTimer();
    placeCards(randomizeImages(images), cards = cards);
}

function doStop()//it will stop after win flag=1 or click on startNewGame btn 
{
    clearTimeout(toStopTimeOut);
}

let time = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") +
    ":" +
    (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00") +
    ":" +
    (milliseconds > 9 ? milliseconds : "0" + milliseconds);

function showWinnerOverlay() {
    doStop();
    document.getElementById("overlay").setAttribute("style", "display:block");
}


function removeOverlay()//click on start new game
{
    let input = document.querySelector('input[type="text"]');
    let buttonAddToBoardScore = document.querySelector(".addToBoardScoreBtn");
    // input.setAttribute("style", "display:none");
    // buttonAddToBoardScore.setAttribute("style", "display:none");

    document.getElementById("overlay").setAttribute("style", "display:none");
    createNewGame();
}

let board = [];
let playerName = "";

function savePlayertoBoardScore(event) {

    playerName = document.querySelector("input").value;
    let playerWrongGuess = wrongGuess;
    let playerDate = new Date().toLocaleString("en-US");
    board.push({ index: board.length, playerName: playerName, playerWrongGuess: playerWrongGuess, playerDate: playerDate });

    localStorage.setItem("boardRef", JSON.stringify(board));
    
    let input = document.querySelector('input[type="text"]');
    let buttonAddToBoardScore = document.querySelector(".addToBoardScoreBtn");
    input.setAttribute("style", "display:none");
    input.value="";
    buttonAddToBoardScore.setAttribute("style", "display:none");
    showBoardScore();
}

function showBoardScore() {
    let input = document.querySelector('input[type="text"]');
    let buttonAddToBoardScore = document.querySelector(".addToBoardScoreBtn");
    input.setAttribute("style", "display:block");
    buttonAddToBoardScore.setAttribute("style", "display:block");

    function compare(a, b) {
        return a.playerWrongGuess - b.playerWrongGuess;
    }
    const ref = localStorage.getItem("boardRef");
    if (ref) {
        board = JSON.parse(ref);


        board.sort(compare);

        if (board.length >= 0) {
            let p = document.querySelector("p");
            p.style.display = "block";
            let boardTable = document.querySelector(".boardScore table");
            let tableBody = boardTable.getElementsByTagName('tbody')[0];
            tableBody.innerHTML = "";

            for (let i = 0; i < Math.min(board.length, 3); i++){
                let tr = document.createElement('tr');
                let td1 = document.createElement('td');
                let td2 = document.createElement('td');
                let td3 = document.createElement('td');
                let td4 = document.createElement('td');

                let text1 = document.createTextNode(`${i + 1}`);
                let text2 = document.createTextNode(`${board[i].playerDate}`);
                let text3 = document.createTextNode(`${board[i].playerName}`);
                let text4 = document.createTextNode(`${board[i].playerWrongGuess}`);

                td1.appendChild(text1);
                td2.appendChild(text2);
                td3.appendChild(text3);
                td4.appendChild(text4);
                
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                
                tableBody.appendChild(tr);
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ref = localStorage.getItem("boardRef");
    if (ref) {
        board = JSON.parse(ref);
        // showBoardScore(board)
    }
})
