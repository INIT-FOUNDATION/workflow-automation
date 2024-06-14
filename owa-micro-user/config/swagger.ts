import swaggerAutogen from 'swagger-autogen';
import { envUtils } from "owa-micro-common";
const moduleName = envUtils.getStringEnvVariableOrDefault("MODULE", "owa-micro-user");
const port = envUtils.getNumberEnvVariableOrDefault("PORT", 9003);
const apiBaseUrl = envUtils.getStringEnvVariableOrDefault("OWA_APIS_BASE_URL", `localhost:${port}`);

const doc = {
    info: {
        title: moduleName,
        description: `API Swagger for ${moduleName}`,
    },
    host: apiBaseUrl,
    basePath: '/',
};

swaggerAutogen("./swagger.json", ['../startup/routes.ts'], doc);