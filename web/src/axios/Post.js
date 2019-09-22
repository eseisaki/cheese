import axios from "axios";

export async function register(payload) {
  var apiBaseUrl = process.env.REACT_APP_AUTH + "/register";

  let res = false;
  await axios
    .post(apiBaseUrl, payload, { withCredentials: true })
    .then(response => {
      if (response.status === 201) {
        localStorage.setItem("jwt_token", response.headers["authorization"]);
        res = true;
      }
    })
    .catch(error => {
      if (error.response.status >= 400) {
        res = false;
      }
    });
  return res;
}

export async function login(payload) {
  var apiBaseUrl = process.env.REACT_APP_AUTH + "/login";
  let res = false;
  await axios
    .post(apiBaseUrl, payload, { withCredentials: true })
    .then(response => {
      if (response.status === 200) {
        localStorage.setItem("jwt_token", response.headers["authorization"]);
        res = true;
      }
    })
    .catch(error => {
      if (error.response.status > 300) {
        res = false;
      }
    });
  return res;
}

export async function follow(payload) {
  var apiBaseUrl = process.env.REACT_APP_APP + "/follow";
  let res = {};
  var headers = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("jwt_token"),
      withCredentials: true
    }
  };
  await axios
    .post(apiBaseUrl, payload, headers)
    .then(response => {
      if (response.status === 201) {
        // Succesfull, render user's gallery
        res = response.data;
      }
    })
    .catch(error => {
      if (error.response.status > 300) {
        res = null;
      }
    });
  return res;
}

export async function gallery(payload) {
  var apiBaseUrl = process.env.REACT_APP_APP + "/add_gallery";
  let res = {};
  var headers = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("jwt_token"),
      withCredentials: true
    }
  };
  await axios
    .post(apiBaseUrl, payload, headers)
    .then(response => {
      if (response.status === 201) {
        res = response.data;
      }
    })
    .catch(error => {
      if (error.response.status > 300) {
        res = null;
      }
    });
  return res;
}

export async function comment(payload) {
  var apiBaseUrl = process.env.REACT_APP_APP + "/comment";
  let res = {};
  var headers = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("jwt_token"),
      withCredentials: true
    }
  };
  await axios
    .post(apiBaseUrl, payload, headers)
    .then(response => {
      if (response.status === 201) {
        res = response.data;
      }
    })
    .catch(error => {
      if (error.response.status > 300) {
        res = {};
      }
    });
  return res;
}

export async function image(payload, query) {
  var apiBaseUrl = process.env.REACT_APP_APP + "/add_image";
  let res = {};
  var headers = {
    params: query,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("jwt_token"),
      withCredentials: true
    }
  };
  await axios
    .post(apiBaseUrl, payload, headers)
    .then(response => {
      if (response.status === 201) {
        res = response.data;
      }
    })
    .catch(error => {
      if (error.response.status > 300) {
        res = null;
      }
    });
  return res;
}

export async function profile_image(payload) {
  var apiBaseUrl = process.env.REACT_APP_APP + "/profile_picture";
  let res = {};
  var headers = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("jwt_token"),
      withCredentials: true
    }
  };
  await axios
    .post(apiBaseUrl, payload, headers)
    .then(response => {
      if (response.status === 201) {
        res = response.data;
      }
    })
    .catch(error => {
      if (error.response.status > 300) {
        //res = false;
      }
    });
  return res;
}
