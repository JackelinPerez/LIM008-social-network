import itemPost from './templates/itemPost.js';
import itemCommentPost from './templates/itemCommentPost.js';
import { changeHash, getDayAndHour, objectCreateUserProfile, objectCreatePost, ObjectUpdatePost, deletAndEdit} from '../Util/util.js';
import { createUser, authenticateFacebook, authenticateGoogle, logInUser, logOutUser,
  sendEmail, userStateChange, dataConnectUser, passwordReset} 
  from '../lib/authBD/authFireBase.js';

import { createBDFireStore, createPostBDFireStore, readBDFireStore, readDocBDFireStore,
  updateBDFireStore, deleteUserFireStore, deleteDocFireStore, filterBDFile, sendImagePost}
  from '../lib/crudBD/crudUser/crudUser.js';

export let editCreatePost = 0;
export let idPostCommentGlobal;

let idPostGlobal;
let userConnect, userConnectPhoto, userConnectName;


export const createPost = (userPhoto, userName, postType, titlePost,
  descriptionPost, multimedia, mmultmediaImage, postPrivacy, savePublicPost, closePost) => {
  let userPhoto_, userName_, userEmail_;

  console.log('Ingresa createPost');
  
  firebase.auth().onAuthStateChanged((result) => {
    if (result) {
      userEmail_ = result.email;
      readDocBDFireStore('Users', userEmail_)
        .then((respDoc) => {
          const saveDocumentUser = respDoc.data();
          if (saveDocumentUser !== undefined) {
            userPhoto_ = userPhoto.src = saveDocumentUser.foto;
            userName_ = userName.innerHTML = saveDocumentUser.usuario;
          }
        });  
    } else {
      console.log('Usuario se desconecto');
      changeHash('/inite');
    }
  });
      

  multimedia.onchange = (evt) => {
    let tgt = evt.target || window.event.srcElement,
      files = tgt.files;
  
    // Si existe el archivo cargarlo
    if (FileReader && files && files.length) {
      let fr = new FileReader();
      fr.onload = () => {
        mmultmediaImage.src = fr.result;
      };
      fr.readAsDataURL(files[0]);
    } else alert('El archivo No se cargo correctamente');
  };

  savePublicPost.addEventListener('click', () => {
    let objDataUser = {};

    const postPrivacyValue = postPrivacy.options[postPrivacy.selectedIndex].value;
    const postTypeValue = postType.options[postType.selectedIndex].value;

    console.log('postPrivacyValue: ' + postPrivacyValue + '; postTypeValue: ' + postTypeValue);

    let file = multimedia.files[0];
    // Subimos el archivo a firebase
    if (file !== undefined) {
      sendImagePost(file)
        .then((snapshot) => {
          // getURL lo usaremos al registrar
          snapshot.ref.getDownloadURL()
            .then((getURL) => {
              objDataUser = objectCreatePost(userEmail_, userPhoto_, userName_,
                getDayAndHour(), postPrivacyValue, postTypeValue, titlePost.value, descriptionPost.value, getURL); 
              console.log(objDataUser);
            
              createPostBDFireStore('Post', objDataUser)
                .then(() => console.log('documento se escribio correctamente en post'))
                .catch((err) => console.log(err.message));            
            });
        });
    } else {
      objDataUser = objectCreatePost(userEmail_, userPhoto_, userName_,
        getDayAndHour(), postPrivacyValue, postTypeValue, titlePost.value, descriptionPost.value, '');

      createPostBDFireStore('Post', objDataUser)
        .then(() => {
          console.log('documento se escribio correctamente en post');        
        })
        .catch(() => console.log(err.message));
    }
    changeHash('/home') ;    
  });

  closePost.addEventListener('click', () => {
    changeHash('/home');
  });
};

export const createCommentPost = (inputComment, wallComentPost, saveCommentPost, closeCommentPost) => {
  console.log('Usuario Conectado comment: ' + userConnect);
  console.log('idPostCommentar: ' + idPostCommentGlobal);
  if (userConnect === undefined || idPostCommentGlobal === undefined) {
    changeHash('/home');
    return 1;
  }

  closeCommentPost.addEventListener('click', () => {
    changeHash('/home');
  });

  viewAllCommentPost(wallComentPost, 'Post', idPostCommentGlobal);

  saveCommentPost.addEventListener('click', () => {
    // console.log('userConnectPhoto: '+ userConnectPhoto);
    // console.log('userConnectName: '+userConnectName);
    
    readDocBDFireStore('Post', idPostCommentGlobal)
      .then((dataPost) => {
        const newArrayPostComment = dataPost.data().comentarios;
        let newObjectPostComment = {
          propietario: {
            nombre: userConnectName,
            foto: userConnectPhoto},
          contenido: inputComment.value,
          likes: []        
        };
        newArrayPostComment.push(newObjectPostComment);
        createBDFireStore('Post', idPostCommentGlobal, {comentarios: newArrayPostComment})
          .then((result) => {
            console.log('Se guardo comentario correctamente');
            changeHash('/home');
          })
          .catch((err) => {
            console.log(err.message);
          });      
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
};
export const editPost = (userPhoto_, userName_, postType_, titlePost_, descriptionPost_, multimedia_,
  multmediaImage_, postPrivacy_, savePublicPost_, closePost_) => {
  console.log('Ingresa EditPost');
  console.log('idPostGlobal: ' + idPostGlobal);
  
  if (idPostGlobal === undefined) changeHash('/home');
  else {
    readDocBDFireStore('Post', idPostGlobal)
      .then((dataPost) => {
        const objdataPost = dataPost.data();

        // se cargan la dataPost de la BD
        userPhoto_.src = objdataPost.fotoUsuario;
        userName_.innerHTML = objdataPost.nombreUsuario;
        titlePost_.value = objdataPost.titulo;
        descriptionPost_.value = objdataPost.contenido.descripcion;
        multmediaImage_.src = objdataPost.contenido.multimedia;

        for (let i, j = 0; i = postType_.options[j]; j++) {
          if (i.value === objdataPost.categoria) {
            postType_.selectedIndex = j;
            break;
          }
        }

        for (let i, j = 0; i = postPrivacy_.options[j]; j++) {
          if (i.value === objdataPost.privacidad) {
            postPrivacy_.selectedIndex = j;
            break;
          }
        }

        // Se captura los cambios del usuario

        savePublicPost_.addEventListener('click', () => {
          let objDataUser = {};
          const postPrivacyValue = postPrivacy.options[postPrivacy.selectedIndex].value;
          const postTypeValue = postType.options[postType.selectedIndex].value;
  
          objDataUser = ObjectUpdatePost(postPrivacyValue, postTypeValue, titlePost_.value, descriptionPost_.value, objdataPost.contenido.multimedia);
  
          updateBDFireStore('Post', idPostGlobal, objDataUser)
            .then(() => {
              console.log('documento se actualizo correctamente en post');
              changeHash('/home') ;
            })
            .catch(() => console.log(err.message));    
        });
      }) 
      .catch((err) => {
        console.log(err.message);
        changeHash('/inite');
      });
  
    closePost_.addEventListener('click', () => {
      changeHash('/home');
    });
  }
};

export const mainRedSocial = (userPhoto, userName, buttonDeleteUser, buttonLogOut, createPost, postWall, filterTypePost) => {
  // let userConnect;

  firebase.auth().onAuthStateChanged((result) => {
    if (result) {
      console.log('Usuario conectado es: ' + result.email);      
      userConnect = result.email;  
      readDocBDFireStore('Users', userConnect)
        .then((respDoc) => {
          const saveDocumentUser = respDoc.data();
          if (saveDocumentUser !== undefined) {
            userConnectPhoto = userPhoto.src = saveDocumentUser.foto;
            userConnectName = userName.innerHTML = saveDocumentUser.usuario;

            viewAllPost(postWall, userConnect, 'Post', 'nombreUsuario', saveDocumentUser.usuario,
              'privacidad', 'publico', '', '');

            filterTypePost.addEventListener('change', () => {        
              const postTypeValue = filterTypePost.options[filterTypePost.selectedIndex].value;  
              if (postTypeValue === 'Todos')
                viewAllPost(postWall, userConnect, 'Post', 'nombreUsuario', saveDocumentUser.usuario,
                  'privacidad', 'publico', '', ''); 
              else
                viewAllPost(postWall, userConnect, 'Post', 'nombreUsuario', saveDocumentUser.usuario,
                  'privacidad', 'publico', 'categoria', postTypeValue);
            });
          }
        });
    
      postWall.addEventListener('click', () => {
        const targetEventID = event.target.id;
        itemViewPost(targetEventID, userConnect);
      });
    } else {
      console.log('Usuario No conectado');
      changeHash('/inite') ;
    }    
  });

  buttonLogOut.addEventListener('click', () => {
    logOutUser()
      .then(() => {
        console.log('Usuario fuera de session');
        changeHash('/inite') ;
      })
      .catch((err) => {
        console.log(err.message);
      }); 
  });

  buttonDeleteUser.addEventListener('click', () => {
    deleteUserFireStore('Users','Post', userConnect, userConnectName);
    changeHash('/inite') ;
  });

  createPost.addEventListener('click', () => {
    editCreatePost = 1;
    changeHash('/createPost');
  });

  return 1;
};

const detectPromisesCreateUser = (funct) => {
  funct
    .then((result) => {
      readDocBDFireStore('Users', result.user.email)
        .then((respDoc) => {
          if (respDoc.data() === undefined) {
            console.log('No encontro documento');
            let objDataUser = {};
            const dataUser = result.user;

            objDataUser = objectCreateUserProfile(dataUser.displayName, dataUser.email, dataUser.photoURL, getDayAndHour());
            
            console.log(objDataUser);
            
            createBDFireStore('Users', objDataUser.correo, objDataUser)
              .then(() => console.log('documento se escribio correctamente'))
              .catch(() => console.log(err.message));                
          } else console.log('Usuario ya existe en la BD');

          changeHash('/home') ;
        });
    })
    .catch((err) => {
      console.log(err.code);
      console.log(err.credential);
      console.log('cayo en error: detectPromisesCreateUser');
      
      alert(err.message !== undefined ? err.message : err.email);
    });
};

export const registerOnSubmit = (buttonRegister) => {
  buttonRegister.addEventListener('click', () => {
    changeHash('/pagRegister') ;
  });
};

export const btnAcceptRegisterAndSendToHome = (userName, userEmail, userPassword, buttonAcept) => {
  buttonAcept.addEventListener('click', () => {
    createUser(userEmail.value, userPassword.value)
      .then((result) => {
        let objctCreate = objectCreateUserProfile(userName.value, result.user.email, '', getDayAndHour());

        alert(`Se te ha enviado un mensaje de correo electronico:${result.user.email}
          Por favor de verificarlo para terminar con el proceso! Gracias`);

        const config = {
          url: 'http://localhost:8887/src'
        };
        // sendEmail(config)
        result.user.sendEmailVerification(config)
          .catch((err) => {
            alert(err.message);
          });

        createBDFireStore('Users', result.user.email, objctCreate)
          .then(() => console.log('documento se escribio correctamente'))
          .catch(() => console.log(err.message));

        changeHash('/inite') ;
      })
      .catch((err) => {
        console.log(err.code);
        console.log(err.credential);
        alert(err.message !== undefined ? err.message : err.email);  
      });  
  });
};

export const loginUser = (buttonLogin) => {
  buttonLogin.addEventListener('click', () => {
    changeHash('/pagIniteSesion');
  });
};

export const btnAcceptLoginAndSendToHome = (inputEmail, inputPassword, buttonAcceptLogin, missedPassword) => {
  buttonAcceptLogin.addEventListener('click', () => {
    logInUser(inputEmail.value, inputPassword.value)
      .then(() => changeHash('/home'))
      .catch((err) => console.log(err.message));    
  });

  missedPassword.addEventListener('click', () => {
    passwordReset(inputEmail.value)
      .then(() => alert('Se te envió un correo para la recuperación de tu contraseña,sigue los pasos'))
      .catch((err) => console.log(err.message));    
  });  
};

const viewAllCommentPost = (postWallComment, postCollection, postIdCollection) => {
  console.log('postCollection: ' + postCollection + ' postIdCollection: ' + postIdCollection);
  
  if (postWallComment !== undefined || postWallComment === null) {
    readDocBDFireStore(postCollection, postIdCollection)
      .then((docPost) => {
        postWallComment.innerHTML = '';
        const allPostComment = docPost.data().comentarios;
        console.log('docPost: ' + Object.keys(docPost.data()));
        allPostComment.forEach((dataCommentPost, idCommentPost) => {
          itemCommentPost(idCommentPost, dataCommentPost, '', postWallComment);
        });
      })
      .catch((err) => {
        console.log('err comment: '+ err.message);
        
      });

  }
};

const viewAllPost = (postWall, userConnect, postCollection, key1, value1, key2, value2, key3, value3) => {
  readBDFireStore(postCollection)
    .onSnapshot((doc) => {
      const arrPost = [];
      let objWall = [];
      postWall.innerHTML = '';

      doc.forEach((ele) => {
        arrPost.push({ id: ele.id, ...ele.data()});
      });

      if (key3.length > 0 && value3.length > 0)
        objWall = arrPost.filter(ele => ((ele[key1] === value1 || ele[key2] === value2) && (ele[key3] === value3)));
      else
        objWall = arrPost.filter(ele => (ele[key1] === value1 || ele[key2] === value2));
  
      objWall.forEach((dataPost) => {
        let colorLikeInit = '';
        const idPost = dataPost.id;
        console.log('post.id: ' + idPost);

        const saveNameUserLike = dataPost.likes;

        const detectLike = saveNameUserLike.filter((userLike) => userLike === userConnect);
        if (detectLike.length > 0) {
          console.log('Ya DIO LIKE');
          colorLikeInit = 'background: #de555e;';
        }

        if (userConnect === dataPost.correoUsuario)
          itemPost(idPost, dataPost, deletAndEdit(idPost), postWall, colorLikeInit);
        else itemPost(idPost, dataPost, '', postWall, colorLikeInit);

        const wallComentPost = document.getElementById(`wallComentItemPost_${idPost}`);
        viewAllCommentPost(wallComentPost, 'Post', idPost);
      });
    });
};


export const accesWithFbOrGoogle = (buttonFacebook, buttonGoogle) => {
  buttonFacebook.addEventListener('click', () => {
    detectPromisesCreateUser(authenticateFacebook());
  });
  buttonGoogle.addEventListener('click', () => {
    detectPromisesCreateUser(authenticateGoogle());
  });
};

export const itemViewPost = (targetID, nameUserConnect) => {
  if (targetID) {
    if (targetID.indexOf('editPost_') > -1) {
      const idPost = targetID.substr(('editPost_').length, targetID.length - ('editPost_').length);
      console.log('id= ' + idPost);

      idPostGlobal = idPost;
      editCreatePost = 0;
      changeHash('/createPost');
    } else if (targetID.indexOf('deletePost_') > -1) {
      const idPost = targetID.substr(('deletePost_').length, targetID.length - ('deletePost_').length);
      const getIdContainerItem = document.getElementById(idPost);
      deleteDocFireStore('Post', idPost)
        .then(() => {
          postWall.removeChild(getIdContainerItem);
          console.log('Se elimino correctamente Post');
        })
        .catch((err) => {
          console.log('err= ' + err.message);
        });
    } else if (targetID.indexOf('likes_') > -1) {
      // logica de likes
      const idPost = targetID.substr(('likes_').length, targetID.length - ('likes_').length);
      console.log('id_likes= ' + idPost);

      readDocBDFireStore('Post', idPost)
        .then((dataPost) => {
          const saveNameUserLike = dataPost.data().likes;
          let newArrayLikes = [];

          const detectLike = saveNameUserLike.filter((userLike) => userLike === nameUserConnect);
          if (detectLike.length > 0) {
            saveNameUserLike.map((userLike) => {
              if (userLike !== nameUserConnect) newArrayLikes.push(userLike);
              return 1;
            });
          } else {
            newArrayLikes = saveNameUserLike;
            newArrayLikes.push(nameUserConnect);
          }

          console.log('newArrayLikes: ' + newArrayLikes);

          createBDFireStore('Post', idPost, {likes: newArrayLikes})
            .then((result) => {
              if (detectLike.length > 0) document.getElementById(targetID).style.backgroundColor = '#FFFFFF';
              else document.getElementById(targetID).style.backgroundColor = '#de555e';
            })
            .catch((err) => {
              console.log(err.message);
            });
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (targetID.indexOf('comment_') > -1) {
      const idPost = targetID.substr(('comment_').length, targetID.length - ('comment_').length);
      console.log('id_comment= ' + idPost);
      idPostCommentGlobal = idPost;
      changeHash('/createPostComment');
    }
  }
};
