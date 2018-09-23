import Util from '../util/Util.js';
import UI   from '../ui/UI.js';
var Tocs,
  hasProp = {}.hasOwnProperty;

Tocs = (function() {
  class Tocs {
    constructor(ui, stream, practices1) {
      this.onSelect = this.onSelect.bind(this);
      this.ui = ui;
      this.stream = stream;
      this.practices = practices1;
      [this.specs, this.stack] = this.createTocsSpecs(this.practices);
      //@infoSpecs() #
      this.htmlIdApp = this.ui.getHtmlId('Tocs', '');
      this.classPrefix = Util.isStr(this.practices.css) ? this.practices.css : 'tocs';
      this.last = this.specs[0];
      this.speed = 400;
    }

    createTocsSpecs(practices) {
      var hasChild, keyPrac, keyStudy, practice, spec0, specN, specs, stack, study;
      spec0 = {
        level: 0,
        name: "Beg",
        hasChild: true
      };
      stack = new Array(Tocs.MaxTocLevel);
      stack[0] = spec0;
      specs = [];
      specs.push(spec0);
      for (keyPrac in practices) {
        if (!hasProp.call(practices, keyPrac)) continue;
        practice = practices[keyPrac];
        if (!(UI.isChild(keyPrac))) {
          continue;
        }
        hasChild = this.hasChild(practice);
        this.enrichSpec(keyPrac, practice, specs, 1, spec0, hasChild, true);
        for (keyStudy in practice) {
          if (!hasProp.call(practice, keyStudy)) continue;
          study = practice[keyStudy];
          if (hasChild && UI.isChild(keyStudy)) {
            this.enrichSpec(keyStudy, study, specs, 2, practice, false, false);
          }
        }
      }
      specN = {
        level: 0,
        name: "End",
        hasChild: false
      };
      specs.push(specN);
      return [specs, stack];
    }

    hasChild(spec) {
      var child, key;
      for (key in spec) {
        if (!hasProp.call(spec, key)) continue;
        child = spec[key];
        if (UI.isChild(key)) {
          return true;
        }
      }
      return false;
    }

    infoSpecs() {
      var j, len, ref, spec;
      ref = this.specs;
      for (j = 0, len = ref.length; j < len; j++) {
        spec = ref[j];
        console.info('Tocs.spec', Util.indent(spec.level * 2), spec.name, spec.hasChild);
      }
    }

    enrichSpec(key, spec, specs, level, parent, hasChild, isRow) {
      //console.log( 'Tocs', key, spec )
      spec.level = level;
      spec.parent = parent;
      spec.name = spec.name != null ? spec.name : key; // Need to learn why this is needed
      spec.on = false;
      spec.hasChild = hasChild;
      spec.isRow = isRow;
      specs.push(spec);
    }

    ready() {
      var j, len, ref, select, spec;
      this.$tocs = $(this.html());
      this.$tocp = $('#' + this.htmlIdApp);
      this.$tocp.append(this.$tocs);
      ref = this.specs;
      for (j = 0, len = ref.length; j < len; j++) {
        spec = ref[j];
        if (!(spec.level > 0)) {
          continue;
        }
        spec.$elem = spec.hasChild ? $('#' + spec.ulId) : $('#' + spec.liId);
        spec.$li = $('#' + spec.liId);
        select = this.toSelect(spec);
        this.stream.publish('Select', select, spec.$li, 'click', spec.liId);
      }
      this.subscribe();
    }

    toSelect(spec) {
      var intent;
      if (spec.level === 2) { // Study
        return UI.toTopic(spec.parent.name, 'Tocs', UI.SelectStudy, spec.parent[spec.name]);
      } else {
        intent = spec.name === 'View' ? UI.SelectView : UI.SelectPane;
        return UI.toTopic(spec.name, 'Tocs', intent);
      }
    }

    subscribe() {
      this.stream.subscribe('Select', 'Tocs', (select) => {
        return this.onSelect(select);
      });
    }

    htmlId(spec, ext = '') {
      var suffix;
      suffix = spec.parent != null ? ext + spec.parent.name : ext;
      return this.ui.htmlId(spec.name, 'Tocs', suffix);
    }

    getSpec(select, issueError = true) {
      var j, len, ref, spec;
      ref = this.specs;
      for (j = 0, len = ref.length; j < len; j++) {
        spec = ref[j];
        if (spec.name === select.name) {
          return spec;
        }
      }
      if (issueError && this.nameNotOk(select.name)) {
        console.error('Tocs.getSpec(id) spec null for select', select);
        this.infoSpecs();
      }
      return null;
    }

    nameNotOk(name) {
      var j, len, okName, okNames;
      okNames = ['None', 'View', 'Embrace', 'Innovate', 'Encourage', 'Learn', 'Do', 'Share'];
      for (j = 0, len = okNames.length; j < len; j++) {
        okName = okNames[j];
        if (name === okName) {
          return false;
        }
      }
      return true;
    }

    html() {
      var htm, i, j, ref;
      this.specs[0].ulId = this.htmlId(this.specs[0], 'UL');
      htm = `<ul class="${this.classPrefix}ul0" id="${this.specs[0].ulId}">`;
      for (i = j = 1, ref = this.specs.length; (1 <= ref ? j < ref : j > ref); i = 1 <= ref ? ++j : --j) {
        htm += this.process(i);
      }
      return htm;
    }

    show() {
      this.$tocs.show();
    }

    hide() {
      this.$tocs.hide();
    }

    process(i) {
      var htm, j, level, prev, ref, ref1, spec;
      htm = "";
      prev = this.specs[i - 1];
      spec = this.specs[i];
      if (spec.level >= prev.level) {
        htm += this.htmlBeg(spec);
        this.stack[spec.level] = spec;
      } else {
        for (level = j = ref = prev.level, ref1 = spec.level; (ref <= ref1 ? j <= ref1 : j >= ref1); level = ref <= ref1 ? ++j : --j) {
          if (this.stack[level] != null) {
            htm += this.htmlEnd(this.stack[level]);
          }
        }
        if (i < this.specs.length - 1) {
          htm += this.htmlBeg(spec);
        }
      }
      return htm;
    }

    htmlBeg(spec) {
      var htm;
      spec.liId = this.htmlId(spec, 'LI');
      spec.ulId = this.htmlId(spec, 'UL');
      //console.log( 'Tocs htmlBeg()', spec.id, spec.liId, spec.ulId )
      htm = `<li class="${this.classPrefix}li${spec.level}" id="${spec.liId}" >`;
      htm += `${this.htmIconName(spec)}`;
      if (spec.hasChild) {
        htm += `<ul class="${this.classPrefix}ul${spec.level}" id="${spec.ulId}">`;
      }
      return htm;
    }

    htmIconName(spec) {
      var htm;
      htm = "<div style=\"display:table;\">";
      if (spec.icon) {
        htm += `<i class="fa ${spec.icon} fa-lg"></i>`;
      }
      htm += `<span style="display:table-cell; vertical-align:middle; padding-left:12px;">${Util.toName(spec.name)}</span>`;
      return htm += "</div>";
    }

    htmlEnd(spec) {
      if (spec.level === 0) {
        return "</ul>";
      } else if (spec.hasChild) {
        return "</ul></li>";
      } else {
        return "</li>";
      }
    }

    onSelect(select) {
      var spec;
      UI.verifyTopic(select, 'Tocs');
      spec = this.getSpec(select, true); // spec null ok not all Tocs available for views
      if (spec != null) {
        this.update(spec);
      } else if (select.name === 'View' && (this.last != null)) {
        this.reveal(this.last);
        this.last = this.specs[0];
      }
    }

    update(spec) {
      var j, k, l, last, level, ref, ref1, ref2;
      this.stack[spec.level] = spec;
// Build stack to turn on spec levels
      for (level = j = ref = spec.level; j >= 2; level = j += -1) {
        this.stack[level - 1] = this.stack[level].parent;
      }
      last = this.last;
// Turn off items that are different or below level
      for (level = k = ref1 = this.last.level; k >= 1; level = k += -1) {
        if (last.name !== this.stack[level].name || level > spec.level) {
          this.reveal(last);
        }
        last = last.parent;
      }
// Turn  on  items in the spec stack
      for (level = l = 1, ref2 = spec.level; l <= ref2; level = l += 1) {
        if (!this.stack[level].on) {
          this.reveal(this.stack[level]);
        }
      }
      this.last = spec;
    }

    reveal(spec) {
      spec.on = !spec.on;
      if (spec.level === 0) {
        return;
      }
      if (spec.hasChild) {
        spec.$elem.toggle(this.speed);
      } else {
        spec.$elem.css({
          color: spec.on ? '#FFFF00' : '#FFFFFF'
        });
      }
    }

  };

  Tocs.MaxTocLevel = 12;

  return Tocs;

}).call(this);

export default Tocs;
