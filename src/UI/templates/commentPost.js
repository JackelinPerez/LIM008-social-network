import {createCommentPost} from '../view-controller.js';

export default (idPost) => {
  const container = document.getElementById('container');
  const divContent = `
    <div id = "wallComentPost_${idPost}" class="grid-container-comment">
    </div>
    <input id = "inputComment_${idPost}" class="tittle-of-post" placeholder="Comenta..." type="text"></input>
    <button id= "saveCommentPost_${idPost}">Publicar</publicar>
    <button id= "closeCommentPost_${idPost}">Cerrar</button>
    `;
  container.innerHTML = divContent;
  
  const inputComment = document.getElementById(`inputComment_${idPost}`);
  const wallComentPost = document.getElementById(`wallComentPost_${idPost}`);
  const saveCommentPost = document.getElementById(`saveCommentPost_${idPost}`);
  const closeCommentPost = document.getElementById(`closeCommentPost_${idPost}`);

  createCommentPost(inputComment, wallComentPost, saveCommentPost, closeCommentPost);
  return 1;
};


