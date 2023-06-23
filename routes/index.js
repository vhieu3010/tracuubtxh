const accountRoute = require('./accountRoute');
const userRoute = require('./userRoute');
const { notFound, errorHandler } = require('../middlewares/errorHandler');

const initRoute = (app) => {
  app.use('/users', userRoute);
  app.use('/', accountRoute);

  app.use(notFound);
  app.use(errorHandler);
};

module.exports = initRoute;
