import { jwtDecode } from "jwt-decode";
import { getCookie, deleteCookie } from "cookies-next";

type JWTPayload = {
  exp: number;
  id: string;
  role: string;
};

export const verifyToken = () => {
  const token = getCookie("auth");
  
  if (!token) return false;
  
  try {
    const decoded = jwtDecode<JWTPayload>(token.toString());
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (decoded.exp < currentTime) {
      // Token has expired, clear cookies
      deleteCookie("auth");
      deleteCookie("role");
      return false;
    }
    
    return true;
  } catch {
    // Invalid token, clear cookies
    deleteCookie("auth");
    deleteCookie("role");
    return false;
  }
}; 