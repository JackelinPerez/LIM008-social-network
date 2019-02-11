import Inite from './templates/pagInite.js';
import Login from './templates/pagLogin.js';
import Register from './templates/pagRegister.js';
import Home from './templates/home.js';
import Post from './templates/post.js';
import {paintHeader} from './templates/header.js';
import {photoUserGlobal, nameUserGlobal} from './view-controller.js';

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
  const headerContainer = document.getElementById('header-container');
  headerContainer.innerHTML = '';
  container.innerHTML = '';
  switch (router) {
  case 'inite':
    Inite(); 
    paintHeader(router);break;
  case 'pagIniteSesion':
    Login();
    paintHeader(router); break;
  case 'pagRegister':
    Register();
    paintHeader(router); break;
  case 'home':
    Home();
    paintHeader(router); break;
  case 'createPost':
    Post(nameUserGlobal, photoUserGlobal);
    paintHeader(router); 
    break;
  default:
    Inite();
    paintHeader(router); break;
  }
};

export const initRouter = () => {
  window.addEventListener('load', changeTmp(window.location.hash));
  if (('onhashchange' in window)) window.onhashchange = () => changeTmp(window.location.hash);
};