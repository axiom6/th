
`import Util from '../util/Util.js'`
`import Vis  from '../vis/Vis.js'`
`import Base from '../ui/Base.js'`

class Axes extends Base

  constructor:( stream, ui, @d3d ) ->
    super( stream, ui, 'Axes' )

  ready:( cname ) =>
    Util.noop( cname )
    geo     = @pane.geo
    @graph  = @d3d.createGraph( @pane )
    @margin = { left:40, top:40, right:40, bottom:40 }
    @width  = geo.w - @margin.left - @margin.right
    @height = geo.h - @margin.top  - @margin.bottom
    @g      = @graph.g
    @xObj   = { x1:0, x2:100, xtick1:10, xtick2:1 }
    @yObj   = { y1:0, y2:100, ytick1:10, ytick2:1 }
    @xScale = @createXScale( @xObj, @width  )
    @yScale = @createYScale( @yObj, @height )
    @xAxis  = @createXAxis(  @xObj, @width,  @xScale )
    @yAxis  = @createYAxis(  @yObj, @height, @yScale )
    @attrG( @g )
    @bAxis  = @createBAxis( @g, @xAxis )
    @tAxis  = @createTAxis( @g, @xAxis )
    @lAxis  = @createLAxis( @g, @yAxis )
    @rAxis  = @createRAxis( @g, @yAxis )
    @grid( @g, @xObj, @yObj )
    $('path.domain').hide()
    #@d3d.transform( @graph.$s, @g, geo.w/2, geo.h/2, geo.s )
    @graph.$svg

  createXScale:( xObj, width ) ->
    d3.scaleLinear().domain([xObj.x1,xObj.x2]).range([0,width]).clamp(true)

  createYScale:( yObj, height ) ->
    d3.scaleLinear().domain([yObj.y1,yObj.y2]).range([height,0] ).clamp(true)

  createXAxis:( xObj, width, xScale ) ->
    xtick1 = if xObj.xtick1?  then xObj.xtick1 else (@x2-@x1) / 10
    ntick1 = (xObj.x2-xObj.x1) / xObj.xtick1
    ntick2 = if xObj.xtick2? then xtick1/xObj.xtick2 else 0
    Util.noop( ntick2 )
    d3.axisLeft().scale(xScale).ticks(ntick1).tickSize(12) # tickSubdivide(ntick2) .tickPadding(1)

  createYAxis:( yObj, height, yScale ) ->
    ytick1 = if yObj.ytick1? then yObj.ytick1 else (@y2-@y1) / 10
    ntick1 = (yObj.y2-yObj.y1) / yObj.ytick1
    ntick2 = if yObj.ytick2? then ytick1/yObj.ytick2 else 0
    Util.noop( ntick2 )
    d3.axisTop().scale(yScale).ticks(ntick1).tickSize(12)

  attrG:( g ) ->
    g.attr("style","overflow:visible;")
     .attr("transform", "translate(#{@margin.left},#{@margin.top})" )
     .attr("style","overflow:visible;")

  createBAxis:( s, xAxis ) ->
   s.append("svg:g")
    .attr("class", "axis-bottom axis")
    .attr("stroke", '#FFFFFF')
    .attr("transform", "translate(0,#{@height})" )
    #call(xAxis.orient("bottom"))

  createTAxis:( g, xAxis ) ->
   g.append("svg:g")
    .attr("class", "axis-top axis")
    .attr("stroke", '#FFFFFF')
    #call(xAxis.orient("top"))

  createLAxis:( g, yAxis ) ->
   g.append("svg:g")
    .attr("class", "axis-left axis")
    .attr("stroke", '#FFFFFF')
    #call(yAxis.orient("left"))

  createRAxis:( g, yAxis ) ->
   g.append("svg:g")
    .attr("class", "axis-right axis")
    .attr("stroke", '#FFFFFF')
    .attr("transform", "translate(#{@width},0)" )
    #call(yAxis.orient("right"))

  grid:( g, xObj, yObj ) ->
    elem = g.append("g:g")
    @xLines( elem, xObj.x1, xObj.x2, xObj.xtick2, yObj.y1, yObj.y2, '#000000', 1 )
    @yLines( elem, yObj.y1, yObj.y2, yObj.ytick2, xObj.x1, xObj.x2, '#000000', 1 )
    @xLines( elem, xObj.x1, xObj.x2, xObj.xtick1, yObj.y1, yObj.y2, '#FFFFFF', 1 )
    @yLines( elem, yObj.y1, yObj.y2, yObj.ytick1, xObj.x1, xObj.x2, '#FFFFFF', 1 )

  line:( elem, x1, y1, x2, y2, stroke="black", thick=1, xScale=@xScale, yScale=@yScale ) ->
   elem.append("svg:line")
    .attr("x1",xScale(x1)).attr("y1",yScale(y1)).attr("x2",xScale(x2)).attr("y2",yScale(y2)).attr("stroke",stroke).attr("stroke-width",thick)

  xLines:( elem, xb, xe, dx, y1, y2, stroke, thick ) ->
    i  = 1
    x1 = Vis.floor( xb, dx )
    x2 = Vis.ceil(  xe, dx )
    x  = x1
    while( x <= x2 )
      @line( elem, x, y1, x, y2, stroke, thick )
      x = x1 + dx * i++

  yLines:( elem, yb, ye, dy, x1, x2, stroke, thick ) ->
    i  = 1
    y1 = Vis.floor( yb, dy )
    y2 = Vis.ceil(  ye, dy )
    y  = y1
    while( y <= y2 )
      @line( elem, x1, y, x2, y, stroke, thick )
      y = y1 + dy * i++

`export default Axes`