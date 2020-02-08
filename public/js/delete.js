function deleteResource(id){
    console.log("Delete Resource Ran");
    $.ajax({
        url: '/dr' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteResourceProduct(rid, pid){
  $.ajax({
      url: '/resource/' + rid + '/product/' + pid,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          } 
      }
  })
};

function deleteProduct(id){
    $.ajax({
        url: '/dp' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};