const _browser = this.chrome;
const storage = _browser.storage.sync;

function setErrorText(errorText) {
	var divError=document.getElementById("error");
	divError.innerText=errorText + "\n";
};

function returnError(errorText) {
	setErrorText(errorText);
	throw "";
};

function removeSpaces(string) {
	while (string.charAt(string.length - 1) === " ") {
		string=string.slice(0, string.length - 1);
	}

	if (string.charAt(0) === " ") {
		var temp=string.split(" ");
		string=temp[temp.length - 1];
	}

	return string;
};

function removeSkypeFormatting(string) {
	if (string.charAt(0) === "[") {
		var temp=string.split(" ");
		string=temp[temp.length - 1];
	}

	return string;
};

function openWindow(url, parameter) {
    _browser.tabs.create({
            url: url + parameter
        }, (tab) => {window.close();}
    );
};

function inputParameterListener(e) {
    var enter=13;

	if (e.keyCode === enter) {
		const url = e.target.getAttribute("data-url");
	    let parameter = e.target.value;
	    parameter = removeSpaces(parameter);
	    parameter = removeSkypeFormatting(parameter);
	
	    if (parameter === "") {
		    returnError("Please insert parameter");
	    } else if (url === undefined) {
		    returnError("Please define URL in Options");
	    } else {
		    openWindow(url, parameter);
	    }
	}
};

function listenInputParameter(inputParameter) {
	if (inputParameter.addEventListener) {
		inputParameter.addEventListener("keydown", inputParameterListener, false);
	} else if (inputParameter.attachEvent) {
		inputParameter.attachEvent("keydown", inputParameterListener);
	}
};

function onLoad() {
    storage.get(STORAGE_ITEM, (item) => {
        const parameters = item[STORAGE_ITEM];
        const parametersEl = document.getElementById("parameters");
        if (parameters == undefined || parameters.length == 0) {
            returnError("Please add URL in Options");
            return;
        }
        for (let i = 0; i < parameters.length; i++) {
            const parameter = parameters[i];
            const div = document.createElement("div");
            div.className = "parameter";
            
            const label = document.createElement("label");
            label.className = "name";
            label.innerText = parameter[NAME_FIELD];
            label.title = parameter[NAME_FIELD];
            
            const input = document.createElement("input");
            input.setAttribute("data-url", parameter[URL_FIELD]);
            input.title = parameter[URL_FIELD];
            input.className = "url";
            listenInputParameter(input);
            
            div.appendChild(label);
            div.appendChild(input);
            parametersEl.appendChild(div);
        }
    });
};

if (window.addEventListener) {
	window.addEventListener("load", this.onLoad, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", this.onLoad);
} else {
	document.addEventListener("load", this.onLoad, false);
}


