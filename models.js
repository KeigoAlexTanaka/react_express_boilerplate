const Sequelize = require('sequelize');

const db = new Sequelize({
  database: 'database_name_here',
  dialect: 'postgres',
  define: {
    underscored: true,
    returning: true
  }
});

const Book = sequelize.define('book', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  author: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

module.exports = {
  Book,
  db
}
