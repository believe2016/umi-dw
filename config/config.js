import path from 'path';
import env from './env.json'; // console.log('env', env, path.resolve(__dirname, '../src/assets'))
// console.log('process.env', process.env.NODE_ENV, process.env.APP_ENV)

const oriEnv = env[process.env.APP_ENV];
// console.log('process.env oriEnv', oriEnv);
const defineEnv = {};

for (let key in oriEnv) {
  defineEnv[`process.env.${key}`] = oriEnv[key];
}

// console.log('process.env defineEnv', defineEnv); // ref: https://umijs.org/config/

const config = {
  treeShaking: true,
  // 关闭css-modules 否则直接引入无效
  disableCSSModules: true,
  define: defineEnv,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          immer: true,
        },
        dynamicImport: {
          webpackChunkName: true,
        },
        title: {
          defaultTitle: '心之力医生端',
        },
        dll: true,
        locale: {
          enable: true,
          default: 'zh-CN',
        },
        targets: {
          ie: 10,
        },
        library: 'react',
        // 可能切换底层库为 preact 或 react。
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
        metas: [
          {
            charset: 'utf-8',
          },
        ],
        links: [],
      },
    ],
  ],
  chainWebpack: (config, { webpack }) => {
    config.module
      .rule('scss')
      .test(/\.scss$/)
      .use('sass-loader')
      .loader('sass-loader')
      .options({
        prependData: '@import "theme/_config.scss";',
        sassOptions: {
          includePaths: [path.resolve(__dirname, '../src/assets')],
        },
      })
      .end();
  },
  hash: true,
  minimizer: 'terserjs',
  targets: {
    ie: 10,
  },
};
export default config;

