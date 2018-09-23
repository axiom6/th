
`import Vis from '../vis/Vis.js'`

class Palettes

  @setRgbs:() ->

    for group in Palettes.groupRgbs
      for color in group
        color.rgb = Vis.cssRgb(color.hex)
    return

  @findColor:( name ) ->
    for group in Palettes.groups
      for color in group
        return color if color.name is name
    console.error( 'Palettes.findColor() not found for name', name )
    Palettes.gray

  @hexdec:( name ) ->
    hex = Palettes.findColor(name).hex
    hex = '0x' + hex.substring(1)
    parseInt(hex,16)

  @codes15:['PW','LW','PD','LF','LD','MW','DW','MD','MF','LH','','DH','DF','DD','OW']
  @codes18:['PD','LH','LD','DH','DD','rr','Lr','Dr','Mor','Dor','oor','OD','ooy','Moy','Doy','Dyo','Lyo','yyo']

  @hex:( code ) ->
    console.log( 'Palettes.hex()', code ) if not code?
    console.trace()                       if not code?
    for group in Palettes.groups
      for color in group
        return color.hex if color.code is code
    console.error( 'Palettes.hex not found for code', code )
    Palettes.gray.hex

  @hexGroup:( group, code ) ->
    for color in group
      return color.hex if color.code is code
    console.error( 'Pallettes.color not found for code', code )
    Palettes.gray.hex

  @hexes:( group, c ) ->
    hexs = []
    for code in Palettes.codes15
      hexs.push( Palettes.hexGroup(group,code+c) )
    hexs

  @hsvOut:() ->
    array = []
    for group in Palettes.groups
      for color in group
        hsv = Vis.toHsvHex( color.hex )
        hsv[i] = Math.round(hsv[i]) for i in [0...3]
        str = """[#{hsv[0]},#{hsv[1]},#{hsv[2]}],"#{color.code}","#{color.hex}"\n """
        array.push(str)
    console.log(array)
    return

  @rainbowMH: [
    { hex:"#ee4035" }
    { hex:"#f37736" }
    { hex:"#fdf498" }
    { hex:"#7bc043" }
    { hex:"#0392cf" } ]

  # ............................. Reds ......................................

  @redsMH: [
    { hex:"#ffb2b2" }
    { hex:"#ff6666" }
    { hex:"#ff0000" }
    { hex:"#cc0000" }
    { hex:"#990000" } ]

  @reds: [
    #{ hex:"#DC143C", hsv:"hsv(348, 91%, 86%)", hsl:"hsl(348, 83%,47%)", code:"HTML", name:"crimson" }
    #{ hex:"#DB7093", hsv:"hsv(340, 49%, 86%)", hsl:"hsl(340,  6%,65%)", code:"HTML", name:"palevioletred" }
    #{ hex:"#FFF0F5", hsv:"hsv(340, 60%,100%)", hsl:"hsl(340, 10%,97%)", code:"HTML", name:"lavenderblush" }
    #{ hex:"#DA70D6", hsv:"hsv(302, 49%, 85%)", hsl:"hsl(302, 59%,65%)", code:"HTML", name:"orchid" }
    #{ hex:"#D8BFD8", hsv:"hsv(300, 12%, 85%)", hsl:"hsl(300, 24%, 8%)", code:"HTML", name:"thistle" }
    #{ hex:"#DDA0DD", hsv:"hsv(300, 28%, 87%)", hsl:"hsl(300, 47%,75%)", code:"HTML", name:"plum" }
    #{ hex:"#800000", hsv:"hsv(  0,100%, 50%)", hsl:"hsl(  0,100%,25%)", code:"HTML", name:"maroon" }
    #{ hex:"#8B0000", hsv:"hsv(  0,100%, 55%)", hsl:"hsl(  0,100%,27%)", code:"HTML", name:"darkred" }
    #{ hex:"#FF0000", hsv:"hsv(  0,100%,100%)", hsl:"hsl(  0,100%,50%)", code:"HTML", name:"red" }
    { hex:"#FFCCCC", hsv:"hsv(  0, 22%,100%)", hsl:"hsl(  0,100%, 9%)", code:"PWR", name:"Pale Weak Red" }
    { hex:"#CC9999", hsv:"hsv(  0, 25%, 80%)", hsl:"hsl(  0, 33%, 7%)", code:"LWR", name:"Light Week Red" }
    { hex:"#996666", hsv:"hsv(  0, 33%, 60%)", hsl:"hsl(  0, 20%,50%)", code:"MWR", name:"Medium Weak Red" }
    { hex:"#996666", hsv:"hsv(  0, 33%, 60%)", hsl:"hsl(  0, 20%,50%)", code:"MWR", name:"Medium Weak Red" }
    { hex:"#FF9999", hsv:"hsv(  0, 40%,100%)", hsl:"hsl(  0,100%,80%)", code:"PDR", name:"Pale Dull Red" }
    { hex:"#FF6666", hsv:"hsv(  0, 60%,100%)", hsl:"hsl(  0,100%,70%)", code:"LFR", name:"Light Faded Red" }
    { hex:"#CC6666", hsv:"hsv(  0, 50%, 80%)", hsl:"hsl(  0, 50%,60%)", code:"LDR", name:"Light Dull Red" }
    { hex:"#FF3333", hsv:"hsv(  0, 80%,100%)", hsl:"hsl(  0,100%,60%)", code:"LHR", name:"Light Hard Red" }
    { hex:"#CC3333", hsv:"hsv(  0, 75%, 80%)", hsl:"hsl(  0, 60%,50%)", code:"MFR", name:"Medium Faded Red" }
    { hex:"#993333", hsv:"hsv(  0, 67%, 60%)", hsl:"hsl(  0, 50%,40%)", code:"DDR", name:"Dark Dull Red" }
    #{ hex:"#663333", hsv:"hsv(  0, 50%, 40%)", hsl:"hsl(  0, 33%,30%)", code:"DWR", name:"Dark Weak Red" }
    { hex:"#FF0000", hsv:"hsv(  0,100%,100%)", hsl:"hsl(  0,100%,50%)", code:"R",   name:"Red" }
    { hex:"#CC0000", hsv:"hsv(  0,100%, 80%)", hsl:"hsl(  0,100%,40%)", code:"DHR", name:"Dark Hard Red" }
    { hex:"#990000", hsv:"hsv(  0,100%, 60%)", hsl:"hsl(  0,100%,30%)", code:"DFR", name:"Dark Faded Red" }
    { hex:"#660000", hsv:"hsv(  0,100%, 40%)", hsl:"hsl(  0,100%,20%)", code:"ODR", name:"Obscure Dull Red" }
    { hex:"#330000", hsv:"hsv(  0,100%, 20%)", hsl:"hsl(  0,100%,10%)", code:"OWR", name:"Obscure Weak Red" } ]

  # ............................. Brown ...................................

  @brownsMH: [
    { hex:"#f1e8dc" }
    { hex:"#e4d2ba" }
    { hex:"#d2b48c" }
    { hex:"#a89070" }
    { hex:"#7e6c54" } ]

  @browns: [
    { hex:"#8B4513", hsv:"hsv(25,86%,55%)", hsl:"hsl(25, 76%,31%)", code:"HTML", name:"saddlebrown" }
    { hex:"#E9967A", hsv:"hsv(15,48%,91%)", hsl:"hsl(15, 72%,70%)", code:"HTML", name:"darksalmon" }
    { hex:"#FF6347", hsv:"hsv( 9,72,100%)", hsl:"hsl( 9,100%,64%)", code:"HTML", name:"tomato" }
    { hex:"#FA8072", hsv:"hsv( 6,54%,98%)", hsl:"hsl( 6, 93%,71%)", code:"HTML", name:"salmon" }
    { hex:"#FFE4E1", hsv:"hsv( 6,12,100%)", hsl:"hsl( 6,100%,94%)", code:"HTML", name:"mistyrose" }
    { hex:"#FFFAFA", hsv:"hsv( 0,02,100%)", hsl:"hsl( 0,100%,99%)", code:"HTML", name:"snow" }
    { hex:"#D2691E", hsv:"hsv(25,86%,82%)", hsl:"hsl(25, 75%,47%)", code:"HTML", name:"chocolate" }
    { hex:"#BC8F8F", hsv:"hsv( 0,24%,74%)", hsl:"hsl( 0, 25%,65%)", code:"HTML", name:"rosybrown" }
    { hex:"#F4A460", hsv:"hsv(28,61%,96%)", hsl:"hsl(28, 87%,67%)", code:"HTML", name:"sandybrown" }
    { hex:"#F08080", hsv:"hsv( 0,47%,94%)", hsl:"hsl( 0, 79%,72%)", code:"HTML", name:"lightcoral" }
    { hex:"#CD5C5C", hsv:"hsv( 0,55%,80%)", hsl:"hsl( 0, 53%,58%)", code:"HTML", name:"indianred" }
    { hex:"#A52A2A", hsv:"hsv( 0,75%,65%)", hsl:"hsl( 0, 59%,41%)", code:"HTML", name:"brown" }
    { hex:"#B22222", hsv:"hsv( 0,81%,70%)", hsl:"hsl( 0, 68%,42%)", code:"HTML", name:"firebrick" } ]

  # ................................. Tans .................................

  @skinMH: [
    { hex:"#ffe0bd" }
    { hex:"#ffcd94" }
    { hex:"#eac086" }
    { hex:"#ffad60" }
    { hex:"#ffe39f" } ]

  @tansMH: [
    { hex:"#ffc14c" }
    { hex:"#ec953c" }
    { hex:"#f0800d" }
    { hex:"#ee5a09" }
    { hex:"#d03501" } ]

  @tans: [
    { hex:"#F5DEB3", hsv:"hsv(39, 27%, 96%)", hsl:"hsl(39, 77%,83%)", code:"HTML", name:"wheat" }
    { hex:"#FFE4B5", hsv:"hsv(38, 29%,100%)", hsl:"hsl(38,100%,85%)", code:"HTML", name:"moccasin" }
    { hex:"#FFEFD5", hsv:"hsv(37, 16%,100%)", hsl:"hsl(37,100%,92%)", code:"HTML", name:"papayawhip" }
    { hex:"#FFEBCD", hsv:"hsv(36, 20%,100%)", hsl:"hsl(36,100%,90%)", code:"HTML", name:"blanchedalmond" }
    { hex:"#FFDEAD", hsv:"hsv(36, 32%,100%)", hsl:"hsl(36,100%,84%)", code:"HTML", name:"navajowhite" }
    { hex:"#FAEBD7", hsv:"hsv(34, 14%, 98%)", hsl:"hsl(34, 78%,91%)", code:"HTML", name:"antiquewhite" }
    { hex:"#FFE4C4", hsv:"hsv(33, 23%,100%)", hsl:"hsl(33,100%,88%)", code:"HTML", name:"bisque" }
    { hex:"#FFDAB9", hsv:"hsv(28, 27%,100%)", hsl:"hsl(28,100%,86%)", code:"HTML", name:"peachpuff" }
    { hex:"#F5F5DC", hsv:"hsv(60,100%, 96%)", hsl:"hsl(60, 56%,91%)", code:"HTML", name:"beige" }
    { hex:"#F0E68C", hsv:"hsv(54, 42%, 94%)", hsl:"hsl(54, 77%,75%)", code:"HTML", name:"khaki" }
    { hex:"#FFD700", hsv:"hsv(51,100%,100%)", hsl:"hsl(51,100%,50%)", code:"HTML", name:"gold" }
    { hex:"#D2B48C", hsv:"hsv(34, 33%, 82%)", hsl:"hsl(34, 44%,69%)", code:"HTML", name:"tan" } ]

  # ................................. Oranges ..............................

  @orangesMH: [
    { hex:"#ffe4b2" }
    { hex:"#ffc966" }
    { hex:"#ffa500" }
    { hex:"#cc8400" }
    { hex:"#996300" } ]

  @oranges: [
    #{ hex:"#FFFAF0", hsv:"hsv(40, 60%,100%)", hsl:"hsl(40,100%,97%)", code:"HTML", name:"floralwhite" }
    #{ hex:"#A0522D", hsv:"hsv(19, 72%, 63%)", hsl:"hsl(19, 56%,40%)", code:"HTML", name:"sienna" }
    #{ hex:"#FDF5E6", hsv:"hsv(39, 09%, 99%)", hsl:"hsl(39, 85%,95%)", code:"HTML", name:"oldlace" }
    #{ hex:"#FFA500", hsv:"hsv(39,100%,100%)", hsl:"hsl(39,100%,50%)", code:"HTML", name:"orange" }
    #{ hex:"#DEB887", hsv:"hsv(34, 39%, 87%)", hsl:"hsl(34, 57%,70%)", code:"HTML", name:"burlywood" }
    #{ hex:"#FF8C00", hsv:"hsv(33,100%,100%)", hsl:"hsl(33,100%,50%)", code:"HTML", name:"darkorange" }
    #{ hex:"#FAF0E6", hsv:"hsv(30, 08%, 98%)", hsl:"hsl(30, 67%,94%)", code:"HTML", name:"linen" }
    #{ hex:"#CD853F", hsv:"hsv(30, 69%, 80%)", hsl:"hsl(30, 59%,53%)", code:"HTML", name:"peru" }
    #{ hex:"#FF4500", hsv:"hsv(16,100%,100%)", hsl:"hsl(16,100%,50%)", code:"HTML", name:"orangered" }
    #{ hex:"#FF7F50", hsv:"hsv(16, 69%,100%)", hsl:"hsl(16,100%,66%)", code:"HTML", name:"coral" }
    { hex:"#FFCC99", hsv:"hsv(30, 40%,100%)", hsl:"hsl(30,100%,80%)", code:"PDO",  name:"Pale Dull Orange" }
    { hex:"#FFCC66", hsv:"hsv(40, 60%,100%)", hsl:"hsl(40,100%,70%)", code:"LOY",  name:"Light Orange-Yellow" }
    { hex:"#FFCC33", hsv:"hsv(45, 80%,100%)", hsl:"hsl(45,100%,60%)", code:"LYO",  name:"Light Yellow-Orange" }
    { hex:"#FFCC00", hsv:"hsv(48,100%,100%)", hsl:"hsl(48,100%,50%)", code:"YYO",  name:"Yellow-Yellow-Orange" }
    { hex:"#FF9966", hsv:"hsv(20, 60%,100%)", hsl:"hsl(20,100%,70%)", code:"LOR",  name:"Light Orange-Red" }
    { hex:"#FF9933", hsv:"hsv(30, 80%,100%)", hsl:"hsl(30,100%,60%)", code:"LHO",  name:"Light Hard Orange" }
    { hex:"#FF9900", hsv:"hsv(36,100%,100%)", hsl:"hsl(36,100%,50%)", code:"OOY",  name:"Orange-Orange-Yellow" }
    { hex:"#FF6633", hsv:"hsv(15, 80%,100%)", hsl:"hsl(15,100%,60%)", code:"LRO",  name:"Light Red-Orange" }
    #{ hex:"#CC6600", hsv:"hsv(30,100%, 80%)", hsl:"hsl(30,100%,40%)", code:"DHO",  name:"Dark Hard Orange" }
    { hex:"#CC6633", hsv:"hsv(20, 75%, 80%)", hsl:"hsl(20, 60%,50%)", code:"MOR",  name:"Medium Orange-Red" }
    { hex:"#CC9900", hsv:"hsv(45,100%, 80%)", hsl:"hsl(45,100%,40%)", code:"DYO",  name:"Dark Yellow-Orange" }
    #{ hex:"#996633", hsv:"hsv(30, 67%, 60%)", hsl:"hsl(30, 50%,40%)", code:"DDO",  name:"Dark Dull Orange" }
    #{ hex:"#996600", hsv:"hsv(40,100%, 60%)", hsl:"hsl(40,100%,30%)", code:"DOY",  name:"Dark Orange-Yellow" }
    { hex:"#FF6600", hsv:"hsv(24,100%,100%)", hsl:"hsl(24,100%,50%)", code:"OOR",  name:"Orange-Orange-Red" }
    { hex:"#FF3300", hsv:"hsv(12,100%,100%)", hsl:"hsl(12,100%,50%)", code:"RRO",  name:"Red-Red-Orange" }
    { hex:"#CC3300", hsv:"hsv(15,100%, 80%)", hsl:"hsl(15,100%,40%)", code:"DRO",  name:"Dark Red-Orange" }
    { hex:"#993300", hsv:"hsv(20,100%, 60%)", hsl:"hsl(20,100%,30%)", code:"DOR",  name:"Dark Orange-Red" }
    { hex:"#663300", hsv:"hsv(30,100%, 40%)", hsl:"hsl(30,100%,20%)", code:"ODO",  name:"Obscure Dull Orange" } ]

  # ................................ Yellows .....................................

  @yellowsMH: [
    { hex:"#ffffcc" }
    { hex:"#ffff66" }
    { hex:"#ffff00" }
    { hex:"#FFD700" }    #cccc00
    { hex:"#DAA520" } ]  # 999900

  @yellows: [
    { hex:"#FFFFF0", hsv:"hsv(60%,06,100%)",  hsl:"hsl(60,100%,97%)", code:"HTML", name:"ivory" }
    { hex:"#FFFFE0", hsv:"hsv(60%,12,100%)",  hsl:"hsl(60,100%,94%)", code:"HTML", name:"lightyellow" }
    { hex:"#FFFF00", hsv:"hsv(60,100%,100%)", hsl:"hsl(60,100%,50%)", code:"HTML", name:"yellow" }
    { hex:"#FFF5EE", hsv:"hsv(25%,07,100%)",  hsl:"hsl(25,100%,97%)", code:"HTML", name:"seashell" }
    { hex:"#FFA07A", hsv:"hsv(17%,52,100%)",  hsl:"hsl(17,100%,74%)", code:"HTML", name:"lightsalmon" }
    { hex:"#808000", hsv:"hsv(60,100%,50%)",  hsl:"hsl(60,100%,25%)", code:"HTML", name:"olive" }
    { hex:"#BDB76B", hsv:"hsv(56%,43%,74%)",  hsl:"hsl(56%,38%,58%)", code:"HTML", name:"darkkhaki" }
    { hex:"#DAA520", hsv:"hsv(43%,85%,85%)",  hsl:"hsl(43%,74%,49%)", code:"HTML", name:"goldenrod" }
    { hex:"#B8860B", hsv:"hsv(43%,94%,72%)",  hsl:"hsl(43%,89%,38%)", code:"HTML", name:"darkgoldenrod" }
    { hex:"#FAFAD2", hsv:"hsv(60%,16%,98%)",  hsl:"hsl(60%,80%,90%)", code:"HTML", name:"lightgoldenrodyellow" }
    { hex:"#EEE8AA", hsv:"hsv(55%,29%,93%)",  hsl:"hsl(55%,67%,80%)", code:"HTML", name:"palegoldenrod" }
    { hex:"#FFFACD", hsv:"hsv(54%,20%,100%)", hsl:"hsl(54,100%,90%)", code:"HTML", name:"lemonchiffon" }
    { hex:"#FFF8DC", hsv:"hsv(48%,14,100%)",  hsl:"hsl(48,100%,93%)", code:"HTML", name:"cornsilk" }
    { hex:"#FFFFCC", hsv:"hsv(60%,20%,100%)", hsl:"hsl(60,100%,90%)", code:"PWY",  name:"Pale Weak Yellow" }
    { hex:"#FFFF99", hsv:"hsv(60%,4,100%)",   hsl:"hsl(60,100%,80%)", code:"PDY",  name:"Pale Dull Yellow" }
    { hex:"#FFFF66", hsv:"hsv(60%,6,100%)",   hsl:"hsl(60,100%,70%)", code:"LFY",  name:"Light Faded Yellow" }
    { hex:"#FFFF33", hsv:"hsv(60%,8,100%)",   hsl:"hsl(60,100%,60%)", code:"LHY",  name:"Light Hard Yellow" }
    { hex:"#FFFF00", hsv:"hsv(60,100%,100%)", hsl:"hsl(60,100%,50%)", code:"Y",    name:"Yellow" }
    { hex:"#CCCC99", hsv:"hsv(60%,25%,80%)",  hsl:"hsl(60%,33%,70%)", code:"LWY",  name:"Light Weak Yellow" }
    { hex:"#CCCC66", hsv:"hsv(60%,50%,80%)",  hsl:"hsl(60%,50%,60%)", code:"LDY",  name:"Light Dull Yellow" }
    { hex:"#CCCC33", hsv:"hsv(60%,75%,80%)",  hsl:"hsl(60%,60%,50%)", code:"MFY",  name:"Medium Faded Yellow" }
    { hex:"#CCCC00", hsv:"hsv(60,100%,80%)",  hsl:"hsl(60,100%,40%)", code:"DHY",  name:"Dark Hard Yellow" }
    { hex:"#999966", hsv:"hsv(60%,33%,60%)",  hsl:"hsl(60%,20%,50%)", code:"MWY",  name:"Medium Weak Yellow" }
    { hex:"#999933", hsv:"hsv(60%,67%,60%)",  hsl:"hsl(60%,50%,40%)", code:"DDY",  name:"Dark Dull Yellow" }
    { hex:"#999900", hsv:"hsv(60,100%,60%)",  hsl:"hsl(60,100%,30%)", code:"DFY",  name:"Dark Faded Yellow" }
    { hex:"#666633", hsv:"hsv(60%,50%,40%)",  hsl:"hsl(60%,33%,30%)", code:"DWY",  name:"Dark Weak Yellow" }
    { hex:"#666600", hsv:"hsv(60,100%,40%)",  hsl:"hsl(60,100%,20%)", code:"ODY",  name:"Obscure Dull Yellow" }
    { hex:"#333300", hsv:"hsv(60,100%,20%)",  hsl:"hsl(60,100%,100%)", code:"OWY", name:"Obscure Weak Yellow" } ]

  # ............................ Lime .....................................

  #32cd32
  #2db82d
  #28a428
  #238f23
  #1e7b1e

  @limesMH: [
    { hex:"#96e737" }
    { hex:"#90f035" }
    { hex:"#71f066" }
    { hex:"#5ee718" }
    { hex:"#43c52f" } ]

  @limes: [
    #{ hex:"#7FFFD4", hsv:"hsv(160%,5,100%)", hsl:"hsl(160,100%,75%)", code:"HTML", name:"aquamarine" }
    #{ hex:"#ADFF2F", hsv:"hsv(84%,82,100%)", hsl:"hsl(84,100%,59%)", code:"HTML", name:"greenyellow" }
    #{ hex:"#7FFF00", hsv:"hsv(90,100%,100%)", hsl:"hsl(90,100%,50%)", code:"HTML", name:"chartreuse" }
    #{ hex:"#00FF00", hsv:"hsv(120,100%,100%)", hsl:"hsl(120,100%,50%)", code:"HTML", name:"lime" }
    #{ hex:"#7CFC00", hsv:"hsv(90,100%,99%)", hsl:"hsl(90,100%,49%)", code:"HTML", name:"lawngreen" }
    #{ hex:"#98FB98", hsv:"hsv(120%,39%,98%)", hsl:"hsl(120%,93%,79%)", code:"HTML", name:"palegreen" }
    #{ hex:"#00FA9A", hsv:"hsv(157,100%,98%)", hsl:"hsl(157,100%,49%)", code:"HTML", name:"mediumspringgreen" }
    #{ hex:"#90EE90", hsv:"hsv(120%,39%,93%)", hsl:"hsl(120%,73%,75%)", code:"HTML", name:"lightgreen" }
    #{ hex:"#00FFFF", hsv:"hsv(180,100%,100%)", hsl:"hsl(180,100%,50%)", code:"HTML", name:"aqua" }
    #{ hex:"#40E0D0", hsv:"hsv(174%,7100%,88%)", hsl:"hsl(174%,72%,56%)", code:"HTML", name:"turquoise" }
    { hex:"#CCFF00", hsv:"hsv(72,100%,100%)", hsl:"hsl(72,100%,50%)", code:"YYS", name:"Yellow-Yellow-Spring" }
    { hex:"#CCFF33", hsv:"hsv(75%,8,100%)", hsl:"hsl(75,100%,60%)", code:"LYS", name:"Light Yellow-Spring" }
    { hex:"#99CC00", hsv:"hsv(75,100%,80%)", hsl:"hsl(75,100%,40%)", code:"DYS", name:"Dark Yellow-Spring" }
    { hex:"#CCFF66", hsv:"hsv(80%,6,100%)", hsl:"hsl(80,100%,70%)", code:"LSY", name:"Light Spring-Yellow" }
    { hex:"#99CC33", hsv:"hsv(80%,75%,80%)", hsl:"hsl(80%,60%,50%)", code:"MSY", name:"Medium Spring-Yellow" }
    { hex:"#669900", hsv:"hsv(80,100%,60%)", hsl:"hsl(80,100%,30%)", code:"DSY", name:"Dark Spring-Yellow" }
    { hex:"#99FF00", hsv:"hsv(84,100%,100%)", hsl:"hsl(84,100%,50%)", code:"SSY", name:"Spring-Spring-Yellow" }
    { hex:"#99FF33", hsv:"hsv(90%,8,100%)", hsl:"hsl(90,100%,60%)", code:"LHS", name:"Light Hard Spring" }
    { hex:"#66CC00", hsv:"hsv(90,100%,80%)", hsl:"hsl(90,100%,40%)", code:"DHS", name:"Dark Hard Spring" }
    { hex:"#CCFF99", hsv:"hsv(90%,4,100%)", hsl:"hsl(90,100%,80%)", code:"PDS", name:"Pale Dull Spring" }
    { hex:"#99CC66", hsv:"hsv(90%,50%,80%)", hsl:"hsl(90%,50%,60%)", code:"LDS", name:"Light Dull Spring" }
    { hex:"#669933", hsv:"hsv(90%,67%,60%)", hsl:"hsl(90%,50%,40%)", code:"DDS", name:"Dark Dull Spring" }
    { hex:"#336600", hsv:"hsv(90,100%,40%)", hsl:"hsl(90,100%,20%)", code:"ODS", name:"Obscure Dull Spring" }
    { hex:"#66FF00", hsv:"hsv(96,100%,100%)", hsl:"hsl(96,100%,50%)", code:"SSG", name:"Spring-Spring-Green" }
    { hex:"#99FF66", hsv:"hsv(100%,6,100%)", hsl:"hsl(100,100%,70%)", code:"LSG", name:"Light Spring-Green" }
    { hex:"#66CC33", hsv:"hsv(100%,75%,80%)", hsl:"hsl(100%,60%,50%)", code:"MSG", name:"Medium Spring-Green" }
    { hex:"#339900", hsv:"hsv(100,100%,60%)", hsl:"hsl(100,100%,30%)", code:"DSG", name:"Dark Spring-Green" }
    { hex:"#66FF33", hsv:"hsv(105%,8,100%)", hsl:"hsl(105,100%,60%)", code:"LGS", name:"Light Green-Spring" }
    { hex:"#33CC00", hsv:"hsv(105,100%,80%)", hsl:"hsl(105,100%,40%)", code:"DGS", name:"Dark Green-Spring" }
    { hex:"#33FF00", hsv:"hsv(108,100%,100%)", hsl:"hsl(108,100%,50%)", code:"GGS", name:"Green-Green-Spring" } ]

  # ............................ Greens .....................................

  @greensMH: [
    { hex:"#b2ffb2" }
    { hex:"#66ff66" }
    { hex:"#00ff00" }
    { hex:"#00cc00" }
    { hex:"#009900" } ]

  @greens: [
    #{ hex:"#008000", hsv:"hsv(120,100%,50%)", hsl:"hsl(120,100%,25%)", code:"HTML", name:"green" }
    #{ hex:"#F0FFF0", hsv:"hsv(120%,06,100%)", hsl:"hsl(120,100%,97%)", code:"HTML", name:"honeydew" }
    #{ hex:"#48D1CC", hsv:"hsv(178%,66%,82%)", hsl:"hsl(178%,60%,55%)", code:"HTML", name:"mediumturquoise" }
    #{ hex:"#66CDAA", hsv:"hsv(160%,50%,80%)", hsl:"hsl(160%,5100%,60%)", code:"HTML", name:"mediumaquamarine" }
    #{ hex:"#9ACD32", hsv:"hsv(80%,76%,80%)",  hsl:"hsl(80%,6100%,50%)", code:"HTML", name:"yellowgreen" }
    #{ hex:"#32CD32", hsv:"hsv(120%,76%,80%)", hsl:"hsl(120%,6100%,50%)", code:"HTML", name:"limegreen" }
    #{ hex:"#8FBC8F", hsv:"hsv(120%,24%,74%)", hsl:"hsl(120%,25%,65%)", code:"HTML", name:"darkseagreen" }
    #{ hex:"#3CB371", hsv:"hsv(147%,66%,70%)", hsl:"hsl(147%,50%,47%)", code:"HTML", name:"mediumseagreen" }
    #{ hex:"#20B2AA", hsv:"hsv(177%,82%,70%)", hsl:"hsl(177%,70%,4100%)", code:"HTML", name:"lightseagreen" }
    #{ hex:"#6B8E23", hsv:"hsv(80%,75%,56%)",  hsl:"hsl(80%,60%,35%)", code:"HTML", name:"olivedrab" }
    #{ hex:"#2E8B57", hsv:"hsv(146%,67%,55%)", hsl:"hsl(146%,50%,36%)", code:"HTML", name:"seagreen" }
    #{ hex:"#228B22", hsv:"hsv(120%,76%,55%)", hsl:"hsl(120%,6100%,34%)", code:"HTML", name:"forestgreen" }
    #{ hex:"#556B2F", hsv:"hsv(82%,56%,42%)",  hsl:"hsl(82%,39%,30%)", code:"HTML", name:"darkolivegreen" }
    #{ hex:"#006400", hsv:"hsv(120,100%,39%)", hsl:"hsl(120,100%,20%)", code:"HTML", name:"darkgreen" }
    { hex:"#CCFFCC", hsv:"hsv(120%,20%,100%)", hsl:"hsl(120,100%,90%)", code:"PWG", name:"Pale Weak Green" }
    { hex:"#99FF99", hsv:"hsv(120%,4,100%)",  hsl:"hsl(120,100%,80%)", code:"PDG", name:"Pale Dull Green" }
    { hex:"#66FF66", hsv:"hsv(120%,6,100%)",  hsl:"hsl(120,100%,70%)", code:"LFG", name:"Light Faded Green" }
    { hex:"#33FF33", hsv:"hsv(120%,8,100%)",  hsl:"hsl(120,100%,60%)", code:"LHG", name:"Light Hard Green" }
    { hex:"#00FF00", hsv:"hsv(120,100%,100%)", hsl:"hsl(120,100%,50%)", code:"G", name:"Green" }
    { hex:"#99CC99", hsv:"hsv(120%,25%,80%)", hsl:"hsl(120%,33%,70%)", code:"LWG", name:"Light Weak Green" }
    { hex:"#66CC66", hsv:"hsv(120%,50%,80%)", hsl:"hsl(120%,50%,60%)", code:"LDG", name:"Light Dull Green" }
    { hex:"#33CC33", hsv:"hsv(120%,75%,80%)", hsl:"hsl(120%,60%,50%)", code:"DHG", name:"Medium Faded Green" }
    { hex:"#00CC00", hsv:"hsv(120,100%,80%)", hsl:"hsl(120,100%,40%)", code:"DHG", name:"Dark Hard Green" }
    { hex:"#669966", hsv:"hsv(120%,33%,60%)", hsl:"hsl(120%,20%,50%)", code:"MWG", name:"Medium Weak Green" }
    { hex:"#339933", hsv:"hsv(120%,67%,60%)", hsl:"hsl(120%,50%,40%)", code:"DDG", name:"Dark Dull Green" }
    { hex:"#009900", hsv:"hsv(120,100%,60%)", hsl:"hsl(120,100%,30%)", code:"DFG", name:"Dark Faded Green" }
    { hex:"#336633", hsv:"hsv(120%,50%,40%)", hsl:"hsl(120%,33%,30%)", code:"DWG", name:"Dark Weak Green" }
    { hex:"#006600", hsv:"hsv(120,100%,40%)", hsl:"hsl(120,100%,20%)", code:"ODG", name:"Obscure Dull Green" }
    { hex:"#003300", hsv:"hsv(120,100%,20%)", hsl:"hsl(120,100%,100%)", code:"OWG", name:"Obscure Weak Green" } ]

  # .......... Teals .......

  @aquasMH:[
    { hex:"#76eec6" }
    { hex:"#6ad6b2" }
    { hex:"#5ebe9e" }
    { hex:"#52a68a" }
    { hex:"#468e76" } ]

  @aquasMHbak:[
    { hex:"#d8fff2" }
    { hex:"#b2ffe5" }
    { hex:"#8bffd8" }
    { hex:"#65cca9" }
    { hex:"#4c997f" } ]

  @tealsMH: [
    { hex:"#b2d8d8" }
    { hex:"#66b2b2" }
    { hex:"#008080" }
    { hex:"#006666" }
    { hex:"#004c4c" } ]

  @teals: [
    #{ hex:"#008080", hsv:"hsv(180,100%,50%)", hsl:"hsl(180,100%,25%)", code:"HTML", name:"teal" }
    #{ hex:"#00FF7F", hsv:"hsv(150,100%,100%)", hsl:"hsl(150,100%,50%)", code:"HTML", name:"springgreen" }
    #{ hex:"#F5FFFA", hsv:"hsv(150%,04,100%)", hsl:"hsl(150,100%,98%)", code:"HTML", name:"mintcream" }
    { hex:"#00FF33", hsv:"hsv(132,100%,100%)", hsl:"hsl(132,100%,50%)", code:"GGT", name:"Green-Green-Teal" }
    { hex:"#33FF66", hsv:"hsv(135%,8,100%)", hsl:"hsl(135,100%,60%)", code:"LGT", name:"Light Green-Teal" }
    { hex:"#00CC33", hsv:"hsv(135,100%,80%)", hsl:"hsl(135,100%,40%)", code:"DGT", name:"Dark Green-Teal" }
    { hex:"#66FF99", hsv:"hsv(140%,6,100%)", hsl:"hsl(140,100%,70%)", code:"LTG", name:"Light Teal-Green" }
    { hex:"#33CC66", hsv:"hsv(140%,75%,80%)", hsl:"hsl(140%,60%,50%)", code:"MTG", name:"Medium Teal-Green" }
    { hex:"#009933", hsv:"hsv(140,100%,60%)", hsl:"hsl(140,100%,30%)", code:"DTG", name:"Dark Teal-Green" }
    { hex:"#00FF66", hsv:"hsv(144,100%,100%)", hsl:"hsl(144,100%,50%)", code:"TTG", name:"Teal-Teal-Green" }
    { hex:"#33FF99", hsv:"hsv(150%,8,100%)", hsl:"hsl(150,100%,60%)", code:"LHT", name:"Light Hard Teal" }
    { hex:"#00CC66", hsv:"hsv(150,100%,80%)", hsl:"hsl(150,100%,40%)", code:"DHT", name:"Dark Hard Teal" }
    { hex:"#99FFCC", hsv:"hsv(150%,4,100%)", hsl:"hsl(150,100%,80%)", code:"PDT", name:"Pale Dull Teal" }
    { hex:"#66CC99", hsv:"hsv(150%,50%,80%)", hsl:"hsl(150%,50%,60%)", code:"LDT", name:"Light Dull Teal" }
    { hex:"#339966", hsv:"hsv(150%,67%,60%)", hsl:"hsl(150%,50%,40%)", code:"DDT", name:"Dark Dull Teal" }
    { hex:"#00FF99", hsv:"hsv(156,100%,100%)", hsl:"hsl(156,100%,50%)", code:"TTC", name:"Teal-Teal-Cyan" }
    { hex:"#66FFCC", hsv:"hsv(160%,6,100%)", hsl:"hsl(160,100%,70%)", code:"LTC", name:"Light Teal-Cyan" }
    { hex:"#33CC99", hsv:"hsv(160%,75%,80%)", hsl:"hsl(160%,60%,50%)", code:"MTC", name:"Medium Teal-Cyan" }
    { hex:"#009966", hsv:"hsv(160,100%,60%)", hsl:"hsl(160,100%,30%)", code:"DTC", name:"Dark Teal-Cyan" }
    { hex:"#33FFCC", hsv:"hsv(165%,8,100%)", hsl:"hsl(165,100%,60%)", code:"LCT", name:"Light Cyan-Teal" }
    { hex:"#00CC99", hsv:"hsv(165,100%,80%)", hsl:"hsl(165,100%,40%)", code:"DCT", name:"Dark Cyan-Teal" }
    { hex:"#00FFCC", hsv:"hsv(168,100%,100%)", hsl:"hsl(168,100%,50%)", code:"CCT", name:"Cyan-Cyan-Teal" }
    { hex:"#33DDAA", hsv:"hsv(150%,67%,60%)", hsl:"hsl(150%,50%,30%)", code:"QDT", name:"Q Dull Teal" }
    { hex:"#006633", hsv:"hsv(150,100%,40%)", hsl:"hsl(150,100%,20%)", code:"ODT", name:"Obscure Dull Teal" } ]

  # ...... Cyans ......

  @cyansMH: [
    { hex:"#00ffff" }
    { hex:"#00dfdf" }
    { hex:"#00cccc" }
    { hex:"#00b4b4" }
    { hex:"#009292" } ]

  @cyans: [
    #{ hex:"#00FFFF", hsv:"hsv(180,100%,100%)", hsl:"hsl(180,100%,50%)", code:"HTML", name:"cyan" }
    #{ hex:"#008B8B", hsv:"hsv(180,100%,55%)", hsl:"hsl(180,100%,27%)", code:"HTML", name:"darkcyan" }
    #{ hex:"#E0FFFF", hsv:"hsv(180%,12,100%)", hsl:"hsl(180,100%,94%)", code:"HTML", name:"lightcyan" }
    { hex:"#CCFFFF", hsv:"hsv(180%,20%,100%)", hsl:"hsl(180,100%,90%)", code:"PWC", name:"Pale Weak Cyan" }
    { hex:"#99FFFF", hsv:"hsv(180%,4,100%)", hsl:"hsl(180,100%,80%)", code:"PDC", name:"Pale Dull Cyan" }
    { hex:"#66FFFF", hsv:"hsv(180%,6,100%)", hsl:"hsl(180,100%,70%)", code:"LFC", name:"Light Faded Cyan" }
    { hex:"#33FFFF", hsv:"hsv(180%,8,100%)", hsl:"hsl(180,100%,60%)", code:"LHC", name:"Light Hard Cyan" }
    { hex:"#00FFFF", hsv:"hsv(180,100%,100%)", hsl:"hsl(180,100%,50%)", code:"C", name:"Cyan" }
    { hex:"#99CCCC", hsv:"hsv(180%,25%,80%)", hsl:"hsl(180%,33%,70%)", code:"LWC", name:"Light Weak Cyan" }
    { hex:"#66CCCC", hsv:"hsv(180%,50%,80%)", hsl:"hsl(180%,50%,60%)", code:"LDC", name:"Light Dull Cyan" }
    { hex:"#33CCCC", hsv:"hsv(180%,75%,80%)", hsl:"hsl(180%,60%,50%)", code:"MFC", name:"Medium Faded Cyan" }
    { hex:"#00CCCC", hsv:"hsv(180,100%,80%)", hsl:"hsl(180,100%,40%)", code:"DHC", name:"Dark Hard Cyan" }
    { hex:"#669999", hsv:"hsv(180%,33%,60%)", hsl:"hsl(180%,20%,50%)", code:"MWC", name:"Medium Weak Cyan" }
    { hex:"#339999", hsv:"hsv(180%,67%,60%)", hsl:"hsl(180%,50%,40%)", code:"DDC", name:"Dark Dull Cyan" }
    { hex:"#009999", hsv:"hsv(180,100%,60%)", hsl:"hsl(180,100%,30%)", code:"DFC", name:"Dark Faded Cyan" }
    { hex:"#336666", hsv:"hsv(180%,50%,40%)", hsl:"hsl(180%,33%,30%)", code:"DWC", name:"Dark Weak Cyan" }
    { hex:"#006666", hsv:"hsv(180,100%,40%)", hsl:"hsl(180,100%,20%)", code:"ODC", name:"Obscure Dull Cyan" }
    { hex:"#003333", hsv:"hsv(180,100%,20%)", hsl:"hsl(180,100%,100%)", code:"OWC", name:"Obscure Weak Cyan" } ]

  # ................................ Azures ...............................

  @azuresMH: [
    { hex:"#e2f3fb" }
    { hex:"#93e1ed" }
    { hex:"#02b9f3" }
    { hex:"#018abd" }
    { hex:"#005c9d" } ]

  @azures: [
    #{ hex:"#F0F8FF", hsv:"hsv(208%,06,100%)", hsl:"hsl(208,100%,97%)", code:"HTML", name:"aliceblue" }
    #{ hex:"#F0FFFF", hsv:"hsv(180%,06,100%)", hsl:"hsl(180,100%,97%)", code:"HTML", name:"azure" }
    #{ hex:"#B0C4DE", hsv:"hsv(214%,2100%,87%)", hsl:"hsl(214%,4100%,78%)", code:"HTML", name:"lightsteelblue" }
    #{ hex:"#B0E0E6", hsv:"hsv(187%,23%,90%)", hsl:"hsl(187%,52%,80%)", code:"HTML", name:"powderblue" }
    #{ hex:"#ADD8E6", hsv:"hsv(195%,25%,90%)", hsl:"hsl(195%,53%,79%)", code:"HTML", name:"lightblue" }
    #{ hex:"#AFEEEE", hsv:"hsv(180%,26%,93%)", hsl:"hsl(180%,65%,8100%)", code:"HTML", name:"paleturquoise" }
    #{ hex:"#5F9EA0", hsv:"hsv(182%,4100%,63%)", hsl:"hsl(182%,25%,50%)", code:"HTML", name:"cadetblue" }
    #{ hex:"#87CEEB", hsv:"hsv(197%,43%,92%)", hsl:"hsl(197%,7100%,73%)", code:"HTML", name:"skyblue" }
    #{ hex:"#87CEFA", hsv:"hsv(203%,46%,98%)", hsl:"hsl(203%,92%,75%)", code:"HTML", name:"lightskyblue" }
    #{ hex:"#6A5ACD", hsv:"hsv(248%,56%,80%)", hsl:"hsl(248%,53%,58%)", code:"HTML", name:"slateblue" }
    { hex:"#00CCFF", hsv:"hsv(192,100%,100%)", hsl:"hsl(192,100%,50%)", code:"CCA", name:"Cyan-Cyan-Azure" }
    { hex:"#33CCFF", hsv:"hsv(195%,8,100%)", hsl:"hsl(195,100%,60%)", code:"LCA", name:"Light Cyan-Azure" }
    { hex:"#0099CC", hsv:"hsv(195,100%,80%)", hsl:"hsl(195,100%,40%)", code:"DCA", name:"Dark Cyan-Azure" }
    { hex:"#66CCFF", hsv:"hsv(200%,6,100%)", hsl:"hsl(200,100%,70%)", code:"LAC", name:"Light Azure-Cyan" }
    { hex:"#3399CC", hsv:"hsv(200%,75%,80%)", hsl:"hsl(200%,60%,50%)", code:"MAC", name:"Medium Azure-Cyan" }
    { hex:"#006699", hsv:"hsv(200,100%,60%)", hsl:"hsl(200,100%,30%)", code:"DAC", name:"Dark Azure-Cyan" }
    { hex:"#0099FF", hsv:"hsv(204,100%,100%)", hsl:"hsl(204,100%,50%)", code:"AAC", name:"Azure-Azure-Cyan" }
    { hex:"#3399FF", hsv:"hsv(210%,8,100%)", hsl:"hsl(210,100%,60%)", code:"LHA", name:"Light Hard Azure" }
    { hex:"#0066CC", hsv:"hsv(210,100%,80%)", hsl:"hsl(210,100%,40%)", code:"DHA", name:"Dark Hard Azure" }
    { hex:"#99CCFF", hsv:"hsv(210%,4,100%)", hsl:"hsl(210,100%,80%)", code:"PDA", name:"Pale Dull Azure" }
    { hex:"#6699CC", hsv:"hsv(210%,50%,80%)", hsl:"hsl(210%,50%,60%)", code:"LDA", name:"Light Dull Azure" }
    { hex:"#336699", hsv:"hsv(210%,67%,60%)", hsl:"hsl(210%,50%,40%)", code:"DDA", name:"Dark Dull Azure" }
    { hex:"#003366", hsv:"hsv(210,100%,40%)", hsl:"hsl(210,100%,20%)", code:"ODA", name:"Obscure Dull Azure" }
    { hex:"#0066FF", hsv:"hsv(216,100%,100%)", hsl:"hsl(216,100%,50%)", code:"AAB", name:"Azure-Azure-Blue" }
    { hex:"#6699FF", hsv:"hsv(220%,6,100%)", hsl:"hsl(220,100%,70%)", code:"LAB", name:"Light Azure-Blue" }
    { hex:"#3366CC", hsv:"hsv(220%,75%,80%)", hsl:"hsl(220%,60%,50%)", code:"MAB", name:"Medium Azure-Blue" }
    { hex:"#003399", hsv:"hsv(220,100%,60%)", hsl:"hsl(220,100%,30%)", code:"DAB", name:"Dark Azure-Blue" }
    { hex:"#3366FF", hsv:"hsv(225%,8,100%)", hsl:"hsl(225,100%,60%)", code:"LBA", name:"Light Blue-Azure" }
    { hex:"#0033CC", hsv:"hsv(225,100%,80%)", hsl:"hsl(225,100%,40%)", code:"DBA", name:"Dark Blue-Azure" }
    { hex:"#0033FF", hsv:"hsv(228,100%,100%)", hsl:"hsl(228,100%,50%)", code:"BBA", name:"Blue-Blue-Azure" } ]

  # ................................ Blues ......................................

  @bluesMH: [
    { hex:"#b2d8ff" }
    { hex:"#66b2ff" }
    { hex:"#0080ff" }
    { hex:"#0066cc" }
    { hex:"#004c99" } ]

  @blues: [
    { hex:"#b2d8ff" }
    { hex:"#66b2ff" }
    { hex:"#0080ff" }
    { hex:"#0066cc" }
    { hex:"#004c99" }
    #{ hex:"#483D8B", hsv:"hsv(248%,56%,55%)", hsl:"hsl(248%,39%,39%)", code:"HTML", name:"darkslateblue" }
    #{ hex:"#E6E6FA", hsv:"hsv(240%,08%,98%)", hsl:"hsl(240%,67%,94%)", code:"HTML", name:"lavender" }
    #{ hex:"#7B68EE", hsv:"hsv(249%,56%,93%)", hsl:"hsl(249%,80%,67%)", code:"HTML", name:"mediumslateblue" }
    #{ hex:"#6495ED", hsv:"hsv(219%,58%,93%)", hsl:"hsl(219%,79%,66%)", code:"HTML", name:"cornflowerblue" }
    #{ hex:"#4682B4", hsv:"hsv(207%,6100%,7100%)", hsl:"hsl(207%,44%,49%)", code:"HTML", name:"steelblue" }
    #{ hex:"#00CED1", hsv:"hsv(181,100%,82%)", hsl:"hsl(181,100%,4100%)", code:"HTML", name:"darkturquoise" }
    #{ hex:"#4169E1", hsv:"hsv(225%,7100%,88%)", hsl:"hsl(225%,73%,57%)", code:"HTML", name:"royalblue" }
    #{ hex:"#00008B", hsv:"hsv(240,100%,55%)", hsl:"hsl(240,100%,27%)", code:"HTML", name:"darkblue" }
    #{ hex:"#191970", hsv:"hsv(240%,78%,44%)", hsl:"hsl(240%,64%,27%)", code:"HTML", name:"midnightblue" }
    #{ hex:"#1E90FF", hsv:"hsv(210%,88,100%)", hsl:"hsl(210,100%,56%)", code:"HTML", name:"dodgerblue" }
    #{ hex:"#00BFFF", hsv:"hsv(195,100%,100%)", hsl:"hsl(195,100%,50%)", code:"HTML", name:"deepskyblue" }
    #{ hex:"#0000CD", hsv:"hsv(240,100%,80%)", hsl:"hsl(240,100%,40%)", code:"HTML", name:"mediumblue" }
    #{ hex:"#000080", hsv:"hsv(240,100%,50%)", hsl:"hsl(240,100%,25%)", code:"HTML", name:"navy" }
    #{ hex:"#0000FF", hsv:"hsv(240,100%,100%)", hsl:"hsl(240,100%,50%)", code:"HTML", name:"blue" }
    { hex:"#CCCCFF", hsv:"hsv(240%,20%,100%)", hsl:"hsl(240,100%,90%)", code:"PWB", name:"Pale Weak Blue" }
    { hex:"#9999FF", hsv:"hsv(240%,4,100%)", hsl:"hsl(240,100%,80%)", code:"PDB", name:"Pale Dull Blue" }
    { hex:"#6666FF", hsv:"hsv(240%,6,100%)", hsl:"hsl(240,100%,70%)", code:"LFB", name:"Light Faded Blue" }
    { hex:"#3333FF", hsv:"hsv(240%,8,100%)", hsl:"hsl(240,100%,60%)", code:"LHB", name:"Light Hard Blue" }
    { hex:"#0000FF", hsv:"hsv(240,100%,100%)", hsl:"hsl(240,100%,50%)", code:"B", name:"Blue" }
    { hex:"#9999CC", hsv:"hsv(240%,25%,80%)", hsl:"hsl(240%,33%,70%)", code:"LWB", name:"Light Weak Blue" }
    { hex:"#6666CC", hsv:"hsv(240%,50%,80%)", hsl:"hsl(240%,50%,60%)", code:"LDB", name:"Light Dull Blue" }
    { hex:"#3333CC", hsv:"hsv(240%,75%,80%)", hsl:"hsl(240%,60%,50%)", code:"MFB", name:"Medium Faded Blue" }
    { hex:"#0000CC", hsv:"hsv(240,100%,80%)", hsl:"hsl(240,100%,40%)", code:"DHB", name:"Dark Hard Blue" }
    { hex:"#666699", hsv:"hsv(240%,33%,60%)", hsl:"hsl(240%,20%,50%)", code:"MWB", name:"Medium Weak Blue" }
    { hex:"#333399", hsv:"hsv(240%,67%,60%)", hsl:"hsl(240%,50%,40%)", code:"DDB", name:"Dark Dull Blue" }
    { hex:"#000099", hsv:"hsv(240,100%,60%)", hsl:"hsl(240,100%,30%)", code:"DFB", name:"Dark Faded Blue" }
    { hex:"#333366", hsv:"hsv(240%,50%,40%)", hsl:"hsl(240%,33%,30%)", code:"DWB", name:"Dark Weak Blue" }
    { hex:"#000066", hsv:"hsv(240,100%,40%)", hsl:"hsl(240,100%,20%)", code:"ODB", name:"Obscure Dull Blue" }
    { hex:"#000033", hsv:"hsv(240,100%,20%)", hsl:"hsl(240,100%,100%)", code:"OWB", name:"Obscure Weak Blue" } ]

  # ............................. Violets ...................................

  @violetsMH: [
    { hex:"#d8b2ff" }
    { hex:"#b266ff" }
    { hex:"#b266ff" }
    { hex:"#6600cc" }
    { hex:"#4c0099" } ]

  @violets: [
    #{ hex:"#EE82EE", hsv:"hsv(300%,45%,93%)", hsl:"hsl(300%,76%,72%)", code:"HTML", name:"violet" }
    #{ hex:"#C71585", hsv:"hsv(322%,89%,78%)", hsl:"hsl(322%,8100%,43%)", code:"HTML", name:"mediumvioletred" }
    #{ hex:"#FF00FF", hsv:"hsv(300,100%,100%)", hsl:"hsl(300,100%,50%)", code:"HTML", name:"fuchsia" }
    #{ hex:"#800080", hsv:"hsv(300,100%,50%)", hsl:"hsl(300,100%,25%)", code:"HTML", name:"purple" }
    #{ hex:"#BA55D3", hsv:"hsv(288%,60%,83%)", hsl:"hsl(288%,59%,58%)", code:"HTML", name:"mediumorchid" }
    #{ hex:"#9400D3", hsv:"hsv(282,100%,83%)", hsl:"hsl(282,100%,4100%)", code:"HTML", name:"darkviolet" }
    #{ hex:"#9932CC", hsv:"hsv(280%,75%,80%)", hsl:"hsl(280%,6100%,50%)", code:"HTML", name:"darkorchid" }
    #{ hex:"#8A2BE2", hsv:"hsv(27100%,8100%,89%)", hsl:"hsl(27100%,76%,53%)", code:"HTML", name:"blueviolet" }
    #{ hex:"#9370DB", hsv:"hsv(260%,49%,86%)", hsl:"hsl(260%,60%,65%)", code:"HTML", name:"mediumpurple" }
    #{ hex:"#4B0082", hsv:"hsv(275,100%,5100%)", hsl:"hsl(275,100%,25%)", code:"HTML", name:"indigo" }
    { hex:"#3300FF", hsv:"hsv(252,100%,100%)", hsl:"hsl(252,100%,50%)", code:"BBV", name:"Blue-Blue-Violet" }
    { hex:"#6633FF", hsv:"hsv(255%,8,100%)", hsl:"hsl(255,100%,60%)", code:"LBV", name:"Light Blue-Violet" }
    { hex:"#3300CC", hsv:"hsv(255,100%,80%)", hsl:"hsl(255,100%,40%)", code:"DBV", name:"Dark Blue-Violet" }
    { hex:"#9966FF", hsv:"hsv(260%,6,100%)", hsl:"hsl(260,100%,70%)", code:"LVB", name:"Light Violet-Blue" }
    { hex:"#6633CC", hsv:"hsv(260%,75%,80%)", hsl:"hsl(260%,60%,50%)", code:"MVB", name:"Medium Violet-Blue" }
    { hex:"#330099", hsv:"hsv(260,100%,60%)", hsl:"hsl(260,100%,30%)", code:"DVB", name:"Dark Violet-Blue" }
    { hex:"#6600FF", hsv:"hsv(264,100%,100%)", hsl:"hsl(264,100%,50%)", code:"VVB", name:"Violet-Violet-Blue" }
    { hex:"#9933FF", hsv:"hsv(270%,8,100%)", hsl:"hsl(270,100%,60%)", code:"LHV", name:"Light Hard Violet" }
    { hex:"#6600CC", hsv:"hsv(270,100%,80%)", hsl:"hsl(270,100%,40%)", code:"DHV", name:"Dark Hard Violet" }
    { hex:"#CC99FF", hsv:"hsv(270%,4,100%)", hsl:"hsl(270,100%,80%)", code:"PDV", name:"Pale Dull Violet" }
    { hex:"#9966CC", hsv:"hsv(270%,50%,80%)", hsl:"hsl(270%,50%,60%)", code:"LDV", name:"Light Dull Violet" }
    { hex:"#663399", hsv:"hsv(270%,67%,60%)", hsl:"hsl(270%,50%,40%)", code:"DDV", name:"Dark Dull Violet" }
    { hex:"#330066", hsv:"hsv(270,100%,40%)", hsl:"hsl(270,100%,20%)", code:"ODV", name:"Obscure Dull Violet" }
    { hex:"#9900FF", hsv:"hsv(276,100%,100%)", hsl:"hsl(276,100%,50%)", code:"VVM", name:"Violet-Violet-Gray" }
    { hex:"#CC66FF", hsv:"hsv(280%,6,100%)", hsl:"hsl(280,100%,70%)", code:"LVM", name:"Light Violet-Magenta" }
    { hex:"#9933CC", hsv:"hsv(280%,75%,80%)", hsl:"hsl(280%,60%,50%)", code:"MVM", name:"Medium Violet-Magenta" }
    { hex:"#660099", hsv:"hsv(280,100%,60%)", hsl:"hsl(280,100%,30%)", code:"DVM", name:"Dark Violet-Magenta" }
    { hex:"#CC33FF", hsv:"hsv(285%,8,100%)", hsl:"hsl(285,100%,60%)", code:"LMV", name:"Light Magenta-Violet" }
    { hex:"#9900CC", hsv:"hsv(285,100%,80%)", hsl:"hsl(285,100%,40%)", code:"DMV", name:"Dark Magenta-Violet" }
    { hex:"#CC00FF", hsv:"hsv(288,100%,100%)", hsl:"hsl(288,100%,50%)", code:"MMV", name:"Magenta-Magenta-Violet" } ]

  @plumsMH:[
    { hex:"#4c004c" }
    { hex:"#660066" }
    { hex:"#800080" }
    { hex:"#b266b2" }
    { hex:"#d8b2d8" } ]

  @magentasMH: [
    { hex:"#ffb2ff" }
    { hex:"#ff66ff" }
    { hex:"#ff00ff" }
    { hex:"#cc00cc" }
    { hex:"#990099" } ]

  @magentas: [
    #{ hex:"#FF00FF", hsv:"hsv(300,100%,100%)", hsl:"hsl(300,100%,50%)", code:"HTML", name:"magenta" }
    #{ hex:"#8B008B", hsv:"hsv(300,100%,55%)", hsl:"hsl(300,100%,27%)", code:"HTML", name:"darkmagenta" }
    { hex:"#FFCCFF", hsv:"hsv(300%,20%,100%)", hsl:"hsl(300,100%,90%)", code:"PWM", name:"Pale Weak Magenta" }
    { hex:"#FF99FF", hsv:"hsv(300%,4,100%)", hsl:"hsl(300,100%,80%)", code:"PDM", name:"Pale Dull Magenta" }
    { hex:"#FF66FF", hsv:"hsv(300%,6,100%)", hsl:"hsl(300,100%,70%)", code:"LFM", name:"Light Faded Magenta" }
    { hex:"#FF33FF", hsv:"hsv(300%,8,100%)", hsl:"hsl(300,100%,60%)", code:"LHM", name:"Light Hard Magenta" }
    { hex:"#FF00FF", hsv:"hsv(300,100%,100%)", hsl:"hsl(300,100%,50%)", code:"M", name:"Magenta" }
    { hex:"#CC99CC", hsv:"hsv(300%,25%,80%)", hsl:"hsl(300%,33%,70%)", code:"LWM", name:"Light Weak Magenta" }
    { hex:"#CC66CC", hsv:"hsv(300%,50%,80%)", hsl:"hsl(300%,50%,60%)", code:"LDM", name:"Light Dull Magenta" }
    { hex:"#CC33CC", hsv:"hsv(300%,75%,80%)", hsl:"hsl(300%,60%,50%)", code:"MFM", name:"Medium Faded Magenta" }
    { hex:"#CC00CC", hsv:"hsv(300,100%,80%)", hsl:"hsl(300,100%,40%)", code:"DHM", name:"Dark Hard Magenta" }
    { hex:"#996699", hsv:"hsv(300%,33%,60%)", hsl:"hsl(300%,20%,50%)", code:"MWM", name:"Medium Weak Magenta" }
    { hex:"#993399", hsv:"hsv(300%,67%,60%)", hsl:"hsl(300%,50%,40%)", code:"DDM", name:"Dark Dull Magenta" }
    { hex:"#990099", hsv:"hsv(300,100%,60%)", hsl:"hsl(300,100%,30%)", code:"DFM", name:"Dark Faded Magenta" }
    { hex:"#663366", hsv:"hsv(300%,50%,40%)", hsl:"hsl(300%,33%,30%)", code:"DWM", name:"Dark Weak Magenta" }
    { hex:"#660066", hsv:"hsv(300,100%,40%)", hsl:"hsl(300,100%,20%)", code:"ODM", name:"Obscure Dull Magenta" }
    { hex:"#330033", hsv:"hsv(300,100%,20%)", hsl:"hsl(300,100%,100%)", code:"OWM", name:"Obscure Weak Magenta" } ]

  @pinksMH: [
    { hex:"#ffb2d8" }
    { hex:"#ff66b2" }
    { hex:"#ff0080" }
    { hex:"#cc0066" }
    { hex:"#99004c" } ]

  @pinks: [
    #{ hex:"#FF69B4", hsv:"hsv(330, 59%,100%)", hsl:"hsl(330,100%,71%)", code:"HTML", name:"hotpink" }
    #{ hex:"#FF1493", hsv:"hsv(328, 92%,100%)", hsl:"hsl(328,100%,54%)", code:"HTML", name:"deeppink" }
    #{ hex:"#FFB6C1", hsv:"hsv(351, 29%,100%)", hsl:"hsl(351,100%,86%)", code:"HTML", name:"lightpink" }
    #{ hex:"#FFC0CB", hsv:"hsv(350, 25%,100%)", hsl:"hsl(350,100%,88%)", code:"HTML", name:"pink" }
    { hex:"#FF00CC", hsv:"hsv(312,100%,100%)", hsl:"hsl(312,100%,50%)", code:"MMP", name:"Magenta-Magenta-Pink" }
    { hex:"#FF33CC", hsv:"hsv(315, 80%,100%)", hsl:"hsl(315,100%,60%)", code:"LMP", name:"Light Magenta-Pink" }
    { hex:"#CC0099", hsv:"hsv(315,100%, 80%)", hsl:"hsl(315,100%,40%)", code:"DMP", name:"Dark Magenta-Pink" }
    { hex:"#FF66CC", hsv:"hsv(320, 60%,100%)", hsl:"hsl(320,100%,70%)", code:"LPM", name:"Light Pink-Magenta" }
    { hex:"#CC3399", hsv:"hsv(320, 75%, 80%)", hsl:"hsl(320%,60%,50%)", code:"MPM", name:"Medium Pink-Magenta" }
    { hex:"#990066", hsv:"hsv(320,100%, 60%)", hsl:"hsl(320,100%,30%)", code:"DPM", name:"Dark Pink-Magenta" }
    { hex:"#FF0099", hsv:"hsv(324,100%,100%)", hsl:"hsl(324,100%,50%)", code:"PPM", name:"Pink-Pink-Magenta" }
    { hex:"#FF3399", hsv:"hsv(330, 80%,100%)", hsl:"hsl(330,100%,60%)", code:"LHP", name:"Light Hard Pink" }
    { hex:"#CC0066", hsv:"hsv(330,100%, 80%)", hsl:"hsl(330,100%,40%)", code:"DHP", name:"Dark Hard Pink" }
    { hex:"#FF99CC", hsv:"hsv(330, 40%,100%)", hsl:"hsl(330,100%,80%)", code:"PDP", name:"Pale Dull Pink" }
    { hex:"#CC6699", hsv:"hsv(330, 50%, 80%)", hsl:"hsl(330%,50%,60%)", code:"LDP", name:"Light Dull Pink" }
    { hex:"#993366", hsv:"hsv(330, 67%, 60%)", hsl:"hsl(330%,50%,40%)", code:"DDP", name:"Dark Dull Pink" }
    { hex:"#660033", hsv:"hsv(330,100%, 40%)", hsl:"hsl(330,100%,20%)", code:"ODP", name:"Obscure Dull Pink" }
    { hex:"#FF0066", hsv:"hsv(336,100%,100%)", hsl:"hsl(336,100%,50%)", code:"PPR", name:"Pink-Pink-Red" }
    { hex:"#FF6699", hsv:"hsv(340, 60%,100%)", hsl:"hsl(340,100%,70%)", code:"LPR", name:"Light Pink-Red" }
    { hex:"#CC3366", hsv:"hsv(340, 75%, 80%)", hsl:"hsl(340%,60%,50%)", code:"MPR", name:"Medium Pink-Red" }
    { hex:"#990033", hsv:"hsv(340,100%, 60%)", hsl:"hsl(340,100%,30%)", code:"DPR", name:"Dark Pink-Red" }
    { hex:"#FF3366", hsv:"hsv(345, 80%,100%)", hsl:"hsl(345,100%,60%)", code:"LRP", name:"Light Red-Pink" }
    { hex:"#CC0033", hsv:"hsv(345,100%, 80%)", hsl:"hsl(345,100%,40%)", code:"DRP", name:"Dark Red-Pink" }
    { hex:"#FF0033", hsv:"hsv(348,100%,100%)", hsl:"hsl(348,100%,50%)", code:"RRP", name:"Red-Red-Pink" }  ]

  # ................................. Grays .................................

  @gray = { hex:"#777777", hsv:"hsv(0,100%, 50%)", hsl:"hsl(0,100%,50%)", code:"G",   name:"Gray" }

  @grays: [
    { hex:"#111111", hsv:"hsv(0, ,100%)",    hsl:"hsl(0,0,100%)",    code:"HTML", name:"none" }
    { hex:"#FFFFFF", hsv:"hsv(0,0,100%)", hsl:"hsl(0,0,100%)",    code:"HTML", name:"white" }
    { hex:"#F8F8FF", hsv:"hsv(240%,03,100%)", hsl:"hsl(240,100%,99%)", code:"HTML", name:"ghostwhite" }
    { hex:"#F5F5F5", hsv:"hsv(0,0%,96%)", hsl:"hsl(0,0%,96%)", code:"HTML", name:"whitesmoke" }
    { hex:"#DCDCDC", hsv:"hsv(0,0%,86%)", hsl:"hsl(0,0%,86%)", code:"HTML", name:"gainsboro" }
    { hex:"#D3D3D3", hsv:"hsv(0,0%,83%)", hsl:"hsl(0,0%,83%)", code:"HTML", name:"lightgray" }
    { hex:"#C0C0C0", hsv:"hsv(0,0%,75%)", hsl:"hsl(0,0%,75%)", code:"HTML", name:"silver" }
    { hex:"#A9A9A9", hsv:"hsv(0,0%,66%)", hsl:"hsl(0,0%,66%)", code:"HTML", name:"darkgray" }
    { hex:"#808080", hsv:"hsv(0,0%,50%)", hsl:"hsl(0,0%,50%)", code:"HTML", name:"gray" }
    { hex:"#696969", hsv:"hsv(0,0%,4100%)", hsl:"hsl(0,0%,4100%)", code:"HTML", name:"dimgray" }
    { hex:"#000000", hsv:"hsv(0,0%,00%)", hsl:"hsl(0,0,0%)",    code:"HTML", name:"black" }
    { hex:"#778899", hsv:"hsv(210,22%,60%)", hsl:"hsl(210%,14%,53%)", code:"HTML", name:"lightslategray" }
    { hex:"#708090", hsv:"hsv(210,22%,56%)", hsl:"hsl(210%,13%,50%)", code:"HTML", name:"slategray" }
    { hex:"#2F4F4F", hsv:"hsv(180,41%,31%)", hsl:"hsl(180%,25%,25%)", code:"HTML", name:"darkslategray" }
    { hex:"#FFCCFF", hsv:"hsv(0, 20%,100%)", hsl:"hsl(0,100%,90%)", code:"PWG", name:"Pale Weak Gray" }
    { hex:"#FF99FF", hsv:"hsv(0, 40%,100%)", hsl:"hsl(0,100%,80%)", code:"PDG", name:"Pale Dull Gray" }
    { hex:"#EEEEEE", hsv:"hsv(0, 25%, 80%)", hsl:"hsl(0, 33%,70%)", code:"LWG", name:"Light Weak Gray" }
    { hex:"#DDDDDD", hsv:"hsv(0, 50%, 40%)", hsl:"hsl(0, 33%,30%)", code:"DWG", name:"Dark Weak Gray" }
    { hex:"#CCCCCC", hsv:"hsv(0, 33%, 60%)", hsl:"hsl(0, 20%,50%)", code:"MWG", name:"Medium Weak Gray" }
    { hex:"#BBBBBB", hsv:"hsv(0, 50%, 80%)", hsl:"hsl(0, 50%,60%)", code:"LDG", name:"Light Dull Gray" }
    { hex:"#AAAAAA", hsv:"hsv(0, 67%, 60%)", hsl:"hsl(0, 50%,40%)", code:"DDG", name:"Dark Dull Gray" }
    { hex:"#999999", hsv:"hsv(0, 60%,100%)", hsl:"hsl(0,100%,70%)", code:"LFG", name:"Light Faded Gray" }
    { hex:"#888888", hsv:"hsv(0, 75%, 80%)", hsl:"hsl(0, 60%,50%)", code:"MFG", name:"Medium Faded Gray" }
    { hex:"#666666", hsv:"hsv(0, 80%,100%)", hsl:"hsl(0,100%,60%)", code:"LHG", name:"Light Hard Gray" }
    { hex:"#555555", hsv:"hsv(0,100%, 80%)", hsl:"hsl(0,100%,40%)", code:"DHG", name:"Dark Hard Gray" }
    { hex:"#444444", hsv:"hsv(0,100%, 60%)", hsl:"hsl(0,100%,30%)", code:"DFG", name:"Dark Faded Gray" }
    { hex:"#777777", hsv:"hsv(0,100%, 50%)", hsl:"hsl(0,100%,50%)", code:"G",   name:"Gray" }
    { hex:"#333333", hsv:"hsv(0,100%, 40%)", hsl:"hsl(0,100%,20%)", code:"ODG", name:"Obscure Dull Gray" }
    { hex:"#222222", hsv:"hsv(0,100%, 20%)", hsl:"hsl(0,100%,10%)", code:"OWG", name:"Obscure Weak Gray" } ]

  @groups      = [@reds,@browns,@tans,@oranges,@yellows,@limes,@greens,@teals,@cyans,@azures,@blues,@violets,@magentas,@pinks,@grays]
  @groupRgbs   = [@redsMH,@orangesMH,@yellowsMH,@limesMH,@greensMH,@aquasMH,@cyansMH,@azuresMH,@bluesMH,@violetsMH,@magentasMH,@pinksMH]
  @groupRgbs10 = [@redsMH,@orangesMH,@yellowsMH,@limesMH,@greensMH,@aquasMH,@cyansMH,@azuresMH,@bluesMH,@violetsMH]

  @group12 = ['red','orange','yellow','lime','green','aqua','cyan','teal','blue','violet','magenta','pink']

  @toGroup:( h ) ->
    group = @reds
    group = @reds     if   0 <= h and h <=  15  # red
    group = @oranges  if  15 <  h and h <=  45  # orange
    group = @yellows  if  45 <  h and h <=  75  # yellow
    group = @limes    if  75 <  h and h <= 105  # lime
    group = @greens   if 105 <  h and h <= 135  # green
    group = @teals    if 135 <  h and h <= 165  # teal
    group = @cyans    if 165 <  h and h <= 195  # cyan
    group = @azures   if 195 <  h and h <= 225  # azure
    group = @blues    if 225 <  h and h <= 255  # blue
    group = @violets  if 255 <  h and h <= 285  # violet
    group = @magentas if 285 <  h and h <= 315  # magenta
    group = @pinks    if 315 <  h and h <= 345  # pink
    group = @reds     if 345 <  h and h <= 360  # red
    group

  @toIndex:( h ) ->
    index =  0
    index =  0 if   0 <= h and h <=  15  # red
    index =  1 if  15 <  h and h <=  45  # orange
    index =  2 if  45 <  h and h <=  75  # yellow
    index =  3 if  75 <  h and h <= 105  # lime
    index =  4 if 105 <  h and h <= 135  # green
    index =  5 if 135 <  h and h <= 165  # teal
    index =  6 if 165 <  h and h <= 195  # cyan
    index =  7 if 195 <  h and h <= 225  # azure
    index =  8 if 225 <  h and h <= 255  # blue
    index =  9 if 255 <  h and h <= 285  # violet
    index = 10 if 285 <  h and h <= 315  # magenta
    index = 11 if 315 <  h and h <= 345  # pink
    index =  0 if 345 <  h and h <= 360  # red
    index

  @scales:() ->
    scs = []
    for group in @groupRgbs10
      colors = []
      len = group.length
      for j in [0...len]
        colors.push( group[len-1-j].hex )
      scs.push( chroma.scale( colors ) )
    scs

  @Brewer = {
    OrRd: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'],
    PuBu: ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'],
    BuPu: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'],
    Oranges: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
    BuGn: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'],
    YlOrBr: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'],
    YlGn: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'],
    Reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
    RdPu: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'],
    Greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
    YlGnBu: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
    Purples: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
    GnBu: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'],
    Greys: ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'],
    YlOrRd: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
    PuRd: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'],
    Blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
    PuBuGn: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'],
    Spectral: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
    RdYlGn: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'],
    RdBu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
    PiYG: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'],
    PRGn: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'],
    RdYlBu: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
    BrBG: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
    RdGy: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'],
    PuOr: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],
    Set2: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
    Accent: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'],
    Set1: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'],
    Set3: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'],
    Dark2: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'],
    Paired: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
    Pastel2: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'],
    Pastel1: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2']
  }

  @BrewerRainbow = ['OrRd','Oranges','YlOrBr','YlGn','Greens','GnBu','BuGn','PuBuGn','Blues','Purples','RdPu','PuRd','OrRd']

`export default Palettes`