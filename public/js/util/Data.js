import Util from '../util/Util.js';
var Data,
  hasProp = {}.hasOwnProperty;

Data = (function() {
  class Data {
    // ---- Read JSON with batch async
    static batchRead(batch, callback) {
      var key, obj;
      for (key in batch) {
        if (!hasProp.call(batch, key)) continue;
        obj = batch[key];
        this.batchJSON(obj, batch, callback);
      }
    }

    static batchComplete(batch) {
      var key, obj;
      for (key in batch) {
        if (!hasProp.call(batch, key)) continue;
        obj = batch[key];
        if (!obj['data']) {
          return false;
        }
      }
      return true;
    }

    static batchJSON(obj, batch, callback) {
      var settings, url;
      if (Util.jQueryHasNotBeenLoaded()) {
        return;
      }
      url = Data.baseUrl() + obj.url;
      settings = {
        url: url,
        type: 'GET',
        dataType: 'json',
        processData: false,
        contentType: 'application/json',
        accepts: 'application/json'
      };
      settings.success = (data, status, jqXHR) => {
        Util.noop(status, jqXHR);
        obj['data'] = obj.isPrac ? Data.createPracs(data) : data;
        if (Data.batchComplete(batch)) {
          return callback(batch);
        }
      };
      settings.error = (jqXHR, status, error) => {
        Util.noop(jqXHR);
        return console.error("Data.batchJSON()", {
          url: url,
          status: status,
          error: error
        });
      };
      $.ajax(settings);
    }

    static baseUrl() {
      if (window.location.href.includes('localhost')) {
        return Data.local;
      } else {
        return Data.hosted;
      }
    }

    static asyncJSON(url, callback) {
      var settings;
      if (Util.jQueryHasNotBeenLoaded()) {
        return;
      }
      url = Data.baseUrl() + url;
      settings = {
        url: url,
        type: 'GET',
        dataType: 'json',
        processData: false,
        contentType: 'application/json',
        accepts: 'application/json'
      };
      settings.success = (data, status, jqXHR) => {
        Util.noop(status, jqXHR);
        return callback(data);
      };
      settings.error = (jqXHR, status, error) => {
        Util.noop(jqXHR);
        return console.error("Data.asyncJSON()", {
          url: url,
          status: status,
          error: error
        });
      };
      $.ajax(settings);
    }

    static syncJSON(path) {
      var jqxhr;
      if (Util.jQueryHasNotBeenLoaded()) {
        return {};
      }
      jqxhr = $.ajax({
        type: "GET",
        url: path,
        dataType: 'json',
        cache: false,
        async: false
      });
      return jqxhr['responseJSON'];
    }

    static pracJSON(path) {
      return Data.createPracs(Data.syncJSON(path));
    }

    static packJSON(path) {
      return Data.createPacks(Data.syncJSON(path));
    }

    
    // ---- Practices ----
    static createPracs(data) {
      var ikey, item, pkey, practice, skey, study, tkey, topic;
      for (pkey in data) {
        practice = data[pkey];
        if (!(Util.isChild(pkey))) {
          continue;
        }
        if (practice['name'] == null) {
          practice['name'] = pkey;
        }
        practice.studies = {};
        if (data.practices != null) {
          data.practices[pkey] = practice;
        }
        for (skey in practice) {
          study = practice[skey];
          if (!(Util.isChild(skey))) {
            continue;
          }
          if (study['name'] == null) {
            study['name'] = skey;
          }
          study.topics = {};
          practice.studies[skey] = study;
          for (tkey in study) {
            topic = study[tkey];
            if (!(Util.isChild(tkey))) {
              continue;
            }
            if (topic['name'] == null) {
              topic['name'] = tkey;
            }
            topic.items = {};
            study.topics[tkey] = topic;
            for (ikey in topic) {
              item = topic[ikey];
              if (!(Util.isChild(ikey))) {
                continue;
              }
              if (item['name'] == null) {
                item['name'] = ikey;
              }
              topic.items[ikey] = item;
            }
          }
        }
      }
      return data;
    }

    static createPacks(data) {
      var gkey, pack;
      for (gkey in data) {
        pack = data[gkey];
        if (!(Util.isChild(gkey))) {
          continue;
        }
        pack['name'] = gkey;
        data[gkey] = pack;
        pack.practices = {};
        this.createPracs(pack);
      }
      return data;
    }

    // ------ Quick JSON read ------
    static read(url, doJson) {
      if (Util.isObj(url)) {
        Data.readFile(url, doJson);
      } else {
        Data.readAjax(url, doJson);
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

  Data.hosted = "https://ui-48413.firebaseapp.com/";

  Data.local = "http://localhost:63342/muse/public/";

  Data.localJSON = "http://localhost:63342/muse/public/json";

  // A quick in and out method to select JSON data
  /*Needs Store
  @selectJson:( stream, uri, table, doData ) ->
  rest = new Store.Rest( stream, uri )
  rest.remember()
  rest.select( table )
  rest.subscribe( table, 'none', 'select', doData )
  */
  Data.Databases = {
    color: {
      id: "color",
      key: "id",
      uriLoc: Data.localJSON + '/color',
      uriWeb: 'https://github.com/axiom6/ui/data/color',
      tables: ['master', 'ncs', 'gray']
    },
    exit: {
      id: "exit",
      key: "_id",
      uriLoc: Data.localJSON + '/exit',
      uriWeb: 'https://github.com/axiom6/ui/data/exit',
      tables: ['ConditionsEast', 'ConditionsWest', 'Deals', 'Forecasts', 'I70Mileposts', 'SegmentsEast', 'SegmentsWest']
    },
    radar: {
      id: "radar",
      key: "name",
      uriLoc: Data.localJSON + '/radar',
      uriWeb: 'https://github.com/axiom6/ui/data/radar',
      tables: ['axiom-techs', 'axiom-quads', 'axiom-techs-schema', 'axiom-quads-schema', 'polyglot-principles']
    },
    sankey: {
      id: "radar",
      uriLoc: Data.localJSON + '/sankey',
      uriWeb: 'https://github.com/axiom6/ui/data/sankey',
      tables: ['energy', 'flare', 'noob', 'plot']
    },
    muse: {
      id: "muse",
      uriLoc: Data.localJSON + '/muse',
      uriWeb: 'https://github.com/axiom6/ui/data/muse',
      tables: ['Columns', 'Rows', 'Practices']
    },
    pivot: {
      id: "pivot",
      uriLoc: Data.localJSON + '/pivot',
      uriWeb: 'https://github.com/axiom6/ui/data/pivot',
      tables: ['mps']
    },
    geo: {
      id: "geo",
      uriLoc: Data.localJSON + '/geo',
      uriWeb: 'https://github.com/axiom6/ui/data/geo',
      tables: ['upperLarimerGeo'],
      schemas: ['GeoJSON']
    },
    f6s: {
      id: "f6s",
      uriLoc: Data.localJSON + '/f6s',
      uriWeb: 'https://github.com/axiom6/ui/data/fs6',
      tables: ['applications', 'followers', 'mentors', 'profile', 'teams']
    }
  };

  return Data;

}).call(this);

export default Data;
