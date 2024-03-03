function setup() {
    createCanvas(1280, 720);
}

const p5canvas = document.getElementById('defaultCanvas0');

// Set up scene, camera, renderer with THREE.js

// Create plane for video texture
const videoTexture = new THREE.Texture(p5canvas);
const planeGeom = new THREE.PlaneGeometry(16, 9);
const videoMaterial = new THREE.MeshBasicMaterial({map: videoTexture});
const videoPlane = new THREE.Mesh(planeGeom, videoMaterial);
scene.add(videoPlane);

// Add text mesh to scene
const textGeom = new THREE.TextGeometry("Hello World!", {font: font});
const textMaterial = new THREE.MeshBasicMaterial({color: 'red'});
const textMesh = new THREE.Mesh(textGeom, textMaterial);
scene.add(textMesh);

// Animate text mesh and render loop
function render() {
    // Update text position
    textMesh.position.x += 0.01;

    renderer.render(scene, camera);

    // Capture frame
    capturer.capture(renderer.domElement);
}

// Export animation with CCapture.js
const capturer = new CCapture({ format: 'webm'});
capturer.start();

// Render loop
for (let i = 0; i < frameCount; i++) {
    render();
}

capturer.stop();
capturer.save();
