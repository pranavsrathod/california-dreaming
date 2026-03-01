// ===== Custom Paper Plane Cursor Module =====
document.addEventListener('DOMContentLoaded', () => {

  const cursorPlane = document.getElementById('cursorPlane');
  if (!cursorPlane) return; // Prevent errors if element missing

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouch) return; // Disable on touch devices

  document.body.classList.add('custom-cursor');

  // Start hidden until first movement
  cursorPlane.style.opacity = '0';
  cursorPlane.style.position = 'fixed';
  cursorPlane.style.pointerEvents = 'none';
  cursorPlane.style.left = '0px';
  cursorPlane.style.top = '0px';
  cursorPlane.style.transform = 'translate(-50%, -50%)';

  let isDragging = false;

  window.addEventListener('mousemove', (e) => {
    cursorPlane.style.opacity = '1';
    cursorPlane.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) rotate(${isDragging ? '25deg' : '0deg'})`;
  });

  window.addEventListener('mousedown', () => {
    isDragging = true;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mouseleave', () => {
    cursorPlane.style.opacity = '0';
  });

});
