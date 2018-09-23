
`import Util     from '../util/Util.js'`
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
#import Rest     from '../store/Rest.js'`

class Pres

  constructor:( @build, @stream, @view ) ->
    @Shows    = { Axes:{},Chord:{},Cluster:{},Tree:{},Radial:{},Links:{},Radar:{},Wheelc:{},Brewer:{}, }
    @stream.subscribe( 'Select', 'Pres', (select) => @onSelect(select) )

  onSelect:( select ) ->
    name = select.name
    selected = @Shows[name ]
    if selected?
       selected.d3d = @createD3D(  name  ) if not @Shows[name].d3d?
       selected.page.selected = if name  is 'Table' then 'Topic' else 'Svg'
       # console.log( 'Pres.onSelect()', select, selected.page.selected )
      
  createShow:( pane ) ->
    page = new @Page( @build, @stream, @view, pane, 'Center' )
    if @Shows[pane.name]?
       @Shows[pane.name].pane = pane
       @Shows[pane.name].page = page
    else
       console.error( 'Pres.createShow() unknown show', pane.name )
    page

  createD3D:( select ) ->
    pane = @Shows[select].pane
    # concole.log( 'Pres.createD3D', select )
    d3d = switch select
      when 'Axes'    then @instanciateAxes(    pane  )
      when 'Chord'   then @instanciateChord(   pane  )
      #hen 'Cluster' then @instanciateCluster( pane  )
      when 'Link'    then @instanciateLink(    pane  )
      when 'Radar'   then @instanciateRadar(   pane  )
      when 'Radial'  then @instanciateRadial(  pane  )
      when 'Tree'    then @instanciateTree(    pane  )
      when 'Wheelc'  then @instanciateWheelc(  pane  )
      else console.error( 'd3d/Pres.instanciate() unknown select', select ); null
    d3d

  svgGeom:( pane ) ->
    console.error( 'Pres.svgGeom() missing page', pane.name ) if not pane.page?
    [pane.page.contents.svg,pane.geom()]

  transform:( pane, x, y, s ) ->
    cs = pane.page.contents.svg
    cs.$.hide()                          # Hide svg so it won't push out the pane
    cs.$g.attr( 'transform', """translate(#{x},#{y}) scale(#{s},#{s})""" )
    cs.$.show()
    return

  restData:( dbName, fileJson, doData ) ->
    rest = new @Rest( @stream, @Database.Databases[dbName].uriLoc )
    rest.key = 'name' if dbName is 'radar'
    rest.remember()
    rest.select( fileJson )
    onNext = (data) =>
      doData( data )
    rest.subscribe( Util.firstTok(fileJson,'.'), 'none', 'select', onNext )

  instanciateTree:( pane ) ->
    [svg,geom]= @svgGeom( pane )
    tree   = new Tree( svg.g, geom.wv, geom.hv, false )
    @restData( 'radar', 'polyglot-principles.json', (data) => tree.doTree(data) )
    tree

  instanciateRadial:( pane ) ->
    [svg,geom]= @svgGeom( pane )
    radial = new Radial( svg.g, geom.wv, geom.hv )
    @restData( 'radar', 'polyglot-principles.json', (data) => radial.doRadial(data) )
    radial


  instanciateRadar:( pane  ) ->
    [svg,geom]= @svgGeom( pane )
    radar = new Radar( svg.g, true, geom.wv, geom.hv )
    @restData( 'radar', 'axiom-quads.json', (quads) => radar.doQuads(quads) )
    @restData( 'radar', 'axiom-techs.json', (techs) => radar.doTechs(techs) )
    radar
    
  instanciateWheelc:( pane  ) ->
    [svg,geom]= @svgGeom( pane )
    wheelc = new Wheelc( svg.g, geom.wv, geom.hv )
    wheelc


  instanciateAxes:( pane  ) ->
    [svg,geom]= @svgGeom( pane )
    axes = new Axes( svg.g, geom.wv, geom.hv, { x1:0, x2:100, xtick1:10, xtick2:1 }, { y1:0, y2:100, ytick1:10, ytick2:1 } )
    @transform( pane, 40, 40, 1.0 )
    axes

  instanciateChord:( pane  ) ->
    [svg,geom]= @svgGeom( pane )
    chord = new Chord( svg.g, geom.wv, geom.hv )
    @transform( pane, geom.wv/2, geom.hv/2, geom.s )
    chord

  instanciateLink:( pane ) ->
    [svg,geom]= @svgGeom( pane )
    link = new Link( svg.g, geom.wv, geom.hv )
    link.ornament( 150 )
    link

`export default Pres`