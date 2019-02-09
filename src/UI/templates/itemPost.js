import {itemViewPost} from '../view-controller.js';

export default (userPhoto, userName, dateAndTimeCreate, postTitle, multmediaImage, postInfo) => {
  const postWall = document.getElementById('postWall');
  const contPost = document.createElement('section');
  contPost.setAttribute('id', userName);
  const divContent = `
        <div>
            <input id= "userPhoto" type="image" src="${userPhoto}" width="80" height="100" alt="Login"></input><br>
            <label id= "userName">${userName}</label><br>
            <label id= "dateAndTimeCreate">${dateAndTimeCreate}</label><br>
            <label id= "postTitle">${postTitle}</label><br>
        </div>
        <div>
            <input id="multmediaImage" type = "image" src="${multmediaImage}"><br>
            <label id = "postInfo">${postInfo}</label><br>
        </div>
        <div>
            <button id="likes">Likes</button>
            <button id="comment">Comentar</button>
            <button id="share">Compartir</button>
        </div>
    `;
  contPost.innerHTML = divContent;
  postWall.appendChild(contPost);
  const idPost = document.getElementById(userName);
  const likes = document.getElementById('likes');
  const comment = document.getElementById('comment');
  const share = document.getElementById('share');
    
  itemViewPost(idPost, likes, comment, share);

};