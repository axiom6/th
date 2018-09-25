
class Gui

  constructor:( @act ) ->
    @gui = new dat.GUI()
    @planes()
    @rows()
    @cols()

  planes:() ->
    pfolder = @gui.addFolder('Planes')
    pfolder.add( @act, 'info' )
    pfolder.add( @act, 'know' )
    pfolder.add( @act, 'wise' )
    pfolder.open()

  rows:() ->
    rfolder = @gui.addFolder('Rows')
    rfolder.add( @act, 'learn'   )
    rfolder.add( @act, 'do'        )
    rfolder.add( @act, 'share' )
    rfolder.open()

  cols:() ->
    rfolder = @gui.addFolder('Cols')
    rfolder.add( @act, 'embrace'   )
    rfolder.add( @act, 'innovate'  )
    rfolder.add( @act, 'encourage' )
    rfolder.open()

`export default Gui`