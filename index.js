const PluginError = require('plugin-error')
const through2 = require('through2')
const { inlineSource } = require('inline-source')
const fs = require('fs')
const path = require('path')

const defaults = {
  compress: true
}

function inlineSources(opts) {
  const options = Object.assign({}, defaults, opts)

  return through2.obj(function (file, enc, cb) {
    const self = this;

    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new PluginError('gulp-inline-sources', 'Streaming not supported'));
      return;
    }

    if (path.extname(file.path) !== '.html') {
      self.push(file)
      return cb()
    }

    return inlineSource(file.contents.toString(), options)
      .then((html) => {
        file.contents = Buffer.from(html || '', enc)
        self.push(file)
        cb(null, file)
      })
      .catch((err) => {
        cb(err)
      })
  })
}

module.exports = inlineSources
