
`import Util from '../util/Util.js'`
`import Vis  from '../vis/Vis.js'`
`import UI   from '../ui/UI.js'`
`import Base from '../ui/Base.js'`

class Cluster extends Base

  constructor:( stream, ui, @d3d ) ->
    super( stream, ui, 'Cluster' )

  ready:( cname ) =>
    Util.noop( cname )
    geo    = @pane.geo
    @graph = @d3d.createGraph( @pane )
    @g     = @graph.g
    @w     = geo.w
    @h     = geo.h
    @tree  = d3.cluster()
    @tree.size([@h*0.6,@w*0.75])
    UI.readJSON( 'json/Prin.json', (data) => @doCluster(data,@g) )

    @graph.$svg

  doCluster:( data, g ) =>
    @root = d3.hierarchy( data )
    @tree(  @root )
    #@sort( @root )
    @tree(  @root )
    @doLink()
    @doNode()
    return

  sort:( root ) ->
    root.sort(  (a, b) -> (a.height - b.height) || a.id.localeCompare(b.id) )
    return

  doLink:() ->
    link = @g.selectAll(".link")
      .data(@root.descendants().slice(1))
      .enter().append("path")
      .attr("class", "link")
      .attr("d", (d) => @moveTo(d) )

  moveTo:(d) ->
    p = d.parent
    """M#{d.y},#{d.x}C#{p.y+100},#{d.x} #{p.y+100},#{p.x} #{p.y},#{p.x}"""

  doNode:() ->
    node = @g.selectAll(".node")
      .data(@root.descendants())
      .enter().append("g")
      .attr("class",     (d) -> "node" + (d.children ? " node--internal" : " node--leaf") )
      .attr("transform", (d) -> "translate(" + d.y + "," + d.x + ")" )
    node.append("circle").attr("r", 5.0)
    node.append("svg:text")
      .attr("dy", 3 )
      .attr("x",  (d) -> if d.children? then -8 else 8 )
      .attr("y",  3 )
      .text(      (d) -> d.name )
      .attr("stroke", "yellow" )
      .style("text-anchor", (d) -> if d.children? then "end" else "start" )
      #text(                (d) -> d.name.substring(d.name.lastIndexOf(".") + 1) )

`export default Cluster`