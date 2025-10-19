// Moves the gold underline to the menu item that corresponds
// to the section in view. Needs anchors: #inicio, #productos, #acerca, #quien
(function(){
  const map = {
    inicio: document.querySelector('nav a[href="#inicio"]'),
    productos: document.querySelector('nav a[href="#productos"]'),
    acerca: document.querySelector('nav a[href="#acerca"]'),
    quien: document.querySelector('nav a[href="#quien"]')
  };
  const sections = Object.keys(map)
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if(!sections.length) return;

  let last = null;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e => {
      if(e.isIntersecting){
        const id = e.target.id;
        if(map[id]){
          if(last) last.classList.remove('is-active');
          map[id].classList.add('is-active');
          last = map[id];
        }
      }
    })
  }, { rootMargin: "-40% 0px -45% 0px", threshold: 0.01 });

  sections.forEach(s => obs.observe(s));
})();