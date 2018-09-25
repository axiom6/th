`import Util     from '../util/Util.js'`
`import Vis      from '../vis/Vis.js'`

class Rect

  constructor:( @title, @xyz, @whd, @hsv, @opacity ) ->
    rec = new THREE.PlaneGeometry( @whd[0], @whd[1] )
    rec.translate(      @xyz[0], @xyz[1], @xyz[2] )
    rgb = Vis.toRgbHsv( @hsv[0], @hsv[1], @hsv[2] )
    col = new THREE.Color( @colorRgb( rgb ) )
    mat = new THREE.MeshBasicMaterial( { color:col, opacity:@opacity, transparent:true, side:THREE.DoubleSide } )

    @mesh = new THREE.Mesh( rec, mat )

  colorRgb:( rgb ) ->
    "rgb(#{Math.round(rgb[0]*255)}, #{Math.round(rgb[1]*255)}, #{Math.round(rgb[2]*255)})"

`export default Rect`