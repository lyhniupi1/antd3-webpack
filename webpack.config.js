const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    port: 3000,
    hot: true,
    open: true,
    proxy: {
      '/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        bypass: function(req, res, proxyOptions) {
          // 排除静态资源、webpack热更新和HTML文件
          if (req.url.startsWith('/dist/') || req.url.startsWith('/bundle.js') || req.url.startsWith('/sockjs-node/') || req.url.startsWith('/__webpack_dev_server__/')) {
            return req.url;
          }
          if (req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
            return '/index.html';
          }
        }
      }
    },
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};