import Util     from '../util/Util.js';
import Vis      from '../vis/Vis.js';
var MBox;

MBox = class MBox {
  constructor() {
    var THREE;
    THREE = window['THREE'];
    this.mathbox = mathBox({
      plugins: ['core', 'controls', 'cursor', 'stats'],
      controls: {
        klass: THREE.OrbitControls // TrackballControls  OrbitControls
      }
    });
    if (this.mathbox.fallback) {
      console.error('mathbox WebGL not supported');
    }
    this.three = this.mathbox.three;
    this.three.renderer.setClearColor(new THREE.Color(0x000000), 1.0);
    //@mathbox.set( { focus:3, scale: 720 } )
    Util.time = 0;
    this.setupTime();
  }

  setupTime() {
    this.three.on('update', function() {
      return Util.time = this.three.Time.clock;
    });
    Util.noop();
  }

  pv1v2(p, v1, v2) {
    var i, j, p1, p2, v3;
    p1 = p * 0.01;
    p2 = 1.0 - p1;
    v3 = [0, 0, 0];
    for (i = j = 0; j < 3; i = ++j) {
      v3[i] = v1[i] * p1 + v2[i] * p2;
    }
    return v3;
  }

  toRad(i, n) {
    var hue;
    hue = (i * 360 / n) % 360;
    return Vis.toRadian(hue);
  }

  toHue(i, n) {
    var h;
    h = (i * 360 / n) % 360;
    return Util.toInt(h);
  }

  sin9(x, y) {
    return 0.5 + 0.25 * Math.sin(12 * x + Util.time * 0.3) + 0.25 * Math.sin(12 * y + Util.time * 0.3);
  }

  sin12(x, y) {
    return 0.5 + 0.50 * Math.sin(12 * x + Util.time * 0.3) + 0.50 * Math.sin(12 * y + Util.time * 0.3);
  }

  sinNorm(x, y) {
    return Math.sin(12 * x + Util.time * 0.3) + Math.sin(12 * y + Util.time * 0.3);
  }

  sin9Pq(a, r) {
    return 0.5 + 0.25 * Math.sin(12 * (r + a) + Util.time * 1.2 + π / 12) + 0.25 * Math.cos(12 * a);
  }

  sin9P(a, r) {
    return 0.5 * Math.sin(12 * (a + r) + Util.time * 1.2 + π / 12) + 0.5 * Math.cos(12 * a);
  }

  sin9R(a, r) {
    return 0.5 + 0.25 * Math.sin(12 * r * a + Util.time * 1.2) + 0.25 * Math.sin(6 * a);
  }

  sin9P(a, r) {
    return 0.5 + 0.25 * Math.sin(12 * r + Util.time * 0.3 + π / 12) + 0.25 * Math.sin(12 * a + π / 12);
  }

  sin9PJan(a, r) {
    return 0.5 * Math.sin(12 * (a + r) + Util.time * 1.2 + π / 12) + 0.50 * Math.cos(12 * a);
  }

  sin9QJan(a, r) {
    return 0.5 + 0.25 * Math.sin(12 * r + Util.time * 0.3 + π / 12) + 0.25 * Math.sin(12 * a + π / 12);
  }

  sin12P(a, r) {
    return 0.5 * Math.sin(12 * (r + a) + Util.time * 1.2) + 0.5 * Math.cos(12 * a);
  }

  sin12R(a, r) {
    return .5 + 0.25 * Math.sin(r + a) + 0.25 * Math.cos(r + a * Util.time * 0.5);
  }

  sin12PMar(a, r) {
    return .5 + .5 * Math.sin(12 * (r + a) + Util.time) * Math.sin(9 * a + Util.time);
  }

  sin12CMar(a, r) {
    return .5 + .5 * Math.sin(12 * (r + a) + Util.time) * Math.sin(9 * a + Util.time) * Math.cos(r);
  }

  sin09PMar(a, r) {
    return .5 + .5 * Math.sin(9 * (r + a) + Util.time) * Math.sin(9 * a + Util.time);
  }

  sin01Oct(a, r) {
    return .5 + .5 * Math.sin(a + Util.time) * Math.sin(r + Util.time);
  }

  sin09Oct(a, r) {
    return .5 + .5 * Math.sin(9 * a + Util.time) * Math.sin(9 * r + Util.time);
  }

  sin12Oct(a, r) {
    return .5 + .5 * Math.sin(12 * a + Util.time) * Math.sin(12 * r + Util.time);
  }

  cos01Oct(a, r) {
    return .5 + .5 * Math.cos(a + Util.time) * Math.cos(r + Util.time);
  }

  sin12AMay(a) {
    return .5 + .50 * Math.cos(12 * a + Util.time);
  }

  sin12RMay(a, r) {
    return .5 + .50 * Math.cos(12 * r + Util.time);
  }

  sin12MMay(a, r) {
    return .5 + .50 * Math.cos(12 * a + Util.time) * 1.00 * Math.cos(12 * r + Util.time);
  }

  sin12PMay(a, r) {
    return .5 + .25 * Math.cos(12 * a + Util.time) + .25 * Math.cos(12 * r + Util.time);
  }

  sin12QMay(a, r) {
    return .5 + .25 * Math.cos(12 * a + Util.time) + .25 * Math.cos(12 * r + Util.time);
  }

  sin12QJan(a, r) {
    return .50 + .50 * Math.sin(12 * (r + a) + Util.time * 1.2);
  }

  sin12AJan(a) {
    return .50 + .50 * Math.sin(12 * a + Util.time * 1.2);
  }

  sin06AJan(a) {
    return .50 + .50 * Math.sin(3 * a + Util.time * 1.2); // Keep
  }

  sin06B(a) {
    return .55 + .45 * Math.sin(3 * a + Util.time);
  }

  sin06C(a) {
    return .60 + .40 * Math.sin(3 * a + Util.time);
  }

  sin03D(a, r) {
    return .60 + .40 * Math.sin(3 * a + Util.time) * Math.sin(r * 0.11 + Util.time);
  }

  sin06D(a, r) {
    return .60 + .40 * Math.sin(6 * a + Util.time) * Math.sin(r * 0.11 + Util.time);
  }

  sin06E(a, r) {
    return .60 + .40 * Math.sin(6 * a + Util.time) * Math.sin(r / 12 + Util.time);
  }

  sin06F(a, r) {
    return .60 + .40 * Math.sin(6 * a + Util.time) * Math.sin(r / 8 + Util.time);
  }

  sigmoidal(x, k, x0 = 0.5) {
    return 1 / (1 + Math.exp(-k * (x - x0)));
  }

  depth() {
    return Math.abs(Math.cos(Util.time * 0.5));
  }

  toDep(a, r) {
    return Math.abs(Math.cos(6 * (r + a) + Util.time * 0.5));
  }

};

export default MBox;
