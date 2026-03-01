

// ===== Carousel Module =====
document.addEventListener('DOMContentLoaded', () => {

  const carousel = document.getElementById('carousel');
  if (!carousel) return;

  let isDown = false;
  let startX;
  let scrollLeft;
  let animationFrame;
  let autoSpeed = 0.6;

  carousel.style.scrollSnapType = "none";

  // ===== Load Images =====
  fetch('memories.json')
    .then(res => res.json())
    .catch(() => [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80"
    ])
    .then(images => {
      const allImages = [...images, ...images, ...images];

      allImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.className = "h-[350px] sm:h-[450px] md:h-[520px] w-[80vw] sm:w-[600px] md:w-[760px] object-cover rounded-3xl flex-shrink-0 pointer-events-none";
        carousel.appendChild(img);
      });

      carousel.scrollLeft = carousel.scrollWidth / 3;
      startAutoScroll();
    });

  // ===== Auto Scroll =====
  function startAutoScroll() {
    if (animationFrame) cancelAnimationFrame(animationFrame);

    function step() {
      if (!isDown) {
        carousel.scrollLeft += autoSpeed;

        const third = carousel.scrollWidth / 3;

        if (carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth)) {
          carousel.scrollLeft = third;
        }

        if (carousel.scrollLeft <= 0) {
          carousel.scrollLeft = third;
        }
      }

      animationFrame = requestAnimationFrame(step);
    }

    animationFrame = requestAnimationFrame(step);
  }

  // ===== Drag Support =====
  carousel.addEventListener('pointerdown', (e) => {
    isDown = true;
    carousel.setPointerCapture(e.pointerId);
    startX = e.clientX;
    scrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const walk = (e.clientX - startX) * 1.5;
    carousel.scrollLeft = scrollLeft - walk;
  });

  carousel.addEventListener('pointerup', (e) => {
    isDown = false;
    carousel.releasePointerCapture(e.pointerId);
    setTimeout(startAutoScroll, 50);
  });

  carousel.addEventListener('pointercancel', () => {
    isDown = false;
    startAutoScroll();
  });

});