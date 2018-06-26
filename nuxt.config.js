const path = require('path')

const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    extend (config, ctx) {
      config.module.rules.forEach((rule) => {
        // images
        if (~rule.test.source.indexOf('|svg')) {
          rule.test = new RegExp(rule.test.source.replace('|svg', ''))
        }

        // transform urls to require calls
        if (rule.loader === 'vue-loader') {
          rule.options.transformToRequire = {
            'img': 'src',
            'image': 'xlink:href',
            'use': 'xlink:href'
          }
          return
        }
      })

      // svg
      config.module.rules.push({
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
          symbolId: this.options.dev
            ? '[1].[ext]'
            : (new IncrementalCache()).get,
          symbolRegExp: this.options.srcDir + '/(.*)\\.svg',
          esModule: false,
          extract: true,
          spriteFilename: this.options.dev
            ? spriteFilenameGeneratorDev.bind(this)()
            : spriteFilenameGeneratorProd.bind(this)()
        }
      })
    },
    plugins: [
      new SpriteLoaderPlugin()
    ]
  }
}

function spriteFilenameGeneratorDev() {
  return (svgPath) => {
    const pathKey = getSvgSpritePathKey({ svgPath, options: this.options })
    const normalizedPathKey = normalizeSvgSpritePathKey(pathKey)
    return `sprites/${normalizedPathKey}.svg`
  }
}

function spriteFilenameGeneratorProd(svgPath) {
  const cache = new IncrementalCache()
  cache.get('default') // set 0 for default
  return (svgPath) => {
    const pathKey = getSvgSpritePathKey({ svgPath, options: this.options })
    const normalizedPathKey = normalizeSvgSpritePathKey(pathKey)
    const id = cache.get(normalizedPathKey)
    return `sprites/${id}.[hash:7].svg`
  }
}

function normalizeSvgSpritePathKey(pathKey) {
  return pathKey
    .toLowerCase()
    .replace(/(^\/|\/$)/g, '')
    .replace(/\//g, '-')
}

function getSvgSpritePathKey({ svgPath, options }) {
  if (~svgPath.indexOf(options.srcDir)) {
    const relPath = svgPath.slice(options.srcDir.length + 1)
    const rules = [
      // components first level
      /(components[\/\\][^\/\\]+)[\/\\]/
    ]
    let m
    for (rule of rules) {
      m = relPath.match(rule)
      if (m && m[1]) return m[1]
    }
    // pages
    for (route of options.router.routes) {
      if (~relPath.indexOf(options.dir.pages + route.path)) {
        return options.dir.pages + route.path
      }
    }
  }
  return 'default'
}

function IncrementalCache() {
  this.store = {}
  this.lastId = 0

  this.get = (key) => {
    if (!this.store[key]) {
      this.store[key] = (this.lastId++).toString(36)
    }
    return this.store[key]
  }
}
