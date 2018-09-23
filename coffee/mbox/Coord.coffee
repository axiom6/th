
`import Util     from '../util/Util.js'`
`import Vis      from '../vis/Vis.js'`
`import MBox     from '../mbox/MBox.js'`

class Coord

  constructor:( @mbox, @width, @height, @depth=10 ) ->
    @mathbox  = @mbox.mathbox
    @npoints  = 24 * @width

  # [[-100,100],[0,100],[-100,100]]
  cartesian:( range=[[0,1],[0,1],[0,1]], scale=[2,1,2], divide=[10,10] ) ->
    @mathbox.camera( { position:[2.4,2.4,2.4], proxy:true } )
    view  = @mathbox.cartesian( { range:range, scale:scale } )
    @axesXYZ( view,  8, 0xFFFFFF )
    @gridXYZ( view,  4, 0xFFFFFF, divide[0], 0.7, '10' )
    @tickXYZ( view, 64, 0xFFFFFF, divide[1], 2 )
    view

  polar:( range=[[0,2*π],[0,100],[0,100]], scale=[2,1.5,0.75] ) ->
    @mathbox.camera( { position:[0,0,4], proxy:true } ) # 2*π
    view = @mathbox.polar( { range:range, scale:scale } )
    #@tick(  view, 64, 0xFFFFFF, 12, 3, 1 )
    view.transform( {position: [0, 100, 0] } )
        .grid({ unitX:π/12, baseX:2, zWrite:false, detailX:81, divideX:12, divideY:10,axes:'xz', blending:'add', color:0x00F0B0, width:@width, opacity:1 } )
    @radPolar( view )
    view

  sphere:( range=[[0,2*π],[0,2*π],[0,1]], scale=[1,1,1] ) ->
    @mathbox.camera( { position:[0,0,4], proxy:true } ) # 2*π
    view = @mathbox.spherical( { range:range, scale:scale } )
    view

  axesXYZ:( view, width, color ) ->
    view.axis( { axis:1, width:width, color:color, end:false } )
        .axis( { axis:2, width:width, color:color, end:false } )
        .axis( { axis:3, width:width, color:color, end:false } )

  gridXYZ:( view, width, color, divide, opacity, id ) ->
    view.grid( { axes:[1,2], width:width, color:color, divideX:divide, divideY:divide, opacity:opacity, id:"gridXY#{id}" } )
        .grid( { axes:[2,3], width:width, color:color, divideX:divide, divideY:divide, opacity:opacity, id:"gridYZ#{id}" } )
        .grid( { axes:[3,1], width:width, color:color, divideX:divide, divideY:divide, opacity:opacity, id:"gridZX#{id}" } )

  tickXYZ:( view, size, color, divide, digits ) ->
    @tick(  view, size, color, divide, digits, 1 )
    @tick(  view, size, color, divide, digits, 2 )
    @tick(  view, size, color, divide, digits, 3 )

  tick:( view, size, color, divide, digits, axis ) ->
    offset = if axis is 2 then [0,0.06] else [0.0]
    view.scale(  {  axis:axis, divide:divide } )
    .ticks(  { zBias:axis, width:5, size:size*0.25, color:color } )
    .format( { digits:digits, font:"Arial" } )
    .label(  { size:size, depth:1, color:color, outline:1, offset:offset } )

  radPolar:( view ) ->
    points = view.area( @angPolar( ) )
    view.vector( { points:points, color:'white', width:10 } )

  angPolar:( ) ->
    obj = { id:"angPolar", axes:[1,2], width:13, height:1, items:2, channels:3 }
    obj.expr =  ( emit, a, r ) =>
      Util.noop( r )
      emit( 0, 0, 1 )
      emit( a, 1, 1 )
      return
    obj

  cartData:( range=[[0,1],[0,1],[0,1]] ) ->
    array = []
    dx = ( range[0][1]-range[0][0] ) / (@width-1)
    dy = ( range[1][1]-range[1][0] ) / (@height-1)
    dz = ( range[2][1]-range[2][0] ) / (@depth-1)
    for     x in [range[0][0]..range[0][1]] by dx
      for   y in [range[1][0]..range[1][1]] by dy
        for z in [range[2][0]..range[2][1]] by dz
          array.push([x,y,z,1])
    { data:array, items:1, channels:4, live:false, id:'cartData', width:@width*@height*@depth }

  cartPoints:( id="cartPoints" ) ->
    obj =  { id:id, width:@width, height:@height, depth:@depth, items:1, channels:4 }
    obj.expr = ( emit, x, y, z ) =>
      emit( x, y, z, 1 )
    obj

  cartColors:( toRgb, id="cartColors") ->
    obj  =  { id:id, width:@width, height:@height, depth:@depth, channels:4 } #
    obj.expr  = ( emit, x, y, z ) =>
      [r,g,b] = toRgb(x,y,z)
      emit( r, g, b, 1 )
    obj

  point:( size=40, pid="points", cid="colors" ) ->
    { points:'#'+pid, colors:'#'+cid, color: 0xffffff, size:size }

  cartVolume:( view, toRgb ) ->
    view.volume( @cartPoints() )
    view.volume( @cartColors( toRgb ) )
    view.point(  @point(  40, "cartPoints", "cartColors" ) )

  cartArray:( view ) ->
    view.array(  @cartData()   )
    view.point(  @point(  40, "cartData", "cartData" ) )

  cartSurfPoints:( toZ, id="cartSurfPoints" ) ->
    obj  =  { id:id, width:@width, height:@height, axes:[1,3], channels:3 }
    obj.expr = ( emit, x, y ) =>
      emit( x, toZ(x,y), y )
    obj

  cartSurfColors:( toRgb, id="cartSurfColors" ) ->
    obj  =  { id:id, width:@width,  height:@height, channels:4, axes:[1,2] } #
    obj.expr = ( emit, x, y ) =>
      [r,g,b] = toRgb( x, y )
      emit( r, g, b, 1 )
    obj

  cartSurface:( view, toDep, toRgb ) ->
    points = view.area( @cartSurfPoints( toDep ) )
    colors = view.area( @cartSurfColors( toRgb ) )
    view.surface( { points:points, colors:colors, color: 0xffffff, shaded:false, opacity:1.0, lineX:true, lineY:true, width:5 } )

  cylData:( range=[[0,2*π],[0,100],[0,100]] ) ->
    array = []
    dx = ( range[0][1]-range[0][0] ) / @width
    dy = ( range[1][1]-range[1][0] ) / @height
    dz = ( range[2][1]-range[2][0] ) / @depth
    for     h in [range[0][0]..range[0][1]] by dx
      for   c in [range[1][0]..range[1][1]] by dy
        for s in [range[2][0]..range[2][1]] by dz
          array.push([h,c,s])
    { data:array, items:1, channels:4, live:false, id:'hcss', width: @width * @height * @depth }

  # Cylindrical ang, rad, dep
  cylPoints:( id="cylPoints" ) ->
    obj =  {  id:id, width:@width, height:@height, depth:@depth, items:1, channels:4 }
    obj.expr = ( emit, ang, rad, dep, i ) =>
      radian = @mbox.toRad( i, @width )
      emit( radian, rad, dep, 1 )
    obj

  # Cylindrical ang, rad, dep  
  cylColors:( toRgb, id="cylColors" ) ->
    obj  =  { id:id, width:@width, height:@height, depth:@depth, channels:4 } #
    obj.expr  = ( emit, ang, rad, dep, i ) =>
      hue     = @mbox.toHue( i, @width )
      [r,g,b] = toRgb( hue, rad, dep ) # HCS
      emit( r, g, b, 1 )
    obj

  cylVolume:( view, toRgb ) ->
    view.volume( @cylPoints() )
    view.volume( @cylColors( toRgb ) )
    view.point(  @point(  40, "cylPoints", "cylColors" ) )

  cylLookup:( view, hcss, rgbs ) =>
    view.array( { data:hcss, id:"hcss", items:1, channels:4, live:false, width:hcss.length } )
    view.array( { data:rgbs, id:"rgbs", items:1, channels:4, live:false, width:rgbs.length } )
    view.point( { points:'#'+"hcss", colors:'#'+"rgbs", color:0xffffff, size:40 } )

  cylSurfPoints:( toDep, id="cylSurfPoints" ) ->
    obj  =  { id:id, width:@npoints+1, height:@height, axes:[1,2], channels:3 } # Need @npoints+1 to complete rotation
    obj.expr = ( emit, ang, rad, i ) =>
      radian = @mbox.toRad( i, @npoints )
      emit( radian, rad, 100*toDep(radian,rad) )
    obj

  cylSurfColors:( toDep, toRgb, id="cylSurfColors" ) ->
    obj  =  { id:id, width:@npoints+1, height:@height, channels:4, axes:[1,2] } # Need @npoints+1 to complete rotation
    obj.expr = ( emit, ang, rad, i ) =>
      hue     = @mbox.toHue( i, @npoints )
      radian  = @mbox.toRad( i, @npoints )
      [r,g,b] = toRgb( hue, rad, toDep(radian,rad)*100 )
      emit( r, g, b, 1 )
    obj

  cylSurface:( view, toRgb, toDep ) ->
    points = view.area( @cylSurfPoints( toDep ) )
    colors = view.area( @cylSurfColors( toDep, toRgb ) )
    view.surface( { points:points, colors:colors, color: 0xffffff, shaded:false, opacity:1.0, lineX:true, lineY:true, width:5 } )

  # Spherical Points
  sphPoints:( id="sphPoints" ) ->
    obj =   { id:id, width:@width, height:@height, depth:@depth, items:1, channels:4 }
    obj.expr = ( emit, ang1, ang2, rad, i, j ) =>
      emit( i*π*2/@width, j*π*2/@height, rad, 1 ) #if j*π*2/@height <= π
    obj

  sphColors:( toRgb, id="sphColors" ) ->
    obj  =  { id:id, width:@width, height:@height, depth:@depth, channels:4 } #
    obj.expr  = ( emit, ang1, ang2, rad, i, j ) =>
      [r,g,b] = toRgb( i*360/@width, j*360/@height, rad )
      emit( r, g, b, 1 )
    obj

  sphVolume:( view, toRgb ) ->
    view.volume( @sphPoints() )
    view.volume( @sphColors( toRgb ) )
    view.point(  @point(  40, "sphPoints", "sphColors" ) )

  domeColors:() ->
    obj =  { id:'domeColors', width:@width, height:@height, depth:@depth, channels:4 } #
    obj.expr  = ( emit, ang1, ang2, rad, i, j ) =>
      if j*360/@height <= 180
        [r,g,b] = Vis.toRgbHsv( i*360/@width, j*360/@height, rad )
        emit( r, g, b, 1 )
      else
        emit( 0, 0, 0, 0 )
    obj

`export default Coord`