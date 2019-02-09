import Inite from './templates/pagInite.js';
import Login from './templates/pagLogin.js';
import Register from './templates/pagRegister.js';
import Home from './templates/home.js';
import Post from './templates/post.js';

const changeTmp = (hash) => {
  if (hash === '#/' || hash === '' || hash === '#') {
    return viewTmp('#/inite');
  } else if (hash === '#/pagIniteSesion' || hash === '#/pagRegister' || hash === '#/home' || hash === '#/createPost') {
    return viewTmp(hash);
  } else {
    return viewTmp('#/inite');
  }
};

const viewTmp = (routers) => {
  const router = routers.substr(2, routers.length - 2);
  const container = document.getElementById('container');    
  // const headerContainer = document.getElementById('header-container');
  // headerContainer.innerHTML = paintHeader(router);
  container.innerHTML = '';
  switch (router) {
  case 'inite':
    Inite(); break;
  case 'pagIniteSesion':
    Login(); break;
  case 'pagRegister':
    Register(); break;
  case 'home':
    Home(); break;
  case 'createPost':
    Post(); break;
  default:
    Inite(); break;
  }
};

export const initRouter = () => {
  window.addEventListener('load', changeTmp(window.location.hash));
  if (('onhashchange' in window)) window.onhashchange = () => changeTmp(window.location.hash);
};