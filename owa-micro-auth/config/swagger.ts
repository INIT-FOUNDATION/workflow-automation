import swaggerAutogen from 'swagger-autogen';
import { envUtils } from "owa-micro-common";

const moduleName = envUtils.getStringEnvVariableOrDefault("MODULE", "owa-micro-auth");
const port = envUtils.getNumberEnvVariableOrDefault("PORT", 9001);
const apiBaseUrl = envUtils.getStringEnvVariableOrDefault("OWA_APIS_BASE_URL", `localhost:${port}`);

const doc = {
    info: {
        title: moduleName,
        description: `API Swagger for ${moduleName}`,
    },
    host: apiBaseUrl,
    basePath: '/',
    schemes: [apiBaseUrl.includes("localhost") ? "http" : "https"]
};

const outputFile = './swagger.json';
const endpointsFiles = ['../startup/routes.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);