
`import Util  from '../util/Util.js'`
`import Vis   from '../vis/Vis.js'`
`import Build from '../hum/Build.js'`

class Cube

  Cube.JSON = Build.syncJSON( 'webfonts/helvetiker_regular.typeface.json' )
  Cube.Font = new THREE.Font( Cube.JSON )
  @matrix   = new THREE.Matrix4()

  constructor:( @plane, @row, @col, @title, @xyz, @whd, @hsv, @opacity ) ->
    box = new THREE.BoxBufferGeometry()
    box.name = @title
    Cube.matrix.makeScale(       @whd[0], @whd[1], @whd[2] )
    box.applyMatrix( Cube.matrix )
    Cube.matrix.makeTranslation( @xyz[0], @xyz[1], @xyz[2] )
    box.applyMatrix( Cube.matrix )
    rgb = Vis.toRgbHsv(  @hsv[0], @hsv[1], @hsv[2] )
    col = new THREE.Color( @colorRgb( rgb ) )
    mat = new THREE.MeshPhongMaterial( { color:col, opacity:@opacity, transparent:true, side:THREE.BackSide } ) # blemding:THREE.AdditiveBlending
    @mesh = new THREE.Mesh( box, mat )
    @mesh.name  = @title
    @mesh.geom  = "Cube"
    @mesh.plane = @plane
    @mesh.row   = @row
    @mesh.col   = @col

    obj  = { font:Cube.Font, size:12, height:6, curveSegments:2 }
    text = new THREE.TextBufferGeometry( @title, obj )
    face = new THREE.MeshBasicMaterial( { color: 0xffffff } )
    side = new THREE.MeshBasicMaterial( { color: 0xffffff } )

    mats = [face,side]
    text.applyMatrix( Cube.matrix )
    @tmesh       = new THREE.Mesh( text, mats )
    @tmesh.name  = @title
    @mesh.geom   = "Text"
    @tmesh.plane = @plane
    @tmesh.row   = @row
    @tmesh.col   = @col

  colorRgb:( rgb ) ->
    "rgb(#{Math.round(rgb[0]*255)}, #{Math.round(rgb[1]*255)}, #{Math.round(rgb[2]*255)})"

#mat = new THREE.MeshPhongMaterial( { color:col, opacity:@opacity, transparent:true, side:THREE.BackSide, blemding:THREE.AdditiveBlending } )
#mat = new THREE.MeshBasicMaterial( { color:col, opacity:@opacity, transparent:true } ) # blemding:THREE.AdditiveBlending


`export default Cube`
