const galeria = document.getElementById('galeria');

async function agregarTarjeta() {
  const nombre = document.getElementById('nombreInput').value.toLowerCase().trim();

  if (!nombre) {
    alert("Por favor escribe el nombre de un Pokémon.");
    return;
  }

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
    
    if (!res.ok) throw new Error("Pokémon no encontrado");

    const data = await res.json();
    const pokemon = {
      nombre: data.name,
      img: data.sprites.front_default
    };

    const html = `
      <div class="tarjeta" onclick="reemplazarImagen(event)">
        <button class="cerrar" onclick="eliminarTarjeta(event)">X</button>
        <div class="mitad-roja">
          <img src="${pokemon.img}" alt="${pokemon.nombre}">
        </div>
        <div class="mitad-blanca">
          <div class="nombre">${pokemon.nombre}</div>
        </div>
      </div>
    `;

    galeria.insertAdjacentHTML('beforeend', html);
    document.getElementById('nombreInput').value = "";
  } catch (error) {
    alert("Error: " + error.message);
  }
}

function eliminarTarjeta(e) {
  e.stopPropagation();
  const tarjeta = e.target.closest('.tarjeta');
  tarjeta.animate([
    { opacity: 1, transform: 'scale(1)' },
    { opacity: 0, transform: 'scale(0.5)' }
  ], {
    duration: 300,
    easing: 'ease-in-out'
  }).onfinish = () => tarjeta.remove();
}

async function reemplazarImagen(e) {
  const tarjeta = e.currentTarget;
  const nombre = tarjeta.querySelector('.nombre').textContent.toLowerCase();
  const imgActual = tarjeta.querySelector('img');
  
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
    const data = await res.json();
    const nuevaImg = document.createElement('img');
    nuevaImg.src = data.sprites.front_shiny || data.sprites.front_default;
    nuevaImg.alt = data.name;

    nuevaImg.onload = () => {
      tarjeta.querySelector('.mitad-roja').replaceChild(nuevaImg, imgActual);
    };
  } catch (error) {
    alert("No se pudo reemplazar la imagen.");
  }
}
