import mockAxios from "axios";
import { image, gallery, comment, follower } from "../axios/Delete";

it("delete image", async () => {
  // setup
  mockAxios.delete.mockImplementationOnce(() =>
    Promise.resolve({
      status: 200
    })
  );

  // work
  let payload;
  let cred = await image(payload);

  // expect
  expect(cred).toBeTruthy();
  expect(mockAxios.delete).toHaveBeenCalledWith(
    "http://127.0.0.1:4000/delete_image",
    {
      data: payload,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt_token"),
        withCredentials: true
      }
    }
  );
});

it("delete gallery", async () => {
  // setup
  mockAxios.delete.mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      data: { data: "data" }
    })
  );

  // work
  let payload;
  let cred = await gallery(payload);

  // expect
  expect(cred).toBeDefined();
  expect(mockAxios.delete).toHaveBeenCalledWith(
    "http://127.0.0.1:4000/delete_gallery",
    {
      data: payload,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt_token"),
        withCredentials: true
      }
    }
  );
});

it("delete comment", async () => {
  // setup
  mockAxios.delete.mockImplementationOnce(() =>
    Promise.resolve({
      status: 200
    })
  );

  // work
  let payload;
  let cred = await comment(payload);

  // expect
  expect(cred).toBeTruthy();
  expect(mockAxios.delete).toHaveBeenCalledWith(
    "http://127.0.0.1:4000/delete_comment",
    {
      data: payload,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt_token"),
        withCredentials: true
      }
    }
  );
});

it("delete follower", async () => {
  // setup
  mockAxios.delete.mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      data: { data: "data" }
    })
  );

  // work
  let payload;
  let cred = await follower(payload);

  // expect
  expect(cred).toBeDefined();
  expect(mockAxios.delete).toHaveBeenCalledWith(
    "http://127.0.0.1:4000/delete_follower",
    {
      data: payload,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt_token"),
        withCredentials: true
      }
    }
  );
});
