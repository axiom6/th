
`import Util     from '../util/Util.js'`
`import Stream   from '../util/Stream.js'`
`import UI       from '../ui/UI.js'`
`import Vis      from '../vis/Vis.js'`
`import Axes     from '../d3d/Axes.js'`
`import Chord    from '../d3d/Chord.js'`
`import Cluster  from '../d3d/Cluster.js'`
`import Color    from '../d3d/Color.js'`
`import Link     from '../d3d/Link.js'`
`import Palettes from '../d3d/Palettes.js'`
`import Radar    from '../d3d/Radar.js'`
`import Radial   from '../d3d/Radial.js'`
`import Tree     from '../d3d/Tree.js'`
`import Wheelc   from '../d3d/Wheelc.js'`


class D3d

  D3d.specs = UI.pracJSON( "json/D3ds.json" )

  @init = () ->
    UI.hasPack = false
    UI.hasPage = false
    UI.hasTocs = true
    UI.hasLays = true
    UI.local   = "http://localhost:63342/th/public/"   # Every app needs to change this
    UI.hosted  = "https://jitter-48413.firebaseapp.com/" # Every app needs to change this
    Util.ready ->
      subjects = ["Ready","Select","Test"]
      infoSpec = { subscribe:true, publish:true, subjects:subjects }
      stream   = new Stream( subjects, infoSpec )
      ui       = new UI( stream, D3d.specs )
      d3d      = new D3d( stream, ui )
      d3d.ready()
      return
    return

  constructor:( @stream, @ui ) ->
    @axes    = new Axes(    @stream, @ui, @ )
    @chord   = new Chord(   @stream, @ui, @ )
    @cluster = new Cluster( @stream, @ui, @ )
    @link    = new Link(    @stream, @ui, @ )
    @radar   = new Radar(   @stream, @ui, @, 'Radar'  )
    @radial  = new Radial(  @stream, @ui, @ )
    @tree    = new Tree(    @stream, @ui, @ )
    @Wheelc  = new Wheelc(  @stream, @ui, @, 'Wheelc' )

  ready:() =>
    @ui.pagesReady( 'Graph' )
    @ui.view.hideAll(  )
    select = UI.toTopic( 'View', 'D3d', UI.SelectView )
    @stream.publish( 'Select', select )

  createGraph:( pane ) ->
    geo        = pane.geo
    graph      = {}
    graph.sId  = Util.htmlId( pane.name, 'Svg' )
    graph.gId  = Util.htmlId( pane.name, 'Grp' )
    graph.svg  = d3.select('#'+pane.htmlId).append("svg:svg").attr("id",graph.sId)
    graph.svg.attr("width",geo.wp).attr("height",geo.hp)
    graph.defs = graph.svg.append("svg:defs")
    graph.g    = graph.svg.append("svg:g").attr("id",graph.gId) # All tranforms are applied to g
    graph.$svg = pane.$.find( '#'+graph.sId )
    graph.$g   = pane.$.find( '#'+graph.gId )
    graph.d3d  = @
    graph

  transformGraph:( pane, graph, select ) ->
    geo = pane.geo
    if select.intent is UI.SelectView
      [x0,y0,s] = [0,0,1.0]
    else
      [x0,y0,s] = [ geo.x0, geo.y0, geo.s ]
    console.log( 'D3d.transformGraph()', { w:geo.w, h:geo.h, x0:x0, y0:y0, s:s } )
    graph['$svg'].hide() # Hide svg so it won't push out the pane
    graph.svg.attr('width',geo.w).attr('height',geo.h)
    graph.g.attr( 'transform', """translate(#{x0},#{y0}) scale(#{s})""" )
    graph['$svg'].show()
    return

D3d.init()

`export default D3d`
