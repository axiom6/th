var Build,
  hasProp = {}.hasOwnProperty;

Build = (function() {
  class Build {
    constructor(batch) {
      this.batch = batch;
      this.Muse = this.batch.Muse.data;
      this.None = {
        name: 'None'
      };
      this.Rows = this.toRows(this.Muse.Rows);
      this.Columns = this.toColumns(this.Muse.Columns);
      this.Planes = this.createPlanes(this.Muse.Planes);
    }

    //@logAdjacentPractices()
    createPlanes(planes) {
      var key, obj, prac, practice, ref, ref1;
      ref = this.batch;
      for (key in ref) {
        obj = ref[key];
        if (!(key !== 'Muse' && key !== 'Font')) {
          continue;
        }
        planes[key]['practices'] = {};
        ref1 = obj.data;
        for (prac in ref1) {
          practice = ref1[prac];
          planes[key]['practices'][prac] = practice;
        }
      }
      return planes;
    }

    combine() {
      var arg, i, key, len, obj, val;
      obj = {};
      for (i = 0, len = arguments.length; i < len; i++) {
        arg = arguments[i];
        for (key in arg) {
          if (!hasProp.call(arg, key)) continue;
          val = arg[key];
          obj[key] = val;
        }
      }
      return obj;
    }

    logMuse() {
      console.log('------ Beg Muse ------');
      console.log("Plns: ", Build.Muse.Planes);
      console.log("Rows: ", Build.Muse.Rows);
      console.log("Cols: ", Build.Muse.Columns);
      return console.log('------ End Muse  ------');
    }

    toRows(rows) {
      var key, row;
      for (key in rows) {
        row = rows[key];
        row['key'] = key;
        row['name'] = row.name != null ? row.name : key;
        if (row['quels'] != null) {
          row['cells'] = this.toCells(row['quels']);
        }
      }
      return rows;
    }

    toColumns(cols) {
      var col, key;
      for (key in cols) {
        col = cols[key];
        col['key'] = key;
        col['name'] = col.name != null ? col.name : key;
        if (col['quels'] != null) {
          col['cells'] = this.toCells(col['quels']);
        }
      }
      return cols;
    }

    // Not used now. Use when you want to specify group in Muse.json
    toGroups(groups) {
      var group, key;
      for (key in groups) {
        group = groups[key];
        group['key'] = key;
        group['name'] = group.name != null ? group.name : key;
        if (group['quels'] != null) {
          group['cells'] = this.toCells(group['quels']);
        }
        group['border'] = group['border'] != null ? group['border'] : '0';
      }
      return groups;
    }

    notContext(key) {
      return key !== '@context';
    }

    toArray(objects) {
      var array, key, obj;
      array = [];
      for (key in objects) {
        if (!hasProp.call(objects, key)) continue;
        obj = objects[key];
        obj['id'] = key;
        array.push(obj);
      }
      return array;
    }

    getPractices(name) {
      var key, plane, ref;
      ref = this.Planes;
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        plane = ref[key];
        if (plane.name === name) {
          return this.Planes[key].practices;
        }
      }
      console.error('Build.getPractices(name) unknown plane with', name, 'returning Info practices');
      return this.Planes['Info'].practices;
    }

    getPractice(plane, row, column) {
      var key, practice, practices;
      practices = this.getPractices(plane);
      for (key in practices) {
        if (!hasProp.call(practices, key)) continue;
        practice = practices[key];
        if (practice.column === column && practice.row === row) {
          return practice;
        }
      }
      console.error('Build.getPractice() practice not found for', {
        plane: plane,
        column: column,
        row: row
      });
      return {};
    }

    getStudies(planeName, practiceName) {
      var practices;
      practices = this.getPractices(planeName);
      if (practices[practiceName] != null) {
        return practices[practiceName].studies;
      } else {
        console.error('Build.getStudies(ikw,practice) unknown practice', practice, 'returning Collaborate studies');
        return practices['Collaborate'].studies;
      }
    }

    planeKey(planeName) {
      var key;
      key = Build.Keys[planeName];
      if (key != null) {
        return key;
      } else {
        return 'Info';
      }
    }

    adjacentPractice(practice, dir) {
      var col, key, plane, pln, plnKey, prac, practices, ref, row;
      if ((practice == null) || (practice.name == null) || practice.name === 'None' || (practice.column == null)) {
        return this.None;
      }
      plnKey = Build.Keys[practice.plane];
      [col, row, pln] = (function() {
        switch (dir) {
          case 'west':
            return [this.Columns[practice.column].west, practice.row, practice.plane];
          case 'east':
            return [this.Columns[practice.column].east, practice.row, practice.plane];
          case 'north':
            return [practice.column, this.Rows[practice.row].north, practice.plane];
          case 'south':
            return [practice.column, this.Rows[practice.row].south, practice.plane];
          case 'prev':
            return [practice.column, practice.row, this.Planes[plnKey].prev];
          case 'next':
            return [practice.column, practice.row, this.Planes[plnKey].next];
          default:
            return ["", "", ""];
        }
      }).call(this);
      if ([col, row, pln] === ["", "", ""]) {
        //console.log( 'Build.adjacentPractice() [col,row,pln]', practice.name, dir, col,row,pln )
        return this.None;
      }
      ref = this.Planes;
      for (key in ref) {
        plane = ref[key];
        practices = this.Planes[key].practices;
        for (key in practices) {
          if (!hasProp.call(practices, key)) continue;
          prac = practices[key];
          if (prac.column === col && prac.row === row && prac.plane === pln) {
            return prac;
          }
        }
      }
      return this.None;
    }

    adjacentStudies(practice, dir) {
      var adjPrac;
      adjPrac = this.adjacentPractice(practice, dir);
      if (adjPrac.name !== 'None' && (adjPrac.studies != null)) {
        return adjPrac.studies;
      } else {
        return {};
      }
    }

    logAdjacentPractices() {
      var adj, name, pkey, plane, practice, ref, ref1;
      ref = this.Planes;
      for (pkey in ref) {
        if (!hasProp.call(ref, pkey)) continue;
        plane = ref[pkey];
        ref1 = plane.practices;
        for (name in ref1) {
          if (!hasProp.call(ref1, name)) continue;
          practice = ref1[name];
          adj = this.findAdjacents(practice);
          console.log('Build.logAdjacentPractices()', adj);
        }
      }
    }

    connectName(practice, dir) {
      var adjacent;
      adjacent = this.adjacentPractice(practice, dir);
      if (adjacent.name !== 'None') {
        return [practice.name, adjacent.name];
      } else {
        return ['None', 'None'];
      }
    }

    findAdjacents(practice) {
      var adj;
      adj = {};
      adj.name = practice.name;
      adj.col = practice.column;
      adj.row = practice.row;
      adj.plane = practice.plane;
      adj.west = this.adjacentPractice(practice, 'west').name;
      adj.east = this.adjacentPractice(practice, 'east').name;
      adj.north = this.adjacentPractice(practice, 'north').name;
      adj.south = this.adjacentPractice(practice, 'south').name;
      adj.prev = this.adjacentPractice(practice, 'prev').name;
      adj.next = this.adjacentPractice(practice, 'next').name;
      return adj;
    }

  };

  Build.Keys = {
    Information: 'Info',
    Knowledge: 'Know',
    Wisdom: 'Wise'
  };

  return Build;

}).call(this);

export default Build;
