const { db } = require('../models');

const resetDb = async () => {
  try {
    db.sync({ force: true });
    console.log('noice, database synced');
  } catch (e) {
    console.log(e);
  } finally {
    process.exit();
  }
}

resetDb();
