let faker = require("faker");

let generateUsers = () => {
  let users = [];

  for (let id = 0; id < 5; id++) {
    let username = faker.internet.userName();
    let email = faker.internet.email();
    let password = faker.internet.password();

    users.push({ id: id, username: username, email: email, password: password });
  }

  return { users: users };
};

module.exports = generateUsers;
