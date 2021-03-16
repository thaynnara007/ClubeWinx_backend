const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['../routes.js'];

const doc = {
  info: {
    version: '1.0.0',
    title: 'HOMEMATE API',
    description:
      'Documentation automatically generated by the <b>swagger.autogen</b> module.',
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [],
  securityDefinitions: {},
  definitions: {},
};

swaggerAutogen(outputFile, endpointsFiles, doc);
