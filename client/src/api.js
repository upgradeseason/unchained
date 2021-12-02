import axios from "axios";

axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common.Accept = "application/json";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.common["Cache-Control"] = "no-cache, no-store, must-revalidate";
axios.defaults.headers.common.Pragma = "no-cache";
axios.defaults.headers.common.Expires = "0";

export default class API {
  static host = () => "http://localhost:5000";

  static Get = async (path, params) => axios.get(`${API.host()}${path}`, { params: params || {} });

  static Post = async (path, data) => axios.post(`${API.host()}${path}`, data);

  static Delete = async path => axios.delete(`${API.host()}${path}`);
}
