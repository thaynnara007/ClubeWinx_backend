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
      description:
        'Enter your bearer token in the format **Bearer &lt;token>**',
    },
  },
  definitions: {
    Security: [{ Bearer: [] }],
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
    OtherProfile: {
      connection: {
          id: 3,
          accepted: true,
          requestedUserId: 1,
          sendedUserId: 3
      },
      email: 'finn_the_human@gmail.com',
      picture: 'https://firebasestorage.googleapis.com/v0/b/homemate-55271.appspot.com/o/finn.jpg?alt=media&token=10621565-fb77-43cd-9f0b-844c06903a2c',
      name: 'Finn',
      lastname: 'The Human',
      gender: 'Masculino',
      id: 1,
      socialMedia: 'https://instagram.com/adventuretime?igshid=1ti2rgx3xdt9n',
      description: 'I am a human boy, who lives in a tree house with my brother, Jake, we have an adventure business together. I am good with people and know how to cook, though jake knows it more',
      privateAtConnection: false,
      posterId: 1,
      userId: 1,
      tags: [
          {
              id: 12,
              name: 'UFCG',
              isFixed: true,
              categoryId: 3,
          }
      ]
    },
    NewCategory: {
      name: '3 casa',
      description: '123',
    },
    Category: {
      id: 5,
      name: 'Animais',
      description: 'Contempla as tags que visam nomear os animais domésticos',
      createdAt: '2021-04-19T19:57:39.417Z',
      updatedAt: '2021-04-19T19:57:39.417Z',
      tags: [
        {
          id: 69,
          name: 'Cachorro',
          isFixed: true,
          categoryId: 5,
        },
      ],
    },
    Categories: [
      {
        id: 5,
        name: 'Animais',
        description: 'Contempla as tags que visam nomear os animais domésticos',
        createdAt: '2021-04-19T19:57:39.417Z',
        updatedAt: '2021-04-19T19:57:39.417Z',
        tags: [
          {
            id: 69,
            name: 'Cachorro',
            isFixed: true,
            categoryId: 5,
          },
        ],
      },
    ],
    Poster: {
      id: 1,
      expens: 286.89,
      description:
        'Its a tree house, with 3 floors, a video game, a dog, the taz came from our tresure, that i and jake picks up, so you may have no worries',
      residents: 3,
      vacancies: 1,
      createdAt: '2021-04-23T00:15:50.642Z',
      updatedAt: '2021-04-23T00:15:50.642Z',
      userId: 1,
      tags: [
        {
          id: 10,
          name: 'Diabético',
          isFixed: true,
          categoryId: 4,
          PosterTags: {
            createdAt: '2021-04-23T00:32:46.022Z',
            updatedAt: '2021-04-23T00:32:46.022Z',
            posterId: 1,
            tagId: 25,
          },
        },
      ],
    },
    PosterId: {
      id: 1,
      expens: 286.89,
      description:
        'Its a tree house, with 3 floors, a video game, a dog, the taz came from our tresure, that i and jake picks up, so you may have no worries',
      residents: 3,
      vacancies: 1,
      createdAt: '2021-04-23T00:15:50.642Z',
      updatedAt: '2021-04-23T00:15:50.642Z',
      userId: 1,
    },
    PosterAll: [
      {
        id: 2,
        expens: 246.89,
        description:
          'Its a cave shaped like home. There are some bats at it, but hey, you would have you personal piece of the ocean',
        residents: 1,
        vacancies: 1,
        createdAt: '2021-04-23T00:15:50.642Z',
        updatedAt: '2021-04-23T00:15:50.642Z',
        userId: 3,
        tags: [
          {
            id: 11,
            name: 'Hipertenso',
            isFixed: true,
            categoryId: 4,
            PosterTags: {
              createdAt: '2021-04-23T00:32:46.022Z',
              updatedAt: '2021-04-23T00:32:46.022Z',
              posterId: 1,
              tagId: 25,
            },
          },
        ],
      },
    ],
    AddTags: {
      tags: [1, 2, 3],
    },
NewTags: {
      name: 'Marceline',
      gender: 'Feminino',
      id: 5,
      privateAtConnection: true,
      userId: 3,
      tags: [
        {
          id: 69,
          name: 'Cachorro',
          categoryId: 5,
        },
        {
          id: 18,
          name: 'Ciência da Computação',
          categoryId: 4,
        },
        {
          id: 12,
          name: 'UFCG',
          categoryId: 3,
        }
      ]
    },
    CreateTags: {
      tags: [
          { name: 'Otaku', 'categoryId': 4},
          { name: 'Nerd', 'categoryId': 4},
          { name: 'UFCG', 'categoryId': 4}
      ]
  },
  }
};

swaggerAutogen(outputFile, endpointsFiles, doc);
