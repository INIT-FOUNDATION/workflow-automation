const BASE_URL = 'https://apiowa.dev.orrizonte.in';
const DIRECT_BASE_URL = 'https://apiowa.dev.orrizonte.in';
const API_ADMIN_PORT = ``;
const API_AUTH_PORT = ``;
const API_USER_PORT = ``;
const API_FORMS_PORT = ``;
const API_WORKFLOW_PORT = ``;

export const environment = {
  production: false,
  admin_prefix_url: `${BASE_URL}${API_ADMIN_PORT}/api/v1/admin`,
  auth_prefix_url: `${BASE_URL}${API_AUTH_PORT}/api/v1/auth`,
  user_prefix_url: `${BASE_URL}${API_USER_PORT}/api/v1/user`,
  forms_prefix_url: `${BASE_URL}${API_FORMS_PORT}/api/v1/forms`,
  workflow_prefix_url: `${BASE_URL}${API_WORKFLOW_PORT}/api/v1/workflow`,

};
