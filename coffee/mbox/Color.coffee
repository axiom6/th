
`import Util     from '../util/Util.js'`
`import Vis      from '../vis/Vis.js'`
`import MBox     from '../mbox/MBox.js'`

class Color

  constructor:( @mbox ) ->
    @spaces   = ['hci','rgb','hsi','hsl','hsv','lab','lch','hcl','cmyk','gl']

  addARgb:(  a, r, g, b    ) -> [ r+a, g+a, b+a ]
  mulSRgb:(  s, r, g, b    ) -> [ r*s, g*s, b*s ]
  addARygb:( a, r, y, g, b ) -> [ r+a, y+a, g+a, b+a ]
  mulSRygb:( s, r, y, g, b ) -> [ r*s, y*s, g*s, b*s ]

  addRygbs:( rygb1, rygb2 ) ->
    rygb3 = [0,0,0,0]
    for i in [0...4]
      rygb3[i] = rygb1[i] + rygb2[i]
    rygb3

  toRygbFromHue:( hue ) =>
    cos = Math.abs(Vis.cos(hue))
    sin = Math.abs(Vis.sin(hue))
    [r,y,g,b] = [cos,sin,cos,sin]
    rygb      = [  0,  0,  0,  0]
    if        0 <= hue and hue <  90 then rygb = [ r, y, 0, 0 ]
    else if  90 <= hue and hue < 180 then rygb = [ 0, y, g, 0 ]
    else if 180 <= hue and hue < 270 then rygb = [ 0, 0, g, b ]
    else if 270 <= hue and hue < 360 then rygb = [ r, 0, 0, b ]
    rygb

  toRgbFromHue:( hue ) =>
    cos = (h) -> Math.abs(Vis.cos(h*90/120))
    [R,G,B] = [cos(hue),cos(hue-120),cos(hue-240),1]
    rgb = [0,0,0]
    if        0 <= hue and hue < 120 then rgb = [R,G,0]
    else if 120 <= hue and hue < 240 then rgb = [0,G,B]
    else if 240 <= hue and hue < 360 then rgb = [R,0,B]
    rgb

  genWithVecs:( coord, view ) =>
    [hcss,rgbs] = @genVecs()
    coord.cylLookup( view, hcss, rgbs )

  genWithVecsRgb:( coord, view, see ) =>
    [hcss,rgbs] = @genVecsRgb( see)
    coord.cylLookup( view, hcss, rgbs )

  genPolarRgbs:( coord, view, scale ) =>
    [hcss,rgbs] = @genPolarRgb( scale )
    console.log( 'genPolarRgbs', hcss.length, rgbs.length )
    coord.cylLookup( view, hcss, rgbs )
    #genPolarSurf(   view, hcss, rgbs )

  genPolarSurf:( view, hcss, rgbs ) =>
    for s in [90] #[0,10,20,30,40,50,60,70,80,90]
      #view.play( { delay:1, speed:1000 } )
      points = []
      colors = []
      for i in [0...hcss.length]
        sh = hcss[i][2]
        if s <= sh and sh < s + 10
          points.push( hcss[i] )
          colors.push( rgbs[i] )
      pts = view.area( { data:points, width:points.length, height:1, axes:[1,2], channels:3 } )
      rgs = view.area( { data:colors, width:colors.length, height:1, axes:[1,2], channels:3 } )
      view.surface( { points:pts, colors:rgs, color: 0xffffff, shaded:false, opacity:1.0, lineX:true, lineY:true, width:5 } )

  toHue:( C1,N ) -> # ,C2
    n   = 100-N
    hue = n
    if      C1 is 'Y' then hue = n
    else if C1 is 'G' then hue = n + 100
    else if C1 is 'B' then hue = n + 200
    else if C1 is 'R' then hue = n + 300
    else if C1 is ' ' then hue = 0
    hue = hue * 0.9
    hue = 0 if hue is 360
    hue

  scsPts:( colors ) ->
    pts = []
    for key, color of colors
      pts.push( [ Vis.toRadian(color.hue-2), color.c, 100-color.s, 1 ] )
      pts.push( [ Vis.toRadian(color.hue+2), color.c, 100-color.s, 1 ] )
    pts

  scsRgbs:( colors ) ->
    rgbs = []
    s    = 1/255
    for key, color of colors
      rgbs.push( [ color.r*s, color.g*s, color.b*s, 1 ] )
      rgbs.push( [ color.R*s, color.G*s, color.B*s, 1 ] )
    rgbs

  genVecsCompare:() ->
    hcss = []
    rgbs = []
    for hue   in [0...360] by 15
      for c   in [0,10,20,30,40,50,60,70,80,90,100]
        for s in [0,10,20,30,40,50,60,70,80,90,100]
          hcss.push( [ Vis.toRadian(hue-3), c, s, 1 ] )
          hcss.push( [ Vis.toRadian(hue  ), c, s, 1 ] )
          hcss.push( [ Vis.toRadian(hue+3), c, s, 1 ] )
          rgbs.push( Vis.toRgbHcs(  hue,  c, s, true ) )
          rgbs.push( Vis.toRgbHcs2( hue,  c, s, true ) )
          rgbs.push( Vis.toRgbHsv(  hue,  c, s, true ) )
    [hcss,rgbs]

  genVecs:() ->
    hcss = []
    rgbs = []
    for hue   in [0...360] by 15
      for c   in [0,10,20,30,40,50,60,70,80,90,100]
        for s in [0,10,20,30,40,50,60,70,80,90,100]
          hcss.push( [ Vis.toRadian(hue  ), c, s, 1 ] )
          rgbs.push( Vis.toRgbHsv(  hue,  c, s, true ) )
    [hcss,rgbs]

  genVecsRgb:( see ) ->
    hcss = []
    rgbs = []
    sf   = 1 / 255
    if see is 'two' or see is 'rgb'
      for r     in [0..255] by 15
        for g   in [0..255] by 15
          for b in [0..255] by 15
            [h, c, s ] = Vis.toHcsRgb( r, g, b )
            if h%15 <= 2 or h%15 >= 13
              ss         = Vis.sScale( h, c, s )
              hcss.push( [ Vis.toRadian(h-2,false), c, ss, 1 ] )
              rgbs.push( [ r*sf, g*sf, b*sf, 1 ] )
    if see is 'two' or see is 'hsv'
      for hue   in [0...360] by 15
        for c   in [0,16,32,48,64,80,100]
          for s in [0,16,32,48,64,80,100]
            hcss.push( [ Vis.toRadian(hue+2), c, s, 1 ] )
            rgbs.push( Vis.toRgbHsvSigmoidal( hue,  c, s, false ) )
    [hcss,rgbs]

  # console.log( 'gpr', { r:r, g:g, b:b, hue:hue, c:Math.round(c), s:Math.round(s) } ) if c is 0
  # hRygb = h # @hueRygb( hue )
  genPolarRgb:( scale=false ) ->
    hcss = []
    rgbs = []
    sf   = 1 / 255
    for r     in [0..255] by 15
      for g   in [0..255] by 15
        for b in [0..255] by 15
          [h, c, s ] = Vis.toHcsRgb( r, g, b )
          ss         = if scale then Vis.sScale( h, c, s ) else s
          hcss.push( [ Vis.toRadian(h,false), c, ss, 1 ] )
          rgbs.push( [ r*sf, g*sf, b*sf, 1 ] )
    [hcss,rgbs]

  # Hue in RYGB
  vecs:( hue ) ->
    v1 = [1,1,1]
    v2 = [1,1,1]
    c  = Math.abs(Vis.cos(hue))
    s  = Math.abs(Vis.sin(hue))
    y  = Math.max(c,s)
    if        0 <= hue and hue <  90 then v2 = [y,s,0]
    else if  90 <= hue and hue < 180 then v2 = [c,y,0]
    else if 180 <= hue and hue < 270 then v2 = [0,c,s]
    else if 270 <= hue and hue < 360 then v2 = [c,0,s]
    [v1,v2]

  csvec:( c, s, v1, v2 ) ->
    c1 = 0.0001 * s * (100 - c)
    c2 = 0.0001 * s * c
    v3 = [0,0,0,1]
    for i in [0...3]
      v3[i] = v1[i]*c1 + v2[i]*c2
    v3

  rgbPc:( r, g, b, R, G, B ) ->
    pc  = (f) -> Util.toInt(f * 100)
    rd = if r isnt 0 then r else -R
    gd = if g isnt 0 then g else -G
    bd = if b isnt 0 then b else -B
    [pc(R/rd),pc(G/gd),pc(B/bd)]

`export default Color`