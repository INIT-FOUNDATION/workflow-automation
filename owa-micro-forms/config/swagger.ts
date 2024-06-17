import swaggerAutogen from 'swagger-autogen';

const moduleName = process.env.MODULE || "owa-micro-forms"
const port = process.env.PORT || 9005;
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
            url: 'http://localhost:9005',
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
    ],
    components: {
        securitySchemes: {
          apiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Enter your token',
          },
        },
        security: [{
            apiKeyAuth: []
        }],
        schemas: {
            formGridSchema: {
                $page_size: 50,
                $current_page: 1,
                search_query: ''
            },
            updateFormStatusSchema: {
                $form_id: 7,
                $status: 1
            },
            createFormSchema: {
                form_name: "School Survey Form 2",
                form_description: "This form is used for taking feedback from schools cxzczx",
                form_fields: [
                    {
                        field_id: 1,
                        options: [
                            {field_property_id: 1, type: "text"},
                            {field_property_id: 2, name: "sample"},
                            {field_property_id: 3, label: "Sample"},
                            {field_property_id: 4, placeholder: "Sample"},
                            {field_property_id: 5, required: true},
                            {field_property_id: 6, minlength: 3},
                            {field_property_id: 7, maxlength: 50}
                        ]
                    }
                ]
            },
            updateFormSchema: {
                form_id: 7,
                form_name: "School Survey Form 2",
                form_description: "This form is used for taking feedback from schools cxzczx",
                form_fields: [
                    {
                        field_id: 1,
                        options: [
                            {field_property_id: 1, type: "text"},
                            {field_property_id: 2, name: "sample"},
                            {field_property_id: 3, label: "Sample"},
                            {field_property_id: 4, placeholder: "Sample"},
                            {field_property_id: 5, required: true},
                            {field_property_id: 6, minlength: 3},
                            {field_property_id: 7, maxlength: 50}
                        ]
                    }
                ]
            }
        }
    },
};

const outputFile = './swagger.json';
const endpointsFiles = ['../startup/routes.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);