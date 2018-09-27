var Gui;

Gui = class Gui {
  constructor(act, elem) {
    this.act = act;
    this.elem = elem;
    this.gui = new dat.GUI({
      autoPlace: false
    });
    this.elem.appendChild(this.gui.domElement);
    this.gui.remember(this.act);
    this.planes();
    this.rows();
    this.cols();
    this.misc();
    this.colors();
  }

  check(folder, obj, prop, onChange) {
    var controller;
    controller = folder.add(obj, prop);
    controller.onChange(onChange);
  }

  slider(folder, obj, prop, onChange, min, max, step) {
    var controller;
    controller = folder.add(obj, prop).min(min).max(max).step(step);
    if (onChange != null) {
      controller.onFinishChange(onChange);
    }
  }

  select(folder, obj, prop, onChange, items) {
    var controller;
    controller = folder.add(obj, prop, items);
    if (onChange != null) {
      controller.onChange(onChange);
    }
  }

  input(folder, obj, prop, onChange) {
    var controller;
    controller = folder.add(obj, prop);
    if (onChange != null) {
      controller.onFinishChange(onChange);
    }
  }

  color(folder, obj, prop, onChange) {
    var controller;
    controller = folder.addColor(obj, prop);
    if (onChange != null) {
      controller.onChange(onChange);
    }
  }

  planes() {
    var folder;
    folder = this.gui.addFolder('Planes');
    this.check(folder, this.act, 'Info', this.act.info);
    this.check(folder, this.act, 'Know', this.act.know);
    this.check(folder, this.act, 'Wise', this.act.wise);
    folder.open();
  }

  rows() {
    var folder;
    folder = this.gui.addFolder('Rows');
    this.check(folder, this.act, 'Learn', this.act.learn);
    this.check(folder, this.act, 'Do', this.act.do);
    this.check(folder, this.act, 'Share', this.act.share);
    folder.open();
  }

  cols() {
    var folder;
    folder = this.gui.addFolder('Cols');
    this.check(folder, this.act, 'Embrace', this.act.embrace);
    this.check(folder, this.act, 'Innovate', this.act.innovate);
    this.check(folder, this.act, 'Encourage', this.act.encourage);
    folder.open();
  }

  misc() {
    var folder;
    folder = this.gui.addFolder('Misc');
    this.slider(folder, this.act, 'Slide', this.act.slide, 0, 100, 10);
    this.select(folder, this.act, 'Select', this.act.select, ['Life', 'Liberty', 'Happiness']);
    this.input(folder, this.act, 'Num', this.act.num);
    this.input(folder, this.act, 'Str', this.act.str);
    folder.open();
  }

  colors() {
    var folder;
    folder = this.gui.addFolder('Colors');
    this.color(folder, this.act, 'Color0', this.act.color0);
    this.color(folder, this.act, 'Color1', this.act.color1);
    this.color(folder, this.act, 'Color2', this.act.color2);
    this.color(folder, this.act, 'Color3', this.act.color3);
    folder.open();
  }

};

export default Gui;
