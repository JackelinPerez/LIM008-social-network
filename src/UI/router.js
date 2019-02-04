import Inite from '.UI/templates/pagInite.js';
import Login from '.UI/templates/pagLogin.js';
import Register from '.UI/templates/pagRegister.js';
import Home from '.UI/templates/home.js';

const changeTmp = (hash) => {
  if (hash === '#/' || hash === '' || hash === '#') {
    return viewTmp('#/inite');
  } else if (hash === '#/pagIniteSesion' || hash === '#/pagRegister' || hash === '#/home') {
    return viewTmp(hash);
  } else {
    return viewTmp('#/inite');
  }
}

const viewTmp = (routers) => {
    const router = routers.substr(2, routers.length - 2)
    const container = document.getElementById('container');
    container.innerHTML = '';
    switch (router) {
      case 'inite':       
          container.appendChild(Inite());  
        break;
      case 'pagIniteSesion':
        container.appendChild(Login());
        break;
        case 'pagRegister':       
          container.appendChild(Register());  
        break;
        case 'home':       
          container.appendChild(Home());  
        break;
      default:
        container.appendChild(Inite());
        break;
    }
  }

export const initRouter = () => {
    window.addEventListener('load', changeTmp(window.location.hash))
    if (("onhashchange" in window)) window.onhashchange = () => changeTmp(window.location.hash)
  }