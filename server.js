/**
 * Created by HUANGHELIN829 on 2017/3/14.
 */
var config = require('./webpack.config');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
  hot: true,
  inline: true,
  proxy: {
      '/sso/*': {
      target: 'http://10.173.41.182:8082/',//'http://10.20.112.185:8081/',http://10.119.8.12:8091/'
      changeOrigin: true,
      secure: false
    }
  }
});

server.listen(8082);
