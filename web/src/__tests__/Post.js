import mockAxios from "axios";
import {
  register,
  login,
  follow,
  gallery,
  comment,
  image,
  profile_image
} from "../axios/Post";

it("post follow", async () => {
  // setup
  mockAxios.post.mockImplementationOnce(() =>
    Promise.resolve({
      status: 201,
      data: { data: "data" }
    })
  );

  // work
  let payload;
  let cred = await follow(payload);

  // expect
  expect(cred).toBeDefined();
  expect(mockAxios.post).toHaveBeenCalledWith(
    "http://127.0.0.1:4000/follow",
    payload,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt_token"),
        withCredentials: true
      }
    }
  );
});

it("post gallery", async () => {
  // setup
  mockAxios.post.mockImplementationOnce(() =>
    Promise.resolve({
      status: 201,
      data: { data: "data" }
    })
  );

  // work
  let payload;
  let cred = await gallery(payload);

  // expect
  expect(cred).toBeDefined();
  expect(mockAxios.post).toHaveBeenCalledWith(
    "http://127.0.0.1:4000/follow",
    payload,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt_token"),
        withCredentials: true
      }
    }
  );
});

it("post comment", async () => {
  // setup
  mockAxios.post.mockImplementationOnce(() =>
    Promise.resolve({
      status: 201,
      data: { data: "data" }
    })
  );

  // work
  let payload;
  let cred = await comment(payload);

  // expect
  expect(cred).toBeDefined();
  expect(mockAxios.post).toHaveBeenCalledWith(
    "http://127.0.0.1:4000/comment",
    payload,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt_token"),
        withCredentials: true
      }
    }
  );
});

it("post image", async () => {
  // setup
  mockAxios.post.mockImplementationOnce(() =>
    Promise.resolve({
      status: 201,
      data: { data: "data" }
    })
  );

  // work
  let payload;
  let query;
  let cred = await image(payload, query);

  // expect
  expect(cred).toBeDefined();
  expect(mockAxios.post).toHaveBeenCalledWith(
    "http://127.0.0.1:4000/add_image",
    payload,
    {
      params: query,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt_token"),
        withCredentials: true
      }
    }
  );
});

it("post profile_image", async () => {
  // setup
  mockAxios.post.mockImplementationOnce(() =>
    Promise.resolve({
      status: 201,
      data: { data: "data" }
    })
  );

  // work
  let payload;
  let cred = await profile_image(payload);

  // expect

  // Fail this test, backend not tested
  expect(cred).toBeDefined();
  expect(mockAxios.post).toHaveBeenCalledWith(
    "http://127.0.0.1:4000/profile_picture",
    payload,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt_token"),
        withCredentials: true
      }
    }
  );
});
