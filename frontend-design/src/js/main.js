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
import { scrollspy } from "./components/scrollspy.js";
import { heroScroll } from "./components/heroScroll.js";

let globalPercentDisplay = null;
let globalLoaderContainer = null;

// document.addEventListener("DOMContentLoaded", () => {
//   const loaderContainer = document.querySelector(".image-sequence-loading");
//   if (loaderContainer && !globalLoaderContainer) {
//     globalLoaderContainer = loaderContainer;

//     const loaderElement = document.createElement("div");
//     loaderElement.className = "loader";
//     loaderContainer.appendChild(loaderElement);

//     const percentDisplay = document.createElement("div");
//     percentDisplay.className = "loading-percent";
//     percentDisplay.textContent = "0";
//     loaderContainer.appendChild(percentDisplay);
//     loaderContainer.classList.add("show");

//     globalPercentDisplay = percentDisplay;
//   }
// });

window.addEventListener(
  "load",
  () => {
    mobileMenu.init();
    accordion.init();
    sliderJobs.init();
    sliderFeatures.init();
    sliderSpotlight.init();
    sliderSteps.init();
    sliderValues.init();
    toggle.init();
    quiz.init();
    scrollspy.init();
    tabs.init();
    heroScroll.init();

    const loaderContainer =
      globalLoaderContainer;
    const percentDisplay = globalPercentDisplay;

    const sections = gsap.utils.toArray(".pin-section");

    if (sections.length > 0) {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

      const imageSequenceScrollText = document.querySelector(
        ".image-sequece-wrapper__scroll",
      );

      let lastScrollTop = window.scrollY;
      let isSnapping = false;
      let isLastSectionGlobal = false;
      let progressAbortController = null;

      function getVideoSrc(section) {
        return section.dataset.videoDesktop || "";
      }

      function buildSectionData() {
        return sections.map((section, index) => {
          let video = section.querySelector(".scroll-video");

          if (!video) {
            video = document.createElement("video");
            video.className = "scroll-video";
            video.muted = true;
            video.playsInline = true;
            video.preload = "none";
            video.setAttribute("playsinline", "");

            Object.assign(video.style, {
              position: "absolute",
              inset: "0",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none",
            });

            section.style.position = "relative";
            section.insertBefore(video, section.firstChild);
          }

          return { section, index, video };
        });
      }

      let sectionData = buildSectionData();

      function activateVideo(data) {
        const { video, section } = data;
        const src = getVideoSrc(section);
        if (!src) return;

        if (video.dataset.loadedSrc === src) return;

        video.dataset.loadedSrc = src;
        video.preload = "auto";
        video.src = src;
      }

      function createScrollVideo({ data, onComplete }) {
        const { video, section, index } = data;
        const scrubber = { t: 0 };
        let lastT = -1;
        let nextActivated = false;

        const updateTime = () => {
          if (scrubber.t === lastT) return;
          lastT = scrubber.t;

          if (video.readyState >= 1 && video.duration) {
            video.currentTime = scrubber.t * video.duration;
          }

          if (!nextActivated && scrubber.t > 0.05 && index + 1 < sectionData.length) {
            nextActivated = true;
            activateVideo(sectionData[index + 1]);
          }
        };

        const scrollDistance = index === sections.length - 1 ? "+=200%" : "+=300%";

        gsap.to(scrubber, {
          t: 1,
          ease: "none",
          onComplete,
          scrollTrigger: {
            trigger: section,
            pin: true,
            start: "top top",
            end: scrollDistance,
            scrub: true,
            snap: {
              snapTo: 1,
              duration: 0.3,
              ease: "power1.inOut",
            },
            onToggle: (self) => {
              if (self.isActive) {
                if (!data.video.dataset.loadedSrc) activateVideo(data);

                if (index < sections.length - 1) {
                  imageSequenceScrollText?.classList.remove("hidden");
                } else {
                  imageSequenceScrollText?.classList.add("hidden");
                }
              }
            },
            onUpdate: updateTime,
          },
        });
      }

      function trackFirstVideoProgress(video) {
        if (!percentDisplay) return;

        if (progressAbortController) {
          progressAbortController.abort();
        }
        progressAbortController = new AbortController();
        const { signal } = progressAbortController;

        const update = () => {
          if (!video.duration) return;
          const bufferedEnd =
            video.buffered.length > 0
              ? video.buffered.end(video.buffered.length - 1)
              : 0;
          const pct = Math.min(
            100,
            Math.round((bufferedEnd / video.duration) * 100),
          );
          percentDisplay.textContent = `${pct}`;
        };

        video.addEventListener("progress", update, { signal });
        // video.addEventListener(
        //   "canplaythrough",
        //   () => {
        //     if (percentDisplay) percentDisplay.textContent = "100";
        //   },
        //   { signal },
        // );
      }

      function hideLoader() {
        if (!loaderContainer) return;
        loaderContainer.classList.add("fade-out");
        setTimeout(() => {
          loaderContainer.style.display = "none";
        }, 1000);
      }

      async function initializeSequences() {
        if (sectionData.length === 0) {
          hideLoader();
          document.body.classList.add("page-loaded");
          return;
        }

        activateVideo(sectionData[0]);
        trackFirstVideoProgress(sectionData[0].video);

        await new Promise((resolve) => {
          const v = sectionData[0].video;
          if (v.readyState >= 2) {
            resolve();
            return;
          }
          v.addEventListener("loadeddata", resolve, { once: true });
          setTimeout(resolve, 5000);
        });

        sectionData.forEach((data) => {
          const { index } = data;
          const nextSection = sections[index + 1];
          const isLastSection = index + 1 === sections.length - 1;

          const handleComplete = () => {
            if (!nextSection) return;

            nextSection.classList.add("pin-section-in-transition");

            gsap.to(window, {
              duration: 1,
              scrollTo: nextSection,
              overwrite: "auto",
              onStart: () => {
                if (!nextSection.classList.contains("last-section")) {
                  imageSequenceScrollText?.classList.remove("hidden");
                } else {
                  imageSequenceScrollText?.classList.add("hidden");
                }
              },
              onComplete: () => {
                nextSection.classList.remove("pin-section-in-transition");

                if (isLastSection) {
                  isLastSectionGlobal = true;
                  imageSequenceScrollText?.classList.add("hidden");
                  setTimeout(() => {
                    const menu = document.querySelector(".menu");
                    const menuLinkFirst = document
                      .querySelectorAll(".menu__item")[0]
                      ?.querySelector(".menu__link");
                    const menuContentFirst =
                      menuLinkFirst?.nextElementSibling?.querySelector("li");

                    menu?.classList.toggle("active");
                    menuLinkFirst?.classList.toggle("active");
                    menuContentFirst?.classList.toggle("active");
                  }, 2000);
                } else {
                  isLastSectionGlobal = false;
                  if (index + 1 < sections.length - 1) {
                    imageSequenceScrollText?.classList.remove("hidden");
                  }
                }
              },
            });
          };

          createScrollVideo({ data, onComplete: handleComplete });
        });

        if (sections.length > 1) {
          imageSequenceScrollText?.classList.remove("hidden");
        }

        hideLoader();
        document.body.classList.add("page-loaded");
      }

      initializeSequences();

      window.addEventListener("scroll", () => {
        if (!isSnapping) lastScrollTop = window.scrollY;

        if (isLastSectionGlobal) {
          const menu = document.querySelector(".menu");
          const menuLinkFirst = document
            .querySelectorAll(".menu__item")[0]
            ?.querySelector(".menu__link");
          const menuContentFirst =
            menuLinkFirst?.nextElementSibling?.querySelector("li");

          menu?.classList.remove("active");
          menuLinkFirst?.classList.remove("active");
          menuContentFirst?.classList.remove("active");
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
                const sectionHeight = section.offsetHeight;
                const distanceFromTop = currentScroll - sectionTop;

                if (distanceFromTop < sectionHeight * 0.3) {
                  const prevSection = sections[i - 1];
                  sections[i].classList.add("pin-section-in-transition");
                  isSnapping = true;

                  window.scrollTo({
                    top: prevSection.offsetTop,
                    behavior: "auto",
                  });

                  requestAnimationFrame(() => {
                    sections[i].classList.remove("pin-section-in-transition");
                    isSnapping = false;

                    if (i - 1 < sections.length - 1) {
                      imageSequenceScrollText?.classList.remove("hidden");
                    }
                  });
                }
              }
              break;
            }
          }
        }
      });

      let resizeTimeout;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill(true));

          sectionData = buildSectionData();

          sectionData.forEach(({ video, section }) => {
            const newSrc = getVideoSrc(section);
            if (video.dataset.loadedSrc !== newSrc) {
              delete video.dataset.loadedSrc;
              video.removeAttribute("src");
              video.preload = "none";
            }
          });

          if (loaderContainer) {
            loaderContainer.style.display = "flex";
            loaderContainer.classList.remove("fade-out");
            loaderContainer.classList.add("show");
            if (percentDisplay) percentDisplay.textContent = "0";
          }

          initializeSequences();
        }, 250);
      });
    } else {
      if (loaderContainer) {
        loaderContainer.classList.add("fade-out");
        setTimeout(() => (loaderContainer.style.display = "none"), 1000);
      }
      document.body.classList.add("page-loaded");
    }
  },
  false,
);

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openVideoBtn");
  const modal = document.getElementById("videoModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalVideoContainer = document.querySelector(".modal-video-container");

  const vimeoId = openBtn?.dataset.vimeoId;
  if (!vimeoId) return;

  const baseVimeoUrl = `https://player.vimeo.com/video/${vimeoId}`;

  openBtn.addEventListener("click", () => openModal());

  function openModal() {
    // modalVideoContainer.classList.add("loading");

    const iframe = document.createElement("iframe");
    iframe.src = `${baseVimeoUrl}?autoplay=1&loop=0&byline=0&title=0&muted=0`;
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allow", "autoplay; fullscreen");
    iframe.setAttribute("allowfullscreen", "");
    // iframe.addEventListener("load", () =>
    //   modalVideoContainer.classList.remove("loading"),
    // );

    modalVideoContainer.innerHTML = '<div class="loader"></div>';
    modalVideoContainer.appendChild(iframe);

    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.style.display = "block";
    }
  }

  function closeModal() {
    modalVideoContainer.innerHTML = "";
    if (typeof modal.close === "function") {
      modal.close();
    } else {
      modal.style.display = "none";
    }
  }

  closeModalBtn?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (!isInDialog) closeModal();
  });
});