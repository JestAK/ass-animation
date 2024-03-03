const video = document.getElementById('video');
const stopButton = document.getElementById('stop-button');
const playButton = document.getElementById('play-button');
const plus5Button = document.getElementById('plus-5sec-button');
const minus5Button = document.getElementById('minus-5sec-button');
const timelineRange = document.getElementById('timeline-range');
const addTextButton = document.getElementById('add-text');

stopButton.addEventListener("click", () => {
    video.pause();
});

playButton.addEventListener("click", () => {
    video.play();
});

plus5Button.addEventListener("click", () => {
    video.currentTime = video.currentTime + 5;
});

minus5Button.addEventListener("click", () => {
    video.currentTime = video.currentTime - 5;
});

timelineRange.addEventListener("input", () => {
    video.currentTime = video.duration * (timelineRange.value / 100);
});

video.addEventListener("timeupdate", () => {
   timelineRange.value = (video.currentTime / video.duration) * 100;
});

const createText = () => {
    console.log("Event");
    let newTextElement = document.createElement('p');

    newTextElement.textContent = 'Added text';
    newTextElement.style.position = 'absolute';
    newTextElement.style.top = '300px';
    newTextElement.style.left = '300px';
};

addTextButton.addEventListener("click", () => {
    createText();
});
