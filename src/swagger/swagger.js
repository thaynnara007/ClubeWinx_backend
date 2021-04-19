const swaggerAutogen = require('swagger-autogen')();
const { API_PORT } = require('../config/environment');

const outputFile = './swagger_output.json';
const endpointsFiles = ['../routes.js'];

const doc = {
  info: {
    version: '1.0.0',
    title: 'HOMEMATE API',
    description:
      'Documentation automatically generated by the <b>swagger.autogen</b> module.',
  },
  host: `localhost:${API_PORT}`,
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [],
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Enter your bearer token in the format **Bearer &lt;token>**'
    }
  },
  definitions: {
    Security: [{ 'Bearer': [] }],
    AddUser: {
      $name: 'thaynnara',
      lastname: 'raiany',
      email: 'tatamiuda06@gmail.com',
      phoneNumber: '987900856',
      birthday: '06/03/1997',
      gender: 'Feminino',
      password: '123thay',
      street: 'rua senador alvorada gaudencio',
      number: 343,
      district: 'meio',
      complement: 'complement',
      zipCode: '12345-563',
      city: 'grande campo',
      state: 'paraiba',
    },
    User: {
      id: 1,
      name: 'Finn',
      lastname: 'The Human',
      birthday: '2004-03-30T23:22:54.988Z',
      gender: 'Masculino',
      phoneNumber: '987900856',
      email: 'finn_the_human@gmail.com',
      createdAt: '2021-03-30T23:22:54.989Z',
      updatedAt: '2021-03-30T23:22:54.989Z',
    },
    AllUser: [
      {
        id: 1,
        name: 'Finn',
        lastname: 'The Human',
        birthday: '2004-03-30T23:22:54.988Z',
        gender: 'Masculino',
        phoneNumber: '987900856',
        email: 'finn_the_human@gmail.com',
        createdAt: '2021-03-30T23:22:54.989Z',
        updatedAt: '2021-03-30T23:22:54.989Z',
      },
    ],
    AddAddress: {
      street: 'Tree house',
      number: 123,
      district: 'Candy Kingdom',
      complement: 'uma grande arvore',
      zipCode: '12345-563',
      city: 'Candy Kingdom',
      state: 'Land of Ooo',
    },
    Address: {
      id: 1,
      street: 'Tree house',
      number: 123,
      district: 'Candy Kingdom',
      complement: 'uma grande arvore',
      zipCode: '12345-563',
      city: 'Candy Kingdom',
      state: 'Land of Ooo',
      createdAt: '2021-03-30T23:22:55.089Z',
      updatedAt: '2021-03-30T23:22:55.089Z',
    },
    AllAddress: [
      {
        id: 1,
        name: 'Finn',
        lastname: 'The Human',
        birthday: '2004-03-30T23:22:54.988Z',
        gender: 'Masculino',
        phoneNumber: '987900856',
        email: 'finn_the_human@gmail.com',
        createdAt: '2021-03-30T23:22:54.989Z',
        updatedAt: '2021-03-30T23:22:54.989Z',
      },
    ],
    AddProfile: {
      userId: 1,
      socialMedia: 'https://instagram.com/adventuretime?igshid=1ti2rgx3xdt9n',
      description:
        'I am a human boy, who lives in a tree house with my brother, Jake, we have an adventure business together. I am good with people and know how to cook, though jake knows it more',
      privateAtConnection: false,
    },
    Profile: {
      id: 1,
      userId: 1,
      socialMedia: 'https://instagram.com/adventuretime?igshid=1ti2rgx3xdt9n',
      description:
        'I am a human boy, who lives in a tree house with my brother, Jake, we have an adventure business together. I am good with people and know how to cook, though jake knows it more',
      privateAtConnection: false,
      createdAt: '2021-03-30T23:22:54.989Z',
      updatedAt: '2021-03-30T23:22:54.989Z',
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
