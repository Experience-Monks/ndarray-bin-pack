var save = require('save-pixels')
var readFont = require('sdf-bitmap-glyphs')
var pixmap = require('ndarray-bitmap-to-rgba').opaque
var pack = require('../')
var ndarray = require('ndarray')

var fs = require('fs')
var path = require('path')

var file = path.join(__dirname, 'OpenSans-Bold.ttf')
var buffer = fs.readFileSync(file)

readFont(buffer, { start: 0, end: 256 }, function (err, font) {
  if (err) throw err

  var glyphs = Object.keys(font.glyphs).map(function (key) {
    return font.glyphs[key]
  })

  var bins = glyphs
    .filter(function (glyph) {
      return glyph.bitmap
    })
    .map(function (glyph) {
      return ndarray(glyph.bitmap, [glyph.shape[1], glyph.shape[0], 1])
    })

  var atlas = pack(bins)
  var out = path.join(__dirname, 'font.png')

  var rgba = pixmap(atlas.array).transpose(1, 0, 2)
  save(rgba, 'png')
    .pipe(fs.createWriteStream(out))
})
