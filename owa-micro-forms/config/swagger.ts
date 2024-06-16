import swaggerAutogen from 'swagger-autogen';
import { envUtils } from "owa-micro-common";


const moduleName = envUtils.getStringEnvVariableOrDefault("MODULE", "owa-micro-forms");
const port = envUtils.getNumberEnvVariableOrDefault("PORT", 9005);
const apiBaseUrl = envUtils.getStringEnvVariableOrDefault("OWA_APIS_BASE_URL", `localhost:${port}`);
const scheme = apiBaseUrl.includes("localhost") ? "http" : "https";

const doc = {
    info: {
        title: moduleName,
        description: `API Swagger for ${moduleName}`,
    },
    servers: [
        {
          url: `${scheme}://${apiBaseUrl}`            
        }
    ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['../startup/routes.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);