import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Charity API',
      version: '1.0.0',
      description: 'API documentation for the Charity backend',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // Adjust the paths as needed
};

export default swaggerOptions;