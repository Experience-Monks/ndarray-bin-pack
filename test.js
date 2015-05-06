var pack = require('./')
var test = require('tape')
var ndarray = require('ndarray')

test('bin-pack an array of rectangular pixels', function (t) {
  var boxes = [
    box(0xff, 30, 5),
    box(0xaa, 10, 10)
  ]
  var atlas = pack(boxes)
  t.deepEqual(atlas.bins[0].shape, boxes[0].shape)
  t.deepEqual(atlas.bins[1].shape, boxes[1].shape)
  t.deepEqual(atlas.bins[0].position, [ 0, 0 ])
  t.deepEqual(atlas.bins[1].position, [ 0, 5 ])
  t.deepEqual(atlas.array.shape, [ 30, 15, 1 ])

  t.throws(pack.bind(null, []), null, 'does not handle zero-length input')
  t.throws(pack.bind(null), null, 'does not handle zero-length input')

  boxes = [
    ndarray(new Uint8ClampedArray([0]), [1, 1, 3])
  ]
  atlas = pack(boxes)
  t.deepEqual(atlas.array.dtype, 'uint8_clamped', 'matches type')
  t.deepEqual(atlas.array.shape, [1, 1, 3], 'matches depth')
  t.end()
})

function box (fill, width, height) {
  var arr = []
  for (var i = 0; i < (width * height); i++) {
    arr.push(fill)
  }
  return ndarray(arr, [width, height, 1])
}
