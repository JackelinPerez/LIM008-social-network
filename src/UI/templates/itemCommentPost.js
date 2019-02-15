export default (idPost, dataPostComment, likesUsers, postCommentWall) => {
  const divContent = document.createElement('DIV');
  divContent.setAttribute('id', `idContainerComment_${idPost}`);
  divContent.setAttribute('class', 'grid-item-comment');

  const divContent_ = `
  <input type="image" src="${dataPostComment.propietario.foto}" width="80" height="100" alt="Login"></input><br>
  <label class = "slogan">${dataPostComment.propietario.nombre}</label><br>
  <label class = "slogan">${dataPostComment.contenido}</label>
    `;
  divContent.innerHTML = divContent_;
  postCommentWall.appendChild(divContent);
  return 1;
};