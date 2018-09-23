import Util from '../util/Util.js';
import Base from '../ui/Base.js';
var Chord,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

Chord = (function() {
  class Chord extends Base {
    constructor(stream, ui, d3d) {
      super(stream, ui, 'Chord');
      this.ready = this.ready.bind(this);
      this.xcreateGroups = this.xcreateGroups.bind(this);
      // Returns an event handler for fading a given chord group.
      this.xfade = this.xfade.bind(this);
      this.d3d = d3d;
      this.matrix = [[0, 20, 20, 20], [20, 0, 20, 80], [20, 20, 0, 20], [20, 80, 20, 0]];
      this.range = ["#FF0000", "#00FF00", "#0000FF", "#888888"];
    }

    ready(cname) {
      var geo;
      boundMethodCheck(this, Chord);
      Util.noop(cname);
      geo = this.pane.geo;
      this.graph = this.d3d.createGraph(this.pane);
      this.g = this.graph.g;
      this.width = geo.w;
      this.height = geo.h;
      this.outer = Math.min(this.width, this.height) * 0.5 - 40;
      this.inner = this.outer - 30;
      this.format = d3.formatPrefix(",.0", 1e3);
      this.chord = this.createChord();
      this.arc = this.createArc(this.inner, this.outer);
      this.ribbon = this.createRibbon(this.inner);
      this.color = this.createColor(this.range);
      this.g.datum(this.chord(this.matrix));
      this.g.attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
      this.group = this.createGroup(this.arc);
      this.ticks = this.createTicks(this.group, this.outer);
      this.appendRibbons(this.g, this.ribbon);
      this.graph.$g.css({
        "background-color": "white"
      });
      return this.graph.$svg;
    }

    createChord() {
      return d3.chord().padAngle(0.05).sortSubgroups(d3.descending);
    }

    createArc(inner, outer) {
      return d3.arc().innerRadius(inner).outerRadius(outer);
    }

    createRibbon(inner) {
      return d3.ribbon().radius(inner);
    }

    createColor(range) {
      return d3.scaleOrdinal().domain(d3.range(4)).range(range);
    }

    createGroup(arc) {
      var group;
      group = this.g.append("g").attr("class", "groups").selectAll("g").data((d) => {
        return d.groups;
      }).enter().append("g");
      return group.append("path").style("fill", (d) => {
        return this.color(d.index);
      }).style("stroke", (d) => {
        return d3.rgb(this.color(d.index)).darker();
      }).attr("d", arc);
    }

    createTicks(group, outer) {
      var ticks;
      ticks = group.selectAll(".group-tick").data((d) => {
        return this.groupTicks(d, 1e3);
      }).enter().append("g").attr("class", "group-tick").attr("transform", (d) => {
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outer + ",0)";
      });
      ticks.append("line").attr("x2", 6);
      ticks.filter(function(d) {
        return d.value % 5e3 === 0;
      }).append("text").attr("x", 8).attr("dy", ".35em").attr("transform", function(d) {
        if (d.angle > Math.PI) {
          return "rotate(180) translate(-16)";
        } else {
          return null;
        }
      }).style("text-anchor", function(d) {
        if (d.angle > Math.PI) {
          return "end";
        } else {
          return null;
        }
      }).text((d) => {
        return this.format(d.value);
      });
      return ticks;
    }

    appendRibbons(g, ribbon) {
      return g.append("g").attr("class", "ribbons").selectAll("path").data(function(chords) {
        return chords;
      }).enter().append("path").attr("d", ribbon).style("fill", (d) => {
        return this.color(d.target.index);
      }).style("stroke", (d) => {
        return d3.rgb(this.color(d.target.index)).darker();
      });
    }

    // Returns an array of tick angles and values for a given group and step.
    groupTicks(d, step) {
      var k;
      k = (d.endAngle - d.startAngle) / d.value;
      return d3.range(0, d.value, step).map(function(value) {
        return {
          value: value,
          angle: value * k + d.startAngle
        };
      });
    }

    // ------------
    xcreateFill(range) {
      return d3.scaleOrdinal().domain(d3.range(4)).range(range);
    }

    xcreateGroups() {
      var groups;
      boundMethodCheck(this, Chord);
      groups = this.g.append("g").selectAll("path").data((d) => {
        return d.groups;
      }).enter().append("path").style("fill", (d) => { 
        return this.fill(d.index);
      }).style("stroke", (d) => {
        return this.fill(d.index);
      });
      groups.attr("d", d3.arc().innerRadius(this.inner).outerRadius(this.outer));
      groups.on("mouseover", this.fade(.1)).on("mouseout", this.fade(1));
      return groups;
    }

    xupdateChords() {
      var chords;
      chords = this.g.append("g").attr("class", "chord").selectAll("path").datam(this.chords(this.matrix)).enter().append("path").attr("d", d3.chord().radius(this.inner)).style("fill", (d) => {
        return this.fill(d.target.index);
      }).style("opacity", 1);
      return chords;
    }

    // Returns an array of tick angles and labels, given a group.
    xcreateTicks() {
      var ticks;
      ticks = this.g.append("g").selectAll("g").data(this.chord.groups);
      ticks.enter().append("g").selectAll("g").data(this.groupTicks);
      //ticks.enter().append("g").attr("transform", (d) => "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + @outer + ",0)" )
      ticks.append("line").attr("x1", 1).attr("y1", 0).attr("x2", 5).attr("y2", 0).style("stroke", "#000");
      ticks.append("text").attr("x", 8).attr("dy", ".35em").attr("transform", function(d) {
        if (d.angle > Math.PI) {
          return "rotate(180)translate(-16)";
        } else {
          return null;
        }
      });
      ticks.style("text-anchor", (d) => {
        if (d.angle > Math.PI) {
          return "end";
        } else {
          return null;
        }
      });
      ticks.text((d) => {
        return d.label;
      });
      return ticks;
    }

    xgroupTicks(d) {
      var k, range;
      k = (d.endAngle - d.startAngle) / d.value;
      range = d3.range(0, d.value, 1000).map((v, i) => {
        return {
          angle: v * k + d.startAngle,
          label: (i % 5 ? null : v / 1000 + "k")
        };
      });
      //console.log( 'groupTicks', d, k )
      return range;
    }

    xfade(opacity) {
      boundMethodCheck(this, Chord);
      return (i) => {
        return this.g.selectAll(".chord path").filter((d) => {
          return d.source.index !== i && d.target.index !== i;
        }).transition().style("opacity", opacity);
      };
    }

  };

  Chord.matrix2 = [[11975, 5871, 8916, 2868], [1951, 10048, 2060, 6171], [8010, 16145, 8090, 8045], [1013, 990, 940, 6907]];

  Chord.range2 = ["#000000", "#FFDD89", "#957244", "#F26223"];

  return Chord;

}).call(this);

export default Chord;
