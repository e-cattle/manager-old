class MainController{

    getAllDevices(){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "http://localhost:3000/devices", false );
        xmlHttp.send( null );

        var devices = JSON.parse(xmlHttp.responseText);
        var tbody = document.getElementById("deviceTable").querySelector("tbody");
        var row;

        devices.forEach(device => {

            row = document.createElement("tr");
            var tdName = document.createElement("td");
            var tdDescription = document.createElement("td");
            var tdBranch = document.createElement("td");
            var tdModel = document.createElement("td");
            var tdVersion = document.createElement("td");
            var tdMac = document.createElement("td");
            var tdActive = document.createElement("td");

            tdName.innerHTML = device.name;
            tdDescription.innerHTML = device.description;
            tdBranch.innerHTML = device.branch;
            tdModel.innerHTML = device.model;
            tdVersion.innerHTML = device.version;
            tdMac.innerHTML = device.mac;
            tdActive.innerHTML = device.enable;

            row.appendChild(tdName);
            row.appendChild(tdDescription);
            row.appendChild(tdBranch);
            row.appendChild(tdModel);
            row.appendChild(tdVersion);
            row.appendChild(tdMac);
            row.appendChild(tdActive);

            tbody.appendChild(row);
        });

    }

}

var mainController = new MainController();