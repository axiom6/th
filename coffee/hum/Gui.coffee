
class Gui

  constructor:( @act, @elem ) ->
    @gui = new dat.GUI( { autoPlace: false })
    @elem.appendChild( @gui.domElement )
    @gui.remember(@act)
    @planes()
    @rows()
    @cols()
    @misc()
    @colors()

  check:( folder, obj, prop, onChange ) ->
    controller = folder.add( obj, prop )
    controller.onChange( onChange )
    return

  slider:( folder, obj, prop, onChange, min, max, step ) ->
    controller = folder.add( obj, prop ).min(min).max(max).step(step)
    controller.onFinishChange( onChange ) if onChange?
    return

  select:( folder, obj, prop, onChange, items ) ->
    controller = folder.add( obj, prop, items  )
    controller.onChange( onChange ) if onChange?
    return

  input:( folder, obj, prop, onChange ) ->
    controller = folder.add( obj, prop )
    controller.onFinishChange( onChange ) if onChange?
    return
    
  color:( folder, obj, prop, onChange ) ->
    controller = folder.addColor( obj, prop )
    controller.onChange( onChange ) if onChange?
    return

  planes:() ->
    folder = @gui.addFolder('Planes')
    @check(  folder, @act, 'Info', @act.info )
    @check(  folder, @act, 'Know', @act.know )
    @check(  folder, @act, 'Wise', @act.wise )
    folder.open()
    return

  rows:() ->
    folder = @gui.addFolder('Rows')
    @check( folder, @act, 'Learn', @act.learn )
    @check( folder, @act, 'Do',    @act.do    )
    @check( folder, @act, 'Share', @act.share )
    folder.open()
    return

  cols:() ->
    folder = @gui.addFolder('Cols')
    @check( folder, @act, 'Embrace',   @act.embrace   )
    @check( folder, @act, 'Innovate',  @act.innovate  )
    @check( folder, @act, 'Encourage', @act.encourage )
    folder.open()
    return

  misc:() ->
    folder = @gui.addFolder('Misc')
    @slider( folder, @act, 'Slide',  @act.slide,  0, 100, 10 )
    @select( folder, @act, 'Select', @act.select, [ 'Life', 'Liberty', 'Happiness' ] )
    @input(  folder, @act, 'Num',    @act.num )
    @input(  folder, @act, 'Str',    @act.str )
    folder.open()
    return

  colors:() ->
    folder = @gui.addFolder('Colors')
    @color( folder, @act, 'Color0', @act.color0 )
    @color( folder, @act, 'Color1', @act.color1 )
    @color( folder, @act, 'Color2', @act.color2 )
    @color( folder, @act, 'Color3', @act.color3 )
    folder.open()
    return

`export default Gui`