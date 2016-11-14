var Box = function(parameters) {
  this.name = 'container';
  this.isMainContainer = false;
  this.transparent = false;
  this.front = true;
  this.back = true;
  this.top = true;
  this.bottom = true;
  this.left = true;
  this.right = true;
  this.width = 100;
  this.height = 100;
  this.depth = 100;
  this.thickness = 6;
  this.offset = 0;

  this.color = 0xFFFFFF;
  this.rotation = {x:0,y:0,z:0};
  this.translation = {x:0,y:0,z:0};

  this.separation_columns = 0;
  this.separation_rows = 0;
  this.separation_thickness = 0;
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
  this.center = {x:this.width/2,y:this.height/2};
  this.paths = [];
  this.gui = null;
  this.setValues(parameters);
  this.generateGui();
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
    this.center = {x:this.width/2,y:this.height/2};
  },

  generateBox: function() {

    if (this.group!==undefined) {
      scene.remove(this.group);
    }

    this.group = new THREE.Group();

    if (this.top) {
      var panel_top = new Panel({
        name:this.name+'_TopPanel',
        width: this.width,
        height: this.depth,
        thickness: this.thickness,
        slots_number_width: this.slots_number_width,
        slots_number_height: this.slots_number_depth,
        rotation: {x:-Math.PI/2,y:0,z:0},
        translation: {x:0,y:0,z:this.height-this.thickness+this.offset},
        slots_bottom: this.front ? true : false,
        slots_invert_bottom: this.front ? true : false,
        slots_top: this.back ? true : false,
        slots_invert_top: this.back ? true : false,
        slots_left: this.left ? true : false,
        slots_right: this.right ? true : false
      });
      this.group.add(panel_top.getMeshGroup());
    }

    if (this.bottom) {
      var panel_bottom = new Panel({
        name:this.name+'_BottomPanel',
        width: this.width,
        height: this.depth,
        thickness: this.thickness,
        slots_number_width: this.slots_number_width,
        slots_number_height: this.slots_number_depth,
        translation: {x:0,y:0,z:-this.offset},
        rotation: {x:-Math.PI/2,y:0,z:0},
        slots_bottom: this.front ? true : false,
        slots_invert_bottom: this.front ? true : false,
        slots_top: this.back ? true : false,
        slots_invert_top: this.back ? true : false,
        slots_left: this.left ? true : false,
        slots_right: this.right ? true : false
      });
      this.group.add(panel_bottom.getMeshGroup());
    }

    if (this.left) {
      var panel_left = new Panel({
        name:this.name+'_LeftPanel',
        width: this.height,
        height: this.depth,
        thickness: this.thickness,
        slots_number_width: this.slots_number_height,
        slots_number_height: this.slots_number_depth,
        rotation: {x:0,y:-Math.PI/2,z:Math.PI/2},
        translation: {x:this.height/2,y:0,z:this.width/2-this.thickness+this.offset},
        slots_bottom: this.front ? true : false,
        slots_invert_bottom: this.front ? true : false,
        slots_top: this.back ? true : false,
        slots_invert_top: this.back ? true : false,
        slots_left: this.bottom ? true : false,
        slots_invert_left: this.bottom ? true : false,
        slots_right: this.top ? true : false,
        slots_invert_right: this.top ? true : false
      });
      this.group.add(panel_left.getMeshGroup());
    }

    if (this.right) {
      var panel_right = new Panel({
        name:this.name+'_RightPanel',
        width: this.height,
        height: this.depth,
        thickness: this.thickness,
        slots_number_width: this.slots_number_height,
        slots_number_height: this.slots_number_depth,
        rotation: {x:0,y:-Math.PI/2,z:Math.PI/2},
        translation: {x:this.height/2,y:0,z:-this.width/2-this.offset},
        slots_bottom: this.front ? true : false,
        slots_invert_bottom: this.front ? true : false,
        slots_top: this.back ? true : false,
        slots_invert_top: this.back ? true : false,
        slots_left: this.bottom ? true : false,
        slots_invert_left: this.bottom ? true : false,
        slots_right: this.top ? true : false,
        slots_invert_right: this.top ? true : false
      });
      this.group.add(panel_right.getMeshGroup());
    }

    if (this.back) {
      var panel_back = new Panel({
        name:this.name+'_BackPanel',
        width: this.width,
        height: this.height,
        thickness: this.thickness,
        slots_number_width: this.slots_number_width,
        slots_number_height: this.slots_number_height,
        translation: {x:0,y:this.height/2,z:-this.depth/2-this.offset},
        slots_bottom: this.bottom ? true : false,
        slots_top: this.top ? true : false,
        slots_left: this.left ? true : false,
        slots_right: this.right ? true : false
      });
      this.group.add(panel_back.getMeshGroup());
    }

    if (this.front) {
      var panel_front = new Panel({
        name:this.name+'_BackPanel',
        width: this.width,
        height: this.height,
        thickness: this.thickness,
        slots_number_width: this.slots_number_width,
        slots_number_height: this.slots_number_height,
        translation: {x:0,y:this.height/2,z:this.depth/2-this.thickness+this.offset},
        slots_bottom: this.bottom ? true : false,
        slots_top: this.top ? true : false,
        slots_left: this.left ? true : false,
        slots_right: this.right ? true : false
      });
      this.group.add(panel_front.getMeshGroup());
    }

    var dColumns = (this.width - this.thickness*2) / this.separation_columns;
    for (var i = 0;i < this.separation_columns-1;i++) {
      var cSeparation = new Panel({
        debug: true,
        name:this.name+'_col_'+i,
        width: this.depth,
        height: this.height,
        thickness: this.separation_thickness,
        slots_size: this.thickness,
        slots_number_width: this.slots_number_depth,
        slots_number_height: this.separation_rows % 2 === 0 ? this.separation_rows+1 : this.separation_rows,
        rotation: {x:0,y:Math.PI/2,z:0},
        translation: {x:0,y:this.height/2,z:-this.width/2+this.thickness+(i+1)*dColumns-this.separation_thickness/2},
        slots_top: this.top ? true : false,
        slots_invert_top: this.top ? true : false,
        slots_right: this.back ? true : false,
        slots_invert_right: this.back ? true : false,
        slots_bottom: this.bottom ? true : false,
        slots_invert_bottom: this.bottom ? true : false,
        slots_left:this.front ? true : false,
        slots_invert_left: this.front ? true : false,
      });
      this.group.add(cSeparation.getMeshGroup());
    }

    var dRows = (this.height - this.thickness*2) / this.separation_rows;
    for (i = 0;i < this.separation_rows-1;i++) {
      var rSeparation = new Panel({
        debug: true,
        name:this.name+'_row_'+i,
        width: this.width,
        height: this.depth,
        thickness: this.separation_thickness,
        slots_size: this.thickness,
        slots_number_width: this.slots_number_width,
        slots_number_height: this.slots_number_depth,
        rotation: {x:Math.PI/2,y:0,z:0},
        translation: {x:0,y:0,z:-this.height+this.thickness+(i+1)*dRows-this.separation_thickness/2},
        slots_top: this.front ? true : false,
        slots_invert_top: this.front ? true : false,
        slots_right: this.right ? true : false,
        slots_invert_right: this.right ? true : false,
        slots_bottom: this.back ? true : false,
        slots_invert_bottom: this.back ? true : false,
        slots_left:this.left ? true : false,
        slots_invert_left: this.left ? true : false,
      });
      this.group.add(rSeparation.getMeshGroup());
    }

    if (DEBUG) {
      var geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
      var material = new THREE.MeshBasicMaterial( {color: 0x00ff00,wireframe:true} );
      var outlines = new THREE.Mesh( geometry, material );
      outlines.translateY(this.height/2);
      this.group.add( outlines );
    }

    this.group.translateY(-this.height/2);
    if (this.isMainContainer) {
      ground.position.y = -this.height/2-this.offset;
    }
    scene.add(this.group);

    gui.save();
  },

  generateGui: function() {
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

      this.gui.add(this,'width',50,500).onChange(updateContainer);
      this.gui.add(this,'height',50,500).onChange(updateContainer);
      this.gui.add(this,'depth',50,500).onChange(updateContainer);
      this.gui.add(this,'thickness',1,10).step(1).onChange(updateContainer);
      this.gui.add(this,'slots_number_depth',1,9).step(2).onChange(function(value){
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
      });
      this.gui.add(this,'offset',0,this.thickness*3).onChange(updateContainer);

      this.gui.add(this,'separation_columns',0,10).step(1).onChange(updateContainer);
      this.gui.add(this,'separation_rows',0,10).step(1).onChange(updateContainer);
      this.gui.add(this,'separation_thickness', 1, 10).step(1).onChange(updateContainer);

      this.gui.open();
    }
  },

  getMeshGroup: function() {
    return this.group;
  }
};