import { jwtDecode } from "jwt-decode";
import { CONSTANTS } from "./constants.utils";

interface JwtPayload {
  name: string;
  [key: string]: any;
}

export const extractNameFromToken = (): string => {
  try {
    let token = getToken();
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      let name = decoded.name || "";
      if (name) {
        name = name.charAt(0).toUpperCase() + name.slice(1);
      }
      return name;
    }
    return "";
  } catch (error) {
    console.error("Invalid token:", error);
    return "";
  }
};

export const getToken = () => {
  return localStorage.getItem(CONSTANTS.ACCESS_TOKEN_NAME);
};
