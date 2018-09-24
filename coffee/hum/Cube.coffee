
`import Util     from '../util/Util.js'`
`import Vis      from '../vis/Vis.js'`

class Cube

  @Faces = ['Front','West','North','East','South','Back']
  @matrix     = new THREE.Matrix4()
  @quaternion = new THREE.Quaternion()
  @color      = new THREE.Color()

  constructor:( @title, @xyz, @ang, @whd, @hsv ) ->
    box = new THREE.BoxBufferGeometry()
    pos = new THREE.Vector3( @xyz[0], @xyz[1], @xyz[2] )
    rot = new THREE.Euler(   @ang[0], @ang[1], @ang[2], 'XYZ' )
    len = new THREE.Vector3( @whd[0], @whd[1], @whd[2] )
    rgb = Vis.toRgbHsv(      @hsv[0], @hsv[1], @hsv[2] )
    col = new THREE.Color( @colorRgb( rgb ) )
    mat = new THREE.MeshBasicMaterial( { color:col, opacity:0.5, transparent:true } )

    Cube.quaternion.setFromEuler( rot, false )
    Cube.matrix.compose( pos, Cube.quaternion, len )
    box.applyMatrix( Cube.matrix )

    @mesh = new THREE.Mesh( box, mat )
    #console.log( 'Cube', xyz )

  colorRgb:( rgb ) ->
    "rgb(#{Math.round(rgb[0]*255)}, #{Math.round(rgb[1]*255)}, #{Math.round(rgb[2]*255)})"


`export default Cube`
