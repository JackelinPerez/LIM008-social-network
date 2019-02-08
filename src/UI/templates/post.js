import {createPost} from '../view-controller.js';

export default () => {
  const container = document.getElementById('container');
  const divContent = `
    <input type="image" src="" id= "userPhoto" width="80" height="100" alt="Login"></input><br>
    <label id= "userName" ></label>

    <h6 class="post-tittle-categoria">Categoría</h6>
    <select id = "postType">
        <option value="Inteligencia Artificial">Inteligencia Artificial</option>
        <option value="Realidad virtual">Realidad virtual</option>
        <option value="Robótica">Robótica</option>
        <option value="Ciberseguridad">Ciberseguridad</option>
        <option value="Dispositivos móviles">Dispositivos móviles</option>
        <option value="Curiosidades">Curiosidades</option>
    </select>
    <h7 class="tittle-of-post">Titulo</h7>
    <button id= "multimedia">+</button>
    <input id = "descriptionPost" placeholder="Escribe aquí" type="text"></input>
    <select id = "postPrivacy">
        <option value="amigos">Amigos</option>
        <option value="publico">Público</option>
    </select>
    <button id= "savePublicPost">Publicar</publicar>
    <button id= "closePost">Cerrar</button>
    `;
  container.innerHTML = divContent;

  const userName = document.getElementById('userName');
  const userPhoto = document.getElementById('userPhoto');
  const postType = document.getElementById('postType');
  const descriptionPost = document.getElementById('descriptionPost');
  const multimedia = document.getElementById('multimedia');    
  const postPrivacy = document.getElementById('postPrivacy');
  const savePublicPost = document.getElementById('savePublicPost');
  const closePost = document.getElementById('closePost');

  createPost(userPhoto, userName, postType, descriptionPost, multimedia, postPrivacy, savePublicPost, closePost);
  return 1;
};