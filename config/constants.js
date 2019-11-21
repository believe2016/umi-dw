const APP_ENV = process.env.APP_ENV || 'prod';
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const LOCAL_DEV_ENV = ['mock', 'dev', 'debug', 'debug-prod'];
module.exports = {
  APP_ENV,
  FILE_EXTENSIONS,
  LOCAL_DEV_ENV
}
