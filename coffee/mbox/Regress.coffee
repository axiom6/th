
`import Util  from '../util/Util.js'`
`import Vis   from '../vis/Vis.js'`
`import MBox  from '../mbox/MBox.js'`
`import Coord from '../mbox/Coord.js'`

class Regress

  constructor:( @mbox ) ->
    @width  = 100
    @height = 100
    @mathbox  = @mbox.mathbox
    @coord = new Coord( @mbox, @width, @height )

  viewLinearRegress:() ->
    @x = @toArray( @data02(), 0 )
    @y = @toArray( @data02(), 1 )
    @n = Math.min( @x.length, @y.length )
    [slope,yInter] = @slopeYInter( @n, @x, @y )
    Util.alert( { slope:slope, yInter:yInter } )
    @view  = @coord.cartesian( [[0,4],[0,500],[0,4]] )
    points = @view.area( @areaRegress( @n, @x, @y )   )
    @view.surface( { points:points, color:0x5090FF, shaded:true, opacity:1.0, lineX:true, lineY:true, width:2 } )

  areaRegress:( n, x, y ) ->
    obj =  { id:'areaRegress', width:@width, height:@height, axes:[1,3], channels:3 }
    obj.expr = ( emit, slope, yInter, i, j ) =>
      Util.noop( i, j )
      emit( slope, @rss( n, x, y, slope, yInter ), yInter )
    obj

  rss:( n, x, y, slope, yInter ) ->
    sum = 0.0
    for i in [0...n]
      term = y[i] - yInter - slope*x[i]
      sum  = sum  + term * term
    #console.log( Util.toFixed(sum,1), Util.toFixed(slope,1), Util.toFixed(yInter,1) )
    sum

  data01:() ->
    [[0,2],[1,4],[2,3],[3,5],[4,8],[5,9],[6,10],[7,11]]

  data02:() ->
    [[0.0,2.1],[1.0,3.9],[2,5.2],[3,7.9],[4.0,10.3],[5,11.7],[6,14.1],[7,15.9]]

  toArray:( data, index ) ->
    x = []
    x.push( d[index] ) for d in data
    x

  slopeYInter:( n, x, y ) ->
    xmean  = @mean( n, x )
    ymean  = @mean( n, y )
    numer  = @sumProducts( n, x, y, xmean, ymean )
    denom  = @sumSquares(  n, x,    xmean  )
    slope  = numer / denom
    yInter = ymean - slope * xmean
    [slope,yInter]

  sumProducts:( n, x, y, xmean, ymean ) ->
    sum = 0.0
    sum = sum + (x[i]-xmean)*(y[i]-ymean) for i in [0...n]
    sum

  sumSquares:( n, x, xmean ) ->
    sum = 0.0
    sum = sum + (x[i]-xmean)*(x[i]-xmean) for i in [0...n]
    sum

  mean:( n, x ) ->
    sum = 0
    sum = sum + x[i]  for i in [0...n]
    sum / n

`export default Regress`