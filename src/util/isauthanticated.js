import jwtDecode from "jwt-decode";
export default function isauthanticated() {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token);
    const expiresAt = new Date(decodedToken.exp * 1000);

    if (new Date() > expiresAt) {
      localStorage.removeItem("token");
      return false;
    } else return true;
  }
  return false;
}
