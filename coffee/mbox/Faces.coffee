
class Faces

  constructor:( ) ->

  tettrakis:( x, y, z, s, tets ) ->
    q   = s * Math.sqrt(2)
    swf = [x-s,y-s,z+s]
    nwf = [x-s,y+s,z+s]
    nef = [x+s,y+s,z+s]
    sef = [x+s,y-s,z+s]
    swb = [x-s,y-s,z-s]
    nwb = [x-s,y+s,z-s]
    neb = [x+s,y+s,z-s]
    seb = [x+s,y-s,z-s]
    top = [x  ,y+q,z  ]
    bot = [x  ,y-q,z  ]
    lef = [x-q,y,  z  ]
    rgt = [x+q,y,  z  ]
    fnt = [x,  y,  z+q]
    bak = [x,  y,  z-q]

    tets.push( [ swf, fnt, nwf ] )
    tets.push( [ nwf, fnt, nef ] )
    tets.push( [ nef, fnt, sef ] )
    tets.push( [ sef, fnt, swf ] )

    tets.push( [ swb, bak, nwb ] )
    tets.push( [ nwb, bak, neb ] )
    tets.push( [ neb, bak, seb ] )
    tets.push( [ seb, bak, swb ] )

    tets.push( [ nwf, top, nwb ] )
    tets.push( [ nwb, top, neb ] )
    tets.push( [ neb, top, nef ] )
    tets.push( [ nef, top, nwf ] )

    tets.push( [ swf, bot, swb ] )
    tets.push( [ swb, bot, seb ] )
    tets.push( [ seb, bot, sef ] )
    tets.push( [ sef, bot, swf ] )

    tets.push( [ swf, lef, nwf ] )
    tets.push( [ nwf, lef, nwb ] )
    tets.push( [ nwb, lef, swb ] )
    tets.push( [ swb, lef, swf ] )

    tets.push( [ sef, rgt, nef ] )
    tets.push( [ nef, rgt, neb ] )
    tets.push( [ neb, rgt, seb ] )
    tets.push( [ seb, rgt, sef ] )
    return

`export default Faces`