import itemPost from './templates/itemPost.js';
import itemCommentPost from './templates/itemCommentPost.js';
import {
  changeHash, getDayAndHour, objectCreateUserProfile, objectCreatePost,
  ObjectUpdatePost, deletAndEdit
} from '../Util/util.js';
import { messageAuth_1, messageAuth_2, messageAuth_3, messageAuth_4, messageAuth_5 } from '../Util/util.js';
import {
  createUser, authenticateFacebook, authenticateGoogle, logInUser, logOutUser,
  sendEmail, userStateChange, passwordReset
}
  from '../lib/authBD/authFireBase.js';

import {
  createIdDocBDFireStore, createPostBDFireStore, readCollectionBDFireStore, readDocBDFireStore,
  updateDocBDFireStore, deleteUserFireStore, deleteDocFireStore, sendImagePost
}
  from '../lib/crudBD/crudUser/crudUser.js';

export let editCreatePost = 0;
export let idPostCommentGlobal;

let idPostGlobal;
let userConnect, userConnectPhoto, userConnectName;


export const createPost = (userPhoto, userName, postType, titlePost,
  descriptionPost, multimedia, mmultmediaImage, postPrivacy, savePublicPost, closePost) => {

  console.log('Ingresa createPost');

  // EN CASO QUE LA PAGINA SE REFRESQUE
  if (userConnect === undefined || userConnectPhoto === undefined || userConnectName === undefined) {
    changeHash('/home');
  }
  else {
    const userEmail_ = userConnect;
    const userPhoto_ = userConnectPhoto;
    const userName_ = userConnectName;


    multimedia.onchange = (evt) => {
      let tgt = evt.target || window.event.srcElement,
        files = tgt.files;

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

                // MAIN CREA EL POST MULTIMEDIA EN LA BD
                createPostBDFireStore('Post', objDataUser)
                  .then(() => console.log('documento se escribio correctamente en post'))
                  .catch((err) => console.log(err.message));
              });
          });
      } else {
        objDataUser = objectCreatePost(userEmail_, userPhoto_, userName_,
          getDayAndHour(), postPrivacyValue, postTypeValue, titlePost.value, descriptionPost.value, '');

        // MAIN CREA EL POST EN LA BD
        createPostBDFireStore('Post', objDataUser)
          .then(() => {
            console.log('documento se escribio correctamente en post');
          })
          .catch(() => console.log(err.message));
      }
      changeHash('/home');
    });

    closePost.addEventListener('click', () => {
      changeHash('/home');
    });
  }
};

export const createCommentPost = (inputComment, wallComentPost, saveCommentPost, closeCommentPost) => {
  console.log('Usuario Conectado comment: ' + userConnect);
  console.log('idPostCommentar: ' + idPostCommentGlobal);
  // EN CASO QUE LA PAGINA SE REFRESQUE
  if (userConnect === undefined || idPostCommentGlobal === undefined) {
    changeHash('/home');
    return 1;
  }

  closeCommentPost.addEventListener('click', () => {
    changeHash('/home');
  });

  viewAllCommentPost(wallComentPost, 'Post', idPostCommentGlobal);

  saveCommentPost.addEventListener('click', () => {

    readDocBDFireStore('Post', idPostCommentGlobal)
      .then((dataPost) => {

        const newArrayPostComment = dataPost.data().comentarios;
        let newObjectPostComment = {
          propietario: {
            nombre: userConnectName,
            foto: userConnectPhoto
          },
          contenido: inputComment.value,
          likes: []
        };
        newArrayPostComment.push(newObjectPostComment);

        // MAIN CREA COMENTARIOS EN LA BD
        createIdDocBDFireStore('Post', idPostCommentGlobal, { comentarios: newArrayPostComment })
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

  // EN CASO QUE LA PAGINA SE REFRESQUE
  if (idPostGlobal === undefined) changeHash('/home');
  else {
    readDocBDFireStore('Post', idPostGlobal)
      .then((dataPost) => {
        const objdataPost = dataPost.data();

        // Se carga el contenido del POST en la pantalla
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

          // MAIN EDITA POST EN LA BD
          let confirmUpdate = confirm("Deseas realmente actualizar tus cambios?");
          if (confirmUpdate === true) {
            updateDocBDFireStore('Post', idPostGlobal, objDataUser)
              .then(() => {
                console.log('documento se actualizo correctamente en post');
                changeHash('/home');
              })
              .catch(() => console.log(err.message));
          }
          else {
            console.log('documento No se actualizo por ordenes del usuario ');
            changeHash('/home');
          }

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

const stateUser = (changeUserStatus, elements) => {

  if (changeUserStatus) {
    console.log('Usuario conectado es: ' + changeUserStatus.email);
    userConnect = changeUserStatus.email;
    readDocBDFireStore('Users', userConnect)
      .then((respDoc) => {
        const saveDocumentUser = respDoc.data();
        if (saveDocumentUser !== undefined) {
          userConnectPhoto = elements.userPhoto.src = saveDocumentUser.foto;
          userConnectName = elements.userName.innerHTML = saveDocumentUser.usuario;

          viewAllPost(elements.postWall, userConnect, 'Post', 'nombreUsuario', saveDocumentUser.usuario,
            'privacidad', 'publico', '', '');

          elements.filterTypePost.addEventListener('change', () => {
            const postTypeValue = elements.filterTypePost.options[elements.filterTypePost.selectedIndex].value;
            if (postTypeValue === 'Todos')
              viewAllPost(elements.postWall, userConnect, 'Post', 'nombreUsuario', saveDocumentUser.usuario,
                'privacidad', 'publico', '', '');
            else
              viewAllPost(elements.postWall, userConnect, 'Post', 'nombreUsuario', saveDocumentUser.usuario,
                'privacidad', 'publico', 'categoria', postTypeValue);
          });
        }
      });

    // MAIN CAPTURA LOS EVENTOS DE CADA POST PUBLICADO
    elements.postWall.addEventListener('click', () => {
      const targetEventID = event.target.id;
      itemViewPost(targetEventID, userConnect);
    });

    elements.createPost.addEventListener('click', () => {
      editCreatePost = 1;
      changeHash('/createPost');
    });

    elements.buttonDeleteUser.addEventListener('click', () => {
      deleteUserFireStore('Users', 'Post', userConnect, userConnectName);
      changeHash('/inite');
    });

    elements.buttonLogOut.addEventListener('click', () => {
      logOutUser()
        .then(() => {
          console.log('Usuario fuera de session');
          changeHash('/inite');
        })
        .catch((err) => {
          console.log(err.message);
        });
    });

  } else {
    console.log('Usuario No conectado');
    changeHash('/inite');
  }
}

export const mainRedSocial = (userPhoto, userName, buttonDeleteUser, buttonLogOut, createPost, postWall, filterTypePost) => {

  const objElements = {
    userPhoto, userName, postWall, filterTypePost, createPost, buttonDeleteUser, buttonLogOut
  }
  userStateChange(stateUser, objElements);
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

            // MAIN CREA EL USUARIO EN LA BD POR AUTENTIC FACE/GOOGLE
            createIdDocBDFireStore('Users', objDataUser.correo, objDataUser)
              .then(() => console.log('documento se escribio correctamente'))
              .catch(() => console.log(err.message));
          } else console.log('Usuario ya existe en la BD');

          changeHash('/home');
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
    changeHash('/pagRegister');
  });
};

export const btnAcceptRegisterAndSendToHome = (userName, userEmail, userPassword, buttonAcept) => {
  buttonAcept.addEventListener('click', () => {
    if (userName.value.length > 0) {
      createUser(userEmail.value, userPassword.value)
        .then((result) => {
          let objctCreate = objectCreateUserProfile(userName.value, result.user.email, '', getDayAndHour());

          const config = {
            url: 'http://localhost:8887/src'
          };
          sendEmail(result.user, config)
            .then(() => {
              alert(`Se te ha enviado un mensaje de correo electronico:${result.user.email}
            Por favor de verificarlo para terminar con el proceso! Gracias`);
            })
            .catch((err) => {
              alert('No pudimos enviarte el email de confirmacion, intenta volver a registrarte');
            });

          // MAIN CREA EL USUARIO EN LA BD POR AUTENTIC REGISTRO
          createIdDocBDFireStore('Users', result.user.email, objctCreate)
            .then(() => console.log('documento se escribio correctamente'))
            .catch((err) => {
              console.log(err.message);
            });

          changeHash('/inite');
        })
        .catch((err) => {
          console.log(err.message);
          if (err.message === messageAuth_1)
            alert('Usuario ya existe en la BD, por favor usar otro correo');
          if (err.message === messageAuth_2)
            alert('El email tiene un formato incorrecto por favor de verificar si cumple con el formato: ***@***.***');
          if (err.message === messageAuth_3)
            alert('Tu contraseña de tener almenos 6 caracteres');
        });
    }
    else {
      alert('No haz escrito tu nombre de Usuario');
    }
  });
};

export const loginUser = (buttonLogin) => {
  buttonLogin.addEventListener('click', () => {
    changeHash('/pagIniteSesion');
  });
};

export const btnAcceptLoginAndSendToHome = (inputEmail, inputPassword, buttonAcceptLogin, missedPassword) => {
  buttonAcceptLogin.addEventListener('click', () => {
    // MAIN LOGEA AL USUARIO EN LA REDSOCIAL
    logInUser(inputEmail.value, inputPassword.value)
      .then(() => changeHash('/home'))
      .catch((err) => {
        console.log(err.message);
        if (err.message === messageAuth_2)
          alert('El email tiene un formato incorrecto por favor de verificar si cumple con el formato: ***@***.***');
        if (err.message === messageAuth_4)
          alert('El usuario No esta registrado');
        if (err.message === messageAuth_5)
          alert('Tu contraseña es incorrecta');
      });
  });

  missedPassword.addEventListener('click', () => {
    // MAIN RESETEA EL PASSWORD DEL USUARIO EN LA REDSOCIAL
    passwordReset(inputEmail.value)
      .then(() => alert('Se te envió un correo para la recuperación de tu contraseña,sigue los pasos'))
      .catch((err) => {
        console.log(err.message);
      });
  });
};

const viewAllCommentPost = (postWallComment, postCollection, postIdCollection) => {
  console.log('postCollection: ' + postCollection + ' postIdCollection: ' + postIdCollection);

  if (postWallComment !== undefined || postWallComment === null) {
    // MAIN OBTIENE TODOS LOS COMENTARIOS DEL POST QUE SELECCIONO EL USUARIO
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
        console.log('err comment: ' + err.message);

      });

  }
};

const getAllPost = (dataAllPost, elementsWall) => {
  const arrAllPost = [];
  let arrObjWall = [];
  elementsWall.postWall.innerHTML = '';

  // MAIN OBTIENE TODOS LOS POST DE LA REDSOCIAL
  dataAllPost.forEach((ele) => {
    arrAllPost.push({ id: ele.id, ...ele.data() });
  });

  // MAIN EVALUA EL TIPO DE FILTRO DE LOS POST
  if (elementsWall.key3.length > 0 && elementsWall.value3.length > 0) // FILTROS DE MENU
    arrObjWall = arrAllPost.filter(ele => ((ele[elementsWall.key1] === elementsWall.value1 ||
      ele[elementsWall.key2] === elementsWall.value2) && (ele[elementsWall.key3] === elementsWall.value3)));
  else // FILTROS PRIVADO Y PUBLICO
    arrObjWall = arrAllPost.filter(ele => (ele[elementsWall.key1] === elementsWall.value1 ||
      ele[elementsWall.key2] === elementsWall.value2));

  arrObjWall.forEach((dataPost) => {
    let colorLikeInit = '';
    const idPost = dataPost.id;
    console.log('post.id: ' + idPost);

    const saveNameUserLike = dataPost.likes;

    const detectLike = saveNameUserLike.filter((userLike) => userLike === elementsWall.userConnect);
    if (detectLike.length > 0) {
      console.log('Ya DIO LIKE');
      colorLikeInit = 'background: #de555e;';
    }

    if (elementsWall.userConnect === dataPost.correoUsuario)
      itemPost(idPost, dataPost, deletAndEdit(idPost), elementsWall.postWall, colorLikeInit);
    else itemPost(idPost, dataPost, '', elementsWall.postWall, colorLikeInit);

    const wallComentPost = document.getElementById(`wallComentItemPost_${idPost}`);
    viewAllCommentPost(wallComentPost, 'Post', idPost);
  });
}

const viewAllPost = (postWall, userConnect, postCollection, key1, value1, key2, value2, key3, value3) => {
  const elementsWall = {
    postWall, userConnect, key1, value1, key2, value2, key3, value3
  };
  readCollectionBDFireStore(postCollection, getAllPost, elementsWall);
};


export const accesWithFbOrGoogle = (buttonFacebook, buttonGoogle) => {
  buttonFacebook.addEventListener('click', () => {
    // MAIN EL USUARIO SE REGISTRA POR AUTENTICACION DE FACEBOOK EN LA BD
    detectPromisesCreateUser(authenticateFacebook());
  });
  buttonGoogle.addEventListener('click', () => {
    // MAIN EL USUARIO SE REGISTRA POR AUTENTICACION DE GOOGLE EN LA BD
    detectPromisesCreateUser(authenticateGoogle());
  });
};

export const itemViewPost = (targetID, nameUserConnect) => {
  if (targetID) {
    // MAIN CAPTURA EVENTO DE EDITAR CONTENIDO DEL POST
    if (targetID.indexOf('editPost_') > -1) {
      const idPost = targetID.substr(('editPost_').length, targetID.length - ('editPost_').length);
      console.log('id= ' + idPost);

      idPostGlobal = idPost;
      editCreatePost = 0;
      changeHash('/createPost');
    }
    // MAIN CAPTURA EVENTO DE ELIMINAR POST
    else if (targetID.indexOf('deletePost_') > -1) {
      const idPost = targetID.substr(('deletePost_').length, targetID.length - ('deletePost_').length);
      const getIdContainerItem = document.getElementById(idPost);
      // MAIN ELIMINA AL POST
      let confirmDeletePost = confirm("Deseas realmente eliminar el Post?");
      if (confirmDeletePost === true) {
        deleteDocFireStore('Post', idPost)
          .then(() => {
            postWall.removeChild(getIdContainerItem);
            console.log('Se elimino correctamente Post');
          })
          .catch((err) => {
            console.log('err= ' + err.message);
          });
      }
    }
    // MAIN CAPTURA EVENTO DE DAR LIKE AL CONTENIDO DEL POST
    else if (targetID.indexOf('likes_') > -1) {
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

          // MAIN GUARDA O BORRA EL LIKE DEL POST
          createIdDocBDFireStore('Post', idPost, { likes: newArrayLikes })
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
    }
    // MAIN CAPTURA EVENTO DE COMENTAR AL CONTENIDO DEL POST
    else if (targetID.indexOf('comment_') > -1) {
      const idPost = targetID.substr(('comment_').length, targetID.length - ('comment_').length);
      console.log('id_comment= ' + idPost);
      idPostCommentGlobal = idPost;
      changeHash('/createPostComment');
    }
  }
};
