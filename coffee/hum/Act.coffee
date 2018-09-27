
class Act

  constructor:( @scene ) ->
    @Info      = true
    @Know      = true
    @Wise      = true
    @Learn     = true
    @Do        = true
    @Share     = true
    @Embrace   = true
    @Innovate  = true
    @Encourage = true
    @Slide     = 50
    @Select    = "Liberty"
    @Num       = 39
    @Str       = "Master"
    @Color0    = "#ffae23"
    @Color1    = [ 0, 128, 255 ]
    @Color2    = [ 0, 128, 255, 0.3 ]
    @Color3    = { h: 350, s: 0.9, v: 0.3 }

  info:()      => @traverse( 'plane', 'Information', @Info      )
  know:()      => @traverse( 'plane', 'Knowledge',   @Know      )
  wise:()      => @traverse( 'plane', 'Wisdom',      @Wise      )
  learn:()     => @traverse( 'row',   'Learn',       @Learn     )
  do:()        => @traverse( 'row',   'Do',          @Do        )
  share:()     => @traverse( 'row',   'Share',       @Share     )
  embrace:()   => @traverse( 'col',   'Embrace',     @Embrace   )
  innovate:()  => @traverse( 'col',   'Innovate',    @Innovate  )
  encourage:() => @traverse( 'col',   'Encourage',   @Encourage )

  traverse:( prop, value, visible ) ->
    reveal = (child) =>
      if child[prop]? and child[prop] is value
         child.visible = visible
         #console.log( 'reveal',  { name:child.name, prop:prop, value:value, visible:child.visible } )
    @scene.traverse( reveal ) if @scene?
    return

  slide:() =>
    console.log( 'Act.slide', @Slide )
    return

  select:() =>
    console.log( 'Act.select', @Select )
    return

  num:() =>
    console.log( 'Act.num', @Num )
    return

  str:() =>
    console.log( 'Act.str', @Str )
    return

  color0:() =>
    console.log( 'Act.color0', @Color0 )
    return

  color1:() =>
    console.log( 'Act.color1', @Color1 )
    return

  color2:() =>
    console.log( 'Act.color2', @Color2 )
    return

  color3:() =>
    console.log( 'Act.color3', @Color3 )
    return

`export default Act`