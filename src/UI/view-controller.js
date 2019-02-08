import { createUser, authenticateFacebook, authenticateGoogle, logInUser, logOutUser, userStateChange,passwordReset} 
  from '../lib/authBD/authFireBase.js';

import { createUserFireStore, readUserFireStore, updateUserFireStore, deleteUserFireStore}
  from '../lib/crudBD/crudUser/crudUser.js';

import {createPostFireStore, readPostFireStore, readDocPostFireStore, deletePostFireStore, updatePostFireStore} from '../lib/crudBD/crudPost/crudPost.js';
import post from './templates/post.js';

const changeHash = (hash) => {
  location.hash = hash;
};

const getDayAndHour = () => {
  let h, m, s; 

  const checkTime = (i) => {
    if (i < 10) i = '0' + i;
    return i;
  };
  
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
    'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  const date = new Date();
  
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const yy = date.getFullYear();
  
  h = date.getHours();
  m = date.getMinutes();
  s = date.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  
  const fechaYhora = day + ' ' + months[month] + ' ' + yy + ' a las ' + h + ':' + m + ':' + s;
  return fechaYhora;
};
  
const objectCreateUserProfile = (usuario, correo, foto, userCreateDay) => {
  const objectUserProfile = {};
  objectUserProfile.fecha = userCreateDay;
  objectUserProfile.usuario = usuario;
  objectUserProfile.correo = correo;
  objectUserProfile.foto = foto;
  objectUserProfile.estado = '';
  objectUserProfile.edad = '';
  return objectUserProfile;
};

const objectCreatePost = (privacidad, categoria, descripcion, multimedia, postCreateDay, idPost) => {
  const objectPost = {};
  objectPost.id = idPost;
  objectPost.fecha = postCreateDay;
  objectPost.privacidad = privacidad;
  objectPost.categoria = categoria;
  objectPost.contenido = {
    descripcion: descripcion,
    multimedia: multimedia,
  };
  objectPost.likes = 0;
  objectPost.comentarios = {
    quienComento: '',
    likes: 0,
  };
  return objectPost;
};

export const createPost = (userPhoto, userName, postType, 
  descriptionPost, multimedia, postPrivacy, savePublicPost, closePost) => {
  let userConnect = dataConnectUser().email;
  console.log('Usuario conectado es: ' + userConnect);
  readUserFireStore('Users', userConnect)
    .then((respDoc) => {
      const saveDocumentUser = respDoc.data();
      if (saveDocumentUser !== undefined) {
        userPhoto.src = saveDocumentUser.foto;
        userName.innerHTML = saveDocumentUser.usuario;
      }

      savePublicPost.addEventListener('click', () => {
        const postPrivacyValue = postPrivacy.options[postPrivacy.selectedIndex].value;
        const postTypeValue = postType.options[postType.selectedIndex].value;

        console.log('postPrivacyValue: ' + postPrivacyValue + '; postTypeValue: ' + postTypeValue);
        

        let objDataUser = {};
        // contador de post
        let contPost = 0;

        readPostFireStore('Users', 'Post', userConnect)
          .then((result) => {
            contPost = '#' + (result.size + 1).toString();
            objDataUser = objectCreatePost(postPrivacyValue, postTypeValue, descriptionPost.value, '', getDayAndHour(), contPost);
              
            console.log(objDataUser);
          
            Object.keys(objDataUser).forEach((ele) => {
              createPostFireStore('Users', 'Post', userConnect, contPost, ele, objDataUser[ele])
                .then(() => console.log('documento se escribio correctamente en post'))
                .catch(() => console.log(err.message));                
            });
          })
          .catch((err) => {
            console.log('ERRos: ' + err.message);
          });
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

export const mainRedSocial = (userPhoto, userName, buttonDeleteUser, buttonLogOut, createPost) => {
  let stateUser = [];
  stateUser = userStateChange(stateUser);
  if (stateUser) {
    // Evaluar estado del usuario

    let userConnect = dataConnectUser().email;
    
    console.log('Usuario conectado es: ' + userConnect);

    readUserFireStore('Users', userConnect)
      .then((respDoc) => {
        const saveDocumentUser = respDoc.data();
        if (saveDocumentUser !== undefined) {
          userPhoto.src = saveDocumentUser.foto;
          userName.innerHTML = saveDocumentUser.usuario;
        }
      })
      .catch((err) => {
        console.log(err.message);
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
      deleteUserFireStore('Users', userConnect);
      changeHash('/inite') ;
    });

    createPost.addEventListener('click', () => {
      changeHash('/createPost') ;
    });
  } else {
    console.log('Usuario No conectado');
  }
  return 1;
};

const detectPromisesCreateUser = (funct) => {
  funct
    .then((result) => {
      readUserFireStore('Users', result.user.email)
        .then((respDoc) => {
          if (respDoc.data() === undefined) {
            console.log('No encontro documento');
            let objDataUser = {};
            const dataUser = result.user;

            objDataUser = objectCreateUserProfile(dataUser.displayName, dataUser.email, dataUser.photoURL, getDayAndHour());
            
            console.log(objDataUser);
            
            Object.keys(objDataUser).forEach((ele) => {
              createUserFireStore('Users', objDataUser.correo, ele, objDataUser[ele])
                .then(() => console.log('documento se escribio correctamente'))
                .catch(() => console.log(err.message));                
            }); 
          } else console.log('Usuario ya existe en la BD');

          changeHash('/home') ;
        })
        .catch((err) => {
          console.log(err.message);
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
        let objctCreate = objectCreateUserProfile(userName.value, result.user.email, '.png', getDayAndHour());

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

        Object.keys(objctCreate).forEach((ele) => {
          createUserFireStore('Users', result.user.email, ele, objctCreate[ele])
            .then(() => console.log('documento se escribio correctamente'))
            .catch(() => console.log(err.message));
        });
        changeHash('/home') ;
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

export const btnAcceptLoginAndSendToHome = (inputEmail, inputPassword, buttonAcceptLogin) => {
  buttonAcceptLogin.addEventListener('click', () => {
    logInUser(inputEmail.value, inputPassword.value)
      .then(() => {
        changeHash('/home') ;        
      })
      .catch((err) => {
        console.log(err.message);
      });    
  });
};

export const getEmailAndSendEmailToRecoverPassword = (inputEmail,buttonMissedPassword) => {
  buttonMissedPassword.addEventListener('click', () => {
    passwordReset(inputEmail.value)
      .then(() => {
        alert('Se te envió un correo para la recuperación de tu contraseña,sigue los pasos');        
      })
      .catch((err) => {
        console.log(err.message);
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

// const pruebasPost () =>{
// // Ejemplo Eliminando Post
// deletePostFireStore('Users', 'Post', 'jmpc2305@gmail.com', '#2');

// // Obteniendo datos especificos de un post
// readDocPostFireStore('Users', 'Post', 'jmpc2305@gmail.com', '#1')
// .then((result)=>{
//   if(result.data() !== undefined)
//   console.log('ES: '+ Object.keys(result.data()));
//   else
//   console.log('No existe Post');
// })
// .catch((err)=>{
//   console.log('ERR: '+err.message);
// })

// // Editando Post
// updatePostFireStore('Users', 'Post', 'jmpc2305@gmail.com', '#1', 'categoria', 'terror')
// .catch((err) =>{
//   console.log(err.message);
// })
// }


// pruebasPost();