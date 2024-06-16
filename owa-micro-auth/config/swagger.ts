import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: "owa-micro-auth",
        description: `API Swagger for owa-micro-auth`,
    },
    servers: [
        {
          url: 'http://localhost:9001',              
          description: 'Local Environment'       
        },
        {
            url: 'https://apiowa.dev.orrizonte.in',              
            description: 'Dev Environment'       
        },
        {
            url: 'https://apiowa.orrizonte.in',              
            description: 'Prod Environment'       
        },
      ]
};

console.log(process.env)

const outputFile = './swagger.json';
const endpointsFiles = ['../startup/routes.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);