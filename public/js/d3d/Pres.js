import Util     from '../util/Util.js';
import Vis      from '../vis/Vis.js';
import Axes     from '../d3d/Axes.js';
import Chord    from '../d3d/Chord.js';
import Cluster  from '../d3d/Cluster.js';
import Color    from '../d3d/Color.js';
import Link     from '../d3d/Link.js';
import Palettes from '../d3d/Palettes.js';
import Radar    from '../d3d/Radar.js';
import Radial   from '../d3d/Radial.js';
import Tree     from '../d3d/Tree.js';
import Wheelc   from '../d3d/Wheelc.js';
var Pres;

//import Rest     from '../store/Rest.js'`
Pres = class Pres {
  constructor(build, stream, view) {
    this.build = build;
    this.stream = stream;
    this.view = view;
    this.Shows = {
      Axes: {},
      Chord: {},
      Cluster: {},
      Tree: {},
      Radial: {},
      Links: {},
      Radar: {},
      Wheelc: {},
      Brewer: {}
    };
    this.stream.subscribe('Select', 'Pres', (select) => {
      return this.onSelect(select);
    });
  }

  onSelect(select) {
    var name, selected;
    name = select.name;
    selected = this.Shows[name];
    if (selected != null) {
      if (this.Shows[name].d3d == null) {
        selected.d3d = this.createD3D(name);
      }
      return selected.page.selected = name === 'Table' ? 'Topic' : 'Svg';
    }
  }

  // console.log( 'Pres.onSelect()', select, selected.page.selected )
  createShow(pane) {
    var page;
    page = new this.Page(this.build, this.stream, this.view, pane, 'Center');
    if (this.Shows[pane.name] != null) {
      this.Shows[pane.name].pane = pane;
      this.Shows[pane.name].page = page;
    } else {
      console.error('Pres.createShow() unknown show', pane.name);
    }
    return page;
  }

  createD3D(select) {
    var d3d, pane;
    pane = this.Shows[select].pane;
    // concole.log( 'Pres.createD3D', select )
    d3d = (function() {
      switch (select) {
        case 'Axes':
          return this.instanciateAxes(pane);
        case 'Chord':
          return this.instanciateChord(pane);
        //hen 'Cluster' then @instanciateCluster( pane  )
        case 'Link':
          return this.instanciateLink(pane);
        case 'Radar':
          return this.instanciateRadar(pane);
        case 'Radial':
          return this.instanciateRadial(pane);
        case 'Tree':
          return this.instanciateTree(pane);
        case 'Wheelc':
          return this.instanciateWheelc(pane);
        default:
          console.error('d3d/Pres.instanciate() unknown select', select);
          return null;
      }
    }).call(this);
    return d3d;
  }

  svgGeom(pane) {
    if (pane.page == null) {
      console.error('Pres.svgGeom() missing page', pane.name);
    }
    return [pane.page.contents.svg, pane.geom()];
  }

  transform(pane, x, y, s) {
    var cs;
    cs = pane.page.contents.svg;
    cs.$.hide(); // Hide svg so it won't push out the pane
    cs.$g.attr('transform', `translate(${x},${y}) scale(${s},${s})`);
    cs.$.show();
  }

  restData(dbName, fileJson, doData) {
    var onNext, rest;
    rest = new this.Rest(this.stream, this.Database.Databases[dbName].uriLoc);
    if (dbName === 'radar') {
      rest.key = 'name';
    }
    rest.remember();
    rest.select(fileJson);
    onNext = (data) => {
      return doData(data);
    };
    return rest.subscribe(Util.firstTok(fileJson, '.'), 'none', 'select', onNext);
  }

  instanciateTree(pane) {
    var geom, svg, tree;
    [svg, geom] = this.svgGeom(pane);
    tree = new Tree(svg.g, geom.wv, geom.hv, false);
    this.restData('radar', 'polyglot-principles.json', (data) => {
      return tree.doTree(data);
    });
    return tree;
  }

  instanciateRadial(pane) {
    var geom, radial, svg;
    [svg, geom] = this.svgGeom(pane);
    radial = new Radial(svg.g, geom.wv, geom.hv);
    this.restData('radar', 'polyglot-principles.json', (data) => {
      return radial.doRadial(data);
    });
    return radial;
  }

  instanciateRadar(pane) {
    var geom, radar, svg;
    [svg, geom] = this.svgGeom(pane);
    radar = new Radar(svg.g, true, geom.wv, geom.hv);
    this.restData('radar', 'axiom-quads.json', (quads) => {
      return radar.doQuads(quads);
    });
    this.restData('radar', 'axiom-techs.json', (techs) => {
      return radar.doTechs(techs);
    });
    return radar;
  }

  instanciateWheelc(pane) {
    var geom, svg, wheelc;
    [svg, geom] = this.svgGeom(pane);
    wheelc = new Wheelc(svg.g, geom.wv, geom.hv);
    return wheelc;
  }

  instanciateAxes(pane) {
    var axes, geom, svg;
    [svg, geom] = this.svgGeom(pane);
    axes = new Axes(svg.g, geom.wv, geom.hv, {
      x1: 0,
      x2: 100,
      xtick1: 10,
      xtick2: 1
    }, {
      y1: 0,
      y2: 100,
      ytick1: 10,
      ytick2: 1
    });
    this.transform(pane, 40, 40, 1.0);
    return axes;
  }

  instanciateChord(pane) {
    var chord, geom, svg;
    [svg, geom] = this.svgGeom(pane);
    chord = new Chord(svg.g, geom.wv, geom.hv);
    this.transform(pane, geom.wv / 2, geom.hv / 2, geom.s);
    return chord;
  }

  instanciateLink(pane) {
    var geom, link, svg;
    [svg, geom] = this.svgGeom(pane);
    link = new Link(svg.g, geom.wv, geom.hv);
    link.ornament(150);
    return link;
  }

};

export default Pres;
