    const loaderContainer = document.querySelector(".image-sequence-loading");

    if (loaderContainer) {
      gsap.registerPlugin(ScrollTrigger);

      const sections = gsap.utils.toArray(".pin-section");
      const imageSequenceScrollText = document.querySelector(
        ".image-sequece-wrapper__scroll"
      );

      let lastScrollTop = window.scrollY;
      let isSnapping = false;
      let isLastSectionGlobal = false;

      loaderContainer.classList.add("show");

      class ProgressiveImageLoader {
        constructor() {
          this.imageCache = new Map();
          this.loadingQueue = [];
          this.concurrentLoads = 8;
          this.activeLoads = 0;
          this.sectionsLoading = new Set();
          this.sectionsLoaded = new Set();
        }

        loadImage(url) {
          if (this.imageCache.has(url)) {
            return Promise.resolve(this.imageCache.get(url));
          }

          return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
              this.imageCache.set(url, img);
              this.activeLoads--;
              this.processQueue();
              resolve(img);
            };

            img.onerror = () => {
              this.activeLoads--;
              this.processQueue();
              reject(new Error(`Failed to load ${url}`));
            };

            if (this.activeLoads < this.concurrentLoads) {
              this.activeLoads++;
              img.src = url;
            } else {
              this.loadingQueue.push({ img, url, resolve, reject });
            }
          });
        }

        processQueue() {
          while (this.loadingQueue.length > 0 && this.activeLoads < this.concurrentLoads) {
            const { img, url } = this.loadingQueue.shift();
            this.activeLoads++;
            img.src = url;
          }
        }

        async loadSection(sectionIndex, urls, onProgress) {
          if (this.sectionsLoaded.has(sectionIndex) || this.sectionsLoading.has(sectionIndex)) {
            return;
          }

          this.sectionsLoading.add(sectionIndex);

          const chunkSize = 20;
          let loadedCount = 0;

          for (let i = 0; i < urls.length; i += chunkSize) {
            const chunk = urls.slice(i, i + chunkSize);
            await Promise.allSettled(chunk.map(url => this.loadImage(url)));

            loadedCount += chunk.length;
            if (onProgress) {
              onProgress(loadedCount, urls.length);
            }
          }

          this.sectionsLoading.delete(sectionIndex);
          this.sectionsLoaded.add(sectionIndex);
        }

        getImage(url) {
          return this.imageCache.get(url);
        }

        isSectionLoaded(sectionIndex) {
          return this.sectionsLoaded.has(sectionIndex);
        }

        isLoading(sectionIndex) {
          return this.sectionsLoading.has(sectionIndex);
        }
      }

      const imageLoader = new ProgressiveImageLoader();

      class LoadingIndicatorManager {
        constructor(sections) {
          this.indicators = new Map();
          this.setupIndicators(sections);
        }

        setupIndicators(sections) {
          sections.forEach((section, index) => {
            const canvas = section.querySelector(".image-sequence-canvas");
            if (!canvas) return;

            const indicator = document.createElement('div');
            indicator.className = 'section-loading-indicator';
            indicator.style.cssText = `
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 12px;
          z-index: 1000;
          display: none;
          font-family: monospace;
          border: 1px solid rgba(255, 255, 255, 0.2);
        `;
            indicator.innerHTML = `
          <div>⏳ Loading section ${index + 1}...</div>
          <div style="margin-top: 5px;" class="progress-text">0%</div>
        `;

            canvas.parentElement.style.position = 'relative';
            canvas.parentElement.appendChild(indicator);
            this.indicators.set(index, indicator);
          });
        }

        show(sectionIndex) {
          const indicator = this.indicators.get(sectionIndex);
          if (indicator) {
            indicator.style.display = 'block';
          }
        }

        hide(sectionIndex) {
          const indicator = this.indicators.get(sectionIndex);
          if (indicator) {
            indicator.style.display = 'none';
          }
        }

        updateProgress(sectionIndex, loaded, total) {
          const indicator = this.indicators.get(sectionIndex);
          if (indicator) {
            const progressText = indicator.querySelector('.progress-text');
            const percentage = Math.round((loaded / total) * 100);
            progressText.textContent = `${percentage}% (${loaded}/${total})`;
          }
        }
      }

      let indicatorManager;

      const sectionData = sections.map((section, index) => {
        const frameCount = parseInt(section.dataset.frameCount, 10);
        const imagePath = section.dataset.imagePath;
        const urls = Array.from(
          { length: frameCount },
          (_, i) => `${imagePath}-${(i + 1).toString().padStart(3, "0")}.webp`
        );

        return {
          section,
          index,
          frameCount,
          imagePath,
          urls,
          canvas: section.querySelector(".image-sequence-canvas")
        };
      });

      function resizeCanvas(canvas) {
        const rect = canvas.parentElement.getBoundingClientRect();
        const displayWidth = rect.width;
        const displayHeight = rect.height;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        if (displayWidth > 0 && displayHeight > 0) {
          canvas.width = displayWidth * dpr;
          canvas.height = displayHeight * dpr;
          canvas.style.width = displayWidth + 'px';
          canvas.style.height = displayHeight + 'px';

          const ctx = canvas.getContext('2d');
          ctx.scale(dpr, dpr);
        } else {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }
      }

      function drawImageCover(ctx, img, canvasW, canvasH) {
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
      }

      function imageSequence({
        urls,
        canvas,
        scrollTrigger,
        onComplete,
        effectiveFps = 15,
        sectionIndex
      }) {
        const ctx = canvas.getContext("2d", { alpha: false });
        let curFrame = -1;
        let playhead = { frame: 0 };
        let hasTriggeredNextLoad = false;

        const updateImage = () => {
          const frame = Math.round(playhead.frame);
          if (frame !== curFrame) {
            const img = imageLoader.getImage(urls[frame]);
            if (img?.complete) {
              drawImageCover(ctx, img, canvas.width, canvas.height);
              curFrame = frame;
            }
          }

          if (!hasTriggeredNextLoad && frame > 0) {
            hasTriggeredNextLoad = true;
            const nextSectionIndex = sectionIndex + 1;

            if (nextSectionIndex < sectionData.length) {
              const nextSection = sectionData[nextSectionIndex];

              if (!imageLoader.isSectionLoaded(nextSectionIndex) &&
                !imageLoader.isLoading(nextSectionIndex)) {

                indicatorManager.show(nextSectionIndex);

                imageLoader.loadSection(
                  nextSectionIndex,
                  nextSection.urls,
                  (loaded, total) => {
                    indicatorManager.updateProgress(nextSectionIndex, loaded, total);
                  }
                ).then(() => {
                  indicatorManager.hide(nextSectionIndex);
                });
              }
            }
          }
        };

        const duration = urls.length / effectiveFps;

        const animation = gsap.to(playhead, {
          frame: urls.length - 1,
          ease: "none",
          duration: duration,
          onUpdate: updateImage,
          onComplete: onComplete,
          scrollTrigger: scrollTrigger,
        });

        return animation;
      }

      async function initializeSequences() {
        indicatorManager = new LoadingIndicatorManager(sections);

        const firstFramePromises = sectionData.map(({ urls }) =>
          imageLoader.loadImage(urls[0])
        );

        await Promise.all(firstFramePromises);

        const firstSection = sectionData[0];

        await imageLoader.loadSection(
          0,
          firstSection.urls,
          () => {}
        );

        sectionData.forEach(({ canvas, imagePath }, index) => {
          if (!canvas) return;

          resizeCanvas(canvas);

          const firstImageUrl = `${imagePath}-001.webp`;
          const img = imageLoader.getImage(firstImageUrl);

          if (img) {
            const ctx = canvas.getContext("2d");
            drawImageCover(ctx, img, canvas.width, canvas.height);
          }
        });

        loaderContainer.classList.add("fade-out");
        setTimeout(() => {
          loaderContainer.style.display = "none";
        }, 500);

        sectionData.forEach(({ section, urls, canvas, index }) => {
          if (!canvas) return;

          const nextSection = sections[index + 1];
          const isLastSection = index + 1 === sections.length - 1;

          const handleComplete = () => {
            if (nextSection) {
              nextSection.classList.add("pin-section-in-transition");
              gsap.to(window, {
                duration: 1,
                scrollTo: nextSection,
                overwrite: "auto",
                onStart: () => {
                  if (isLastSection) {
                    imageSequenceScrollText.classList.add("hidden");
                  }
                },
                onComplete: () => {
                  nextSection.classList.remove("pin-section-in-transition");
                  if (isLastSection) {
                    isLastSectionGlobal = true;
                    setTimeout(() => {
                      const menuLinkFirst = document
                        .querySelectorAll(".menu__item")[0]
                        ?.querySelector(".menu__link");
                      const menuContentFirst =
                        menuLinkFirst?.nextElementSibling?.querySelector("li");

                      menuLinkFirst?.classList.toggle("active");
                      menuContentFirst?.classList.toggle("active");
                    }, 2000);
                  } else {
                    isLastSectionGlobal = false;
                  }
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

          imageSequence({
            urls,
            canvas,
            scrollTrigger: scrollTriggerConfig,
            onComplete: handleComplete,
            effectiveFps: 15,
            sectionIndex: index
          });
        });
      }

      initializeSequences();

      window.addEventListener("scroll", () => {
        if (!isSnapping) {
          lastScrollTop = window.scrollY;
        }
        if (isLastSectionGlobal) {
          const menuLinkFirst = document
            .querySelectorAll(".menu__item")[0]
            ?.querySelector(".menu__link");
          const menuContentFirst =
            menuLinkFirst?.nextElementSibling?.querySelector("li");

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

      let resizeTimeout;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          sections.forEach((section) => {
            const canvas = section.querySelector(".image-sequence-canvas");
            if (canvas) {
              resizeCanvas(canvas);
            }
          });
        }, 250);
      });
    }

    document.querySelector("body").classList.add("page-loaded");