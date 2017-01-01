var Panel = function(parameters) {
  this.name = 'panel';
  this.transparent = false;
  this.width = 100;
  this.height = 100;
  this.thickness = 6;

  this.color = 0xFFFFFF;
  this.rotation = {x:0,y:0,z:0};
  this.translation = {x:0,y:0,z:0};

  // SEPARATORS
  // Amount of slots to cut to put separators
  this.separators_number = 0;
  // Thickness of separator material
  this.separators_thickness = 0;

  // SLOTS PARAMETERS
  this.slots_size = -1;
  this.slots_left = false;
  this.slots_right = false;
  this.slots_top = false;
  this.slots_bottom = false;
  this.slots_invert_left = false;
  this.slots_invert_right = false;
  this.slots_invert_top = false;
  this.slots_invert_bottom = false;
  this.slots_number_width = 5;
  this.slots_number_height = 5;

  this.SVG = null;
  this.mesh = null;
  this.group = new THREE.Group();
  this.center = {x:this.width/2,y:this.height/2};
  this.paths = [];

  this.setValues(parameters);
  this.generateSVGClean();
  this.extrude();
};

Panel.prototype = {
  constructor: Panel,

  // Assign values to keys
  setValues: function(values) {
    if ( values === undefined ) return;
    for (var key in values) {
      var newValue = values[key];
      if (newValue === undefined ) {
        console.log( "Panel "+this.name+": '" + key + "' parameter is undefined." );
        continue;
      }
      var currentValue = this[key];
      if ( currentValue === undefined ) {
        console.log( "Panel "+this.name+":: '" + key + "' is not a property." );
        continue;
      }
      this[key] = newValue;
    }
    if (this.slots_size == -1) {
      this.slots_size = this.thickness;
    }
    this.center = {x:this.width/2,y:this.height/2};
  },

  getSVG: function() {
    return this.SVG;
  },

  extrude: function() {
    var i,j, len, len1;
    var path, simpleShapes, simpleShape, shape3d, x;
    var color = new THREE.Color( this.color );

    var extrudeSettings = {
      amount: this.thickness,
      bevelEnabled: false,
      bevelSegments:2,
      steps:2,
      bevelSize:1,
      bevelThickness:1,
      material:0,
      extrudeMaterial:1,
      name:this.name
    };

    len = this.paths.length;
    for (i = 0; i < len; ++i) {
      path = $d3g.transformSVGPath(this.paths[i]);

      simpleShapes = path.toShapes(true);
      len1 = simpleShapes.length;
      for (j = 0; j < len1; ++j) {
        simpleShape = simpleShapes[j];

        shape3d = new THREE.ExtrudeGeometry(simpleShape,extrudeSettings);

        this.mesh = new THREE.Mesh(shape3d, this.transparent ? plywoodMaterialTransparent : plywoodMaterial);

        // COMPUTE UVS
        shape3d.computeBoundingBox();
        var boundingBox = shape3d.boundingBox;
        var max = boundingBox.max, min = boundingBox.min;
        var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
        var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
        this.mesh.geometry.faceVertexUvs[0] = [];
        for (var k = 0; k < this.mesh.geometry.faces.length ; k++) {
          var v1 = this.mesh.geometry.vertices[this.mesh.geometry.faces[k].a];
          var v2 = this.mesh.geometry.vertices[this.mesh.geometry.faces[k].b];
          var v3 = this.mesh.geometry.vertices[this.mesh.geometry.faces[k].c];
          this.mesh.geometry.faceVertexUvs[0].push(
            [
              new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
              new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
              new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
            ]);
        }
        this.mesh.geometry.uvsNeedUpdate = true;

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.name = this.name;
        this.mesh.rotateX(this.rotation.x);
        this.mesh.rotateY(this.rotation.y);
        this.mesh.rotateZ(this.rotation.z);
        this.mesh.translateX(this.translation.x-this.center.x);
        this.mesh.translateY(this.translation.y-this.center.y);
        this.mesh.translateZ(this.translation.z);

        //this.group.add(mesh);

        this.mesh.castShadow = true;
      }
    }
  },

  getMeshGroup: function() {
    return this.group;
  },

  getMesh: function() {
    return this.mesh;
  },

  generateSVG: function() {
    var hDelta = this.height/this.slots_number_height;
    var wDelta = this.width/this.slots_number_width;

    this.SVG = '';
    var mX = 0;
    var mY = 0;

    if (this.slots_invert_right) {
      mX = this.slots_size;
    }
    if (this.slots_invert_bottom) {
      mY = this.slots_size;
    }
    this.SVG += 'M'+mX+','+mY+' ';

    var i = 1;

    if (this.slots_right) {
      if (!this.slots_invert_right) {
        for (i = 1;i<this.slots_number_height;i+=2) {
          this.SVG += 'V'+(hDelta*i)+' ';
          this.SVG += 'H'+this.slots_size+' ';
          this.SVG += 'V'+(hDelta*(i+1))+' ';
          this.SVG += 'H0 ';
        }
      } else {
        for (i = 1;i<this.slots_number_height;i+=2) {
          this.SVG += 'V'+(hDelta*i)+' ';
          this.SVG += 'H0 ';
          this.SVG += 'V'+(hDelta*(i+1))+' ';
          this.SVG += 'H'+this.slots_size+' ';
        }
      }
    }

    if (!this.slots_invert_top) {
      this.SVG += 'V'+this.height+' ';
    } else {
      this.SVG += 'V'+(this.height-this.slots_size)+' ';
    }

    if (this.slots_top) {
      if (!this.slots_invert_top) {
        for (i = 1;i<this.slots_number_width;i+=2) {
          this.SVG += 'H'+(wDelta*i)+' ';
          this.SVG += 'V'+(this.height-this.slots_size)+' ';
          this.SVG += 'H'+(wDelta*(i+1))+' ';
          this.SVG += 'V'+(this.height);
        }
      } else {
        for (i = 1;i<this.slots_number_width;i+=2) {
          this.SVG += 'H'+(wDelta*i)+' ';
          this.SVG += 'V'+(this.height)+' ';
          this.SVG += 'H'+(wDelta*(i+1))+' ';
          this.SVG += 'V'+(this.height-this.slots_size);
        }
      }
    }

    if (!this.slots_invert_left) {
      this.SVG += 'H'+this.width+' ';
    } else {
      this.SVG += 'H'+(this.width-this.slots_size)+' ';
    }


    if (this.slots_left) {
      if (!this.slots_invert_left) {
        for (i=1;i<this.slots_number_height;i+=2) {
          this.SVG += 'V'+(this.height-hDelta*i)+' ';
          this.SVG += 'H'+(this.width-this.slots_size)+' ';
          this.SVG += 'V'+(this.height-hDelta*(i+1))+' ';
          this.SVG += 'H'+(this.width)+' ';
        }
      } else {
        for (i=1;i<this.slots_number_height;i+=2) {
          this.SVG += 'V'+(this.height-hDelta*i)+' ';
          this.SVG += 'H'+(this.width)+' ';
          this.SVG += 'V'+(this.height-hDelta*(i+1))+' ';
          this.SVG += 'H'+(this.width-this.slots_size)+' ';
        }
      }
    }

    if (!this.slots_invert_bottom) {
      this.SVG += 'V0';
    } else {
      this.SVG += 'V'+this.slots_size+' ';
    }

    if (this.slots_bottom) {
      if (!this.slots_invert_bottom) {
        for (i = 1;i<this.slots_number_width;i+=2) {
          this.SVG += 'H'+(this.width-wDelta*i)+' ';
          this.SVG += 'V'+this.slots_size+' ';
          this.SVG += 'H'+(this.width-wDelta*(i+1))+' ';
          this.SVG += 'V0 ';
        }
      } else {
        for (i = 1;i<this.slots_number_width;i+=2) {
          this.SVG += 'H'+(this.width-wDelta*i)+' ';
          this.SVG += 'V0 ';
          this.SVG += 'H'+(this.width-wDelta*(i+1))+' ';
          this.SVG += 'V'+this.slots_size+' ';
        }
      }
    }

    if (!this.slots_invert_right) {
      this.SVG += 'H0 ';
    } else {
      this.SVG += 'H'+this.slots_size+' ';
    }

    this.paths = [this.SVG];
  },

  generateSVGClean: function() {
    var hDelta = this.height/this.slots_number_height;
    var wDelta = this.width/this.slots_number_width;

    this.SVG = '';
    var mX = 0;
    var mY = 0;

    if (this.slots_invert_left) {
      mX = this.slots_size;
    }
    if (this.slots_invert_bottom) {
      mY = this.slots_size;
    }
    this.SVG += 'M'+mX+','+mY+' ';

    var i = 1;
    if (this.slots_left) {
      if (!this.slots_invert_left) {
        for (i = 1;i<this.slots_number_height;i+=2) {
          this.SVG += 'V'+(hDelta*i)+' ';
          this.SVG += 'H'+this.slots_size+' ';
          this.SVG += 'V'+(hDelta*(i+1))+' ';
          this.SVG += 'H0 ';
        }
      } else {
        for (i = 1;i<this.slots_number_height;i+=2) {
          this.SVG += 'V'+(hDelta*i)+' ';
          this.SVG += 'H0 ';
          this.SVG += 'V'+(hDelta*(i+1))+' ';
          this.SVG += 'H'+this.slots_size+' ';
        }
      }
    }

    if (!this.slots_invert_top) {
      this.SVG += 'V'+this.height+' ';
    } else {
      this.SVG += 'V'+(this.height-this.slots_size)+' ';
    }

    if (this.slots_top) {
      if (!this.slots_invert_top) {
        for (i = 1;i<this.slots_number_width;i+=2) {
          this.SVG += 'H'+(wDelta*i)+' ';
          this.SVG += 'V'+(this.height-this.slots_size)+' ';
          this.SVG += 'H'+(wDelta*(i+1))+' ';
          this.SVG += 'V'+(this.height);
        }
      } else {
        for (i = 1;i<this.slots_number_width;i+=2) {
          this.SVG += 'H'+(wDelta*i)+' ';
          this.SVG += 'V'+(this.height)+' ';
          this.SVG += 'H'+(wDelta*(i+1))+' ';
          this.SVG += 'V'+(this.height-this.slots_size);
        }
      }
    }

    if (!this.slots_invert_right) {
      this.SVG += 'H'+this.width+' ';
    } else {
      this.SVG += 'H'+(this.width-this.slots_size)+' ';
    }


    if (this.slots_right) {
      if (!this.slots_invert_right) {
        for (i=1;i<this.slots_number_height;i+=2) {
          this.SVG += 'V'+(this.height-hDelta*i)+' ';
          this.SVG += 'H'+(this.width-this.slots_size)+' ';
          this.SVG += 'V'+(this.height-hDelta*(i+1))+' ';
          this.SVG += 'H'+(this.width)+' ';
        }
      } else {
        for (i=1;i<this.slots_number_height;i+=2) {
          this.SVG += 'V'+(this.height-hDelta*i)+' ';
          this.SVG += 'H'+(this.width)+' ';
          this.SVG += 'V'+(this.height-hDelta*(i+1))+' ';
          this.SVG += 'H'+(this.width-this.slots_size)+' ';
        }
      }
    }

    if (!this.slots_invert_bottom) {
      this.SVG += 'V0';
    } else {
      this.SVG += 'V'+this.slots_size+' ';
    }

    if (this.slots_bottom) {
      if (!this.slots_invert_bottom) {
        for (i = 1;i<this.slots_number_width;i+=2) {
          this.SVG += 'H'+(this.width-wDelta*i)+' ';
          this.SVG += 'V'+this.slots_size+' ';
          this.SVG += 'H'+(this.width-wDelta*(i+1))+' ';
          this.SVG += 'V0 ';
        }
      } else {
        for (i = 1;i<this.slots_number_width;i+=2) {
          this.SVG += 'H'+(this.width-wDelta*i)+' ';
          this.SVG += 'V0 ';
          this.SVG += 'H'+(this.width-wDelta*(i+1))+' ';
          this.SVG += 'V'+this.slots_size+' ';
        }
      }
    }

    if (!this.slots_invert_left) {
      this.SVG += 'H0 ';
    } else {
      this.SVG += 'H'+this.slots_size+' ';
    }

    this.paths = [this.SVG];
  }
};
