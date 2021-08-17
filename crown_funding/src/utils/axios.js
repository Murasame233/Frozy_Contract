import Axios from "axios";
const instance = Axios.create({
  baseURL: "/api",
  timeout: 10000,
});
export const createApp = (addre, end, amount) => {
  return instance.post("/createApp", { addre, end, amount });
};
export const getaccess = (addre) => {
  return instance.post("/getaccess", { addre });
};
export const giveAway = (addre) => {
  return instance.post("/giveaway", { addre });
};
export const updateApp = (addre, appid) => {
  return instance.post("/update", { addre, appid });
};
export const newApp = (appid) => {
  return instance.post("/newApp", { appid });
};
export const deleteApp = (appid) => {
  return instance.post("/delApp", {appid});
};
export const getAllApp = () => {
  return instance.post("/getAllAppContent", {});
};
export const getaApp = (appid) => {
  return instance.post("/getAppContent", {appid});
};
export const updateAppcontent = (app) => {
  return instance.post("/updateAppContent", app);
};
window.getaccess = getaccess;
