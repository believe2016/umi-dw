import * as devConfig from './dev';
import * as debugConfig from './prerelease';
import * as prodConfig from './prod';

// console.log('process.env', process.env.APP_ENV);
// console.log('process.env.APP_ENV devConfig', devConfig);
// console.log('process.env.APP_ENV debugConfig', debugConfig);
// console.log('process.env.APP_ENV debugConfig', debugConfig);


let config: {
  [index: string]: any;
} = devConfig;
switch (process.env.APP_ENV) {
  case 'dev' :
    config = devConfig;
    break;
  case 'debug' :
    config = debugConfig;
    break;
  case 'prod' :
    config = prodConfig;
    break;
}
export default config

