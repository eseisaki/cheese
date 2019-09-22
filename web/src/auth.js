import jwt from "jsonwebtoken";

class Auth {
  constructor(props) {
    this.authenticated = true;
  }

  isAuthenticated() {
    var isExpired = false;
    const date = new Date(0);
    const token = localStorage.getItem("jwt_token");
    var dateNow = new Date();
    var decodedToken = jwt.decode(token, { complete: true });
    if (decodedToken) {
      date.setUTCSeconds(decodedToken.payload["exp"]);

      if (date.valueOf() < dateNow.valueOf()) {
        isExpired = true;
      }
    }
    if (token === null || isExpired) {
      this.authenticated = false;
    } else {
      this.authenticated = true;
    }

    return this.authenticated;
  }
}
export default new Auth();
