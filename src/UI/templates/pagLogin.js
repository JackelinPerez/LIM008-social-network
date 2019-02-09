import { btnAcceptLoginAndSendToHome} from '../view-controller.js';

export default () => {
  const container = document.getElementById('container');
  const divContent = `
    <form>
      <h2 class="text-center">communitytech</h2>
      <input type="text" id="inputEmail" class="username-o-correo" placeholder="nombre de usuario o correo">
      <input type="password" id="inputPassword" class="password-enter" placeholder="contraseña">
      <h5 class="missed">¿Olvidaste tu cuenta?</h7>
      <button id="buttonAcceptLogin" class="btn-inite-sesion">Iniciar sesion</button>
    </form>
    `;
  container.innerHTML = divContent;

  const inputEmail = document.getElementById('inputEmail');
  const inputPassword = document.getElementById('inputPassword');
  const buttonAcceptLogin = document.getElementById('buttonAcceptLogin');
  btnAcceptLoginAndSendToHome(inputEmail, inputPassword, buttonAcceptLogin );

  return 1;
};