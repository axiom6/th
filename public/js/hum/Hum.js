import Util     from '../util/Util.js';
import Stream   from '../util/Stream.js';
import UI       from '../ui/UI.js';
import Vis      from '../vis/Vis.js';
var Hum;

Hum = class Hum {
  static init() {
    Util.ready(function() {
      var hum, infoSpec, stream, subjects;
      subjects = ["Ready", "Select", "Test"];
      infoSpec = {
        subscribe: true,
        publish: true,
        subjects: subjects
      };
      stream = new Stream(subjects, infoSpec);
      hum = new Hum(stream);
      hum.ready();
    });
    return;
    return {
      constructor: function(stream1) {
        this.stream = stream1;
      },
      ready: function() {}
    };
  }

};

Hum.init();

export default Hum;
