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
  {
    name: "profile",
    controller: "user",
    method: "get",
    api: "/api/profile",
    middleware: ["Authorization"],
  },
];
module.exports = commands;
