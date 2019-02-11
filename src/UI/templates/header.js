import {sendToPageOfInite, sendToPageOfRegister} from '../view-controller.js';
export const paintHeader = (hash) => {
  const headerContainer = document.getElementById('header-container');
  const headerHTML = `
      <div class="header">
      <h1 class="logo">communitytech<h1>
        ${hash === 'inite' ? `
        <div class="btn-inite-space">
        <button class="btn-inite-sesion inite-text" id="buttonLogin">
          Iniciar Sesión
        </button>
      </div>` : '<div></div>'}
      ${hash === 'pagRegister' ? `
      <div class="btn-inite-space">
      <button class="btn-inite-sesion inite-text" id="buttonLogin">
        Iniciar Sesión</button>
    </div>` : '<div></div>'}
      ${hash === 'pagIniteSesion' ? `      
        <div class=" btn-register-in-inite">
          <button class="btn-register register-text" id="buttonRegister">
            Registrar
          </button>
        </div> ` : '<div></div>'}
        ${hash === 'home' ? ` <div class="menu-in-inite">
        <nav class="menu-muro">
          <a href="#/misPosts">Mis Posts</a>
        </nav>
      </div>` : '<div></div>'} `;
  headerContainer.innerHTML = headerHTML;
  // Login
  const buttonLogin = document.getElementById('buttonLogin');
  const buttonRegister = document.getElementById('buttonRegister');
  sendToPageOfRegister(buttonRegister);
  sendToPageOfInite(buttonLogin);
  return 1;
};
  

