/*
var newTable = document.createElement("table");
newTable.id = "myTable";
var header = document.createElement("tr");
var headerNames = ["Name", "Reps", "Weight", "Date", "Unit", ""];
headerNames.forEach(function(item){
  var th = document.createElement("th");
  th.textContent = item;
  header.appendChild(th);
});

newTable.appendChild(header);

var req = new XMLHttpRequest();
req.open('GET', 'http://flip2.engr.oregonstate.edu:6377/');
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
req.addEventListener('load', function() {
  if(req.status >= 200 && req.status < 400) {
    var response = JSON.parse(req.responseText);
    console.log(req.responseText);
    console.log(response.length);
    var tbody = document.createElement("tbody");

    for (var i = 0; i < response.length; i++){
      var row = document.createElement("tr");
      row.id = "row"+response[i].id;

      var cell = document.createElement("td");
      cell.textContent = response[i].name;
      cell.id = "name"+response[i].name;
      row.appendChild(cell);

      var cell2 = document.createElement("td");
      cell2.textContent = response[i].reps;
      cell2.id = "reps"+response[i].reps;
      row.appendChild(cell2);

      var cell3 = document.createElement("td");
      cell3.textContent = response[i].weight;
      row.appendChild(cell3);

      var cell4 = document.createElement("td");
      cell4.textContent = response[i].date;
      row.appendChild(cell4);

      var cell5 = document.createElement("td");
      if (response[i].lbs == 1) {
        cell5.textContent = "lbs";
      } else {
        cell5.textContent = "kg";
      }
      row.appendChild(cell5);

      var cell6 = document.createElement("td");

      var editForm = document.createElement("form");
      var formID = document.createElement("input");
      formID.setAttribute("type", "hidden");
      formID.value = response[i].id;
      editForm.appendChild(formID);

      var editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.setAttribute("type", "button");
      editButton.value = response[i].id;
      var url = "'http://flip2.engr.oregonstate.edu:6377/updateHome/?id="+response[i].id+"\&name="+response[i].name+"\&reps="+response[i].reps+"\&weight="+response[i].weight+"\&date="+response[i].date+"\&unit="+response[i].lbs+"\'";
      var target = "window.open(" + url + ", '_self')";
      editButton.setAttribute("onclick", target);

      var delButton = document.createElement("button");
      delButton.textContent = "Delete";
      delButton.setAttribute("type", "button");
      delButton.value = response[i].id;
      delButton.setAttribute("onclick", "deleteRow(this.value)");

      editForm.appendChild(editButton);
      editForm.appendChild(delButton);
      cell6.appendChild(editForm);
      row.appendChild(cell6);

      tbody.appendChild(row);
    }

    newTable.appendChild(tbody);
  } else {
    console.log("Error in network request: " + req.statusText);
  }
});
req.send(null);

document.getElementById("mainTable").appendChild(newTable);

document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
  document.getElementById('exSubmit').addEventListener('click', function(event){
    var req = new XMLHttpRequest();
    var myId = {};
    var payload = {name:null, reps:null, weight:null, date:null, unit:null, id:null};
    payload.name = document.getElementById('name').value;
    payload.reps = document.getElementById('reps').value;
    payload.weight = document.getElementById('weight').value;
    payload.date = document.getElementById('date').value;
    payload.unit = document.getElementById('unit').value;

    if (payload.name != "") {

      req.open('GET', 'http://flip2.engr.oregonstate.edu:6377/insert?'+'name='+payload.name+"\&reps="+payload.reps+"\&weight="+payload.weight+"&date="+payload.date+"&unit="+payload.unit);
      req.addEventListener('load', function() {
        if(req.status >= 200 && req.status < 400) {
          var response = JSON.parse(req.responseText);
          myId.id = response;
          console.log("Response "+response)
          console.log("Unparsed "+req.responseText);
          var row = document.createElement("tr");
          row.id = "row"+myId.id;

          var cell = document.createElement("td");
          cell.textContent = payload.name;
          row.appendChild(cell);

          var cell2 = document.createElement("td");
          cell2.textContent = payload.reps;
          row.appendChild(cell2);

          var cell3 = document.createElement("td");
          cell3.textContent = payload.weight;
          row.appendChild(cell3);

          var cell4 = document.createElement("td");
          cell4.textContent = payload.date;
          row.appendChild(cell4);

          var cell5 = document.createElement("td");
          if (payload.unit == 1) {
            cell5.textContent = "lbs";
          } else {
            cell5.textContent = "kg";
          }
          row.appendChild(cell5);


          var cell6 = document.createElement("td");
          var editForm = document.createElement("form");
          var formID = document.createElement("input");
          formID.setAttribute("type", "hidden");
          formID.value = myId.id;
          editForm.appendChild(formID);
          var editButton = document.createElement("button");
          editButton.textContent = "Edit";
          editButton.setAttribute("type", "button");
          editButton.value = myId.id;
          var url = "'http://flip2.engr.oregonstate.edu:6377/updateHome/?id="+myId.id+"\&name="+payload.name+"\&reps="+payload.reps+"\&weight="+payload.weight+"\&date="+payload.date+"\&unit="+payload.lbs+"\'";
          var target = "window.open(" + url + ", '_self')";
          editButton.setAttribute("onclick", target);

          var delButton = document.createElement("button");
          delButton.textContent = "Delete";
          delButton.setAttribute("type", "button");
          delButton.value = myId.id;
          delButton.setAttribute("onclick", "deleteRow(this.value)");

          editForm.appendChild(editButton);
          editForm.appendChild(delButton);
          cell6.appendChild(editForm);
          row.appendChild(cell6);

          myBody = document.getElementsByTagName("body")[0];
          myTable = myBody.getElementsByTagName("table")[0];
          myTableBody = myTable.getElementsByTagName("tbody")[0];
          myTableBody.appendChild(row);

        } else {
          console.log("Error in network request: " + req.statusText);
        }

      });
    }
    req.send(null);
    event.preventDefault();
    myId.id = req.responseText;
    console.log("wMyId = " + req.responseText);
  })
}

function deleteRow(rowIn){
  var idIn = rowIn;
  var rowId = "row" + idIn;
  var req = new XMLHttpRequest();
  var payload = {id:null};
  payload.id = idIn;
  req.open('GET', 'http://flip2.engr.oregonstate.edu:6377/delete?'+'id='+payload.id);
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');//'application/x-www-url-encoded');
  req.addEventListener('load', function() {
    if(req.status >= 200 && req.status < 400) {
      console.log(req.responseText);
    } else {
      console.log("Error in network request: " + req.statusText);
    }
  });
  req.send(null);
  event.preventDefault();
  var row = document.getElementById(rowId);
  row.parentNode.removeChild(row);
}
*/
