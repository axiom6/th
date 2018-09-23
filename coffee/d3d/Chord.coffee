
`import Util from '../util/Util.js'`
`import Base from '../ui/Base.js'`

class Chord extends Base

  @matrix2 = [[11975, 5871, 8916, 2868], [1951, 10048, 2060, 6171], [8010, 16145, 8090, 8045], [1013, 990, 940, 6907]]
  @range2  = ["#000000", "#FFDD89", "#957244", "#F26223"]

  constructor:( stream, ui, @d3d ) ->
    super( stream, ui, 'Chord' )
    @matrix = [
      [ 0,20,20,20],
      [20, 0,20,80],
      [20,20, 0,20],
      [20,80,20, 0]]
    @range  = ["#FF0000", "#00FF00", "#0000FF", "#888888"]

  ready:( cname ) =>
    Util.noop( cname )
    geo     = @pane.geo
    @graph  = @d3d.createGraph( @pane )
    @g      = @graph.g
    @width  = geo.w
    @height = geo.h
    @outer  = Math.min( @width, @height) * 0.5 - 40
    @inner  = @outer - 30
    @format = d3.formatPrefix(",.0", 1e3)
    @chord  = @createChord()
    @arc    = @createArc(    @inner, @outer )
    @ribbon = @createRibbon( @inner )
    @color  = @createColor(  @range )
    @g.datum( @chord(@matrix) )
    @g.attr("transform", "translate(" + @width / 2 + "," + @height / 2 + ")")
    @group  = @createGroup( @arc   )
    @ticks  = @createTicks( @group, @outer )
    @appendRibbons( @g, @ribbon )
    @graph.$g.css( { "background-color":"white" } )
    @graph.$svg

  createChord:() ->
    d3.chord().padAngle(0.05).sortSubgroups(d3.descending)

  createArc:( inner, outer ) ->
    d3.arc().innerRadius(inner).outerRadius(outer)

  createRibbon:( inner ) ->
    d3.ribbon().radius(inner)

  createColor:( range ) ->
    d3.scaleOrdinal().domain( d3.range(4) ).range(range)

  createGroup:( arc ) ->

    group = @g.append("g")
      .attr("class", "groups")
      .selectAll("g")
      .data( (d) => d.groups )
      .enter().append("g")

    group.append("path")
      .style("fill",   (d) => @color(d.index) )
      .style("stroke", (d) => d3.rgb( @color(d.index)).darker() )
      .attr("d", arc )

  createTicks:( group, outer ) ->

    ticks = group.selectAll(".group-tick")
      .data(  (d) => @groupTicks( d, 1e3 ) )
      .enter().append("g")
      .attr("class", "group-tick")
      .attr("transform", (d) => "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outer + ",0)" )

    ticks.append("line").attr("x2", 6 )

    ticks
      .filter(              (d) -> d.value % 5e3 is 0 ).append("text").attr("x", 8).attr("dy", ".35em")
      .attr("transform",    (d) -> ( if d.angle > Math.PI then "rotate(180) translate(-16)" else null ) )
      .style("text-anchor", (d) -> ( if d.angle > Math.PI then "end" else null ) )
      .text( (d) => @format(d.value) )

    ticks

  appendRibbons:( g, ribbon ) ->
    g.append("g")
      .attr("class", "ribbons")
      .selectAll("path")
      .data( (chords) -> chords )
      .enter().append("path")
      .attr("d", ribbon )
      .style("fill",   (d) => @color(d.target.index) )
      .style("stroke", (d) => d3.rgb( @color(d.target.index)).darker() )

  # Returns an array of tick angles and values for a given group and step.
  groupTicks:( d, step ) ->
    k = ( d.endAngle - d.startAngle) / d.value
    d3.range( 0, d.value, step).map( (value) -> { value: value, angle: value * k + d.startAngle } )

  # ------------

  xcreateFill:(  range  ) ->
    d3.scaleOrdinal().domain( d3.range(4) ).range( range )

  xcreateGroups:() =>
    groups = @g.append("g").selectAll("path").data( (d) => d.groups ).enter().append("path") #
      .style("fill",   (d) => @fill( d.index ) )
      .style("stroke", (d) => @fill( d.index ) )
    groups.attr( "d", d3.arc().innerRadius(@inner).outerRadius(@outer) )
    groups.on( "mouseover", @fade(.1) ).on( "mouseout", @fade(1) )
    groups

  xupdateChords:() ->
    chords = @g.append("g").attr("class", "chord").selectAll("path").datam( @chords(@matrix) ).enter().append("path")
      .attr(  "d", d3.chord().radius(@inner))
      .style( "fill", (d) => @fill( d.target.index ) )
      .style( "opacity", 1 )
    chords

  # Returns an array of tick angles and labels, given a group.
  xcreateTicks:() ->
    ticks =  @g.append("g").selectAll("g").data( @chord.groups )
    ticks.enter().append("g").selectAll("g").data( @groupTicks   )
    #ticks.enter().append("g").attr("transform", (d) => "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + @outer + ",0)" )
    ticks.append("line").attr("x1", 1).attr("y1", 0).attr("x2", 5).attr("y2", 0).style( "stroke", "#000" )
    ticks.append("text").attr("x",  8).attr("dy", ".35em")
     .attr( "transform", (d) -> ( if d.angle > Math.PI then "rotate(180)translate(-16)" else null ) )
    ticks.style("text-anchor", (d) => ( if d.angle > Math.PI then "end" else null) )
    ticks.text( (d) => d.label )
    ticks

  xgroupTicks: (d) ->
    k = (d.endAngle - d.startAngle) / d.value
    range = d3.range(0, d.value, 1000).map( (v,i) => { angle: v * k + d.startAngle, label: (if i % 5 then null else v / 1000 + "k") } )
    #console.log( 'groupTicks', d, k )
    range

  # Returns an event handler for fading a given chord group.
  xfade: (opacity) =>
    (i) =>
        @g.selectAll(".chord path").filter( (d) =>
          d.source.index isnt i and d.target.index isnt i ).transition().style( "opacity", opacity )


`export default Chord`

