export const createIdDocBDFireStore = (idCollection, idUser, obj) => {
  return firebase.firestore().collection(idCollection).doc(idUser).set(obj, { merge: true });
};

export const createPostBDFireStore = (idCollection, obj) => {
  return firebase.firestore().collection(idCollection).add(obj);
};

export const readDocBDFireStore = (idCollection, idUser) => {
  return firebase.firestore().collection(idCollection).doc(idUser).get();
};

export const readCollectionBDFireStore = (idCollection, callbackPost, objElements) => {
  firebase.firestore().collection(idCollection).onSnapshot((dataAllPost) => {
    callbackPost(dataAllPost, objElements);
  });
  return 1;
};

export const updateDocBDFireStore = (idCollection, idUser, obj) => {
  return firebase.firestore().collection(idCollection).doc(idUser).update(obj);
};

export const deleteDocFireStore = (idCollection, idUser) => {
  return firebase.firestore().collection(idCollection).doc(idUser).delete();
};

export const deleteUserFireStore = (idCollectionUser, idCollectionPost, idUser) => {
  // borrar de la collection Post los post del usuario que se eliminara
  firebase.firestore().collection(idCollectionPost).where('correoUsuario', '==', idUser).get()
    .then((dataPost) => {
      dataPost.forEach((collection) => {
        firebase.firestore().collection(idCollectionPost).doc(collection.id).delete()
          .then(() => console.log(`Se elimino correctamente el post: ${collection.id} del usuario`))
          .catch((err) => console.log('Errror al querer eliminar Los post del usuario'));
      });
    })
    .catch((err) => console.log('No pudo eliminar collectiones Post del usuario: ' + err.message));

  firebase.firestore().collection(idCollectionUser).doc(idUser).delete()
    .then(() => {
      firebase.auth().currentUser.delete()
        .then(() => console.log('Se elimino los datos del usuario en la Autenticacion: ' + idUser))
        .catch((err) => console.log('No pudo eliminar los datos del usuario en la Autenticacion: ' + err.message));
    })
    .catch((err) => console.log('No pudo eliminar collection Usuario: ' + err.message));
};

export const sendImagePost = (imageASubir) => {
  return firebase.storage().ref().child('images/' + imageASubir.name).put(imageASubir);
};
