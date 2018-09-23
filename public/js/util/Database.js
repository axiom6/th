import Util from '../util/Util.js';
var Database;

Database = (function() {
  class Database {
    constructor() {
      this.dummy = "";
    }

    //nodejDataURI = 'file:../../data'
    static dataURI() {
      if (Util.isCommonJS) {
        return Database.nodejDataURI;
      } else {
        return Database.localDataURI;
      }
    }

    // ------ Quick JSON access ------
    static read(url, doJson) {
      if (Util.isObj(url)) {
        Database.readFile(url, doJson);
      } else if ('file:' === Util.parseURI(url).protocol) {
        Database.readRequire(url, doJson);
      } else {
        Database.readAjax(url, doJson);
      }
    }

    static readFile(fileObj, doJson) {
      var fileReader;
      fileReader = new FileReader();
      fileReader.onerror = function(e) {
        return console.error('Store.readFile', fileObj.name, e.target.error);
      };
      fileReader.onload = function(e) {
        return doJson(JSON.parse(e.target.result));
      };
      fileReader.readAsText(fileObj);
    }

    static readRequire(url, doJson) {
      var json, path;
      path = url.substring(5);
      json = Util.require(path); // Util.require prevents dynamic resolve in webpack
      if (json != null) {
        doJson(json);
      } else {
        console.error('Store.req require(json)  failed for url', url);
      }
    }

    static readAjax(url, doJson) { //jsonp
      var settings;
      settings = {
        url: url,
        type: 'get',
        dataType: 'json',
        processData: false,
        contentType: 'application/json',
        accepts: 'application/json'
      };
      settings.success = (data, status, jqXHR) => {
        var json;
        Util.noop(status, jqXHR);
        json = JSON.parse(data);
        return doJson(json);
      };
      settings.error = (jqXHR, status, error) => {
        return console.error('Store.ajaxGet', {
          url: url,
          status: status,
          error: error
        });
      };
      $.ajax(settings);
    }

  };

  Database.localImageURI = 'http://localhost:63342/ui/img/aaa';

  Database.localDataURI = 'http://localhost:63342/ui/data';

  Database.nodejDataURI = 'file://Users/ax/Documents/prj/ui/data';

  Database.fileURI = '/Users/ax/Documents/prj/ui/data';

  Database.Databases = {
    color: {
      id: "color",
      key: "id",
      uriLoc: Database.localDataURI + '/color',
      uriWeb: 'https://github.com/axiom6/ui/data/color',
      tables: ['master', 'ncs', 'gray']
    },
    exit: {
      id: "exit",
      key: "_id",
      uriLoc: Database.localDataURI + '/exit',
      uriWeb: 'https://github.com/axiom6/ui/data/exit',
      tables: ['ConditionsEast', 'ConditionsWest', 'Deals', 'Forecasts', 'I70Mileposts', 'SegmentsEast', 'SegmentsWest']
    },
    radar: {
      id: "radar",
      key: "name",
      uriLoc: Database.localDataURI + '/radar',
      uriWeb: 'https://github.com/axiom6/ui/data/radar',
      tables: ['axiom-techs', 'axiom-quads', 'axiom-techs-schema', 'axiom-quads-schema', 'polyglot-principles']
    },
    sankey: {
      id: "radar",
      uriLoc: Database.localDataURI + '/sankey',
      uriWeb: 'https://github.com/axiom6/ui/data/sankey',
      tables: ['energy', 'flare', 'noob', 'plot']
    },
    muse: {
      id: "muse",
      uriLoc: Database.localDataURI + '/muse',
      uriWeb: 'https://github.com/axiom6/ui/data/muse',
      tables: ['Columns', 'Rows', 'Practices']
    },
    pivot: {
      id: "pivot",
      uriLoc: Database.localDataURI + '/pivot',
      uriWeb: 'https://github.com/axiom6/ui/data/pivot',
      tables: ['mps']
    },
    geo: {
      id: "geo",
      uriLoc: Database.localDataURI + '/geo',
      uriWeb: 'https://github.com/axiom6/ui/data/geo',
      tables: ['upperLarimerGeo'],
      schemas: ['GeoJSON']
    },
    f6s: {
      id: "f6s",
      uriLoc: Database.localDataURI + '/f6s',
      uriWeb: 'https://github.com/axiom6/ui/data/fs6',
      tables: ['applications', 'followers', 'mentors', 'profile', 'teams']
    }
  };

  return Database;

}).call(this);

// A quick in and out method to select JSON data
/*Needs Store
@selectJson:( stream, uri, table, doData ) ->
rest = new Store.Rest( stream, uri )
rest.remember()
rest.select( table )
rest.subscribe( table, 'none', 'select', doData )
*/
export default Database;
