import itemPost from './templates/itemPost.js';
import { createUser, authenticateFacebook, authenticateGoogle, logInUser, logOutUser,
  sendEmail, userStateChange, dataConnectUser, passwordReset} 
  from '../lib/authBD/authFireBase.js';

import { createBDFireStore, readBDFireStore, readDocBDFireStore,
  updateBDFireStore, deleteUserFireStore, deleteDocFireStore, sendImagePost}
  from '../lib/crudBD/crudUser/crudUser.js';


// import {createPostFireStore, readPostFireStore, readDocPostFireStore, deletePostFireStore, updatePostFireStore} from '../lib/crudBD/crudPost/crudPost.js';

export let photoUserGlobal, nameUserGlobal;
let contPost = 0;

const changeHash = (hash) => {
  location.hash = hash;
};

export const sendToPageOfRegister = (buttonRegister) => {
  buttonRegister.addEventListener('click', () => {
    changeHash('/pagRegister') ;
  });
};// preguntar si esta bien asì o es mejor poner un href

export const sendToPageOfInite = (buttonLogin) => {
  buttonLogin.addEventListener('click', () => {
    changeHash('/pagIniteSesion');
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

export const accesWithFbOrGoogle = (buttonFacebook, buttonGoogle) => {
  buttonFacebook.addEventListener('click', () => {
    detectPromisesCreateUser(authenticateFacebook());
  });
  buttonGoogle.addEventListener('click', () => {
    detectPromisesCreateUser(authenticateGoogle());
  });
};
  
export const mainRedSocial = (userPhoto, userName, buttonDeleteUser, buttonLogOut, createPost) => {
  let stateUser = [];
  stateUser = userStateChange(stateUser);
  if (stateUser) {
    // Evaluar estado del usuario

    let userConnect = dataConnectUser().email;
    
    console.log('Usuario conectado es: ' + userConnect);

    readDocBDFireStore('Users', userConnect)
      .then((respDoc) => {
        const saveDocumentUser = respDoc.data();
        if (saveDocumentUser !== undefined) {
          userPhoto.src = saveDocumentUser.foto;
          userName.innerHTML = saveDocumentUser.usuario;
        }
      });

    viewAllPost(postWall);

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
      nameUserGlobal = userName.innerHTML;
      photoUserGlobal = userPhoto.getAttribute('src');
      changeHash('/createPost');
    });
  } else {
    console.log('Usuario No conectado');
  }
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

const viewAllPost = (postWall) => {
  let arrayItemPost = [];
  readBDFireStore('Post')
    .onSnapshot((doc) => {
      contPost = '#' + (doc.size + 1).toString();
      doc.forEach((post) => {
        const dataPost = post.data();
        arrayItemPost.push(itemPost(dataPost.id, dataPost.fotoUsuario, dataPost.nombreUsuario, dataPost.fecha,
          dataPost.titulo, dataPost.contenido.multimedia, dataPost.contenido.descripcion));
      });

      postWall.innerHTML = arrayItemPost.join('');
    });
};

export const itemViewPost = (idPost, likes, comment, share, editPost, deletePost) => {
  // editPost.addEventListener('click', () => {
  //     changeHash('/createPost');
  // });

  // deletePost.addEventListener('click', () => {
  //   deleteDocFireStore('Post', idPost);
  // });
};

// const pruebasPost () =>{

// borrar todos los elementos de una coleccion

// firebase.firestore().collection('Users').get()
//   .then((doc) => {
//     doc.forEach((data) => {
//       console.log(data.id, ' => ', data.data());

//       firebase.firestore().collection('Users').doc(data.id).delete()
//         .catch((err) => {
//           console.log(err.message);
//         });
//     });
//   })
//   .catch((err) => console.log(err.message));

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
