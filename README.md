# ndarray-bin-pack

[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

A simple bin-packer for a list of [ndarray](https://www.npmjs.com/package/ndarray) objects. Guesses depth and dtype from the first ndarray object.

Can be used for packing 2D sprites into a single texture atlas.

```js
var pack = require('ndarray-bin-pack')

//pack a list of ndarrays
var atlas = pack(boxes)

console.log(atlas.bins)
// [ { position, shape }, { position, shape } ]

console.log(atlas.array)
// ndarray for the whole atlas

console.log(atlas.array.shape)
// size of final atlas
```

## Usage

[![NPM](https://nodei.co/npm/ndarray-bin-pack.png)](https://www.npmjs.com/package/ndarray-bin-pack)

#### `atlas = pack(ndarrays)`

Bin-packs the list of `ndarrays` (must be a non-empty list) into a single atlas. 

The return value is:

```
{
  array: array,  //the ndarray for the whole atlas
  bins: [ 
    { position: [x, y], shape: [w, h, d] },
    ... etc
  ]
}
```

Where `bins` is parallel to the array that was provided as input.

## License

MIT, see [LICENSE.md](http://github.com/Jam3/ndarray-bin-pack/blob/master/LICENSE.md) for details.
