import { accordion } from "./components/accordion.js";
import { mobileMenu } from "./components/mobile-menu.js";
import { sliderJobs } from "./components/sliderJobs.js";
import { sliderFeatures } from "./components/sliderFeatures.js";
import { sliderSpotlight } from "./components/sliderSpotlight.js";
import { sliderValues } from "./components/sliderValues.js";
import { toggle } from "./components/toggle.js";
import { quiz } from "./components/quiz.js";
// import { imageScroll } from "./components/imageScroll.js";
// import { scrollspy } from "./components/scrollspy.js";
// import { slider } from "./components/slider.js";

window.addEventListener(
  "load",
  () => {
    mobileMenu.init();
    accordion.init();
    sliderJobs.init();
    sliderFeatures.init();
    sliderSpotlight.init();
    // createSliderManager.init();
    sliderValues.init();
    toggle.init();
    quiz.init();

    gsap.registerPlugin(ScrollTrigger);

    const canvas = document.querySelector("#image-sequence");
    const sections = gsap.utils.toArray(".pin-section");

    let updateCallbacks = [];

    const resizeCanvas = (canvasElement, updateImageCallback) => {
      const rect = canvasElement.getBoundingClientRect();

      canvasElement.width = rect.width;
      canvasElement.height = rect.height;

      if (updateImageCallback) {
        updateImageCallback();
      }
    };

    const generateImageUrls = (frameCount, imagePath) => {
      return new Array(frameCount)
        .fill()
        .map(
          (o, i) => `${imagePath}-${(i + 1).toString().padStart(3, "0")}.jpg`
        );
    };

    sections.forEach((section, index) => {
      const frameCount = parseInt(section.dataset.frameCount, 10);
      const imagePath = section.dataset.imagePath;

      const urls = generateImageUrls(frameCount, imagePath);

      const nextSection = sections[index + 1];

      const anim = imageSequence({
        urls,
        canvas: canvas,
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onLeave: () => {
            if (nextSection) {
              gsap.to(window, {
                duration: 0,
                scrollTo: nextSection,
              });
            }
          },
        },
      });

      if (anim && anim.vars.onUpdate) {
        updateCallbacks.push(anim.vars.onUpdate);
      }
    });

    const redrawCurrentFrame = () => {
      if (updateCallbacks.length > 0) {
        const activeTrigger = ScrollTrigger.getAll().find(
          (trigger) => trigger.isActive
        );

        if (activeTrigger) {
          updateCallbacks[updateCallbacks.length - 1]();
        } else {
          updateCallbacks[0]();
        }
      }
    };

    window.addEventListener("resize", () =>
      resizeCanvas(canvas, redrawCurrentFrame)
    );

    function imageSequence(config) {
      let playhead = { frame: 0 },
        canvasElement =
          gsap.utils.toArray(config.canvas)[0] ||
          console.warn("Canvas element not found"),
        ctx = canvasElement ? canvasElement.getContext("2d") : null,
        curFrame = -1,
        onUpdate = config.onUpdate,
        images;

      if (!ctx) {
        return;
      }

      let updateImage = function () {
        let frame = Math.round(playhead.frame);

        const shouldRedraw = frame !== curFrame;

        if (shouldRedraw) {
          ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

          let img = images[frame];

          if (img && img.complete) {
            const canvasW = canvasElement.width;
            const canvasH = canvasElement.height;
            const imgW = img.width;
            const imgH = img.height;

            const ratio = Math.max(canvasW / imgW, canvasH / imgH);

            const scaledW = imgW * ratio;
            const scaledH = imgH * ratio;

            const x = (canvasW - scaledW) / 2;
            const y = (canvasH - scaledH) / 2;

            ctx.drawImage(img, x, y, scaledW, scaledH);

            curFrame = frame;
            onUpdate && onUpdate.call(this, frame, images[frame]);
          }
        }
      };

      images = config.urls.map((url, i) => {
        let img = new Image();
        img.src = url;

        if (i === 0) {
          img.onload = () => {
            resizeCanvas(canvas, updateImage);
          };
        }

        return img;
      });

      return gsap.to(playhead, {
        frame: images.length - 1,
        ease: "none",
        onUpdate: updateImage,
        duration: images.length / (config.fps || 30),
        paused: !!config.paused,
        scrollTrigger: config.scrollTrigger,
      });
    }
    document.querySelector("body").classList.add("page-loaded");
  },
  false
);
