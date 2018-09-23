
`import Util     from '../util/Util.js'`
`import Stream   from '../util/Stream.js'`
`import UI       from '../ui/UI.js'`
`import Vis      from '../vis/Vis.js'`

class Hum

  @init = () ->

    Util.ready ->
      subjects = ["Ready","Select","Test"]
      infoSpec = { subscribe:true, publish:true, subjects:subjects }
      stream   = new Stream( subjects, infoSpec )
      hum      = new Hum( stream )
      hum.ready()
      return
    return

    constructor:( @stream ) ->

    ready:() ->

Hum.init()

`export default Hum`