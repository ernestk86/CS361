function searchDriverByFirstName() {
  if (document.getElementById('fname_search_string').value.length != 0) {
    var fname_search_string = document.getElementById('fname_search_string').value
    window.location = '/driver/search/' + encodeURI(fname_search_string)
  }
}
