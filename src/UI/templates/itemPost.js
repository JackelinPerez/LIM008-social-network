export default (idPost, dataPost, deleteEdit, postWall, colorLike) => {
  const divContent = document.createElement('DIV');
  divContent.setAttribute('id', idPost);
  divContent.setAttribute('class', 'grid-item');

  const divContent_ = `
        <div>
            ${deleteEdit}
            <label id= "postType" class = "slogan">${dataPost.privacidad}</label><br>
            <input id= "userPhoto" type="image" src="${dataPost.fotoUsuario}" width="80" height="100" alt="Login"></input><br>
            <label id= "userName" class = "slogan">${dataPost.nombreUsuario}</label><br>
            <label id= "dateAndTimeCreate" class = "slogan">${dataPost.fecha}</label><br>
            <label id= "postType" class = "slogan">${dataPost.categoria}</label><br>
            <label id= "postTitle" class = "slogan">${dataPost.titulo}</label><br>
        </div>
        <div>
            <img id="multmediaImage" src="${dataPost.contenido.multimedia}" width="150" height="100"><br>
            <label id = "postInfo">${dataPost.contenido.descripcion}</label><br>
        </div>
        <div id= "#LikesComent_${idPost}">
            <label id="#likes" >Likes ${dataPost.likes.length}</label>
            <label id="#comentario">comentario ${dataPost.comentarios.length}</label>
        </div>       
        <div>
            <button id="likes_${idPost}" style= "${colorLike}">Likes</button>
            <button id="comment_${idPost}">Comentar</button>
            <button id="share_${idPost}">Compartir</button>
            <div id = "wallComentItemPost_${idPost}" class="grid-container-comment">
            </div>            
        </div>
    `;
  divContent.innerHTML = divContent_;
  postWall.appendChild(divContent);
  return 1;
};