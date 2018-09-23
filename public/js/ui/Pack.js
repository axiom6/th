import Util    from '../util/Util.js';
import UI      from '../ui/UI.js';
import Pane    from '../ui/Pane.js';
var Pack;

Pack = class Pack extends Pane {
  constructor(ui, stream, view, spec, panes) {
    super(ui, stream, view, spec);
    this.panes = panes;
    this.margin = this.view.margin;
    this.icon = this.spec.icon;
    this.css = Util.isStr(this.spec.css) ? this.spec.css : 'ui-pack';
    this.$ = UI.$empty;
  }

  id(name, ext) {
    return this.ui.htmlId(name + 'Pack', ext);
  }

  ready() {
    var select;
    this.htmlId = this.id(this.name, 'Pack');
    this.$icon = this.createIcon();
    this.view.$view.append(this.$icon);
    select = UI.toTopic(this.name, 'Pack', this.spec.intent);
    return this.stream.publish('Select', select, this.$icon, 'click');
  }

  static show() {
    var i, len, pane, ref, results;
    super.show();
    ref = this.panes;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      pane = ref[i];
      results.push(pane.show());
    }
    return results;
  }

  static hide() {
    var i, len, pane, ref, results;
    super.hide();
    ref = this.panes;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      pane = ref[i];
      results.push(pane.hide());
    }
    return results;
  }

  createIcon() {
    var $icon, height, htm, left, top, width;
    htm = this.htmIconName(this.spec);
    $icon = $(htm);
    [left, top, width, height] = this.positionIcon(this.spec);
    $icon.css({
      left: this.xs(left),
      top: this.ys(top),
      width: this.pc(width),
      height: this.pc(height)
    });
    return $icon;
  }

  htmIconName(spec) {
    var htm;
    htm = `<div  id="${this.id(spec.name, 'Icon')}" class="${this.css}-icon" style="display:table; font-size:1.2em;">`;
    if (spec.icon) {
      htm += `<i class="fa ${spec.icon} fa-lg"></i>`;
    }
    htm += spec.css === 'ikw-col' ? this.htmColName(spec) : this.htmRowName(spec);
    return htm += "</div>";
  }

  htmColName(spec) {
    return `<span style="display:table-cell; vertical-align:middle; padding-left:12px;">${Util.toName(spec.name)}</span>`;
  }

  htmRowName(spec) {
    return `<div style="display:table-cell; vertical-align:middle; padding-left:12px;">${Util.toName(spec.name)}</div>`;
  }

  positionIcon(spec) {
    var w;
    w = spec.w != null ? spec.w * this.wscale * 0.5 : 100 * this.wscale * 0.5; // Calulation does not make sense but it works
    //Util.log( 'Pack.positionIcon', @left, @width, w, @xcenter( @left, @width, w ) ) if spec.intent is ub.SelectCol
    switch (spec.intent) {
      case UI.SelectRow:
        return [-10, this.ycenter(this.top, this.height, this.margin.west), 12, this.margin.west];
      case UI.SelectCol:
        return [this.xcenter(this.left, this.width, w), 0, this.margin.north, this.margin.north];
      case UI.SelectPack:
        return [this.xcenter(this.left, this.width, w), 0, this.margin.north, this.margin.north];
      default:
        return this.positionPackIcon();
    }
  }

  positionPack() {
    var height, left, top, width;
    [left, top, width, height] = this.view.positionPack(this.cells, this.spec);
    return this.$.css({
      left: this.xs(left),
      top: this.ys(top),
      width: this.xs(width),
      height: this.ys(height) // , 'background-color':fill } )
    });
  }

  positionPackIcon() {
    var height, left, top, width;
    [left, top, width, height] = this.view.positionPack(this.cells, this.spec);
    return [left + 20, top + 20, 20, 20];
  }

  animateIcon($icon) {
    var height, left, top, width;
    [left, top, width, height] = this.positionIcon();
    return $icon.animate({
      left: this.xs(left),
      top: this.ys(top),
      width: this.pc(width),
      height: this.pc(height)
    });
  }

  unionPanes() {
    var gpanes, i, ig, ip, jg, jp, len, mg, mp, ng, np, pane, ref;
    gpanes = [];
    [jg, mg, ig, ng] = UI.jmin(this.cells);
    ref = this.view.panes;
    for (i = 0, len = ref.length; i < len; i++) {
      pane = ref[i];
      [jp, mp, ip, np] = UI.jmin(pane.cells);
      if (jg <= jp && jp + mp <= jg + mg && ig <= ip && ip + np <= ig + ng) {
        gpanes.push(pane);
      }
    }
    return gpanes;
  }

  // Not used
  fillPanes() {
    var fill, i, len, pane, ref;
    fill = this.spec['hsv'] != null ? Vis.toRgbHsvStr(this.spec['hsv']) : "#888888";
    ref = this.panes;
    for (i = 0, len = ref.length; i < len; i++) {
      pane = ref[i];
      pane.$.css({
        'background-color': fill
      });
    }
  }

  animate(left, top, width, height, parent = null, callback = null) {
    this.$.animate({
      left: this.pc(left),
      top: this.pc(top),
      width: this.pc(width),
      height: this.pc(height)
    }, this.speed, () => {
      if (callback != null) {
        return callback(this);
      }
    });
  }

};

export default Pack;
