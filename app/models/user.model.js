// module.exports = (sequelize, Sequelize) => {
//     const User = sequelize.define("users", {
//       username: {
//         type: Sequelize.STRING
//       },
//       email: {
//         type: Sequelize.STRING
//       },
//       password: {
//         type: Sequelize.STRING
//       }
//     },{
//       freezeTableName: true,
//       timestamps: false
//     });
  
//     return User;
//   };
  

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  });

  return User;
};