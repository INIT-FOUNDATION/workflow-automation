import Swal from "sweetalert2";
import * as AppPreference from "./AppPreferences";
import withReactContent from "sweetalert2-react-content";
import { axiosInstance as axios } from "./axiosConfig";
const LoaderSwal = withReactContent(Swal);

interface MakeRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
  headers?: Record<string, string>;
  responseType?: 'json' | 'arraybuffer' | 'blob' | 'document' | 'text' | 'stream';
  skipLoader?: boolean;
}

interface Response {
  error: boolean;
  data: any;
  errorMessage?: any;
}

const makeRequest = async ({
  method,
  url,
  data = null,
  headers = {},
  responseType = 'json',
  skipLoader = false
}: MakeRequestOptions): Promise<Response> => {
  let token = await AppPreference.getValue("userToken");

  if (url.indexOf("https://link-prod.blr1.digitaloceanspaces.com") === -1) {
    if (token) {
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
  } catch (error: any) {
    Swal.close();
    if (error?.response?.status === 401) {
      console.log("Unauthorized !!!");
    }
    return { error: true, data: null, errorMessage: error };
  }
};

export const get = async (
  url: string,
  headers: Record<string, string> = {},
  responseType: 'json' | 'arraybuffer' | 'blob' | 'document' | 'text' | 'stream' = 'json',
  skipLoader = false
): Promise<Response> => {
  return await makeRequest({ method: 'GET', url, headers, responseType, skipLoader });
};

export const post = async (
  url: string,
  data: any,
  headers: Record<string, string> = {},
  responseType: 'json' | 'arraybuffer' | 'blob' | 'document' | 'text' | 'stream' = 'json',
  skipLoader = false
): Promise<Response> => {
  return await makeRequest({ method: 'POST', url, data, headers, responseType, skipLoader });
};
