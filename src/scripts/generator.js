var containerGroup;
var boxes = [];
var invalid = [];

function updateBoxes() {
  containerGroup.updateValuesFromGlobalParameter();

  for (var b in boxes) {
    scene.remove(boxes[b]);
    scene.remove(boxes[b].group);
  }

  boxes = [];

  var gridIndex = 1;
  $('.gs-w').each(function(){
    this.id = gridIndex;
    gridIndex++;
    this.w = $(this).attr('data-sizex');
    this.h = $(this).attr('data-sizey');
    this.x = $(this).attr('data-col');
    this.y = $(this).attr('data-row');
    boxes.push(createDrawer(this.id,containerGroup, this.w, this.h, this.x, this.y));
  });

  for (var i = 0;i<invalid.length;i++) {
    var item = invalid[i];
    scene.getObjectByName(item).material = errorPlywoodMaterial;
  }
  invalid = [];
  render();
}

function createDrawer(id, mainContainer, unitWidth, unitHeight, x, y) {
  if (id !== undefined && id !== null) {
    var d = new Box({
      name:'drawer_'+id,
      isMainContainer: false,
      mainContainer: mainContainer,
      unitWidth: unitWidth,
      unitHeight: unitHeight,
      unitDepth: 1,
      top: false,
      delta: {x:x,y:y,z:0}
    });
    return d;
  }
}

function createContainer() {
  containerGroup = new Box({
    name:'container',
    isMainContainer: true,
    front:false
  });

  updateBoxes();
}