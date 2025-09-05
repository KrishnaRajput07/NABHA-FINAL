
    (function(){
      const toggle = document.getElementById('langToggle');
      const buttons = Array.from(toggle.querySelectorAll('.lang-btn'));
      const hint = document.getElementById('hint');
      const continueBtn = document.getElementById('continueBtn');
      const skipBtn = document.getElementById('skipBtn');

      // Set initial from storage if available
      const stored = localStorage.getItem('nabha_lang');
      let activeIndex = 0;
      if (stored){
        const found = buttons.findIndex(b => b.dataset.lang === stored);
        if (found >= 0) { activeIndex = found; }
      }
      activate(activeIndex, false);

      buttons.forEach((btn, idx) => {
        btn.addEventListener('click', () => activate(idx, true));
        // keyboard support
        btn.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
            e.preventDefault();
            const dir = e.key === 'ArrowRight' ? 1 : -1;
            const next = (activeIndex + dir + buttons.length) % buttons.length;
            buttons[next].focus();
            activate(next, true);
          }
        });
      });

      continueBtn.addEventListener('click', () => {
        // redirect after choosing
        window.location.href = 'auth.html';
      });

      skipBtn.addEventListener('click', () => {
        window.location.href = 'auth.html';
      });

      function activate(index, save){
        activeIndex = index;
        toggle.style.setProperty('--active', index);
        buttons.forEach((b,i)=>{
          b.classList.toggle('active', i===index);
          b.setAttribute('aria-selected', i===index ? 'true' : 'false');
        });
        const code = buttons[index].dataset.lang;
        hint.textContent = 'Current: ' + (code==='en'?'English': code==='pa'?'ਪੰਜਾਬੀ':'हिंदी');
        if (save){
          localStorage.setItem('nabha_lang', code);
        }
      }
    }());