
`import Util  from '../util/Util.js'`
`import Vis   from '../vis/Vis.js'`
`import Build from '../mbox/Build.js'`

class IKW

  constructor:( @mbox, @coord, @color, @width, @height, @depth ) ->
    @mathbox  = @mbox.mathbox
    @build    = new Build()
    @ni       = 0
    @nt       = 4

  canvasContext:() ->
    canvas   = document.querySelector('canvas')
    ctx      = canvas.getContext('2d')
    ctx      = canvas.getContext('webgl'   )     if not ctx?
    console.log( 'MBox.IKW.canvasContext() null' ) if not ctx?
    ctx

  canvasText:( icon, x, y ) ->
    uc       = Vis.unicode( icon )
    ctx      = @canvasContext()
    ctx.font = 'bold 24px FontAwesome'
    ctx.fillText( uc, x, y )
    return

  contextFont:( fontSpec='36px FontAwesome' ) ->
    ctx      = @canvasContext()
    ctx.font = fontSpec
    console.log( 'MBox.IKW.contextFont()', fontSpec )
    return

  logContextFont:( msg ) ->
    ctx      = @canvasContext()
    console.log( 'MBox.IKW().logContextFont', msg, ctx.font )
    return

  museCartesian:( range=[[0,120],[0,120],[0,120]], scale=[2,2,2], divide=[12,12] ) ->
    @mathbox.camera( { position:[3,3,3], proxy:true } )
    view  = @mathbox.cartesian( { range:range, scale:scale } )
    # @coord.axesXYZ( view,  8, 0xFFFFFF )
    # @coord.gridXYZ( view,  4, 0xFFFFFF, divide[1], 0.7, '10' )
    # @coord.tickXYZ( view, 64, 0xFFFFFF, divide[2], 2 )
    view

  inIAKW:( plane ) ->
    array = ['Information','Augment','Knowledge','Wisdom']
    Util.inArray( array, plane )

  inIAK:( plane ) ->
    array = ['Information','Augment','Knowledge']
    Util.inArray( array, plane )

  cubeFaces:( x, y, z, s, cubp ) ->
    cubp.push( [[x-s,y-s,z-s],[x-s,y+s,z-s],[x-s,y+s,z+s],[x-s,y-s,z+s]] )
    cubp.push( [[x+s,y-s,z-s],[x+s,y+s,z-s],[x+s,y+s,z+s],[x+s,y-s,z+s]] )
    cubp.push( [[x-s,y-s,z-s],[x+s,y-s,z-s],[x+s,y-s,z+s],[x-s,y-s,z+s]] )
    cubp.push( [[x-s,y+s,z-s],[x+s,y+s,z-s],[x+s,y+s,z+s],[x-s,y+s,z+s]] )
    cubp.push( [[x-s,y-s,z-s],[x+s,y-s,z-s],[x+s,y+s,z-s],[x-s,y+s,z-s]] )
    cubp.push( [[x-s,y-s,z+s],[x+s,y-s,z+s],[x+s,y+s,z+s],[x-s,y+s,z+s]] )
    return

  convey:( practice, dir, x, y, z, s, hsv, conv, conc, conb, cone, conp ) ->
    q = s/2
    [beg,end] = @build.connectName( practice, dir )
    conv.push( [[x-s,y-q,z],[x-s,y+q,z],[x+s,y+q,z],[x+s,y-q,z]] )
    conc.push( Vis.toRgbHsv( hsv[0], hsv[1], hsv[2], true ) )
    conb.push( beg )
    cone.push( end )
    conp.push( [x,y,z] )
    #console.log( 'Convey', { beg:beg, end:end, x:x, y:y, z:z } )
    return

  flow:( practice, dir, x, y, z, s, hsv, flow, floc, flob, floe, flop ) ->
    q = s/2
    [beg,end] = @build.connectName( practice, dir )
    flow.push( [[x-q,y-s,z],[x-q,y+s,z],[x+q,y+s,z],[x+q,y-s,z]] )
    floc.push( Vis.toRgbHsv( hsv[0], hsv[1], hsv[2], true ) )
    flob.push( beg )
    floe.push( end )
    flop.push( [x,y,z] )
    return

  conduit:( practice, dir, x, y, z, s, hsv, pipv, pipc, pipb, pipe, pipp ) ->
    q = s / 2
    [beg,end] = @build.connectName( practice, dir )
    console.log( 'Conduit', beg, end, [[x-q,y,z-q],[x+q,y,z-q],[x+q,y,z+q],[x-q,y,z+q]] )
    pipv.push( [[x-q,y,z-q],[x+q,y,z-q],[x+q,y,z+q],[x-q,y,z+q]] )
    pipc.push( Vis.toRgbHsv( hsv[0], hsv[1], hsv[2], true ) )
    pipb.push( beg )
    pipe.push( end )
    pipp.push( [x,y,z] )
    return

  fourTier:( x, y, z, s, study, hexp, hexc, hexq, hext, hexi ) ->
    cos30s = Vis.cos(30) * s
    cos30y = cos30s      * 2
    switch study.dir
      when 'north','northd' then hexp.push( @hex( x,       y+cos30s, z, s, hexq ) )
      when 'west', 'westd'  then hexp.push( @hex( x-1.5*s, y,        z, s, hexq ) )
      when 'east', 'eastd'  then hexp.push( @hex( x+1.5*s, y,        z, s, hexq ) )
      when 'south','southd' then hexp.push( @hex( x,       y-cos30s, z, s, hexq ) )
      when 'nw',   'nwd'    then hexp.push( @hex( x-1.5*s, y+cos30y, z, s, hexq ) )
      when 'ne',   'ned'    then hexp.push( @hex( x+1.5*s, y+cos30y, z, s, hexq ) )
      when 'sw',   'swd'    then hexp.push( @hex( x-1.5*s, y-cos30y, z, s, hexq ) )
      when 'se',   'sed'    then hexp.push( @hex( x+1.5*s, y-cos30y, z, s, hexq ) )
      else                       hexp.push( @hex( x,       y+cos30s, z, s, hexq ) )
    hexc.push( Vis.toRgba( study ) )
    hext.push( study.name )  # Vis.unicode( """'#{study.icon}'""" )
    hexi.push( Vis.unicode( study.icon ) )
    return

  studTier:( x, y, z, study, stup, stuc, stuq, stut, stui ) ->
    h  = 10
    s  = 6.667
    x0 = x - h
    y0 = y + s * 0.5
    switch study.dir
      when 'north' then stup.push( @stu( x0+s,   y0,     z, s, stuq ) )
      when 'west'  then stup.push( @stu( x0,     y0-s,   z, s, stuq ) )
      when 'east'  then stup.push( @stu( x0+s*2, y0-s,   z, s, stuq ) )
      when 'south' then stup.push( @stu( x0+s,   y0-s*2, z, s, stuq ) )
      else              stup.push( @stu( x0+s,   y0-s,   z, s, stuq ) )
    stuc.push( Vis.toRgba( study ) )
    stut.push( study.name )
    stui.push( Vis.unicode( study.icon ) )
    return

  stu:( x, y, z, s, stuq ) ->
    stuq.push( [x+s*0.5,y+s*0.5,z])
    pts = []
    pts.push( [x,  y,  z] )
    pts.push( [x+s,y,  z] )
    pts.push( [x+s,y+s,z] )
    pts.push( [x,  y+s,z] )
    pts

  hex:( x, y, z, s, hexq ) ->
    hexq.push( [x,y,z])
    pts = []
    for ang in [ 0, 60, 120, 180, 240, 300 ]
      pts.push( [ x+s*Vis.cos(ang), y+s*Vis.sin(ang), z ] )
    pts

  studySlots:( x, y, z, sprac, subs ) ->
    s = sprac/3
    for t     in [ s, s*3, s*5 ]
      for u   in [ s, s*3, s*5 ]
        @cubeFaces( x+t-sprac,y+u-sprac,z-s*2, s, subs )
    return

  # {style: {border: '4px dashed rgba(192, 32, 48, .5)', color: 'rgba(96, 16, 32, 1)', background: 'rgba(255, 255, 255, .75)'}},
  flotExpr:( emit, el ) => # i, j, k, l, time ) =>
    emit( el('div', {}, 'Practice' ) )

  toRgbHexxFaces:( len ) ->
    rgbh = []
    for   prac in [0...len]
      for rgba in [[180,50,90],[60,50,90],[90,50,90],[30,50,90]]
        rgbh.push( Vis.toRgbHsv( rgba[0], rgba[1], rgba[2], true ) )
    rgbh

  musePoints:() ->
    obj =  { id:'musePoints', width:@width, height:@height, depth:@depth, items:1, channels:4 }
    obj.expr = ( emit, x, y, z ) =>
       emit( @center(x), @center(y), @center(z), 1 ) # emit( x, y, z, 1 )
    obj

  center:( u ) ->
    v = u
    v =  20 if  0 <= u and u <   40
    v =  60 if 80 <= u and u <   80
    v = 100 if 80 <= u and u <= 120
    v

  museColors:() ->
    obj  =  { id:'museColors', width:@width, height:@height, depth:@depth, channels:4 } #
    obj.expr  = ( emit, x, y, z ) =>
      [r,g,b,a] = @practiceColor( x, y, z, i, j, k )
      emit( r, g, b, a )
    obj

  musePoint:() ->
    obj = { id:"musePoint", points: "#musePoints", colors: "#museColors", shape:"square", color: 0xffffff, size:600 }
    obj

  museText:() ->
    str = (n) -> Util.toStr(n)
    obj = { font:'Helvetica', style:'bold', width:16, height:5, depth:2 } # point:"#musePoint"
    obj.expr = ( emit, i, j, k, time ) =>
      Util.noop( time )
      if @ni < @nt
        @ni = @ni + 1
        #console.log( "Hi #{str(i)} #{str(j)} #{str(k)}" )
      emit( "Hi #{str(i)} #{str(j)} #{str(k)}" )
    obj

  museLabel:() ->
    { points: "#musePoints", color:'#000000', snap:false, outline:2, size:24 , depth:.5,zIndex:5 }

  museCube:( view ) ->
    view.volume( @musePoints() )
    view.volume( @museColors() )
    view.point(  @musePoint()  )
        .text(   @museText()   )
        .label(  @museLabel()  )

  practiceColor:( x, y, z ) ->

    if       0 <= x and x <   40 then hue = 210
    else if 40 <= x and x <   80 then hue =  60
    else if 80 <= x and x <= 120 then hue = 300

    if       0 <= y and y <   40 then c   = 40
    else if 40 <= y and y <   80 then c   = 60
    else if 80 <= y and y <= 120 then c   = 80

    if       0 <= z and z <   40 then v   = 40
    else if 40 <= z and z <   80 then v   = 60
    else if 80 <= z and z <= 120 then v   = 80

    Vis.toRgbHsv( hue, c, v, true )

  createArrays:() ->

    a = {  # Suffixes: p-Pplygons c-Colors t-Text i-Icons q-Points b-Beg Connect e-Eng Connect
      xyzs:[], cubp:[], cubc:[],                   # cub Practices Cube and xyzs locations
      prcp:[], prct:[], prci:[],                   # prc Practices
      hexp:[], hexc:[], hexq:[], hext:[], hexi:[], # hex Hexagon Studies
      stup:[], stuc:[], stuq:[], stut:[], stui:[], # stu Cross   Studies
      conv:[], conc:[], conb:[], cone:[], conp:[], # con Convey  Concections
      flow:[], floc:[], flob:[], floe:[], flop:[], # flo Flow    Concections
      pipv:[], pipc:[], pipb:[], pipe:[], pipp:[]  # pip Conduit Concections  or Pipelines
    }

    sprac = 10
    for plane   in [ {name:'Information',z:100}, {name:'Knowledge',z:60}, {name:'Wisdom',   z: 20} ] #
      for row   in [ {name:'Learn',      y:100}, {name:'Do',       y:60}, {name:'Share',    y: 20} ]
        for col in [ {name:'Embrace',    x: 20}, {name:'Innovate', x:60}, {name:'Encourage',x:100} ]
          x = col.x
          y = row.y
          z = plane.z
          a.xyzs.push( [ x,y,z,1] )
          @cubeFaces(  x, y, z, sprac, a.cubp ) #studySlots( x, y, z, sprac, hexs )
          practice = @build.getPractice( plane.name, row.name, col.name )
          studies  = @build.getStudies(  plane.name, practice.name )
          for key, study of studies
            #fourTier( x, y, z, 4,     study, a.hexp, a.hexc, a.hexq, a.hext, a.hexi )
            @studTier( x, y, z,        study, a.stup, a.stuc, a.stuq, a.stut, a.stui )
          [h,c,v]  = practice.hsv
          a.cubc.push( Vis.toRgbHsv( h, c, v, true ) ) for i in [0...6] # Colors for 6 faces
          a.prcp.push( [ x,y,z,1] ) # ( [ x,y-sprac+2,z,1] )
          a.prct.push( practice.name )
          a.prci.push( "#{Vis.unicode( practice.icon )}" )
        for con in [ {name:'west', x:40, hsv:{h:90,s:60,v:90}, colName:'Embrace' }, {name:'east', x:80, hsv:{h:0,s:60,v:90}, colName:'Innovate' } ]
          practice = @build.getPractice( plane.name, row.name, con.colName )
          @convey(  practice, 'east', con.x, row.y, plane.z, sprac, practice.hsv, a.conv, a.conc, a.conb, a.cone, a.conp )
      for flo in [  {name:'north', y:80, rowName:'Learn'}, {name:'south', y:40, rowName:'Do'} ]
        for col in [ {name:'Embrace', x:20, hsv:{h:210,s:60,v:90} }, {name:'Innovate', x:60, hsv:{h:60,s:60,v:90} }, {name:'Encourage',x:100, hsv:{h:255,s:60,v:90} } ]
          practice = @build.getPractice( plane.name, flo.rowName, col.name )
          @flow( practice, 'south', col.x, flo.y, plane.z, sprac, practice.hsv, a.flow, a.floc, a.flob, a.floe, a.flop )
    for pla     in [ {name:'Information', z: 80}, {name:'Knowledge',  z:40} ] #
      for row   in [ {name:'Learn',       y:100}, {name:'Do',         y:60}, {name:'Share',     y: 20} ]
        for col in [ {name:'Embrace',     x: 20}, {name:'Innovate',   x:60}, {name:'Encourage', x:100} ]
          practice = @build.getPractice( pla.name, row.name, col.name )
          @conduit( practice, 'next', col.x, row.y, pla.z, 20, practice.hsv, a.pipv, a.pipc, a.pipb, a.pipe, a.pipp )
    a # All the arrays

  viewArrays:( view ) =>
    a = @createArrays()
    a.cont = []
    len  = a.conb.length
    for i in [0...len]
      a.cont.push( a.conb[i]+' '+a.cone[i] )
    view.array( { data:a.xyzs, id:"xyzs", items:1, channels:4, live:false, width:a.xyzs.length } )
    view.array( { data:a.cubp, id:"cubp", items:4, channels:3, live:false, width:a.cubp.length } ) # 4 sides = 4 items
    view.array( { data:a.cubc, id:"cubc", items:1, channels:4, live:false, width:a.cubc.length } )

    #iew.array( { data:a.hexp, id:"hexp", items:6, channels:3, live:false, width:a.hexp.length } ) # 6 sides = 6 items
    #iew.array( { data:a.hexc, id:"hexc", items:1, channels:4, live:false, width:a.hexc.length } )
    #iew.array( { data:a.hexq, id:"hexq", items:1, channels:3, live:false, width:a.hexq.length } )

    view.array( { data:a.stup, id:"stup", items:4, channels:3, live:false, width:a.stup.length } ) # 4 sides = 4 items
    view.array( { data:a.stuc, id:"stuc", items:1, channels:4, live:false, width:a.stuc.length } )
    view.array( { data:a.stuq, id:"stuq", items:1, channels:3, live:false, width:a.stuq.length } )

    view.array( { data:a.prcp, id:"prcp", items:1, channels:4, live:false, width:a.prcp.length } )
    view.array( { data:a.conv, id:"conv", items:4, channels:3, live:false, width:a.conv.length } )
    view.array( { data:a.conc, id:"conc", items:1, channels:4, live:false, width:a.conc.length } )
    view.array( { data:a.conp, id:"conp", items:1, channels:3, live:false, width:a.conp.length } )
    view.array( { data:a.flow, id:"flow", items:4, channels:3, live:false, width:a.flow.length } )
    view.array( { data:a.floc, id:"floc", items:1, channels:4, live:false, width:a.floc.length } )
    view.array( { data:a.flop, id:"flop", items:1, channels:3, live:false, width:a.flop.length } )
    view.array( { data:a.pipv, id:"pipv", items:4, channels:3, live:false, width:a.pipv.length } )
    view.array( { data:a.pipc, id:"pipc", items:1, channels:4, live:false, width:a.pipc.length } )
    view.array( { data:a.pipp, id:"pipp", items:1, channels:3, live:false, width:a.pipp.length } )
    view.face(  { points:"#cubp", colors:"#cubc", color:0xffffff, shaded:true, fill:true, line:true, closed:true, zIndex:1, opacity:0.3 } )
    #iew.face(  { points:"#hexp", colors:"#hexc", color:0xffffff, shaded:true, fill:true, line:true, closed:true, zIndex:2, opacity:1.0 } )
    view.face(  { points:"#stup", colors:"#stuc", color:0xffffff, shaded:true, fill:true, line:true, closed:true, zIndex:2, opacity:1.0 } )
    view.face(  { points:"#conv", colors:"#conc", color:0xffffff, shaded:true, fill:true, line:true, closed:true, zIndex:3, opacity:0.5 } )
    view.face(  { points:"#flow", colors:"#floc", color:0xffffff, shaded:true, fill:true, line:true, closed:true, zIndex:3, opacity:0.5 } )
    view.face(  { points:"#pipv", colors:"#pipc", color:0xffffff, shaded:true, fill:true, line:true, closed:true, zIndex:3, opacity:0.5 } )

    view.text(  { data:a.prct, font:'Font Awesome', width:a.prct.length, height:1, depth:1 } ) # , style:'bold'
    view.label( { points:"#prcp", color:'#ffffff', snap:false, size:24, offset:[0,-120], depth:0.5, zIndex:3, outline:0 } )
    view.text(  { data:a.prci, font:'FontAwesome', width:a.prci.length, height:1, depth:1 } ) # , style:'bold'
    view.label( { points:"#prcp", color:'#ffffff', snap:false, size:36, offset:[0,0], depth:0.5, zIndex:3, outline:0 } )

    #iew.text(  { data:a.hext, font:'Font Awesome', width:a.hext.length, height:1, depth:1 } )
    #iew.label( { points:"#hexq", color:'#000000', snap:false, size:16, offset:[0,-15], depth:0.5, zIndex:3, outline:0 } )
    #iew.text(  { data:a.hexi, font:'FontAwesome', width:a.hexi.length, height:1, depth:1 } )
    #iew.label( { points:"#hexq", color:'#000000', snap:false, size:36, offset:[0, 15], depth:0.5, zIndex:3, outline:0 } )

    view.text(  { data:a.stut, font:'Font Awesome', width:a.stut.length, height:1, depth:1 } )
    view.label( { points:"#stuq", color:'#000000', snap:false, size:16, offset:[0,-20], depth:0.5, zIndex:3, outline:0 } )
    view.text(  { data:a.stui, font:'FontAwesome', width:a.stui.length, height:1, depth:1 } )
    view.label( { points:"#stuq", color:'#000000', snap:false, size:36, offset:[0, 10], depth:0.5, zIndex:3, outline:0 } )

    view.text(  { data:a.cont, font:'FontAwesome', width:a.cont.length, height:1, depth:1 } )
    view.label( { points:"#conp", color:'#000000', snap:false, size:16, offset:[0, 15], depth:0.5, zIndex:4, outline:0 } )
    view.text(  { data:a.flob, font:'FontAwesome', width:a.flob.length, height:1, depth:1 } )
    view.label( { points:"#flop", color:'#000000', snap:false, size:16, offset:[0, 15], depth:0.5, zIndex:4, outline:0 } )
    view.text(  { data:a.floe, font:'FontAwesome', width:a.floe.length, height:1, depth:1 } )
    view.label( { points:"#flop", color:'#000000', snap:false, size:16, offset:[0,-15], depth:0.5, zIndex:4, outline:0 } )
    view.text(  { data:a.pipb, font:'FontAwesome', width:a.pipb.length, height:1, depth:1 } )
    view.label( { points:"#pipp", color:'#000000', snap:false, size:16, offset:[0,-15], depth:0.5, zIndex:4, outline:0 } )
    view.text(  { data:a.pipe, font:'FontAwesome', width:a.pipe.length, height:1, depth:1 } )
    view.label( { points:"#pipp", color:'#000000', snap:false, size:16, offset:[0, 15], depth:0.5, zIndex:4, outline:0 } )

    return

`export default IKW`

