import axios from "axios";

export async function image(payload) {
  var apiBaseUrl = process.env.REACT_APP_APP + "/delete_image";
  let res = false;
  var data = {
    data: payload,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("jwt_token"),
      withCredentials: true
    }
  };
  await axios
    .delete(apiBaseUrl, data)
    .then(response => {
      if (response.status === 200) {
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

export async function gallery(payload) {
  var apiBaseUrl = process.env.REACT_APP_APP + "/delete_gallery";
  let res = {};
  var data = {
    data: payload,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("jwt_token"),
      withCredentials: true
    }
  };
  await axios
    .delete(apiBaseUrl, data)
    .then(response => {
      if (response.status === 200) {
        res = response.data;
      }
    })
    .catch(error => {
      if (error.response.status >= 400) {
        res = null;
      }
    });
  return res;
}

export async function comment(payload) {
  var apiBaseUrl = process.env.REACT_APP_APP + "/delete_comment";
  let res = false;
  var data = {
    data: payload,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("jwt_token"),
      withCredentials: true
    }
  };
  await axios
    .delete(apiBaseUrl, data)
    .then(response => {
      if (response.status === 200) {
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

export async function follower(payload) {
  var apiBaseUrl = process.env.REACT_APP_APP + "/delete_follower";
  let res = {};
  var data = {
    data: payload,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("jwt_token"),
      withCredentials: true
    }
  };
  await axios
    .delete(apiBaseUrl, data)
    .then(response => {
      if (response.status === 200) {
        res = response.data;
      }
    })
    .catch(error => {
      if (error.response.status >= 400) {
        res = null;
      }
    });
  return res;
}
