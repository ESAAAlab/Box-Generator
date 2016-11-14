var oThickness = 6;
var oWidth = 300;
var oHeight = 300;
var oDepth = 300;
var oDepthSlots = 5;
var oWidthSlots = 5;
var oHeightSlots = 5;
var oOffset = 0;
var oRows = 8;
var oColumns = 6;
var oBottom = true;
var sThickness = 3;

var containerGroup;
var invalid = [];

function updateContainer() {
  containerGroup.generateBox();

  for (var i = 0;i<invalid.length;i++) {
    var item = invalid[i];
    scene.getObjectByName(item).material = errorPlywoodMaterial;
  }
  invalid = [];
  render();
}

function generateContainer() {
  containerGroup = new Box({
    name:'container',
    isMainContainer: true,
    width: oWidth,
    height: oHeight,
    depth: oDepth,
    thickness: oThickness,
    separation_thickness: sThickness,
    separation_columns: oColumns,
    separation_rows: oRows,
    slots_number_width: oWidthSlots,
    slots_number_height: oHeightSlots,
    slots_number_depth: oDepthSlots,
  });

  // var separation = new Panel({
  //   name:'sep',
  //   width: oWidth,
  //   height: oDepth,
  //   thickness: sThickness,
  //   //slots_size: oThickness,
  //   slots_left: false,
  //   slots_top: true,
  //   slots_invert_top: true,
  //   slots_right: true,
  //   slots_invert_right: true,
  //   slots_bottom: true,
  //   slots_invert_bottom: true,
  // });
  // scene.add(separation.getMeshGroup());

  updateContainer();
}