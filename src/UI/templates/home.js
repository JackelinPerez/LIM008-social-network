import { mainRedSocial} from '../view-controller.js';

export default () => {
  const container = document.getElementById('container');
  const divContent = `
    <button class="btn-inite-sesion inite-text" id="buttonDeleteUser">Eliminar cuenta</button> 
    <button class="btn-inite-sesion inite-text" id="buttonLogOut">Salir</button> 
    <div class="buttonsOfCategories">
        <button>Inteligencia artificial</button>
        <button>Realidad virtual</button>
        <button>Robótica</button>
        <button>Ciberseguridad</button>
        <button>Dispositivos móviles</button>
        <button>Curiosidades(ciencias)</button>
    </div>

    <div class="section-of-new-post">
        <h6 class="text-create-new-post"> Crear nuevo post </h6>
        <input type="text" class="campo-de-texto" placeholder="¿Que hay de nuevo?></input>
        <img src="photoUrl.user">
    </div>

    <div class="container-of-posts>
    </div>`;
  container.innerHTML = divContent;

  // capturar todos los eventos de entrada del muro principal
  const buttonDeleteUser = document.getElementById('buttonDeleteUser');
  const buttonLogOut = document.getElementById('buttonLogOut');

  mainRedSocial(buttonDeleteUser, buttonLogOut);

  return 1;
};