function sum(...args) {
  return args.reduce((p, c) => p + c, 0);
}


import(/* webpackChunkName: 'test' */'./test.js')
  .then(({ mul, count }) => {
    // 文件加载成功~
    // eslint-disable-next-line
    console.log(mul(2, 5));
  })
  .catch(() => {
    // eslint-disable-next-line
    console.log('文件加载失败~');
  });





// eslint-disable-next-line
console.log(sum(1, 2, 3, 4));
