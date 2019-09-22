import axios from "axios";

export async function logout() {
  var apiBaseUrl = process.env.REACT_APP_AUTH + "/logout";
  var headers = {
    headers: {
      Authorization: `Bearer ` + localStorage.getItem("jwt_token"),
      withCredentials: true
    }
  };
  let res = false;

  await axios.get(apiBaseUrl, headers).then(function(response) {
    if (response.status === 200) {
      localStorage.clear();
      res = true;
    } else {
      res = false;
    }
  });
  return res;
}

export async function public_profile(query) {
  var apiBaseUrl = process.env.REACT_APP_APP + "/public_profile";
  var headers = {
    params: query, // expecting query = { username: 'string' }
    headers: {
      Authorization: `Bearer ` + localStorage.getItem("jwt_token"),
      withCredentials: true
    }
  };
  let res = {};

  await axios.get(apiBaseUrl, headers).then(function(response) {
    res = response.data;
  });
  return res;
}

export async function galleries(query) {
  var apiBaseUrl = process.env.REACT_APP_APP + "/get_galleries";
  var headers = {
    params: query, // expecting query = { username: 'string' }
    headers: {
      Authorization: `Bearer ` + localStorage.getItem("jwt_token"),
      withCredentials: true
    }
  };
  let res = {};

  await axios
    .get(apiBaseUrl, headers)
    .then(function(response) {
      res = response.data;
    })
    .catch(error => {
      if (error.response.status === 403) {
        res = null;
      }
    });
  return res;
}

export async function comments(query) {
  var apiBaseUrl = process.env.REACT_APP_APP + "/get_comments";
  var headers = {
    params: query, // expecting query = { username: 'string', image_id: 'string' }
    headers: {
      Authorization: `Bearer ` + localStorage.getItem("jwt_token"),
      withCredentials: true
    }
  };
  let res = {};

  await axios.get(apiBaseUrl, headers).then(function(response) {
    res = response.data;
  });
  return res;
}

export async function images(query) {
  var apiBaseUrl = process.env.REACT_APP_APP + "/gallery_photos";
  var headers = {
    params: query, // expecting query = { username: 'string', gallery_title: 'string' }
    headers: {
      Authorization: `Bearer ` + localStorage.getItem("jwt_token"),
      withCredentials: true
    }
  };
  let res = {};

  await axios
    .get(apiBaseUrl, headers)
    .then(function(response) {
      res = response.data;
    })
    .catch(error => {
      if (error.response.status >= 400) {
        res = null;
      }
    });
  return res;
}

export async function users() {
  var apiBaseUrl = process.env.REACT_APP_APP + "/get_users";
  var headers = {
    headers: {
      Authorization: `Bearer ` + localStorage.getItem("jwt_token"),
      withCredentials: true
    }
  };
  let res = {};

  await axios.get(apiBaseUrl, headers).then(function(response) {
    res = response.data;
  });
  return res;
}
