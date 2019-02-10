// aqui exportaras las funciones que necesites

export const getDayAndHour = () => {
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
}; // newDate

export const objectCreateUserProfile = (user, email, photo, userCreateDay) => {
  const objectUserProfile = {};
  objectUserProfile.fecha = userCreateDay;
  objectUserProfile.user = user;
  objectUserProfile.email = email;
  objectUserProfile.photo = photo;
  objectUserProfile.status = '';
  objectUserProfile.age = '';
  return objectUserProfile;
};// es bueno esto o es mejor agregar defrente?

export const objectCreatePost = (privacy, category, description, multimedia, postCreateDay, idPost) => {
  const objectPost = {};
  objectPost.id = idPost;
  objectPost.date = postCreateDay;
  objectPost.privacy = privacy;
  objectPost.category = category;
  objectPost.content = {
    description: description,
    multimedia: multimedia,
  };
  objectPost.likes = 0;
  objectPost.comments = {
    whoComment: '',
    likes: 0,
  };
  return objectPost;
};