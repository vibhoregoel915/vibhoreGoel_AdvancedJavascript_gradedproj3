let errors;
let time;
let accuracy;
let wpm;
let cpm;
let text;
let appStarted;

let statArray = [
    {
        heading: "Errors",
        stat: errors
    },
    {
        heading: "Timer",
        stat: time
    },
    {
        heading: "Accuracy",
        stat: accuracy
    }
]

let finalStatArray = [
    {
        heading: "Errors",
        stat: errors
    },
    {
        heading: "Timer",
        stat: time
    },
    {
        heading: "Accuracy",
        stat: accuracy
    },
    {
        heading: "WPM",
        stat: wpm
    },
    {
        heading: "CPM",
        stat: cpm
    }
]

let assignValues = () => {
    statArray[0].stat = errors;
    statArray[1].stat = time;
    statArray[2].stat = accuracy;
    finalStatArray[0].stat = errors;
    finalStatArray[1].stat = time;
    finalStatArray[2].stat = accuracy;
    finalStatArray[3].stat = wpm;
    finalStatArray[4].stat = cpm;
}

let setInitialState = () => {
    errors = 0;
    time = 60;
    accuracy = 100;
    wpm = 1;
    cpm = 0;
    text = "Click to start typing!";
    appStarted = false;
    assignValues();
    renderStats(statArray);
    document.getElementById("restart").innerHTML = "";
    document.getElementById("sampleText").innerText = text;
    document.getElementById("inputText").value = "";
}

setInitialState();

function renderStats(statArray) {
    let returnStatElement = (element) => {
        let statElement = document.createElement("div");
        statElement.classList.add("stats");

        statElement.appendChild(document.createElement("div"));
        statElement.appendChild(document.createElement("div"));
        statElement.setAttribute("id", element.heading);
        statElement.firstChild.innerText = element.heading;
        statElement.lastChild.innerText = element.stat;

        return statElement;
    }

    let statContainer = document.getElementById("statistics");
    statContainer.innerHTML = "";
    statArray.map(item => {
        statContainer.appendChild(returnStatElement(item));
    });
}

let myTimer = () => {
    let Timer = document.getElementById("Timer");
    Timer.lastChild.innerText = `${--time} s`;
}

function startApp(event) {
    if (!appStarted) {
        appStarted = true;

        text = "They rushed out the door, grabbing anything and everything they could think of they might need. There was no time to double-check to make sure they weren't leaving something important behind. Everything was thrown into the car and they sped off. Thirty minutes later they were safe and that was when it dawned on them that they had forgotten the most important thing of all."
        event.target.innerHTML = "";
        let textSpan = document.createElement("span");
        textSpan.textContent = text;
        event.target.appendChild(textSpan);
        event.target.classList.remove("text");
        event.target.classList.add("textToType");

        const myInterval = setInterval(myTimer, 1000);

        let input = document.getElementById("inputText");
        input.setAttribute("placeholder", "Start typing here...");
        input.addEventListener("input", checkInput);
        input.addEventListener("keydown",handleBackspace);
        input.value = "";

        setTimeout(() => {
            clearInterval(myInterval);
            stopApp(event);
        }, 60000);
    }
}

function checkInput(event) {
        let userText = event.target.value;
        let errorCount = document.getElementById("Errors");
        let accuracyCount = document.getElementById("Accuracy");
        let sampleText = document.getElementById("sampleText");
        let lastInputCharacter = userText.charAt(userText.length - 1);
        let textCharacter = text.charAt(userText.length - 1);
        let newSpan = document.createElement("span");
        newSpan.textContent = textCharacter;
        if (lastInputCharacter !== textCharacter) {
            errorCount.lastChild.innerText = ++errors;
            newSpan.classList.add("wrongCharacter");
        }
        else {
            newSpan.classList.add("matchingCharacter");
        }

        let untypedText = sampleText.lastChild;
        untypedText.textContent = text.substring(userText.length);

        let regexp = new RegExp("(.*)<span>.*</span>", "g");
        let matches = sampleText.innerHTML.matchAll(regexp);
        let matchingText;

        for (const match of matches) {
            matchingText = match[1];
        }

        sampleText.innerHTML = matchingText;
        sampleText.appendChild(newSpan);
        sampleText.appendChild(untypedText);

        if (lastInputCharacter === " ") {
            wpm++;
        }
        cpm++;
        accuracy = Math.floor(((userText.length - errors) / userText.length) * 100);
        accuracyCount.lastChild.innerText = `${accuracy} %`;
}

function handleBackspace(event) {
    if(event.key === "Backspace" || event.key === "ArrowLeft" || event.target.value.length === text.length){
        event.preventDefault();
    }
}

let stopApp = (event) => {
    event.target.innerText = "Here are your final stats. Please click restart to type again.";
    let input = document.getElementById("inputText");
    input.removeEventListener("input", checkInput);
    input.removeEventListener("keydown",handleBackspace);
    input.value = "";
    input.setAttribute("placeholder", "");
    input.blur();
    assignValues();
    renderStats(finalStatArray);
    let restartButton = document.createElement("button");
    restartButton.textContent = "Restart";
    restartButton.addEventListener("click", setInitialState);
    document.getElementById("restart").appendChild(restartButton);
    let sampleText = document.getElementById("sampleText");
    sampleText.classList.remove("textToType");
    sampleText.classList.add("text");
}

let sampleText = document.getElementById("sampleText");
sampleText.innerText = text;
sampleText.addEventListener("click", startApp);
