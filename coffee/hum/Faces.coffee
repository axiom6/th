
`import Util  from '../util/Util.js'`
`import Vis   from '../vis/Vis.js'`
`import Build from '../hum/Build.js'`

class Faces

  Cube.JSON = Build.syncJSON( 'webfonts/helvetiker_regular.typeface.json' )
  Cube.Font = new THREE.Font( Cube.JSON )
  @matrix   = new THREE.Matrix4()

  constructor:( @plane, @row, @col, @title, @xyz, @whd, @hsv, @opacity ) ->