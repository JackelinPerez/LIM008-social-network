import MockFirebase from 'mock-cloud-firestore';

const fixtureData = {
  __collection__: {
    Post: {
      __doc__: {
        nº1: {
          nombreUsuario: 'pepita1',
          correoUsuario: 'pepita1@gmail.com',
          fotoUsuario: 'fotoPepita1.jpg',
          categoria: 'Curiosidades',
          privacidad: 'publico',
          titulo: 'MAX SCHOOL',
          contenido: {
            descripcion: 'Bebe Hermoso',
            multimedia: 'img1.jpg'
          },
          comentarios: [{
            contenido: 'chiquin',
            propietario: {
              foto: 'fotoPepita2.jpg',
              nombre: 'pepita2',
            }
          }],
          likes: ['pepita1@gmail.com', 'pepita2@gmail.com', 'pepita3@gmail.com'],
        },
      }
    }
  }
};

const createPost = {
    nombreUsuario: 'pepita5',
    correoUsuario: 'pepita5@gmail.com',
    fotoUsuario: 'fotoPepita5.jpg',
    categoria: 'Curiosidades',
    privacidad: 'publico',
    titulo: 'Naturaleza',
    contenido: {
      descripcion: 'tigre',
      multimedia: 'tigre.jpg'
    },
    comentarios: [{
      contenido: 'grrr',
      propietario: {
        foto: 'fotoPepita7.jpg',
        nombre: 'pepita7',
      }
    }],
    likes: ['pepita1@gmail.com', 'pepita3@gmail.com', 'pepita7@gmail.com'],
}

global.firebase = new MockFirebase(fixtureData, {isNaiveSnapshotListenerEnabled: true});

import { createPostBDFireStore, readDocBDFireStore, readCollectionBDFireStore } from '../src/lib/crudBD/crudUser/crudUser.js';

describe('createPostBDFireStore', () => {
    it('createPostBDFireStore:  deberia ser una funcion', () => {
        expect(typeof (createPostBDFireStore)).toBe('function');
    });
    it('Deberia agregar un post', () => {
        return createPostBDFireStore('Post', createPost)
        .then((result) => {
            console.log(result.id);
            
            readDocBDFireStore('Post', result.id)
            .then((data) => {
                console.log(data);
                
            })
        })
    });
})


describe('readCollectionBDFireStore', () => {
  it('readCollectionBDFireStore: Deberia ser una funcion', () => {
    expect(typeof (readCollectionBDFireStore)).toBe('function');
  });
  it('Deberia obtener un arreglo de Posts', (done) => {
    const callbackPost = (dataCollection) => {
      expect(typeof(dataCollection._data)).toBe('object');
      done();
    };
    return readCollectionBDFireStore('Post', callbackPost);
  });
  it('Deberia encontrar el post con id= nº1', (done) => {
    const callbackPost = (dataCollection) => {
        
      expect(dataCollection._data[0]._id).toBe('nº1');
      done();
    };
    return readCollectionBDFireStore('Post', callbackPost);
  });  
});