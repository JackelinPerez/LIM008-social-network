import {itemViewPost} from '../view-controller.js';

export default (idPost, userPhoto, userName, dateAndTimeCreate, postTitle, multmediaImage, postInfo) => {
  const divContent = `
  <div id = "${idPost}" class= "grid-item">
        <div>
            <button id="editPost">Editar</button>
            <button id="deletePost">Eliminar</button>           
            <input id= "userPhoto" type="image" src="${userPhoto}" width="80" height="100" alt="Login"></input><br>
            <label id= "userName">${userName}</label><br>
            <label id= "dateAndTimeCreate">${dateAndTimeCreate}</label><br>
            <label id= "postTitle">${postTitle}</label><br>
        </div>
        <div>
            <img id="multmediaImage" src="${multmediaImage}" width="150" height="100"><br>
            <label id = "postInfo">${postInfo}</label><br>
        </div>
        <div>
            <button id="likes">Likes</button>
            <button id="comment">Comentar</button>
            <button id="share">Compartir</button>
        </div>
    </div>
    `;

  const editPost = document.getElementById('editPost');
  const deletePost = document.getElementById('deletePost');
  const idPost_ = document.getElementById(idPost);
  const likes = document.getElementById('likes');
  const comment = document.getElementById('comment');
  const share = document.getElementById('share');
    
  itemViewPost(idPost_, likes, comment, share, editPost, deletePost);

  return divContent;
};