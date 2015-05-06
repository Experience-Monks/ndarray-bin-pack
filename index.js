var ops = require('ndarray-ops')
var ndarray = require('ndarray')
var binpack = require('bin-pack')

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
  var Ctor = dtype(arrays[0].dtype)
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

// maybe replace this with:
// https://github.com/shama/dtype
// https://github.com/shama/dtype/issues/1
function dtype (type) {
  switch (type) {
    case 'uint8':
      return Uint8Array
    case 'uint16':
      return Uint16Array
    case 'uint32':
      return Uint32Array
    case 'int8':
      return Int8Array
    case 'int16':
      return Int16Array
    case 'int32':
      return Int32Array
    case 'float':
    case 'float32':
      return Float32Array
    case 'double':
    case 'float64':
      return Float64Array
    case 'uint8_clamped':
      return Uint8ClampedArray
    case 'generic':
    case 'buffer':
    case 'data':
    case 'dataview':
      return ArrayBuffer
    case 'array':
    default:
      return Array
  }
}
