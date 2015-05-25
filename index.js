var ops = require('ndarray-ops')
var ndarray = require('ndarray')
var binpack = require('bin-pack')
var dtype = require('ndarray-dtype')

module.exports = pack
function pack (arrays) {
  if (!arrays || arrays.length === 0) {
    throw new TypeError('must be a non-empty list of ndarrays')
  }

  var bins = arrays.map(function (array) {
    return {
      width: array.shape[0],
      height: array.shape[1],
      array: array
    }
  })
  var box = binpack(bins, { inPlace: true })

  var width = box.width
  var height = box.height
  var depth = arrays[0].shape[2] || 1
  var Ctor = dtype(arrays[0].dtype) || Array
  var atlas = ndarray(new Ctor(width * height * depth), [width, height, depth])

  // empty space is left at zero
  for (var i = 0; i < atlas.data.length; i++) {
    atlas.data[i] = 0
  }

  bins.forEach(function (bin) {
    var rect = atlas.lo(bin.x, bin.y).hi(bin.width, bin.height)
    ops.assign(rect, bin.array)
  })

  // return bare rects for each bin
  var items = bins.map(function (bin) {
    return {
      shape: bin.array.shape.slice(),
      position: [ bin.x, bin.y ]
    }
  })

  return {
    array: atlas,
    bins: items
  }
}
