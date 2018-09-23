
`import Util     from '../util/Util.js'`
`import Vis      from '../vis/Vis.js'`
`import Radar    from '../d3d/Radar.js'`
`import Palettes from '../d3d/Palettes.js'`

class Wheelc extends Radar

  constructor:( stream, ui, d3d, name ) ->
    super(      stream, ui, d3d, name )

    @quadrants = [
      { name1:"Red",        key:  '0', color:"hsl(  0,100%,50%)", beg:-15, end: 15 }
      { name1:"Orange",     key: '30', color:"hsl( 30,100%,50%)", beg: 15, end: 45 }
      { name1:"Yellow",     key: '60', color:"hsl( 60,100%,50%)", beg: 45, end: 75 }
      { name1:"Lime",       key: '90', color:"hsl( 90,100%,50%)", beg: 75, end:105 }
      { name1:"Green",      key:'120', color:"hsl(120,100%,50%)", beg:105, end:135 }
      { name1:"Teal",       key:'150', color:"hsl(150,100%,50%)", beg:135, end:165 }
      { name1:"Cyan",       key:'180', color:"hsl(180,100%,50%)", beg:165, end:195 }
      { name1:"Azure",      key:'210', color:"hsl(210,100%,50%)", beg:195, end:225 }
      { name1:"Blue",       key:'240', color:"hsl(240,100%,50%)", beg:225, end:255 }
      { name1:"Violet",     key:'270', color:"hsl(270,100%,50%)", beg:255, end:285 }
      { name1:"Magenta",    key:'300', color:"hsl(300,100%,50%)", beg:285, end:315 }
      { name1:"Pink",       key:'330', color:"hsl(330,100%,50%)", beg:315, end:345 } ]

    @palettes = [
      { palette:Palettes.reds,     name1:"Red",        key:  '0', beg:-15, end: 15 }
      { palette:Palettes.browns,   name1:"Brown",      key: '20', beg: 15, end: 25 }
      { palette:Palettes.tans,     name1:"Tan",        key: '30', beg: 25, end: 35 }
      { palette:Palettes.oranges,  name1:"Orange",     key: '40', beg: 35, end: 45 }
      { palette:Palettes.yellows,  name1:"Yellow",     key: '60', beg: 45, end: 75 }
      { palette:Palettes.limes,    name1:"Lime",       key: '90', beg: 75, end:105 }
      { palette:Palettes.greens,   name1:"Green",      key:'120', beg:105, end:135 }
      { palette:Palettes.teals,    name1:"Teal",       key:'150', beg:135, end:165 }
      { palette:Palettes.cyans,    name1:"Cyan",       key:'180', beg:165, end:195 }
      { palette:Palettes.azures,   name1:"Azure",      key:'210', beg:195, end:225 }
      { palette:Palettes.blues,    name1:"Blue",       key:'240', beg:225, end:255 }
      { palette:Palettes.violets,  name1:"Violet",     key:'270', beg:255, end:285 }
      { palette:Palettes.magentas, name1:"Magenta",    key:'300', beg:285, end:315 }
      { palette:Palettes.pinks,    name1:"Pink",       key:'330', beg:315, end:330 }
      { palette:Palettes.grays,    name1:"Gray",       key:'345', beg:330, end:345 }  ]

    @assoc = @assocQuad(@quadrants)

  ready:( cname ) ->
    Util.noop( cname )
    $svg = super.ready()
    dr = ( @r100 - @r40 ) / 30
    @quads( @hueQuads(10), @r80, @r100 )
    @hsvWedges(     5, dr, @r40, @r100 )
    @paletteWedges( 5, dr, @r40, @r100 )
    #@paletteLogs()
    $svg

  hueQuads:(inc) ->
    a = []
    for hue in [0...360] by inc
      a.push( { name1:@name1(hue), color:"hsla(#{hue},100%,50%,1.0)", beg:hue-inc/2, end:hue+inc/2 } )
    a

  hueWedges:( dh, dr, r1, r2 ) ->
    g = @g.selectAll("g").append("svg:g")
    for hue in [0...360] by dh
      for r in [r1...r2] by dr
        lite = 80 - (r-r1) / (r2-r1) * 50
        @wedge( "hsla(#{hue},100%,#{lite}%,1.0)", g, r, r+dr, hue-dh/2, hue+dh/2 )
    @grid(dh)
    return

  hsvWedges:( dh, dr, r1, r2 ) ->
    g = @g.selectAll("g").append("svg:g")
    for hue in [0...360] by dh
      for r in [r1...r2] by dr
        sat = 0.3 + (r-r1) / (r2-r1) * 0.7
        @wedge( Vis.rgbCss( Vis.hsvToRgb({h:hue,s:sat,v:1}) ), g, r, r+dr, hue-dh/2, hue+dh/2 )
    @grid( dh, dr, -dh/2, 360-dh/2 )
    return

  paletteWedges:( dh, dr, r1, r2 ) ->
    Util.noop(r2)
    g = @g.selectAll("g").append("svg:g")
    for palette in @palettes
      r = r1
      for c in palette.palette
        @wedge( c.hex, g, r, r+dr, palette.beg, palette.end )
        r += dr
    return

  paletteLogs:() ->
    for palette in @palettes
      for c in palette.palette
        hex = '"' + c.hex + '"'
        hsv = '"' + Vis.hsvRgb(Vis.hexRgb(c.hex)) + '"'
        hsl = '"' + Vis.hslRgb(Vis.hexRgb(c.hex)) + '"'
        console.log( '    ', { hex:hex, hsv:hsv, hsl:hsl, code:'"HTML"', name:'"'+c.name+'"' } )
    return

  name1:(hue) ->
    qa = @assoc[hue.toString()]
    if qa? then qa.name1 else null

  assocQuad:(quadrants) ->
    assoc = []
    for q in quadrants
      assoc[q.key] = q
    assoc

`export default Wheelc`