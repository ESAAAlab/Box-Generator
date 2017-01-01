var Box = function(parameters) {
  this.name = 'container';
  this.isMainContainer = false;
  this.mainContainer = null;
  this.transparent = false;
  this.front = true;
  this.back = true;
  this.top = true;
  this.bottom = true;
  this.left = true;
  this.right = true;
  this.width = 300;
  this.height = 300;
  this.depth = 300;
  this.thickness = 6;
  this.offset = 0;

  this.unitWidth = 1;
  this.unitHeight = 1;
  this.unitDepth = 1;

  this.cellWidth = 0;
  this.cellHeight = 0;

  this.color = 0xFFFFFF;
  this.rotation = {x:0,y:0,z:0};
  this.translation = {x:0,y:0,z:0};

  this.separation_columns = 1;
  this.separation_rows = 1;
  this.separation_thickness = 3;
  this.separation_rotate = false;

  this.slots_number_width = 5;
  this.slots_number_height = 5;
  this.slots_number_depth = 5;
  this.slots_left = true;
  this.slots_right = true;
  this.slots_top = true;
  this.slots_bottom = true;
  this.slots_invert_right = false;
  this.slots_invert_left = false;
  this.slots_invert_top = false;
  this.slots_invert_bottom = false;
  this.SVG = null;
  this.mesh = null;
  this.group = undefined;
  this.center = {x:0,y:0,z:0};
  this.delta = {x:0,y:0,z:0};
  this.paths = [];
  this.gui = null;

  this.showSeparations = true;
  this.setValues(parameters);
  //this.generateGui();
};

Box.prototype = {
  constructor: Box,
  setValues: function(values) {
    if ( values === undefined ) return;
    for (var key in values) {
      var newValue = values[key];
      if (newValue === undefined ) {
        console.log( "Box: '" + key + "' parameter is undefined." );
        continue;
      }
      var currentValue = this[key];
      if ( currentValue === undefined ) {
        console.log( "Box: '" + key + "' is not a property." );
        continue;
      }
      this[key] = newValue;
    }
    this.updateValuesFromGlobalParameter();
  },

  updateValuesFromGlobalParameter: function() {
    if (this.isMainContainer) {
      var params = globalParameters.container;
      this.width = params.width.value;
      this.height = params.height.value;
      this.depth = params.depth.value;
      this.thickness = params.thickness.value;
      this.separation_thickness = params.separation_thickness.value;
      this.top = params.top;
      this.bottom = params.bottom;
      this.left = params.left;
      this.right = params.right;
      this.front = params.front;
      this.back = params.back;
      this.showSeparations = params.showSeparations;
    } else {
      this.thickness = globalParameters.drawers.thickness.value;
      this.center.z = globalParameters.drawers.previewOffset.value;
    }
    this.generateBox();
  },

  generateBox: function() {
    if (this.group!==undefined) {
      scene.remove(this.group);
    }

    this.group = new THREE.Group();

    if (this.isMainContainer) {
      this.mainContainer = this;
    }

    this.cellWidth = (this.mainContainer.width -
        this.mainContainer.thickness*2 -
        this.mainContainer.separation_thickness*(this.mainContainer.separation_columns-1)
      )/this.mainContainer.separation_columns;

    this.cellHeight = (this.mainContainer.height -
      this.mainContainer.thickness*2 -
      this.mainContainer.separation_thickness*(this.mainContainer.separation_rows-1)
    )/this.mainContainer.separation_rows;


    if (!this.isMainContainer) {
      this.width = this.unitWidth * this.cellWidth + (this.unitWidth-1)*this.mainContainer.separation_thickness;
      this.height = this.unitHeight * this.cellHeight + (this.unitHeight-1)*this.mainContainer.separation_thickness;

      this.firstX = -this.mainContainer.width / 2 +
                    this.mainContainer.thickness +
                    this.width/2;
      this.firstY = this.mainContainer.height / 2 -
                    this.mainContainer.thickness -
                    this.height/2;

      this.center.x = this.firstX+(this.cellWidth+this.mainContainer.separation_thickness)*(this.delta.x-1);
      this.center.y = this.firstY-(this.cellHeight+this.mainContainer.separation_thickness)*(this.delta.y-1);
      
      this.depth = this.unitDepth * this.mainContainer.depth;
      if (this.mainContainer.front) {
        this.depth -= this.mainContainer.thickness;
        this.center.z -= this.mainContainer.thickness/2;
      }
      if (this.mainContainer.back) {
        this.depth -= this.mainContainer.thickness;
        this.center.z += this.mainContainer.thickness/2;
      }

      this.slots_number_width = 5+(this.unitWidth-1)*4;
      this.slots_number_height = 5+(this.unitHeight-1)*4;
      this.slots_number_depth = this.mainContainer.slots_number_depth;
    }

    if (this.top) {
      var panel_top = new Panel({
        name:this.name+'_TopPanel',
        transparent: this.transparent,
        width: this.width,
        height: this.depth,
        thickness: this.thickness,
        slots_number_width: this.slots_number_width,
        slots_number_height: this.slots_number_depth,
        rotation: {x:-Math.PI/2,y:0,z:0},
        translation: {x:0,y:0,z:this.height/2-this.thickness+this.offset},
        slots_bottom: this.front ? true : false,
        slots_invert_bottom: this.front ? true : false,
        slots_top: this.back ? true : false,
        slots_invert_top: this.back ? true : false,
        slots_left: this.left ? true : false,
        slots_right: this.right ? true : false
      });
      this.group.add(panel_top.getMesh());
    }

    if (this.bottom) {

      var panel_bottom = new Panel({
        name:this.name+'_BottomPanel',
        transparent: this.transparent,
        width: this.width,
        height: this.depth,
        thickness: this.thickness,
        slots_number_width: this.slots_number_width,
        slots_number_height: this.slots_number_depth,
        translation: {x:0,y:0,z:-this.height/2-this.offset},
        rotation: {x:-Math.PI/2,y:0,z:0},
        slots_bottom: this.front ? true : false,
        slots_invert_bottom: this.front ? true : false,
        slots_top: this.back ? true : false,
        slots_invert_top: this.back ? true : false,
        slots_left: this.left ? true : false,
        slots_right: this.right ? true : false
      });
      this.group.add(panel_bottom.getMesh());
    }

    if (this.left) {
      var panel_left = new Panel({
        name:this.name+'_LeftPanel',
        transparent: this.transparent,
        width: this.height,
        height: this.depth,
        thickness: this.thickness,
        slots_number_width: this.slots_number_height,
        slots_number_height: this.slots_number_depth,
        rotation: {x:0,y:-Math.PI/2,z:Math.PI/2},
        translation: {x:0,y:0,z:this.width/2-this.thickness+this.offset},
        slots_bottom: this.front ? true : false,
        slots_invert_bottom: this.front ? true : false,
        slots_top: this.back ? true : false,
        slots_invert_top: this.back ? true : false,
        slots_left: this.bottom ? true : false,
        slots_invert_left: this.bottom ? true : false,
        slots_right: this.top ? true : false,
        slots_invert_right: this.top ? true : false
      });
      this.group.add(panel_left.getMesh());
    }

    if (this.right) {
      var panel_right = new Panel({
        name:this.name+'_RightPanel',
        transparent: this.transparent,
        width: this.height,
        height: this.depth,
        thickness: this.thickness,
        slots_number_width: this.slots_number_height,
        slots_number_height: this.slots_number_depth,
        rotation: {x:0,y:-Math.PI/2,z:Math.PI/2},
        translation: {x:0,y:0,z:-this.width/2-this.offset},
        slots_bottom: this.front ? true : false,
        slots_invert_bottom: this.front ? true : false,
        slots_top: this.back ? true : false,
        slots_invert_top: this.back ? true : false,
        slots_left: this.bottom ? true : false,
        slots_invert_left: this.bottom ? true : false,
        slots_right: this.top ? true : false,
        slots_invert_right: this.top ? true : false
      });
      this.group.add(panel_right.getMesh());
    }

    if (this.back) {
      var panel_back = new Panel({
        name:this.name+'_BackPanel',
        transparent: this.transparent,
        width: this.width,
        height: this.height,
        thickness: this.thickness,
        slots_number_width: this.slots_number_width,
        slots_number_height: this.slots_number_height,
        translation: {x:0,y:0,z:-this.depth/2-this.offset},
        slots_bottom: this.bottom ? true : false,
        slots_top: this.top ? true : false,
        slots_left: this.left ? true : false,
        slots_right: this.right ? true : false
      });
      this.group.add(panel_back.getMesh());
    }

    if (this.front) {
      var panel_front = new Panel({
        name:this.name+'_BackPanel',
        transparent: this.transparent,
        width: this.width,
        height: this.height,
        thickness: this.thickness,
        slots_number_width: this.slots_number_width,
        slots_number_height: this.slots_number_height,
        translation: {x:0,y:0,z:this.depth/2-this.thickness+this.offset},
        slots_bottom: this.bottom ? true : false,
        slots_top: this.top ? true : false,
        slots_left: this.left ? true : false,
        slots_right: this.right ? true : false
      });
      this.group.add(panel_front.getMesh());
    }

    if (this.showSeparations) {
      var dX = -this.width/2+this.thickness;
      for (var i = 1;i < this.separation_columns;i++) {
        var cSeparation = new Panel({
          name:this.name+'_col_'+i,
          transparent: this.transparent,
          width: this.depth,
          height: this.height,
          thickness: this.separation_thickness,
          slots_size: this.thickness,
          slots_number_width: this.slots_number_depth,
          slots_number_height: this.separation_rows % 2 === 0 ? this.separation_rows+1 : this.separation_rows,
          rotation: {x:0,y:Math.PI/2,z:0},
          translation: {x:0,y:0,z:dX+i*this.cellWidth+(i-1)*this.separation_thickness},
          slots_top: this.top ? true : false,
          slots_invert_top: this.top ? true : false,
          slots_right: this.back ? true : false,
          slots_invert_right: this.back ? true : false,
          slots_bottom: this.bottom ? true : false,
          slots_invert_bottom: this.bottom ? true : false,
          slots_left:this.front ? true : false,
          slots_invert_left: this.front ? true : false,
        });
        this.group.add(cSeparation.getMesh());
      }

      var dY = -this.height/2+this.thickness;
      for (i = 1;i < this.separation_rows;i++) {
        var rSeparation = new Panel({
          name:this.name+'_row_'+i,
          transparent: this.transparent,
          width: this.width,
          height: this.depth,
          thickness: this.separation_thickness,
          slots_size: this.thickness,
          slots_number_width: this.slots_number_width,
          slots_number_height: this.slots_number_depth,
          rotation: {x:Math.PI/2,y:0,z:0},
          translation: {x:0,y:0,z:dY+i*this.cellHeight+(i-1)*this.separation_thickness},
          slots_top: this.front ? true : false,
          slots_invert_top: this.front ? true : false,
          slots_right: this.right ? true : false,
          slots_invert_right: this.right ? true : false,
          slots_bottom: this.back ? true : false,
          slots_invert_bottom: this.back ? true : false,
          slots_left:this.left ? true : false,
          slots_invert_left: this.left ? true : false,
        });
        this.group.add(rSeparation.getMesh());
      }
    }

    if (globalParameters.debug) {
      var boundingBoxGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
      var boundingBoxMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe:true} );
      var boundingBox = new THREE.Mesh( boundingBoxGeometry, boundingBoxMaterial );
      this.group.add( boundingBox );

      /*var lineMaterial;
      var lineMaterial2;
      if (this.isMainContainer) {
        lineMaterial = new THREE.LineBasicMaterial({color: 0xff00ff});
        lineMaterial2 = new THREE.LineBasicMaterial({color: 0xFF0000});
      } else {
        lineMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});
        lineMaterial2 = new THREE.LineBasicMaterial({color: 0x0000ff});
      }

      var lineGeometry = new THREE.Geometry();
      var lineGeometry2 = new THREE.Geometry();
      if (this.isMainContainer) {
        for (i = 0; i<this.separation_columns; i++) {
          var firstX = -this.width/2 + this.thickness;
          var deltaX = (this.width -
            this.thickness*2 -
            this.separation_thickness*(this.separation_columns-1)
          )/this.separation_columns;
          var lineX = firstX + deltaX*i + i*this.separation_thickness;
          lineGeometry.vertices.push(
            new THREE.Vector3( lineX, -this.height/2, this.depth/2),
            new THREE.Vector3( lineX, this.height/2, this.depth/2)
          );
          lineGeometry2.vertices.push(
            new THREE.Vector3( lineX, 0, this.depth/2+1 ),
            new THREE.Vector3( lineX+deltaX, 0, this.depth/2)
          );
        }
      }
      var line = new THREE.LineSegments( lineGeometry, lineMaterial );
      var line2 = new THREE.LineSegments( lineGeometry2, lineMaterial2 );
      this.group.add( line );
      this.group.add( line2 );*/
    }

    this.group.position.x = this.center.x;
    this.group.position.y = this.center.y;
    this.group.position.z = this.center.z;
    if (this.isMainContainer) {
      ground.position.y = -this.height/2-this.offset;
    }
    scene.add(this.group);

    //gui.save();
  },

  /*generateGui: function() {
    if (gui.__folders[this.name] === undefined) {
      gui.remember(this);
      this.gui = gui.addFolder(this.name);
      this.gui.add(this,'transparent').onChange(updateContainer);
      this.gui.add(this,'top').onChange(updateContainer);
      this.gui.add(this,'bottom').onChange(updateContainer);
      this.gui.add(this,'left').onChange(updateContainer);
      this.gui.add(this,'right').onChange(updateContainer);
      this.gui.add(this,'front').onChange(updateContainer);
      this.gui.add(this,'back').onChange(updateContainer);
      if (this.isMainContainer) {
        this.gui.add(this,'width',50,500).onChange(updateContainer);
        this.gui.add(this,'height',50,500).onChange(updateContainer);
        this.gui.add(this,'depth',50,500).onChange(updateContainer);
      }
      this.gui.add(this,'thickness',1,10).step(1).onChange(updateContainer);
      /*this.gui.add(this,'slots_number_depth',1,9).step(2).onChange(function(value){
        this.slots_number_depth += 1;
        updateContainer();
      });
      this.gui.add(this,'slots_number_width',1,12).step(2).onChange(function(value){
        this.slots_number_width += 1;
        updateContainer();
      });
      this.gui.add(this,'slots_number_height',1,12).step(2).onChange(function(value){
        this.slots_number_height += 1;
        updateContainer();
      });*/
      /*this.gui.add(this,'offset',0,this.thickness*3).onChange(updateContainer);
      this.gui.add(this,'separation_thickness', 1, 10).step(1).onChange(updateContainer);

      this.gui.open();
    }
  },*/

  getMeshGroup: function() {
    return this.group;
  }
};