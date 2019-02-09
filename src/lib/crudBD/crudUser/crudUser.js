export const createUserFireStore = (idCollection, idUser, key, value) => {
  return firebase.firestore().collection(idCollection).doc(idUser).set({[key]: value}, { merge: true});
};

export const readUserFireStore = (idCollection) => {
    return firebase.firestore().collection(idCollection).get();
  };

export const readDocUserFireStore = (idCollection, idUser) => {
  return firebase.firestore().collection(idCollection).doc(idUser).get();
};

// Actualiza o incluye campos en el documento
export const updateUserFireStore = (idCollection, idUser, key, value) => {
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