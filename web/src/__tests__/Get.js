import mockAxios from "axios";
import {
  logout,
  public_profile,
  galleries,
  comments,
  images,
  users
} from "../axios/Get";

it("get logout", async () => {
  // setup
  mockAxios.get.mockImplementationOnce(() =>
    Promise.resolve({
      data: {},
      status: 200
    })
  );

  // work
  let cred = await logout();

  // expect
  expect(cred).toBeTruthy();
  expect(mockAxios.get).toHaveBeenCalledWith("http://127.0.0.1:4000/logout", {
    headers: {
      Authorization: `Bearer ` + localStorage.getItem("jwt_token"),
      withCredentials: true
    }
  });
});

it("get public_profile", async () => {
  // setup
  mockAxios.get.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        username: "eseisaki",
        email: "eseisaki@gmail.com",
        is_stranger: false,
        my_profile: true,
        followers: null,
        following: null,
        followers_num: 0,
        following_num: 0,
        reg_date: "12/12/19",
        profile_image: "https://encrypted-tbn0.gstatic.com"
      },
      status: 200
    })
  );

  // work
  let query = { username: "eseisaki" };
  let cred = await public_profile(query);

  // expect
  expect(cred).toBeDefined();
  expect(mockAxios.get).toHaveBeenCalledWith(
    "http://127.0.0.1:4000/public_profile",
    {
      params: query,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem("jwt_token"),
        withCredentials: true
      }
    }
  );
});

it("get galleries", async () => {
  // setup
  mockAxios.get.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        galleries: null,
        my_profile: true
      },
      status: 200
    })
  );

  // work
  let query = { username: "eseisaki" };
  let cred = await galleries(query);

  // expect
  expect(cred).toBeDefined();
  expect(mockAxios.get).toHaveBeenCalledWith(
    "http://127.0.0.1:4000/get_galleries",
    {
      params: query,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem("jwt_token"),
        withCredentials: true
      }
    }
  );
});

it("get comments", async () => {
  // setup
  mockAxios.get.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        id: "comment id",
        date: "22/06/19",
        text: "awesome comment",
        owner: "eseisaki"
      },
      status: 200
    })
  );

  // work
  let query = { username: "eseisaki", image_id: "someid" };
  let cred = await comments(query);

  // expect
  expect(cred).toBeDefined();
  expect(mockAxios.get).toHaveBeenCalledWith(
    "http://127.0.0.1:4000/get_comments",
    {
      params: query,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem("jwt_token"),
        withCredentials: true
      }
    }
  );
});

it("get images", async () => {
  // setup
  mockAxios.get.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        id: "image id",
        reg_date: "22/06/19",
        path: "http://storage_server:1000/asdasdas.jpg",
        owner: "eseisaki",
        description: "dis is mah panda",
        comments: null
      },
      status: 200
    })
  );

  // work
  let query = { username: "eseisaki", gallery_title: "gallery" };
  let cred = await images(query);

  // expect
  expect(cred).toBeDefined();
  expect(mockAxios.get).toHaveBeenCalledWith(
    "http://127.0.0.1:4000/gallery_photos",
    {
      params: query,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem("jwt_token"),
        withCredentials: true
      }
    }
  );
});

it("get all_users", async () => {
  // setup
  mockAxios.get.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        data: "data"
      },
      status: 200
    })
  );

  // work
  let cred = await users();

  // expect
  expect(cred).toBeDefined();
  expect(mockAxios.get).toHaveBeenCalledWith(
    "http://127.0.0.1:4000/get_users",
    {
      headers: {
        Authorization: `Bearer ` + localStorage.getItem("jwt_token"),
        withCredentials: true
      }
    }
  );
});
