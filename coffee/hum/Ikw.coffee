
import * as THREE from 'three'; const scene = new THREE.Scene();

class IKW

  constructor:() ->

  create:() ->

    for plane   in [ {name:'Information',z:100}, {name:'Knowledge',z:60}, {name:'Wisdom',   z: 20} ]
      for row   in [ {name:'Learn',      y:100}, {name:'Do',       y:60}, {name:'Share',    y: 20} ]
        for col in [ {name:'Embrace',    x: 20}, {name:'Innovate', x:60}, {name:'Encourage',x:100} ]