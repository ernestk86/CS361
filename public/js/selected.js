function select(dropdown, id) {
  for ( i = 0; i < dropdown.options.length; i++ ) {
    if ( dropdown.options[i].value == id ) {
      dropdown.options[i].selected = "selected";
      break;
    }
  }
  return;
}
