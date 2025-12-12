module.exports = {
  generateRandomId(context, ee, next) {
    context.vars.randomId = Math.random().toString(36).substring(2, 10);
    return next();
  },
};
