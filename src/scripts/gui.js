var controlKit;

var globalParameters = {
  debug: false,
  container: {
    width: {
      value:300,
      range:[10,1000]
    },
    height: {
      value:300,
      range:[10,1000]
    },
    depth: {
      value:300,
      range:[10,1000]
    },
    thickness: {
      value:6,
      range:[1,10]
    },
    separation_thickness: {
      value:3,
      range:[1,10]
    },
    top: true,
    bottom: true,
    left: true,
    right: true,
    front: false,
    back: true,
    showSeparations: true
  },
  drawers: {
    thickness: {
      value:3,
      range:[1,10]
    },
    previewOffset: {
      value:0,
      range:[0,100]
    }
  }  
};

function createGUI() {
  controlKit = new ControlKit({loadAndSave:true});
  controlKit.addPanel({
    label:'Components Box Generator',
    width:300,
    onChange:updateBoxes
  })
  .addGroup({label:'Main Controls'})
    .addCheckbox(globalParameters,'debug',{label:'DEBUG',onChange:updateBoxes})
  .addGroup({label:'Container'})
    .addSlider(globalParameters.container.width,'value','range',{label:'Width',onChange:updateBoxes,step:1,dp:0})
    .addSlider(globalParameters.container.height,'value','range',{label:'Height',onChange:updateBoxes,step:1,dp:0})
    .addSlider(globalParameters.container.depth,'value','range',{label:'Depth',onChange:updateBoxes,step:1,dp:0})
    .addSlider(globalParameters.container.thickness,'value','range',{label:'Thickness',onChange:updateBoxes,step:1,dp:0})
    .addSlider(globalParameters.container.separation_thickness,'value','range',{label:'Separation',onChange:updateBoxes,step:1,dp:0})
    .addCheckbox(globalParameters.container,'showSeparations',{label:'Show Separators',onChange:updateBoxes})
    .addSubGroup({label:'Faces'})
      .addCheckbox(globalParameters.container,'top',{label:'Top Face',onChange:updateBoxes})
      .addCheckbox(globalParameters.container,'bottom',{label:'Bottom Face',onChange:updateBoxes})
      .addCheckbox(globalParameters.container,'left',{label:'Left Face',onChange:updateBoxes})
      .addCheckbox(globalParameters.container,'right',{label:'Right Face',onChange:updateBoxes})
      .addCheckbox(globalParameters.container,'front',{label:'Front Face',onChange:updateBoxes})
      .addCheckbox(globalParameters.container,'back',{label:'Back Face',onChange:updateBoxes})
  .addGroup({label:'Drawers'})
    .addSlider(globalParameters.drawers.thickness,'value','range',{label:'Thickness',onChange:updateBoxes,step:1,dp:0})
    .addSlider(globalParameters.drawers.previewOffset,'value','range',{label:'Offset',onChange:updateBoxes,step:1,dp:0})
    .addButton('Add Drawer',addWidget);
  initMaterials();
}