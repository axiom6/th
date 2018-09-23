

`import Util  from '../util/Util.js'`
`import Vis   from '../vis/Vis.js'`
`import Color from '../d3d/Color.js'`
`import Base  from '../ui/Base.js'`

class Link extends Base

  @pts1 = [ [200, 40], [200, 60], [200, 80], [200,100], [200,120], [200,140], [200,160] ]

  constructor:( stream, ui, @d3d ) ->
    super( stream, ui, 'Link' )

  ready:( cname ) =>
    Util.noop( cname )
    geo       = @pane.geo
    @graph    = @d3d.createGraph( @pane )
    @g        = @graph.g
    @w        = geo.w
    @h        = geo.h
    @cssLink  = 'link'
    @thick    = 1
    @da       = 5
    @ornament( 150 )
    @graph.$svg

  link:( x1, y1, x2, y2, n, fill ) ->
    r  = Math.sqrt( (y2-y1)*(y2-y1) + (x2-x1)*(x2-x1) ) / 2
    a1 = Vis.angleSvg( x2-x1, y2-y1 )
    a2 = Vis.angleSvg( x1-x2, y1-y2 )
    @linkBeg( x1, y1, a1, r, n, fill )
    @linkEnd( x2, y2, a2, r, n, fill )
    return

  linkBeg:( x1, y1, a1, r1, n, fill ) ->
    n2  = Math.floor( n/2 )
    b1  = a1 - @da * n2
    e1  = a1 + @da * n2 + 1
    b1 += 360 if a1 is 0
    e1 += 360 if a1 is 0
    @radiate( @g, x1, y1, r1, b1, e1, @da, false, @rgb(fill) )
    return

  linkEnd:( x2, y2, a2, r2, n, fill ) ->
    n2 = Math.floor( n/2 )
    b2 = a2 - @da * n2
    e2 = a2 + @da * n2 + 1
    b2 += 360 if a2 is 0
    e2 += 360 if a2 is 0
    @radiate( @g, x2, y2, r2, b2, e2, @da, false, @rgb(fill) )
    return

  link2:( x1, y1, x2, y2, n, fill ) ->
    r  = Math.sqrt( (y2-y1)*(y2-y1) + (x2-x1)*(x2-x1) ) / 2
    n2 = Math.floor( n/2 )
    a1 = Vis.angleSvg( x2-x1, y2-y1 )
    b1 = a1 - @da * n2
    e1 = a1 + @da * n2 + 1
    a2 = Vis.angleSvg( x1-x2, y1-y2 )
    b2 = a2 - @da * n2
    e2 = a2 + @da * n2 + 1
    #console.log( 'Link.link', { r:Util.toFixed(r), a1:Util.toFixed(a1), a2:Util.toFixed(a2), n:n, n2:n2, b1:b1, e1:e1, b2:b2, e2:e2 } )
    @radiate( @g, x1, y1, r, b1, e1, @da, false, @rgb(fill) )
    @radiate( @g, x2, y2, r, b2, e2, @da, false, @rgb(fill) )
    return

  rgb:( fill ) ->
    Color.Prac[fill].rgba

  strokeOpp:( ang ) =>
    hue = 180-ang
    hue = 360+hue if hue < 0
    [Vis.hslCss(  { h:hue, s:0.5, l:0.8 } ), hue ]

  inEast:(  ang ) -> (  0 <= ang and ang <=  45 ) or ( 315 <= ang and ang <= 360 )
  inNorth:( ang ) ->   45 <  ang and ang <  134
  inWest:(  ang ) ->  135 <= ang and ang <= 225
  inSouth:( ang ) ->  225 <  ang and ang <  315

  hue090:( ang ) -> 360 - ang
  hue180:( ang ) -> if ang <= 180 then 180-ang else 540-ang
  hue270:( ang ) -> 360 - ang
  hue360:( ang ) -> 540 - ang

  ornament:( r ) ->
    @radiate( @g, @w*0.50,     @h*0.50,     r,   0, 360, 5, false )
    @radiate( @g, @w*0.50+2*r, @h*0.50,     r, 135, 226, 5, false, @hue180 )
    @radiate( @g, @w*0.50,     @h*0.50-2*r, r, 225, 315, 5, true,  @hue270 )
    @radiate( @g, @w*0.50-2*r, @h*0.50,     r, 315, 406, 5, false, @hue360 )
    @radiate( @g, @w*0.50,     @h*0.50+2*r, r,  45, 135, 5, true,  @hue090 )
    return

  line:(  x0, y0, x1, y1 )                 -> """M#{x0},#{y0}L#{x1},#{y1}"""
  quad:(  x0, y0, x1, y1, x2, y2 )         -> """M#{x0},#{y0}Q#{x1},#{y1} #{x2},#{y2}"""
  cubic:( x0, y0, x1, y1, x2, y2, x3, y3 ) -> """M#{x0},#{y0}C#{x1},#{y1} #{x2},#{y2} #{x3},#{y3}"""

  circle:( g, r, x, y, stroke ) ->
    g.append("svg:circle").attr("r",r).attr("r",r).attr("cx",x).attr("cy",y)
    .attr("fill",stroke).attr("stroke",'none')
    return

  path:( g, stroke, ang, hue, d )->
    g.append('svg:path').attr( 'd', d ).attr('stroke',stroke).attr('fill','none').attr('class',@cssLink)
     .attr('stroke-width',@thick).attr('title',ang+' '+hue)
    return

  radiate:( g, x0, y0, r, beg, end, da, skipBeg=false, toHue = (ang) -> ang ) ->
    pc = .5
    for a in [beg...end] by da
      continue if a is beg and skipBeg
      ang = if a > 360 then a - 360 else a
      [x,yy] = @xy( ang, x0, y0, r )
      if @inEast(ang) or @inWest(ang)
        x1  = (x0*(1-pc)+x*pc)
        x2  = (x0*pc+x*(1-pc))
        y1  =  y0
        y2  =  yy
      else
        x1  = x0
        x2  = x
        y1  = (y0*(1-pc)+yy*pc)
        y2  = (y0*pc+yy*(1-pc))
      hue    = 0
      stroke = toHue
      if Util.isFunc(toHue)
        hue    = toHue(ang)
        stroke = Vis.hslCss( { h:hue, s:0.5, l:0.8 } )
      @path( g, stroke, ang, hue, @cubic( x0, y0, x1, y1, x2, y2, x, yy ) )
    return

  xy:( ang, x0, y0, r ) ->
    cos =  Vis.cosSvg(ang)
    sin =  Vis.sinSvg(ang)
    cos =  1 if @inEast(  ang )
    cos = -1 if @inWest(  ang )
    sin = -1 if @inNorth( ang )
    sin =  1 if @inSouth( ang )
    x   = x0 + r * cos
    y   = y0 + r * sin
    [x,y]

  tree:( g, x0, y0, pts, stroke ) ->
    for [x,yy] in pts
      x1 = x  - 30
      y1 = y0
      x2 = x0 - 30
      y2 = yy
      @path( g, @cubic( x0, y0, x1, y1, x2, y2, x, yy ), stroke )
      @circle( g, 2, x0, y0, stroke )
      @circle( g, 2, x1, y1, stroke )
      @circle( g, 2, x2, y2, stroke )
      @circle( g, 2, x,  yy, stroke )
      #console.log( { x0:x0, y0:y0, x1:x1, y1:y1, x2:x2, y2:y2, x3:x, y3:yy } )
    return

  diag:( g, x0, y0, pts, stroke ) ->
    pc = .5
    for [x,yy] in pts
      ang = Vis.angle( x-x0, y-y0 )
      cos = Vis.cos(ang)
      sin = Vis.sin(ang)
      Util.noop( cos, sin )
      x1  = (x0*(1-pc)+x*pc)
      x2  = (x0*pc+x*(1-pc))
      y1  = y0
      y2  = yy
      @path( g, @cubic( x0, y0, x1, y1, x2, y2, x, yy ), stroke )
      @circle( g, 2, x0, y0, stroke )
      @circle( g, 2, x1, y1, stroke )
      @circle( g, 2, x2, y2, stroke )
      @circle( g, 2, x,  yy, stroke )
      #console.log( { x0:x0, y0:y0, x1:x1, y1:y1, x2:x2, y2:y2, x3:x, y3:yy } )
    return

`export default Link`