function addResource() {
    var response = "";
    var jsonData = new Object();
    jsonData.name = document.getElementById("name").value;
    jsonData.location = document.getElementById("location").value;
    jsonData.description = document.getElementById("description").value;
    jsonData.owner = document.getElementById("owner").value;
    if (jsonData.name == "" || jsonData.location == "" || jsonData.description == "") {
        document.getElementById("message").innerHTML = 'All fields are required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }
    var request = new XMLHttpRequest();
    request.open("POST", "/add-resource", true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        console.log(response)
        if (response.message == undefined) {
            document.getElementById("message").innerHTML = 'Added Resource: ' +
                jsonData.name + '!';
            document.getElementById("message").setAttribute("class", "text-success");
            document.getElementById("name").value = "";
            document.getElementById("location").value = "";
            document.getElementById("description").value = "";
            document.getElementById("owner").value = "";
            window.location.href = 'index.html';
        }
        else {
            document.getElementById("message").innerHTML = 'Unable to add resource!';
            document.getElementById("message").setAttribute("class", "text-danger");
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };
    request.send(JSON.stringify(jsonData));
}