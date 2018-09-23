import Util from '../util/Util.js';
import UI   from '../ui/UI.js';
var Pane;

Pane = class Pane {
  constructor(ui, stream, view, spec) {
    var i, j, m, n;
    this.animateCall = this.animateCall.bind(this);
    this.onContent = this.onContent.bind(this);
    this.ui = ui;
    this.stream = stream;
    this.view = view;
    this.spec = spec;
    this.spec.pane = this;
    this.cells = this.spec.cells;
    [j, m, i, n] = this.view.jmin(this.cells);
    [this.left, this.top, this.width, this.height] = this.view.position(j, m, i, n, this.spec);
    this.name = this.spec.name;
    this.classPrefix = Util.isStr(this.spec.css) ? this.spec.css : 'ui-pane';
    this.$ = UI.$empty;
    this.wscale = this.view.wscale;
    this.hscale = this.view.hscale;
    this.margin = this.view.margin;
    this.speed = this.view.speed;
    this.geo = null; // reset by geom() when onContent() dispatches to page
  }

  ready() {
    this.htmlId = this.ui.htmlId(this.name, 'Pane');
    this.$ = this.createHtml();
    this.view.$view.append(this.$);
    this.hide();
    this.adjacentPanes();
    this.$.css(this.scaleReset());
    this.geo = this.geom();
    this.show();
  }

  geom() {
    var ex, geo, h, hi, hp, hv, i, j, m, n, r, s, sx, sy, w, wi, wp, wv, x0, y0;
    [j, m, i, n] = this.view.jmin(this.spec.cells);
    [wp, hp] = this.view.positionpx(j, m, i, n, this.spec); // Pane size in AllPage usually 3x3 View
    wi = this.$.innerWidth();
    hi = this.$.innerHeight();
    w = Math.max(wi, wp); // wp from positionpx
    h = Math.max(hi, hp); // hp from positionpx
    wv = this.view.wPanes();
    hv = this.view.hPanes();
    r = Math.min(w, h) * 0.2; // Use for hexagons
    x0 = w * 0.5;
    y0 = h * 0.5;
    sx = w / wp;
    sy = h / hp;
    s = Math.min(sx, sy);
    ex = wv * 0.9 < w && w < wv * 1.1;
    geo = {
      w: w,
      h: h,
      wi: wi,
      hi: hi,
      wp: wp,
      hp: hp,
      wv: wv,
      hv: hv,
      r: r,
      x0: x0,
      y0: y0,
      sx: sx,
      sy: sy,
      s: s,
      ex: ex
    };
    //console.log( 'Pane.geom()', @name, geo )
    if (wp === 0 || hp === 0) {
      console.error('Pane.geom()', {
        name: this.name,
        spec: this.spec,
        vw: this.view.widthpx(),
        vh: this.view.heightpx(),
        geo: geo
      });
      console.trace();
    }
    return geo;
  }

  // Converts a pane percent to vmin unit by determining the correct pane scaling factor
  toVmin(pc) {
    var sc;
    sc = this.view.widthpx() > this.view.heightpx() ? this.height : this.width;
    return Util.toFixed(sc * pc * 0.01, 2);
  }

  toVw(pc) {
    return Util.toFixed(this.width * pc * 0.01, 2);
  }

  toVh(pc) {
    return Util.toFixed(this.height * pc * 0.01, 2);
  }

  show() {
    this.$.show();
  }

  hide() {
    this.$.hide();
  }

  pc(v) {
    return this.view.pc(v);
  }

  xs(x) {
    return this.view.xs(x);
  }

  ys(y) {
    return this.view.ys(y);
  }

  xcenter(left, width, w, scale = 1.0, dx = 0) {
    return scale * (left + 0.5 * width - 11 + dx / this.wscale);
  }

  xcente2(left, width, w, scale = 1.0, dx = 0) {
    return scale * (left + 0.5 * width - 0.5 * w / this.wscale + dx / this.wscale);
  }

  ycenter(top, height, h, scale = 1.0, dy = 0) {
    return scale * (top + 0.5 * height - 0.5 * h / this.hscale + dy / this.hscale);
  }

  right(left, width, w, scale = 1.0, dx = 0) {
    return scale * (left + width - 0.5 * w / this.wscale + dx / this.wscale);
  }

  bottom(top, height, h, scale = 1.0, dy = 0) {
    return scale * (top + height - 0.5 * h / this.hscale + dy / this.hscale);
  }

  north(top, height, h, scale = 1.0, dy = 0) {
    return scale * (top - h + dy / this.hscale);
  }

  south(top, height, h, scale = 1.0, dy = 0) {
    return scale * (top + height + dy / this.hscale);
  }

  east(left, width, w, scale = 1.0, dx = 0) {
    return scale * (left + width + dx / this.wscale);
  }

  west(left, width, w, scale = 1.0, dx = 0) {
    return scale * (left - w + dx / this.wscale);
  }

  adjacentPanes() {
    var i, ip, j, jp, k, len, m, mp, n, np, pane, ref;
    [jp, mp, ip, np] = this.view.jmin(this.cells);
    [this.northPane, this.southPane, this.eastPane, this.westPane] = [UI.$empty, UI.$empty, UI.$empty, UI.$empty];
    ref = this.view.panes;
    for (k = 0, len = ref.length; k < len; k++) {
      pane = ref[k];
      [j, m, i, n] = this.view.jmin(pane.cells);
      if (j === jp && m === mp && i === ip - n) {
        this.northPane = pane;
      }
      if (j === jp && m === mp && i === ip + np) {
        this.southPane = pane;
      }
      if (i === ip && n === np && j === jp - m) {
        this.westPane = pane;
      }
      if (i === ip && n === np && j === jp + mp) {
        this.eastPane = pane;
      }
    }
  }

  createHtml() {
    var $p;
    $p = $(`<div id="${this.htmlId}" class="${this.classPrefix}"></div>`);
    this.navArrows($p);
    return $p;
  }

  doNav(event) {
    var name, select;
    name = $(event.target).attr('data-name');
    select = UI.toTopic(name, 'Pane.doNav()', UI.SelectPack);
    this.stream.publish('Select', select);
  }

  navArrows($p) {
    var fontvw, leftvw;
    fontvw = this.toVw(33) + 'vw';
    leftvw = '25%';
    if (this.spec['bak'] != null) {
      this.navIcon('bak', leftvw, fontvw, this.spec['bak'], $p);
    }
    if (this.spec['fwd'] != null) {
      this.navIcon('fwd', leftvw, fontvw, this.spec['fwd'], $p);
    }
    if (this.spec['top'] != null) {
      this.navIcon('top', leftvw, fontvw, this.spec['top'], $p);
    }
    if (this.spec['bot'] != null) {
      this.navIcon('bot', leftvw, fontvw, this.spec['bot'], $p);
    }
  }

  navIcon(loc, leftvw, fontvw, name, $p) {
    var $a;
    $a = (function() {
      switch (loc) {
        case 'bak':
          return $(`<i style="position:absolute; left:${leftvw}; top: 40%; font-size:${fontvw}; z-index:4;" class="arrow fas fa-arrow-alt-circle-left"  data-name="${name}"></i>`);
        case 'fwd':
          return $(`<i style="position:absolute; left:${leftvw}; top: 40%; font-size:${fontvw}; z-index:4;" class="arrow fas fa-arrow-alt-circle-right" data-name="${name}"></i>`);
        case 'top':
          return $(`<i style="position:absolute; left:${leftvw}; top:   0; font-size:${fontvw}; z-index:4;" class="arrow fas fa-arrow-alt-circle-up"    data-name="${name}"></i>`);
        case 'bot':
          return $(`<i style="position:absolute; left:${leftvw}; bottom:0; font-size:${fontvw}; z-index:4;" class="arrow fas fa-arrow-alt-circle-down"  data-name="${name}"></i>`);
      }
    })();
    $a.on('click', (event) => {
      return this.doNav(event);
    });
    $p.append($a);
  }

  scaleReset() {
    return {
      left: this.xs(this.left),
      top: this.ys(this.top),
      width: this.xs(this.width),
      height: this.ys(this.height)
    };
  }

  scaleParam(left, top, width, height) {
    return {
      left: this.pc(left),
      top: this.pc(top),
      width: this.pc(width),
      height: this.pc(height)
    };
  }

  emptyParam() {
    return {
      left: "",
      top: "",
      width: "",
      height: ""
    };
  }

  reset(select) {
    this.resetStudiesDir(true);
    this.$.css(this.scaleReset());
    this.onContent(select);
  }

  css(left, top, width, height, select) {
    this.$.css(this.scaleParam(left, top, width, height));
    this.onContent(select);
  }

  animate(left, top, width, height, select, aniLinks = false, callback = null) {
    this.$.show().animate(this.scaleParam(left, top, width, height), this.view.speed, () => {
      return this.animateCall(callback, select);
    });
  }

  animateCall(callback, select) {
    this.onContent(select);
    if (callback != null) {
      callback(this);
    }
  }

  resetStudiesDir(show) {
    var dir, k, len, ref;
    ref = ['west', 'north', 'east', 'south', 'prac'];
    for (k = 0, len = ref.length; k < len; k++) {
      dir = ref[k];
      this.resetStudyDir(false, show, dir);
    }
  }

  resetStudyDir(expand, show, dir) {
    var $study;
    $study = this.$.find(this.dirClass(dir));
    if (expand) {
      $study.css(this.scaleParam(this.view.margin.west, this.view.margin.north, 100 * this.view.wview, 100 * this.view.hview));
    } else {
      $study.css(this.emptyParam());
    }
    if (show) {
      $study.show();
    } else {
      $study.hide();
    }
  }

  dirClass(dir) {
    return `.study-${dir}`;
  }

  onContent(select) {
    var content;
    this.geo = this.geom();
    if (this.stream.hasBundle('Content')) {
      content = UI.toTopic(select.name, 'Pane', select.intent);
      this.stream.publish('Content', content);
    }
  }

};

export default Pane;
