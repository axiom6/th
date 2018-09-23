
`import Util from '../util/Util.js'`
`import UI   from '../ui/UI.js'`
`import Vis  from '../vis/Vis.js'`
`import Base from '../ui/Base.js'`

class Radar extends Base

  constructor:( stream, ui, @d3d, name ) ->
    super( stream, ui, name )
    @criterias = [                       # Grade  Percentile
      { name:"Adopt",  radius:@r40 }     #   A     90-100%
      { name:"Trial",  radius:@r60 }     #   B     80-89%
      { name:"Access", radius:@r80 }     #   C     70-79%
      { name:"Hold",   radius:@r100 } ]  #   D     60-69%

  isRadar:() ->
    @name is 'Radar'

  ready:( cname ) =>
    Util.noop( cname )
    geo     = @pane.geo
    @graph  = @d3d.createGraph( @pane )
    @g      = @graph.g
    @width  = geo.w
    @height = geo.h
    @x0     = @width/2
    @y0     = @height/2
    @inner  = 0
    @outer  = ( Math.min(@width,@height) - 100 ) / 2
    @r04    = @outer*0.04; @r08 = @outer*0.08; @r16 = @outer*0.16;
    @r10    = @outer*0.1;  @r20 = @outer*0.2;  @r30 = @outer*0.3
    @r40    = @outer*0.4;  @r50 = @outer*0.5;  @r60 = @outer*0.6
    @r80    = @outer*0.8;  @r90 = @outer*0.9;  @r100= @outer*1.0
    @s2     = Math.sin(  Vis.rad(60) )
    @r2     = @s2*@s2*60.0
    @p60    = -Math.sin( Vis.rad(60) )
    @attrG( @g )

    UI.readJSON( 'json/Quad.json', (quads) => @doQuads(quads) ) if @isRadar()
    UI.readJSON( 'json/Tech.json', (techs) => @doTechs(techs) ) if @isRadar()

    @graph.$svg

  doQuads:( quads ) =>
    @quads( Util.toArray(quads), @r08, @r100 )
    @circles( @criterias )
    return

  doTechs:( techs ) =>
    @pts( Util.toArray(techs) )
    return

  attrG:( g ) =>
    g.attr("style","background#{d3.rgb(250,240,200)}; overflow:visible;")

  prompt:() =>
    @g.append("svg:text")
      .text("Drag and drop the blue dots to target technologies as Adopt Trial Access or Hold" )
      .attr("x", 20 ).attr("y", 20 ).attr("font-family","Arial").attr("font-size","14px")

  grid:( da, dr, ba=0, ea=360, br=@r40, er=@r100  ) =>
    for ang in [ba...ea] by da
      cos = Math.cos(@rad(ang))
      sin = Math.sin(@rad(ang))
      @quadLine( @r16*cos, @r16*sin, @r100*cos, @r100*sin, "#CCCCCC" )
    for r in [br...er] by dr
      @circle( r  )
    for r in [@r08...@r40] by @r08
      @circle( r  )
    return

  circle:( r ) =>
    @g.append("svg:circle")
      .attr("cx",@x0).attr("cy",@y0)
      .attr("fill","none").attr("stroke","#CCCCCC").attr("stroke-width",1)
      .attr("r", r )
    return

  # Concentric circles for delinating graded adoption criteria
  circles:( criterias ) =>
    g = @g.selectAll("g").data( criterias ).enter().append("svg:g")
    g.append("svg:circle")
     .attr("cx",@x0).attr("cy",@y0)
     .attr("fill","none").attr("stroke","gray").attr("stroke-width",1)
     .attr("r", (criteria) -> criteria.radius )
    if( @isRadar() )
      g.append("svg:text")
       .attr("x",  @x0 )
       .attr("y",  (criteria) => @y0 - criteria.radius )
       .text(      (criteria) => criteria.name )
       .attr("text-anchor","middle")
       .attr("dy","1.2em")
       .attr("font-size","18pt").attr("font-family","Arial")
    return

  quads:( quadrants, r1, r2 ) =>
    @wedges( quadrants, @inner, r2  )
    # @grid((@r100-@r40)/15,5)

    n = quadrants.length*2; dif=360/n; ang=0; cos=0; sin=0; name2s=null
    for i in [0...n]
      ang = i*dif; cos = Math.cos(@rad(ang)); sin = Math.sin(@rad(ang))
      @quadLine( r1*cos, r1*sin, r2*cos, r2*sin, "rgba(180,180,180,1.0)" )
      # @degName( @r100+12, ang )
      name2s = quadrants[Math.floor(i/2)]['name2s']
      if( name2s? && name2s.length==2  )
        @quadName( @r100+12, ang+dif/2, name2s[i%2] )

    n   = quadrants.length
    dif = 360/n
    beg = if @isRadar() then dif/2 else 0
    for i in[0...n]
      name1 = quadrants[i].name1
      if( name1? && name1.length>0  )
        @quadName( @r100+12, beg+dif*i, name1 )
    return

  quadName:( r, ang, name ) =>
    cx  = @x0 + r*Math.cos(@rad(ang))
    cy  = @y0 + r*Math.sin(@rad(ang))
    rot = "rotate(#{@angleQuad(ang)},#{cx},#{cy})"
    dy  = if( 0 <= ang && ang <= 180 ) then ".15em" else ".5em"
    @g.append("svg:text")
      .attr("x", cx )
      .attr("y", cy )
      .text( name )
      .attr("transform",rot)
      .attr("text-anchor","middle")
      .attr("dy",dy)
      .attr("font-size","18pt").attr("font-family","Arial")
    return
    
  degName:( r, ang ) =>
    cx = @x0 + r*Math.cos(@rad(ang))
    cy = @y0 + r*Math.sin(@rad(ang))
    rotate = "rotate(#{@angleQuad(ang)},#{cx},#{cy})"
    @g.append("svg:text").attr("x", cx ).attr("y", cy ).text( ang )
      .attr("transform",rotate).attr("text-anchor","middle")
      .attr("dy",".35em") # .textUtilline("middle")
      .attr("font-size","12pt").attr("font-family","Arial")
    return

  wedge:( fill, g, r1, r2, a1, a2 ) =>
    arc = d3.arc().innerRadius(r1).outerRadius(r2).startAngle(@radD3(a1)).endAngle(@radD3(a2))
    g.append("svg:path").attr("d",arc).attr("fill",fill).attr("stroke","none").attr("transform", "translate(#{@x0},#{@y0})")
    return

  # Background wedges to indicate technology quadrants
  wedges:( quadrants, r1, r2 ) =>
    wedge = d3.arc()
      .innerRadius(r1)
      .outerRadius(r2)
      .startAngle( (d) => @radD3(d.beg) )
      .endAngle(   (d) => @radD3(d.end) )
    @g.selectAll("path")
      .data(quadrants)
      .enter()
      .append("svg:path")
      .attr("d",wedge)
      .attr("transform", "translate(#{@x0},#{@y0})")
      .attr("fill",(d) => d.color )
      .attr("stroke","none")
    return

  symType:( tech ) =>
    if( tech.changed? && tech.changed=='+' ) then "triangle-up" else "circle"
   
  # Plot tech points as either dots or triangles and add drag behavior. Add tech title tool tip
  pts:( techs ) =>
    g = @g.selectAll("g").data(techs).enter().append("svg:g")

    dot = g.append("svg:circle")
      .attr("id",    (tech) => @techId(tech) )
      .attr("class", "dot" )
      .attr("cx",    (tech) => @x(tech) )
      .attr("cy",    (tech) => @y(tech) )
      .attr("title", (tech) => @techTitle(tech) )
      .attr("r", 6 ).attr("fill","orange") # .attr("fill", (d) => if d.fix then "yellow" else "blue" )
      .attr("stroke","orange").attr("stroke-width",1)

    dot.call( (tech) => tech.dot = dot )

    ###
    dot.call(
      d3.behavior.drag()
        .on("dragstart", (tech) => @doDragStart(tech) )
        .on("drag",      (tech) => @doDrag(tech) )
        .on("dragend",   (tech) => @doDragEnd(tech)   )  )
    ###
      
    g.append("svg:text")
      .text(               (tech) => ( if(tech.i) then tech.i+' ' else '' ) + tech.name )
      .attr("id",          (tech) => @techTx(tech) )
      .attr("text-anchor", (tech) => if @leftQuads(tech) then "end"       else "start" ) 
      .attr("x",           (tech) => if @leftQuads(tech) then @x(tech)-10 else @x(tech)+10 )
      .attr("y",           (tech) => @y(tech) )      
      .attr("dy",".35em").attr("font-family","Arial").attr("font-size","10px")
    return

  # Start drag by setting fill yellow
  doDragStart:( tech ) ->
    #d3.select(tech.dot).attr("fill","yellow")
    d3.select("circle#"+@techId(tech)).attr("fill","yellow")
    # Util.log("beg", @techTitle(tech) ); # d3.select(circle).attr("fill","yellow")
    return

  # Respond to mouse drag by updating the tech grade angle and status
  doDrag:( tech ) ->
    if not d3.event? then return
    x   = d3.event.x-@x0
    y   = @y0-d3.event.y # Reverse sign of y
    tech.angle = @angle( x, y )
    tech.grade = @grade( x, y )
    window.status = @techTitle(tech)
    d3.select('circle#'+@techId(tech)).attr("cx",@x(tech)).attr("cy",@y(tech))
    return

  # End drag by setting fill blue
  doDragEnd:( tech ) ->
    d3.select("circle#"+@techId(tech)).attr("fill","blue").attr("title", @techTitle(tech) )
    d3.select(  "text#"+@techTx(tech))
      .attr("x", (tech) => if @leftQuads(tech) then @x(tech)-10 else @x(tech)+10 )
      .attr("y", (tech) => @y(tech) )
    return

  leftQuads:(tech) ->  90<=tech.angle && tech.angle<270

  # Convert degress to radians and make angle counter clockwise
  rad:(    deg ) ->  (360-deg) * Math.PI / 180.0
  degSVG:( deg ) ->   360-deg
  radD3:(  deg ) ->  (450-deg) * Math.PI / 180.0
  degD3:(  rad ) ->      -rad  * 180.0   / Math.PI

  # Calculate x y coordinates for plotting points from the tech grade and angle
  x:( tech ) -> @x0 + @r(tech) * Math.cos(@rad(tech.angle))
  y:( tech ) -> @y0 + @r(tech) * Math.sin(@rad(tech.angle))

  # Calculate radius for plotting points from the tech grade
  r:( tech ) ->
    g = tech.grade
    if g > 90 then (100-g) / 10.0*@r40 else @r40+(90-g)/30.0*@r60

  # Calculate tech angle from xy pixel/mouse coordinates
  angle:( x, y ) ->
    ang = Math.atan2(y,x) * 180.0 / Math.PI
    ang = if ang < 0 then 360+ang else ang
    Math.round(ang)

  # Calculate tech grade radius from xy pixel/mouse coordinates
  grade:( x, y ) ->
    r  = Math.sqrt(x*x+y*y)
    r = if r < @r40 then 100-r*10/@r40 else 90 + (@r40-r)*30.0/@r60
    Math.round(r)

  # Create a string of tech data for tool tips and status
  techTitle:( tech ) ->
    tech.name+ " " + Math.round(tech.grade) + "% " + Math.round(tech.angle) + " Deg  " + tech.title

  # Replace any CSS selection character with_ to create selectable ids
  techId:( tech ) ->
    ptn = /[ .#>:~\^\=\+\*\(\)\[\]]/g
    "_"+tech.name.replace( ptn, '_' )

  techTx:( tech ) -> @techId(tech) + "_tx"

  angleQuad:( ang ) ->
    if Vis.within(0,ang,180) then -ang+90 else -ang-90

  quadLine:( x1, y1, x2, y2, stroke ) ->
    @g.append("svg:line")
    .attr("x1",x1+@x0 ).attr("y1",y1+@y0 ).attr("x2",x2+@x0 ).attr("y2",y2+@y0 )
    .attr("stroke",stroke).attr("stroke-width","1")
    return

`export default Radar`