// Using p5.js for graphics
let video;

function preload() {
    // Load video file
    video = createVideo('video.mp4');
}

function setup() {
    createCanvas(1280, 720);
    video.loop();

    // Create animated text
    let text = new AnimatedText("Hello World!", 100, 100);

    text.addKeyframe(0, {x: 100, y: 100, alpha: 0});
    text.addKeyframe(100, {x: 200, y: 200, alpha: 1});
}

function draw() {
    background(255);

    // Draw video
    image(video, 0, 0);

    // Draw animated text
    text.draw();
}

// Animated text class
class AnimatedText {

    constructor(message, x, y) {
        this.message = message;
        this.x = x;
        this.y = y;
        this.keyframes = [];
    }

    addKeyframe(time, props) {
        this.keyframes.push({time, props});
    }

    draw() {
        push();
        translate(this.x, this.y);

        // Interpolate properties between keyframes
        let frame = floor(frameCount % this.totalDuration);
        let prev = this.keyframes[0];
        for (let kf of this.keyframes) {
            if (frame >= kf.time) {
                prev = kf;
            } else {
                let mix = (frame - prev.time) / (kf.time - prev.time);
                this.#mixProps(prev.props, kf.props, mix);
                break;
            }
        }

        textSize(36);
        fill(0);
        text(this.message, 0, 0);

        pop();
    }

    #mixProps(start, end, mix) {
        this.x = lerp(start.x, end.x, mix);
        this.y = lerp(start.y, end.y, mix);
        this.alpha = lerp(start.alpha, end.alpha, mix);
    }

}
