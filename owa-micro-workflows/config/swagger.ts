import swaggerAutogen from 'swagger-autogen';

const moduleName = process.env.MODULE || "owa-micro-workflows"
const port = process.env.PORT || 9004;
const apiBaseUrl = process.env.OWA_APIS_BASE_URL || `localhost:${port}`;
const scheme = apiBaseUrl.includes("localhost") ? "http" : "https";
const doc = {
    info: {
        version: '1.0.0',
        title: moduleName,
        description: `API Swagger for ${moduleName}`,
    },
    servers: [
        {
            url: 'http://localhost:9004',
            description: 'Local Server'
        },
        {
            url: 'https://apiowa.dev.orrizonte.in',
            description: 'Development Server'
        },
        {
            url: 'https://apiowa.orrizonte.in',
            description: 'Production Server'
        }
    ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['../startup/routes.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);