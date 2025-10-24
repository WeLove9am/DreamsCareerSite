gsap.registerPlugin(ScrollTrigger);

const frameCount = 147;
const canvasWidth = 1158;
const canvasHeight = 770;

// Generate image URL for frame index
const getImageURL = (index) =>
    `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${(index + 1).toString().padStart(4, '0')}.jpg`;

// === Load all frames once and share between sections ===
const images = [];
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = getImageURL(i);
    images.push(img);
}

// Array of canvases and contexts
const canvases = [
    document.getElementById("canvas-1"),
    document.getElementById("canvas-2"),
    document.getElementById("canvas-3")
];

const contexts = canvases.map(canvas => canvas.getContext("2d"));

// Shared render function factory
function createRender(ctx) {
    return function(frameIndex) {
    const idx = Math.floor(frameIndex);
    if (idx >= 0 && idx < frameCount && images[idx].complete) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(images[idx], 0, 0, canvasWidth, canvasHeight);
    }
    };
}

// --- Wait for first image to load before rendering anything ---
images[0].onload = () => {
    console.log("First frame loaded – starting animations.");
    
    // Now initialize GSAP animations
    canvases.forEach((canvas, sectionIndex) => {
    const ctx = contexts[sectionIndex];
    const anim = { frame: 0 }; // Start at frame 0 for each section

    const render = createRender(ctx);

    gsap.to(anim, {
        frame: frameCount - 1,
        ease: "none",
        onUpdate: render,
        scrollTrigger: {
        trigger: ".section",           // All sections use same selector
        start: "top top",              // Pin when top hits top
        end: "+=100%",                 // Duration = height of .section
        scrub: 0.5,                    // Smooth scrub like original
        pin: true,                     // Lock scroll here!
        anticipatePin: true,
        invalidateOnRefresh: true,
        // markers: sectionIndex === 0  // Uncomment for debugging
        }
    });
    });
};

// Optional: Handle errors
images[0].onerror = () => {
    console.error("Failed to load first image. Check network or URL.");
};
