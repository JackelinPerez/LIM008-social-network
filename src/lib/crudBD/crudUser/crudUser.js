export const createBDFireStore = (idCollection, idUser, obj) => {
  return firebase.firestore().collection(idCollection).doc(idUser).set(obj);
};  

export const readBDFireStore = (idCollection) => {
  // return firebase.firestore().collection(idCollection).get();
  return firebase.firestore().collection(idCollection);
};

export const readDocBDFireStore = (idCollection, idUser) => {
  return firebase.firestore().collection(idCollection).doc(idUser).get();
// return firebase.firestore().collection(idCollection).doc(idUser);
};

// Actualiza o incluye campos en el documento
export const updateBDFireStore = (idCollection, idUser, key, value) => {
  return firebase.firestore().collection(idCollection).doc(idUser).update({[key]: value});
};

export const deleteUserFireStore = (idCollection, idUser) => {
  firebase.firestore().collection(idCollection).doc(idUser).delete()
    .then(() => {
      firebase.auth().currentUser.delete()
        .then(() => console.log('Se elimino correctamente el usuario de la bd: ' + idUser))
        .catch((err) => console.log('Error eliminando de bd ' + err.message));
    })
    .catch((err) => console.log('error eliminando usuario= ' + err.message));
};

export const deleteDocFireStore = (idCollection, idUser) => {
  return firebase.firestore().collection(idCollection).doc(idUser).delete();
};

export const sendImagePost = (imageASubir) => {
  return firebase.storage().ref().child('images/' + imageASubir.name).put(imageASubir);
};