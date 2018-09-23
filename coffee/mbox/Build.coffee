
class Build

  Build.Muse = Build.syncJSON( 'json/Muse.json' )
  Build.Info = Build.syncJSON( 'json/Info.json' )
  Build.Augm = Build.syncJSON( 'json/Augm.json' )
  Build.Know = Build.syncJSON( 'json/Know.json' )
  Build.Wise = Build.syncJSON( 'json/Wise.json' )

  Build.Keys = { Information:'Info', Augment:'Augm', DataScience:'Data', Knowledge:'Know', Wisdom:'Wise', Hues:'Hues' }

  constructor:() ->
    @None       = { name:'None' }
    @Rows       = @toRows(       Build.Muse.Rows    )
    @Columns    = @toColumns(    Build.Muse.Columns )
    @Planes     = @createPlanes( Build.Muse.Planes  )
    #@logAdjacentPractices()

  @syncJSON:( path ) ->
   jqxhr = $.ajax( { type:"GET", url:path, dataType:'json', cache:false, async:false } )
   jqxhr['responseJSON']

  createPlanes:( planes ) ->
    for key, plane of planes
      plane['practices'] = @createPractices( key )
      # console.log( 'Build.createPlanes()', plane )
    planes

  isChild:( key ) ->
      a = key.charAt(0)
      a is a.toUpperCase()

  createPractices:( key ) ->
    practices    = {}
    for pkey, practice of Build[key] when @isChild(pkey)
      practice['name'] = pkey
      practice.studies = {}
      practices[practice.name] = practice # Use long form like Infomation instead of Info
      for skey, study of practice  when @isChild(skey)
        study['name']          = skey
        study.topics           = {}
        practice.studies[skey] = study
        for tkey, topic of study  when @isChild(tkey)
          topic['name']      = tkey
          topic.items        = {}
          study.topics[tkey] = topic
          for ikey, item of topic when @isChild(ikey)
            item['name']       = ikey
            topic.items[ikey]  = item
    practices

  combine:() ->
    obj = {}
    for arg in arguments
      for own key, val of arg
        obj[key] = val
    obj

  logMuse:() ->
    console.log( '------ Beg Muse ------' )
    console.log( "Plns: ", Build.Muse.Planes  )
    console.log( "Rows: ", Build.Muse.Rows    )
    console.log( "Cols: ", Build.Muse.Columns )
    console.log( '------ End Muse  ------' )

  toRows:( rows ) ->
    for key, row of rows
      row['key']     = key
      row['name']    = if row.name? then row.name else key
      row['cells']   = @toCells( row['quels'] ) if row['quels']?
    rows

  toColumns:( cols ) ->
    for key, col of cols
      col['key']     = key
      col['name']    = if col.name? then col.name else key
      col['cells']   = @toCells( col['quels'] ) if col['quels']?
    cols

  # Not used now. Use when you want to specify group in Muse.json
  toGroups:( groups ) ->
    for key, group of groups
      group['key']     = key
      group['name']    = if group.name? then group.name else key
      group['cells']   = @toCells( group['quels'] ) if group['quels']?
      group['border']  = if group['border']? then group['border'] else '0'
    groups

  notContext:( key ) ->
    key isnt '@context'

  toArray:( objects ) ->
    array = []
    for own key, obj of objects
      obj['id'] = key
      array.push( obj )
    array


  getPractices:(  name ) ->
    for own key, plane of @Planes
      return @Planes[key].practices if plane.name is name
    console.error( 'Build.getPractices(name) unknown plane with', name, 'returning Info practices' )
    @Planes['Info'].practices

  getPractice:( plane, row, column ) ->
    practices = @getPractices( plane )
    for own key, practice of practices when practice.column is column and practice.row is row
      return practice
    console.error( 'Build.getPractice() practice not found for', { plane:plane, column:column, row:row } )
    {}

  getStudies:( planeName, practiceName ) ->
    practices = @getPractices(planeName)
    if practices[practiceName]?
       practices[practiceName].studies
    else
      console.error( 'Build.getStudies(ikw,practice) unknown practice', practice, 'returning Collaborate studies' )
      practices['Collaborate'].studies

  planeKey:( planeName ) ->
    key = Build.Keys[planeName]
    if key? then key else 'Info'

  adjacentPractice:( practice, dir ) ->
    return @None if not practice? or not practice.name? or practice.name is 'None' or not practice.column?

    plnKey = Build.Keys[practice.plane]

    [col,row,pln] = switch dir
      when 'west'  then [@Columns[practice.column].west, practice.row, practice.plane ]
      when 'east'  then [@Columns[practice.column].east, practice.row, practice.plane ]
      when 'north' then [practice.column, @Rows[practice.row].north,   practice.plane ]
      when 'south' then [practice.column, @Rows[practice.row].south,   practice.plane ]
      when 'prev'  then [practice.column, practice.row, @Planes[plnKey].prev ]
      when 'next'  then [practice.column, practice.row, @Planes[plnKey].next ]
      else              ["","",""]
    #console.log( 'Build.adjacentPractice() [col,row,pln]', practice.name, dir, col,row,pln )
    return @None if [col,row,pln] is ["","",""]
    for key, plane of @Planes
      practices = @Planes[key].practices
      for own key, prac of practices
        return prac if prac.column is col and prac.row is row and prac.plane is pln
    @None

  adjacentStudies:( practice, dir ) ->
    adjPrac = @adjacentPractice( practice, dir )
    if adjPrac.name isnt 'None' and adjPrac.studies? then adjPrac.studies else {}

  logAdjacentPractices:() ->
    for   own pkey, plane    of @Planes
      for own name, practice of plane.practices
        adj = @findAdjacents( practice )
        console.log( 'Build.logAdjacentPractices()', adj )
    return

  connectName:( practice, dir ) ->
    adjacent = @adjacentPractice( practice, dir )
    if adjacent.name isnt 'None' then [practice.name,adjacent.name] else ['None','None']

  findAdjacents:( practice ) ->
    adj = {}
    adj.name  = practice.name
    adj.col   = practice.column
    adj.row   = practice.row
    adj.plane = practice.plane
    adj.west  = @adjacentPractice( practice, 'west'  ).name
    adj.east  = @adjacentPractice( practice, 'east'  ).name
    adj.north = @adjacentPractice( practice, 'north' ).name
    adj.south = @adjacentPractice( practice, 'south' ).name
    adj.prev  = @adjacentPractice( practice, 'prev'  ).name
    adj.next  = @adjacentPractice( practice, 'next'  ).name
    adj

`export default Build`
