var config = {};

config.mongoURI = {
  production:
  `mongodb://${process.env.MLAB_DBUSER}:${process.env.MLAB_DBPASSWORD}@ds161346.mlab.com:61346/index-production`,
  development:
    "mongodb://danielthaugland:DanielSineDongeri2017@ds161136.mlab.com:61136/index-development",
  test:
    "mongodb://danielthaugland:DanielSineDongeri2017@ds161136.mlab.com:61136/index-test"
};

module.exports = config;
