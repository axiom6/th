
class Build

  Build.Keys = { Information:'Info', Knowledge:'Know', Wisdom:'Wise' }

  constructor:( @batch ) ->
    @Muse    = @batch.Muse.data
    @None    = { name:'None' }
    @Rows    = @toRows(       @Muse.Rows    )
    @Columns = @toColumns(    @Muse.Columns )
    @Planes  = @createPlanes( @Muse.Planes  )
    #@logAdjacentPractices()

  createPlanes:( planes ) ->
    for key, obj of @batch when obj.type isnt 'Spec'
      planes[key]['practices'] = obj.data[key]
    # console.log( 'Build.createPlanes()', planes )
    planes

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

  getPractices:( name ) ->
    key = if Build.Keys[name]? then Build.Keys[name] else name
    @Planes[key].practices

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
