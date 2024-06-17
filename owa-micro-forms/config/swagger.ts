import swaggerAutogen from 'swagger-autogen';

const moduleName = process.env.MODULE || "owa-micro-forms"
const port = process.env.PORT || 9005;
const apiBaseUrl = process.env.OWA_APIS_BASE_URL || `localhost:${port}`;
const scheme = apiBaseUrl.includes("localhost") ? "http" : "https";

const doc = {
    info: {
        title: moduleName,
        description: `API Swagger for ${moduleName}`,
    },
    securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'Enter your bearer token in the format **&lt;token&gt;**'
        }
    },
    servers: [
        {
          url: `${scheme}://${apiBaseUrl}`            
        }
      ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['../startup/routes.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);