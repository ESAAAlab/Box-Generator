var gridster, serialization;

function loadGridFromLocalStorage() {
  // Load grid from localstorage
  serialization = JSON.parse(localStorage.getItem('grid'));
  if (serialization === null) {
    // Save default grid to localstorage if nothing exists
    serialization = [
      [{"col":1,"row":1,"size_x":2,"size_y":2},{"col":3,"row":1,"size_x":1,"size_y":2},{"col":4,"row":1,"size_x":1,"size_y":1},{"col":1,"row":3,"size_x":1,"size_y":1},{"col":2,"row":3,"size_x":2,"size_y":1},{"col":4,"row":2,"size_x":1,"size_y":1},{"col":1,"row":4,"size_x":4,"size_y":1},{"col":4,"row":3,"size_x":1,"size_y":1}]
    ];
  }

  // sort serialization
  serialization = Gridster.sort_by_row_and_col_asc(serialization);
}

function reloadGrid(e,ui) {
  // Save grid to localstorage on change
  localStorage.setItem('grid',JSON.stringify(gridster.serialize()));

  // Find max number of rows and columns & update
  var columns = Math.max.apply(Math,
    gridster.$widgets.map(function() {
              return ($(this).attr('data-col')*1+$(this).attr('data-sizex')*1-1);
            }).get());
  var rows = Math.max.apply(Math,
    gridster.$widgets.map(function() {
              return ($(this).attr('data-row')*1+$(this).attr('data-sizey')*1-1);
            }).get());
  containerGroup.separation_columns = columns;
  containerGroup.separation_rows = rows;
  updateBoxes();
}

function removeWidget(el) {
  gridster.remove_widget(el);
  reloadGrid();
}

function addWidget() {
  gridster.add_widget('<li><span>X</span></li>', 1, 1, 1, 1);
  reloadGrid();
}

function initGrid() {
  loadGridFromLocalStorage();

  // Init gridster object
  gridster = $(".gridster ul").gridster({
    widget_base_dimensions: [50, 50],
    widget_margins: [3,3],
    min_cols:1,
    draggable: {
      stop: function(e,ui) {
        reloadGrid(e,ui);
      }
    },
    resize: {
      enabled: true,
      stop: function(e,ui) {
        reloadGrid(e,ui);
      }
    }
  }).data('gridster');

  gridster.remove_all_widgets();
  $.each(serialization, function () {
      gridster.add_widget('<li id="'+this.id+'"><span id="close" onclick="removeWidget(this.parentNode)">x</span></li>', this.size_x, this.size_y, this.col, this.row);
  });

  // Create 3D objects
  createContainer();
  // Update 3D objects with data from grid
  reloadGrid();
}