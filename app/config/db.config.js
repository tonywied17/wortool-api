module.exports = {
  HOST: "",
  USER: "",
  PASSWORD: "",
  DB: "pennsylvania",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
