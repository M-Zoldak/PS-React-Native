import { host } from "../constants/Host";
import { DynamicallyFilledObject } from "../interfaces/DefaultTypes";
import * as SecureStore from "expo-secure-store";
import axios, { AxiosError } from "axios";

async function post<T>(
  path: string,
  body: DynamicallyFilledObject<string> | Array<any> | null
): Promise<T> {
  let token = await SecureStore.getItemAsync("token");

  console.log(`${host}/api${path}`);
  return await axios
    .post(`${host}/api${path}`, body, {
      headers: {
        "mobile-request": true,
        Authorization: token ? `Bearer ${token}` : "",
        CONTENT_TYPE: "application/json",
      },
    })
    .then((res) => res.data);
  // .catch((err: AxiosError) => err.response);
}

async function put<T>(
  path: string,
  body: DynamicallyFilledObject<any> | Array<any>
): Promise<T> {
  let token = await SecureStore.getItemAsync("token");

  console.log(`${host}/api${path}`);
  console.log(body);
  return await axios
    .put(`${host}/api${path}`, body, {
      headers: {
        "mobile-request": true,
        CONTENT_TYPE: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
    .then((res) => res.data);
  // .catch((err: AxiosError) => err.response);
}

async function fetchObject<T>(path: string): Promise<T> {
  let token = await SecureStore.getItemAsync("token");

  console.log(`${host}/api${path}`);
  return await axios
    .get(`${host}/api${path}`, {
      headers: {
        "mobile-request": true,
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
    .then((res) => res.data);
  // .catch((err: AxiosError) => err.response);
}

async function sendDelete<T>(path: string): Promise<T> {
  let token = await SecureStore.getItemAsync("token");

  console.log(`${host}/api${path}`);
  return await axios
    .delete(`${host}/api${path}`, {
      headers: {
        "mobile-request": true,
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
    .then((res) => res.data);
  // .catch((err: AxiosError) => err.response);
}

export const http_methods = {
  post,
  put,
  fetch: fetchObject,
  delete: sendDelete,
};
