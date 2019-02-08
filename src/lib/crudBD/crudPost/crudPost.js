export const createPostFireStore = (idCollection, idCollectionPost, idUser, idPost, key, value) => {
  return firebase.firestore().collection(idCollection).doc(idUser)
    .collection(idCollectionPost).doc(idPost).set({ [key]: value }, { merge: true });
};
//--------------------------------------------------------------------------------------------------
/*objPost = {
   "idUser" : "",
   "tittle": " ",
   "urlImage": "";
   "description": "";
 }*/
export const createPostByUser = (objPost) => {
  return firebase.firestore().collection('Post').add(objPost);
};

// obtenemos la informacion completa de la collecion "post"
export const readPostFireStore = (idCollection, idCollectionPost, idUser) => {
  return firebase.firestore().collection(idCollection).doc(idUser)
    .collection(idCollectionPost).get();
};

// obtiene un campo especifico del post
export const readDocPostFireStore = (idCollection, idCollectionPost, idUser, idPost) => {
  return firebase.firestore().collection(idCollection).doc(idUser)
    .collection(idCollectionPost).doc(idPost).get();
};

export const updatePostFireStore = (idCollection, idCollectionPost, idUser, idPost, key, value) => {
  return firebase.firestore().collection(idCollection).doc(idUser)
    .collection(idCollectionPost).doc(idPost).update({ [key]: value });
};

export const deletePostFireStore = (idCollection, idCollectionPost, idUser, idPost) => {
  firebase.firestore().collection(idCollection).doc(idUser)
    .collection(idCollectionPost).doc(idPost).delete()
    .then(() => console.log('Se elimino correctamente el Blog'))
    .catch((err) => console.log('error eliminando Collection= ' + err.message));
};

export const sendImagePost = (imageASubir) => {
  console.log("////////////////////////")
  console.log(imageASubir)
  return firebase.storage().ref().child('images/' + imageASubir.name).put(imageASubir);
}