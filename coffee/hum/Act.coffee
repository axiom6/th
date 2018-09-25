
class Act

  constructor:( @scene ) ->
    @infoVis      = true
    @knowVis      = true
    @wiseVis      = true
    @learnVis     = true
    @doVis        = true
    @shareVis     = true
    @embraceVis   = true
    @innovateVis  = true
    @encourageVis = true

  info:()      -> @infoVis      = @traverse( 'plane', 'Information', @infoVis      )
  know:()      -> @knowVis      = @traverse( 'plane', 'Knowledge',   @knowVis      )
  wise:()      -> @wiseVis      = @traverse( 'plane', 'Wisdom',      @wiseVis      )
  learn:()     -> @learnVis     = @traverse( 'row',   'Learn',       @learnVis     )
  do:()        -> @doVis        = @traverse( 'row',   'Do',          @doVis        )
  share:()     -> @shareVis     = @traverse( 'row',   'Share',       @shareVis     )
  embrace:()   -> @embraceVis   = @traverse( 'col',   'Embrace',     @embraceVis   )
  innovate:()  -> @innovateVis  = @traverse( 'col',   'Innovate',    @innovateVis  )
  encourage:() -> @encourageVis = @traverse(  'col',  'Encourage',   @encourageVis )

  traverse:( prop, value, visible ) ->
    visible = if visible then false else true
    reveal = (child) =>
      if child[prop]? and child[prop] is value
         child.visible = visible
         console.log( 'reveal',  { name:child.name, prop:prop, value:value, visible:child.visible } )
    @scene.traverse( reveal )
    visible

`export default Act`