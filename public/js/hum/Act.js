var Act;

Act = class Act {
  constructor(scene) {
    this.info = this.info.bind(this);
    this.know = this.know.bind(this);
    this.wise = this.wise.bind(this);
    this.learn = this.learn.bind(this);
    this.do = this.do.bind(this);
    this.share = this.share.bind(this);
    this.embrace = this.embrace.bind(this);
    this.innovate = this.innovate.bind(this);
    this.encourage = this.encourage.bind(this);
    this.slide = this.slide.bind(this);
    this.select = this.select.bind(this);
    this.num = this.num.bind(this);
    this.str = this.str.bind(this);
    this.color0 = this.color0.bind(this);
    this.color1 = this.color1.bind(this);
    this.color2 = this.color2.bind(this);
    this.color3 = this.color3.bind(this);
    this.scene = scene;
    this.Info = true;
    this.Know = true;
    this.Wise = true;
    this.Learn = true;
    this.Do = true;
    this.Share = true;
    this.Embrace = true;
    this.Innovate = true;
    this.Encourage = true;
    this.Slide = 50;
    this.Select = "Liberty";
    this.Num = 39;
    this.Str = "Master";
    this.Color0 = "#ffae23";
    this.Color1 = [0, 128, 255];
    this.Color2 = [0, 128, 255, 0.3];
    this.Color3 = {
      h: 350,
      s: 0.9,
      v: 0.3
    };
  }

  info() {
    return this.traverse('plane', 'Information', this.Info);
  }

  know() {
    return this.traverse('plane', 'Knowledge', this.Know);
  }

  wise() {
    return this.traverse('plane', 'Wisdom', this.Wise);
  }

  learn() {
    return this.traverse('row', 'Learn', this.Learn);
  }

  do() {
    return this.traverse('row', 'Do', this.Do);
  }

  share() {
    return this.traverse('row', 'Share', this.Share);
  }

  embrace() {
    return this.traverse('col', 'Embrace', this.Embrace);
  }

  innovate() {
    return this.traverse('col', 'Innovate', this.Innovate);
  }

  encourage() {
    return this.traverse('col', 'Encourage', this.Encourage);
  }

  traverse(prop, value, visible) {
    var reveal;
    reveal = (child) => {
      if ((child[prop] != null) && child[prop] === value) {
        return child.visible = visible;
      }
    };
    if (this.scene != null) {
      //console.log( 'reveal',  { name:child.name, prop:prop, value:value, visible:child.visible } )
      this.scene.traverse(reveal);
    }
  }

  slide() {
    console.log('Act.slide', this.Slide);
  }

  select() {
    console.log('Act.select', this.Select);
  }

  num() {
    console.log('Act.num', this.Num);
  }

  str() {
    console.log('Act.str', this.Str);
  }

  color0() {
    console.log('Act.color0', this.Color0);
  }

  color1() {
    console.log('Act.color1', this.Color1);
  }

  color2() {
    console.log('Act.color2', this.Color2);
  }

  color3() {
    console.log('Act.color3', this.Color3);
  }

};

export default Act;
