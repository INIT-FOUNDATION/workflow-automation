import Swal from "sweetalert2";
import * as AppPreference from "./AppPreferences";
import withReactContent from "sweetalert2-react-content";
import { axiosInstance as axios } from "./axiosConfig";
const LoaderSwal = withReactContent(Swal);

const makeRequest = async (
  method,
  url,
  data = null,
  headers = {},
  responseType,
  skipLoader
) => {
  let token = await AppPreference.getValue("userToken");
  //To avoid adding Authorization header to CDN urls this condition added
  if (url.indexOf("https://link-prod.blr1.digitaloceanspaces.com") === -1) {
    if (token) {
     // token = JSON.parse(token);
      headers["Authorization"] = `${token}`;
    }
  }
  try {
    if (!skipLoader) {
      LoaderSwal.fire({
        customClass: "swalOverlayLoader",

        background: "rgba(0,0,0,0)",
        color: "#fff",
        didOpen: () => {
          const body = document.body;
          body.style.setProperty("height", "100vh", "important");
          LoaderSwal.showLoading();
        },
        didClose: () => {
          const body = document.body;
          body.style.removeProperty("height");
        },
      });
    }

    const response = await axios({
      method,
      url,
      data,
      headers: {
        ...headers,
      },
      responseType,
    });
    Swal.close();
    return { error: false, data: response.data };
  } catch (error) {
    Swal.close();
    if (error && error.response && error.response.status) {
      if (error.response.status === 401) {
        console.log("Unauthorized !!!");
      }
    }
    return { error: true, data: null, errorMessage: error };
  }
};

export const get = async (
  url,
  headers = {},
  responseType = "json",
  skipLoader = false
) => {
  const response = await makeRequest(
    "GET",
    url,
    null,
    headers,
    responseType,
    skipLoader
  );

  return response;
};

export const post = async (
  url,
  data,
  headers = {},
  responseType = "json",
  skipLoader = false
) => {
  const response = await makeRequest(
    "POST",
    url,
    data,
    headers,
    responseType,
    skipLoader
  );

  return response;
};
