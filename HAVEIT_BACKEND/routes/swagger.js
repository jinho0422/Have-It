const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const express = require('express');

const router = express.Router();

// Swagger definition
// You can set every attribute except paths and swagger
// https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
const swaggerDefinition = {
  info: { // API informations (required)
    title: 'HaveIt', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'REST API with Express',
  },
  host: '52.78.69.165:8001', // Host (optional)
  // host: 'localhost:8001',
  basePath: '/', // Base path (optional)
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'haveCookie',
      }
    }
  },
  security: {
    cookieAuth: []
  }
};

// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // Path to the API docs
  apis: ['./controllers/*.js'],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);


router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;