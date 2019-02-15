export const changeHash = (hash) => {
  location.hash = hash;
};
  
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
};
  
export const objectCreateUserProfile = (usuario, correo, foto, userCreateDay) => {
  const objectUserProfile = {};
  objectUserProfile.fecha = userCreateDay;
  objectUserProfile.usuario = usuario;
  objectUserProfile.correo = correo;
  objectUserProfile.foto = foto;
  objectUserProfile.estado = '';
  objectUserProfile.edad = '';
  return objectUserProfile;
};
  
export const objectCreatePost = (correoUsuario, fotoUsuario, nombreUsuario, fechaCreacion, privacidad, categoria, titulo, descripcion, multimedia) => {
  const objectPost = {};
  objectPost.correoUsuario = correoUsuario;
  objectPost.fotoUsuario = fotoUsuario;
  objectPost.nombreUsuario = nombreUsuario;
  objectPost.fecha = fechaCreacion;
  objectPost.privacidad = privacidad;
  objectPost.categoria = categoria;
  objectPost.titulo = titulo;
  objectPost.contenido = {
    descripcion: descripcion,
    multimedia: multimedia,
  };
  objectPost.likes = [],
  objectPost.comentarios = [
  ];
  return objectPost;
};

export const ObjectUpdatePost = (privacidad, categoria, titulo, descripcion, multimedia) => {
  const objectUpdatePost = {};
  objectUpdatePost.privacidad = privacidad;
  objectUpdatePost.categoria = categoria;
  objectUpdatePost.titulo = titulo;
  objectUpdatePost.contenido = {
    descripcion: descripcion,
    multimedia: multimedia,      
  };
  return objectUpdatePost;
};

export const deletAndEdit = (idDeleteEdit) => {
  const deleteEdit = 
  `<span id="editPost_${idDeleteEdit}" class="icon-pencil cursor mr-5"></span>
  <span id="deletePost_${idDeleteEdit}" class="icon-bin cursor"></span>`;
  return deleteEdit;
};
