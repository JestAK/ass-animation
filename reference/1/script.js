const videoInput = document.getElementById('videoInput');
const canvas = document.getElementById('canvas');
const textInput = document.getElementById('textInput');
let video;

videoInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    video = URL.createObjectURL(file);
    showVideo();
});

function showVideo() {
    const ctx = canvas.getContext('2d');
    const vid = document.createElement('video');

    vid.addEventListener('loadedmetadata', () => {
        canvas.width = vid.videoWidth;
        canvas.height = vid.videoHeight;
        ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
    });

    vid.src = video;
    vid.load();
    // vid.play();
}

function addText() {
    const ctx = canvas.getContext('2d');
    const text = textInput.value;

    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(text, 50, 50); // Adjust the position as needed

    // To export the canvas as a new video, you'd need to use a library like ffmpeg.wasm.
    // This example focuses on the basic concept of adding text.
}