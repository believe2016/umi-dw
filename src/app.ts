// 运行时配置文件，可以在这里扩展运行时的能力，比如修改路由、修改 render 方法等。
// console.log('app.ts')

export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};
