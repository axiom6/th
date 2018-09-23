import Util from '../util/Util.js';
import Vis  from '../vis/Vis.js';
import UI   from '../ui/UI.js';
import Icon from '../ui/Icon.js';
var Page,
  hasProp = {}.hasOwnProperty;

Page = class Page {
  constructor(stream, ui, name1) {
    this.ready = this.ready.bind(this);
    this.onContent = this.onContent.bind(this);
    this.stream = stream;
    this.ui = ui;
    this.name = name1;
    this.ui.addPage(this.name, this);
    this.pane = this.ui.view.getPane(this.name);
    this.spec = this.pane.spec;
    this.icon = this.spec.icon;
    this.contents = {
      Arrow: {},
      Texts: {},
      Graph: {},
      Icons: {},
      Pivot: {},
      Study: {},
      Icon: {},
      Ikw: {}
    };
    this.contenta = Object.keys(this.contents);
    this.cname = "Study";
    this.subscribe();
  }

  ready(cname) {
    var $c, content, empty;
    empty = Util.isObjEmpty(this.contents[cname]);
    //console.info('Page.ready()', { name:@name, cname:cname, empty:empty } ) if @stream.isInfo('Content')
    content = this.ui.createContent(this.pane, this, cname);
    $c = content.ready();
    content.layout();
    this.contents[cname] = content;
    this.cname = cname;
    return $c;
  }

  createContent(cname) {
    Util.noop(cname);
    return new Icon(this.stream, this.ui, this.pane, this);
  }

  subscribe() {
    this.stream.subscribe('Content', 'Page' + this.name, (content) => {
      return this.onContent(content);
    });
  }

  onContent(content) {
    var app, cname, empty;
    cname = Util.inArray(this.contenta, content.intent) ? content.intent : this.cname;
    empty = Util.isObjEmpty(this.contents[cname]);
    if (this.stream.isInfo('Content')) {
      console.info('Page.onContent()', {
        name: this.name,
        cname: cname,
        empty: empty,
        content: content
      });
    }
    if (this.ui.isElem(this.contents[this.cname].$)) {
      this.contents[this.cname].$.hide();
    }
    if (empty) {
      this.pane.$.append(this.ready(cname));
    } else {
      if (cname === 'Study' && this.cname === 'Study') {
        this.contents['Study'].intent(content.intent);
      }
      app = this.contents[cname];
      app.layout();
      if (this.ui.isElem(app.$)) {
        app.$.show();
      }
      this.cname = cname;
    }
  }

  getStudy(name) {
    var key, ref, study;
    ref = this.spec.studies;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      study = ref[key];
      if (name !== 'None') {
        if (key === name) {
          return study;
        }
      }
    }
    return 'None';
  }

  publish($on) {
    var select;
    if (this.ui.isElem($on)) {
      select = UI.toTopic(this.name, 'Page', UI.SelectPane);
      this.stream.publish('Select', select, $on, 'click');
    }
  }

  publishJQueryObjects(objects, intent) {
    var $object, name, select;
    if (true) {
      return;
    }
    for (name in objects) {
      $object = objects[name];
      if (!(this.ui.isElem($object))) {
        continue;
      }
      select = UI.toTopic(this.name, 'Page', intent);
      if (this.stream.isInfo('Select')) {
        console.info('Page.publishJQueryObjects()');
      }
      this.stream.publish('Select', select, $object, 'click');
    }
  }

};

export default Page;
