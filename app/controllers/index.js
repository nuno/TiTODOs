var tasksStatusToSelect = 'pending';

function todoListClicked(e) {
  // get the clicked item from that section
  var item = e.section.getItemAt(e.itemIndex);

  // clicked row
  Ti.API.debug(JSON.stringify(item));

  var options = Ti.UI.createOptionDialog({
    cancel: 3,
    title: item.text.text,
    options: [item.properties.status === 'completed' ? 'Mark un-completed' : 'Mark completed', 'Edit', 'Share', 'Cancel'],
  });

  options.addEventListener('click', function(eOptions) {
    switch (eOptions.index) {
      case 0:
        var myModel = Alloy.Collections.tasks.at(e.itemIndex);
        myModel.set('status', myModel.get('status') === 'completed' ? 'pending' : 'completed');
        myModel.set('lastModifiedDate', require('alloy/moment')().toISOString());
        myModel.save();
        loadTasks();
        break;
      case 1:
        Alloy.Globals.pageStack.open(Alloy.createController('form', {
          refreshCollection: loadTasks,
          itemIndex: e.itemIndex
        }).getView());
        break;
      case 2:
        require('com.alcoapps.socialshare').share({
          status: item.text.text,
          image: item.image.image,
          androidDialogTitle: 'Do you really want to share your task?'
        });
        break;
    }
  });
  options.show();
}

function loadTasks(_status) {
  status = _status || tasksStatusToSelect;
  Alloy.Collections.tasks.fetch({
    query: "SELECT * FROM tasks WHERE status='" + status + "' ORDER BY lastModifiedDate DESC"
  });
}
// Load the data into the collection, collection will bind the data into the ListView automaticly
loadTasks();

function transfomer(model) {
  var transform = model.toJSON();

  transform.prettyTime = require('alloy/moment')(transform.lastModifiedDate).fromNow();
  return transform;
}

// Reload the data after clicked on tabbed bar button
$.segmentBar.on('CHANGE_INDEX', function(e) {
  tasksStatusToSelect = e.source.index === 1 ? 'completed' : 'pending';
  loadTasks();
});

// Open add new screen
function addBtnClicked() {
  Alloy.Globals.pageStack.open(Alloy.createController('form', {
    refreshCollection: loadTasks
  }).getView());
}

Alloy.Globals.pageStack.open($.index);
