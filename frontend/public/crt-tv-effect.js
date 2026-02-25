// Initialize the CRT TV effect
document.addEventListener('DOMContentLoaded', function() {
  // Find all CRT TV elements
  const tvElements = document.querySelectorAll('.scanlines');
  
  tvElements.forEach(tv => {
    const canvas = tv.querySelector('canvas');
    const text = tv.querySelector('.text');
    
    // Only proceed if we have a canvas
    if (canvas && text) {
      const ctx = canvas.getContext('2d');
      
      // Clone the spans for the glitch effect
      const originalSpan = text.querySelector('span');
      if (originalSpan) {
        for (let i = 0; i < 4; i++) {
          const span = originalSpan.cloneNode(true);
          text.appendChild(span);
        }
      }
      
      // Generate CRT noise
      function snow() {
        const w = canvas.width;
        const h = canvas.height;
        const imgData = ctx.createImageData(w, h);
        const buf = new ArrayBuffer(imgData.data.length);
        const buf8 = new Uint8ClampedArray(buf);
        const data = new Uint32Array(buf);
        
        for (let i = 0; i < data.length; i++) {
          data[i] = ((255 * Math.random()) | 0) << 24;
        }
        
        imgData.data.set(buf8);
        ctx.putImageData(imgData, 0, 0);
      }
      
      function animate() {
        snow();
        requestAnimationFrame(animate);
      }
      
      // Turn on the TV after a delay
      setTimeout(function() {
        // Set canvas dimensions based on container
        canvas.width = tv.clientWidth / 3;
        canvas.height = (tv.clientWidth * 0.5625) / 3;
        
        tv.classList.add('on');
        tv.classList.remove('off');
        animate();
      }, 1000);
      
      // Handle menu navigation with arrow keys and number keys
      const menu = tv.querySelector('.menu');
      if (menu) {
        const ul = menu.querySelector('ul');
        if (ul) {
          let idx = 0;
          const count = ul.children.length - 1;
          
          // Initially activate the first menu item
          ul.children[0].classList.add('active');
          
          window.addEventListener('keydown', function(e) {
            const key = e.keyCode;
            const prev = idx;
            
            // Arrow up (38) and down (40) navigation
            if (key === 38 || key === 40) {
              e.preventDefault();
              
              if (key === 38 && idx > 0) {
                idx--;
              } else if (key === 40 && idx < count) {
                idx++;
              }
              
              ul.children[prev].classList.remove('active');
              ul.children[idx].classList.add('active');
            }
            
            // Handle selection with number key "2" (50)
            if (key === 50) {
              const activeItem = ul.children[idx].querySelector('a');
              if (activeItem) {
                activeItem.click();
              }
            }
          });
        }
      }
    }
  });
}); 