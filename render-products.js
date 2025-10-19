// Renders product cards from JSON edited in Decap CMS
// JSON path: /content/products/products.json
(function(){
  const container = document.querySelector('#products-cards');
  if(!container) return;

  fetch('/content/products/products.json', {cache:'no-cache'})
    .then(r => r.json())
    .then(data => {
      if(!Array.isArray(data.products)) return;
      container.innerHTML = data.products.map(p => `
        <article class="card" data-stars="${p.rating ?? ''}">
          <img class="thumb" alt="${p.title ?? ''}" src="${p.image ?? ''}"/>
          <div class="pad">
            <h4>${p.title ?? ''}</h4>
            <div class="sub">${p.subtitle ?? ''}</div>
            ${p.buy_url ? `<a class="buy" href="${p.buy_url}" target="_blank" rel="nofollow noopener">Comprar en Amazon</a>` : ''}
            ${p.why ? `<a class="why" href="#" onclick="this.nextElementSibling.style.display='block';this.style.display='none';return false;">Ver por qué lo recomiendo</a>
              <div class="reason">${p.why}</div>` : ''}
          </div>
        </article>
      `).join('');
    })
    .catch(console.error);
})();