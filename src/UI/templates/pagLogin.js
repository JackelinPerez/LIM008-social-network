import { btnAcceptLoginAndSendToHome} from '../view-controller.js';

export default () => {
  const container = document.getElementById('container');
  const divContent = `
    <form>
      <h2 class="text-center-inite">communitytech</h2>
      <input type="text" id="inputEmail" class="username-o-correo" placeholder="nombre de usuario o correo">
      <input type="password" id="inputPassword" class="password-enter" placeholder="contraseña">
    </form>
    <button id="missedPassword" class="missed">¿Olvidaste tu contraseña?</button>    
    <button id="buttonAcceptLogin" class="btn-inite-sesion">Iniciar sesion</button>    
    `;
  container.innerHTML = divContent;

  const inputEmail = document.getElementById('inputEmail');
  const inputPassword = document.getElementById('inputPassword');
  const missedPassword = document.getElementById('missedPassword');
  const buttonAcceptLogin = document.getElementById('buttonAcceptLogin');
  btnAcceptLoginAndSendToHome(inputEmail, inputPassword, buttonAcceptLogin, missedPassword);

  return 1;
};