commands = [
  {
    name: "login",
    controller: "user",
    method: "post",
    api: "/api/login",
    middleware: [],
  },
  {
    name: "register",
    controller: "user",
    method: "post",
    api: "/api/register",
    middleware: [],
  },
];
module.exports = commands;
