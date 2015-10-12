var args = arguments[0] || {};

if (args.hasOwnProperty('itemIndex')) {
  // Edit mode
  var myModel = Alloy.Collections.tasks.at(args.itemIndex);
  $.text.value = myModel.get('text');
} else {
  // Add mode
  var myModel = Alloy.createModel('tasks');
  myModel.set("status", "pending");
}

// Focus on 1st input
function windowOpened() {
  $.text.focus();
}

function saveBtnClicked() {
  myModel.set("text", $.text.value);
  myModel.set("lastModifiedDate", Alloy.Globals.moment().toISOString());

  // insert if add, update if edit
  myModel.save();

  // Refresh home screen
  args.refreshCollection();

  Alloy.Globals.pageStack.back();
}