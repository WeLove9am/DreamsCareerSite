// utils/preloadImageSequence.js
export const preloadImageSequence = (count, basePath) => {
    // Generates URLs and returns a Promise that resolves when all are in browser cache
    const promises = [];
    for (let i = 1; i <= count; i++) {
        const paddedIndex = String(i).padStart(3, '0');
        const url = `${basePath}-${paddedIndex}.webp`; 
        
        promises.push(new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(img); // Resolve even on error to prevent blocking
            img.src = url; 
        }));
    }
    return Promise.all(promises);
};