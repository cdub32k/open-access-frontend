module.exports = (env) => {
  return require(`./webpack.config.${env.MODE}.js`)(env);
};
