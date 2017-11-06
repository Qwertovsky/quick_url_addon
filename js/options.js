const PARAMETERS_ID = "parameters";
const PARAMETER_CLASS = "parameter";
const NAME_CLASS = "name";
const URL_CLASS = "url";

const _browser = this.chrome;
const storage = _browser.storage.sync;

function saveOptions() {
    const parameterDivs = Array.from(document.getElementsByClassName(PARAMETER_CLASS));

    var error=document.getElementById("error");
    error.textContent = "";

    let parameters = [];
    parameterDivs.forEach( (div) => {
        const name = div.querySelector("input." + NAME_CLASS).value.trim();
        const url = div.querySelector("input." + URL_CLASS).value.trim();

        if (!url) {
            error.textContent = "Please fill URL";
            return;
        } else if (!name) {
            error.textContent = "Please fill name";
            return;
	    }

        const parameter = {};
        parameter[NAME_FIELD] = name;
        parameter[URL_FIELD] = url;
	    parameters.push( parameter );
	});
	storage.set({[STORAGE_ITEM] : parameters}, () => {error.textContent = _browser.runtime.lastError;} );
}

function restoreOptions() {
	storage.get(STORAGE_ITEM, function(item) {
	    const parameters = item[STORAGE_ITEM];
        const parametersEl = document.getElementById(PARAMETERS_ID);
        if (parameters == undefined || parameters.length == 0) {
            parametersEl.appendChild(createInputs());
        } else {
            for(let i=0; i < parameters.length; i++) {
                const name = parameters[i][NAME_FIELD];
                const url = parameters[i][URL_FIELD];
                const div = createInputs(name, url);
                parametersEl.appendChild(div);
            }
        }
    });
}

function addUrl() {
    const div = createInputs();
    const urlsEl = document.getElementById(PARAMETERS_ID);
    urlsEl.appendChild(div);    
}

function createInputs(name, url) {
    const div = document.createElement("div");
    div.className = PARAMETER_CLASS;
    
    div.insertAdjacentHTML("beforeend",
        "<div class='name_row'><label>Name: </label>"
            + "<input class='" + NAME_CLASS + "' placeholder='example'/></div>"
        + "<div class='url_row'><label>URL: </label>"
            + "<input class='" + URL_CLASS + "' placeholder='http://example.com?p='/>[PARAMETER]"
            + "<button class='delete'>X</button> </div");
    const inputName = div.querySelector("input." + NAME_CLASS);
    inputName.value = name || "";
    
    const inputUrl = div.querySelector("input." + URL_CLASS);
    inputUrl.value = url || "";
    
    const deleteBtn = div.querySelector("button.delete");
    deleteBtn.addEventListener( "click", ()=>{div.remove();} );

    return div;
}


document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
document.getElementById("add").addEventListener("click", addUrl);

var enter=13;

function inputListener(e) {
	if (e.keyCode === enter) {
		saveOptions();
	}
}

function listenInput(input) {
	if (input.addEventListener) {
		input.addEventListener("keydown", inputListener, false);
	} else if (input.attachEvent) {
		input.attachEvent("keydown", inputListener);
	}
}

function listen() {
	listenInput(document.getElementsByClassName(URL_CLASS));
	listenInput(document.getElementsByClassName(NAME_CLASS));
}

if (window.addEventListener) {
	window.addEventListener("load", listen, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", listen);
} else {
	document.addEventListener("load", listen, false);
}
