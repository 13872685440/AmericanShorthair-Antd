const path = require('path')
const webpack = require('webpack')
const createThemeColorReplacerPlugin = require('./config/plugin.config')
const SERVICE_URL = "http://localhost:8080"

const Model_ = () => { return "" }

function resolve(dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      createThemeColorReplacerPlugin()
    ]
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      //.set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@style', resolve('src/style'))
      .set('@layout', resolve('src/layout'))
    //.set('@static', resolve('src/static'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          /*
          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
          */
        },
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    port: 8000,
    proxy: {
      '/api': {
        target: SERVICE_URL,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api/system': Model_(),//重写,
          //'^/api/xxx': '/BRITISHSHORTHAIR-SYSTEM'
        }
      }
    }
  },

 // disable source map in production
 productionSourceMap: false,
 lintOnSave: undefined,
 // babel-loader no-ignore node_modules/*
 transpileDependencies: []
}

