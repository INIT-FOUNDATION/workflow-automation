import swaggerAutogen from 'swagger-autogen';

const moduleName = process.env.MODULE || "owa-micro-auth"
const port = process.env.PORT || 9001;
const apiBaseUrl = process.env.OWA_APIS_BASE_URL || `localhost:${port}`;
const scheme = apiBaseUrl.includes("localhost") ? "http" : "https";
const doc = {
    info: {
        title: moduleName,
        description: `API Swagger for ${moduleName}`,
    },
    basePath: "/",
    host: apiBaseUrl,
    schemes: [scheme]
};

const outputFile = './swagger.json';
const endpointsFiles = ['../startup/routes.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);