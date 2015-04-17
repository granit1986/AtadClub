var isEditable = false;

function changeMode(e) {
  if(isEditable){
    $.dashboard.stopEditing();
  } else {
    $.dashboard.startEditing();
  }
}

function handleEdit(e){
  $.button.title = 'Done';
  $.button.style = Ti.UI.iPhone.SystemButtonStyle.DONE;
  isEditable = true;
}

function handleCommit(e){
  $.button.title = 'Edit';
  $.button.style = Ti.UI.iPhone.SystemButtonStyle.PLAIN;
  isEditable = false;
}

function resetBadge(e){
  e.item.badge = 0;
}