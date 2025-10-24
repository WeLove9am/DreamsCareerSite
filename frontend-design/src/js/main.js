import { accordion } from "./components/accordion.js";
import { mobileMenu } from "./components/mobile-menu.js";
import { sliderJobs } from "./components/sliderJobs.js";
import { sliderFeatures } from "./components/sliderFeatures.js";
import { sliderSpotlight } from "./components/sliderSpotlight.js";
import { sliderValues } from "./components/sliderValues.js";
import { sliderSteps } from "./components/sliderSteps.js";
import { toggle } from "./components/toggle.js";
import { quiz } from "./components/quiz.js";
import { tabs } from "./components/tabs.js";
// import { imageScroll } from "./components/imageScroll.js";
import { scrollspy } from "./components/scrollspy.js";
// import { slider } from "./components/slider.js";

window.addEventListener(
  "load",
  () => {
    mobileMenu.init();
    accordion.init();
    sliderJobs.init();
    sliderFeatures.init();
    sliderSpotlight.init();
    sliderSteps.init();
    // createSliderManager.init();
    sliderValues.init();
    toggle.init();
    quiz.init();
    scrollspy.init();
    tabs.init();

    gsap.registerPlugin(ScrollTrigger);

    const canvas = document.querySelector("#image-sequence");
    const sections = gsap.utils.toArray(".pin-section");
    const loaderContainer = document.querySelector(".image-sequence-loading");

    let lastScrollTop = window.scrollY;
    let isSnapping = false;
    let lastSectionActivated = false;

    loaderContainer.classList.add("show");

    let totalImages = 0;
    let loadedImages = 0;
    const allImagesLoaded = new Promise((resolve) => {
      const checkComplete = () => {
        if (loadedImages >= totalImages && totalImages > 0) {
          resolve();
        }
      };

      const originalImage = window.Image;
      window.Image = function () {
        const img = new originalImage();
        const originalOnload = img.onload;
        img.onload = function (...args) {
          loadedImages++;
          checkComplete();
          if (originalOnload) originalOnload.apply(this, args);
        };
        const originalOnerror = img.onerror;
        img.onerror = function (...args) {
          loadedImages++;
          checkComplete();
          if (originalOnerror) originalOnerror.apply(this, args);
        };
        return img;
      };
    });

    sections.forEach((section) => {
      const frameCount = parseInt(section.dataset.frameCount, 10);
      totalImages += frameCount;
    });

    window.addEventListener("scroll", () => {
      if (!isSnapping) {
        lastScrollTop = window.scrollY;
      }
    });

    ScrollTrigger.addEventListener("scrollEnd", () => {
      if (isSnapping) return;

      const currentScroll = window.scrollY;
      const direction = currentScroll > lastScrollTop ? "down" : "up";

      if (direction === "up") {
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          const sectionTop = section.offsetTop;
          if (sectionTop <= currentScroll) {
            if (i > 0) {
              const prevSection = sections[i - 1];
              const currentSection = sections[i];
              const sectionHeight = section.offsetHeight;
              const distanceFromTop = currentScroll - sectionTop;

              if (distanceFromTop < sectionHeight * 0.3) {
                currentSection.classList.add("pin-section-in-transition");
                isSnapping = true;

                window.scrollTo({
                  top: prevSection.offsetTop,
                  behavior: "auto",
                });

                requestAnimationFrame(() => {
                  currentSection.classList.remove("pin-section-in-transition");
                  isSnapping = false;
                });
              }
            }
            break;
          }
        }
      }
    });

    let updateCallbacks = [];

    const resizeCanvas = (canvasElement, updateImageCallback) => {
      const rect = canvasElement.getBoundingClientRect();
      const displayWidth = rect.width;
      const displayHeight = rect.height;

      if (displayWidth <= 0 || displayHeight <= 0) {
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;
      } else {
        canvasElement.width = displayWidth;
        canvasElement.height = displayHeight;
      }

      if (updateImageCallback) {
        updateImageCallback();
      }
    };

    const generateImageUrls = (frameCount, imagePath) => {
      return new Array(frameCount)
        .fill()
        .map(
          (_, i) => `${imagePath}-${(i + 1).toString().padStart(3, "0")}.jpg`
        );
    };

    const drawImageCover = (ctx, img, canvasW, canvasH) => {
      if (canvasW <= 0 || canvasH <= 0 || img.width <= 0 || img.height <= 0)
        return;

      const imgRatio = img.width / img.height;
      const canvasRatio = canvasW / canvasH;

      let drawW, drawH, drawX, drawY;

      if (imgRatio > canvasRatio) {
        drawH = canvasH;
        drawW = canvasH * imgRatio;
      } else {
        drawW = canvasW;
        drawH = canvasW / imgRatio;
      }

      drawX = (canvasW - drawW) / 2;
      drawY = (canvasH - drawH) / 2;

      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    };

    allImagesLoaded.then(() => {
      requestAnimationFrame(() => {
        resizeCanvas(canvas);

        const firstSection = sections[0];
        if (firstSection) {
          const imagePath = firstSection.dataset.imagePath;
          const firstImageUrl = `${imagePath}-001.jpg`;
          const img = new Image();
          img.src = firstImageUrl;

          const drawFirstFrame = () => {
            const ctx = canvas.getContext("2d");
            drawImageCover(ctx, img, canvas.width, canvas.height);
          };

          if (img.complete) {
            drawFirstFrame();
          } else {
            img.onload = drawFirstFrame;
          }
        }

        loaderContainer.classList.add("fade-out");
        setTimeout(() => {
          loaderContainer.style.display = "none";
        }, 500);
      });
    });

    sections.forEach((section, index) => {
      const frameCount = parseInt(section.dataset.frameCount, 10);
      const imagePath = section.dataset.imagePath;
      const urls = generateImageUrls(frameCount, imagePath);
      const nextSection = sections[index + 1];
      const isLastSection = index + 1 === sections.length - 1;

      const handleComplete = () => {
        if (nextSection) {
          nextSection.classList.add("pin-section-in-transition");
          gsap.to(window, {
            duration: 1,
            scrollTo: nextSection,
            overwrite: "auto",
            onComplete: () => {
              setTimeout(() => {
                if (isLastSection) {
                  const menuLinkFirst = document
                    .querySelectorAll(".menu__item")[0]
                    ?.querySelector(".menu__link");
                  const menuContentFirst =
                    menuLinkFirst?.nextElementSibling?.querySelector("li");

                  menuLinkFirst?.classList.toggle("active");
                  menuContentFirst?.classList.toggle("active");
                }
              }, 2000);

              nextSection.classList.remove("pin-section-in-transition");
            },
          });
        }
      };

      const scrollTriggerConfig = {
        trigger: section,
        pin: true,
        start: "top top",
        end: "bottom top",
        scrub: true,
        snap: 0.7,
      };

      if (isLastSection) {
        scrollTriggerConfig.onEnter = (self) => {
          if (self.direction > 0) {
            lastSectionActivated = true;
          }
        };
      }

      const anim = imageSequence({
        urls,
        canvas: canvas,
        scrollTrigger: scrollTriggerConfig,
        onComplete: handleComplete,
        effectiveFps: 15,
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
          const activeAnim = gsap.getTweensOf({
            scrollTrigger: activeTrigger,
          })[0];
          if (activeAnim && activeAnim.vars.onUpdate) {
            activeAnim.vars.onUpdate();
          }
        } else {
          updateCallbacks[0]();
        }
      }
    };

    window.addEventListener("resize", () =>
      resizeCanvas(canvas, redrawCurrentFrame)
    );

    function imageSequence(config) {
      let playhead = { frame: 0 };
      const canvasElement = gsap.utils.toArray(config.canvas)[0];
      const ctx = canvasElement ? canvasElement.getContext("2d") : null;
      let curFrame = -1;
      const onUpdate = config.onUpdate;
      const onComplete = config.onComplete;

      if (!ctx) return;

      const updateImage = function () {
        const frame = Math.round(playhead.frame);
        if (frame !== curFrame) {
          const img = images[frame];
          if (img && img.complete) {
            drawImageCover(ctx, img, canvasElement.width, canvasElement.height);
            curFrame = frame;
            onUpdate && onUpdate.call(this, frame, images[frame]);
          }
        }
      };

      const images = config.urls.map((url) => {
        const img = new Image();
        img.src = url;
        return img;
      });

      const effectiveFps = config.effectiveFps || 15;
      const duration = images.length / effectiveFps;

      return gsap.to(playhead, {
        frame: images.length - 1,
        ease: "none",
        onUpdate: updateImage,
        onComplete: onComplete,
        duration: duration,
        paused: !!config.paused,
        scrollTrigger: config.scrollTrigger,
      });
    }
    document.querySelector("body").classList.add("page-loaded");
  },
  false
);
