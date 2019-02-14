import Inite from './templates/pagInite.js';
import Login from './templates/pagLogin.js';
import Register from './templates/pagRegister.js';
import Home from './templates/home.js';
import Post from './templates/post.js';
//import objUpdatePost from './templates/updatePost.js';

import {editCreatePost} from './view-controller.js';

const changeTmp = (hash) => {
  if (hash === '#/' || hash === '' || hash === '#') {
    return viewTmp('#/inite');
  } else if (hash === '#/pagIniteSesion' || hash === '#/pagRegister' || hash === '#/home' || hash === '#/createPost' || hash === '#/updatePost') {
    return viewTmp(hash);
  } else {
    return viewTmp('#/inite');
  }
};

const viewTmp = (routers) => {
  const router = routers.substr(2, routers.length - 2);
  const container = document.getElementById('container');
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
    Post(editCreatePost); break;
  case 'createPost':
    // UpdatePost(userName, userPhoto, titlePost, multimedia, descriptionPost);
    Post(editCreatePost); break;
    break;
  default:
    Inite(); break;
  }
};

export const initRouter = () => {
  window.addEventListener('load', changeTmp(window.location.hash));
  if (('onhashchange' in window)) window.onhashchange = () => changeTmp(window.location.hash);
};