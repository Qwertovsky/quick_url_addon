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
    let errors = [];
    parameterDivs.forEach( (div) => {
        const name = div.querySelector("input." + NAME_CLASS).value.trim();
        const url = div.querySelector("input." + URL_CLASS).value.trim();

        if (!url) {
            errors.push("Please fill URL");
            return;
        } else if (!name) {
            errors.push("Please fill name");
            return;
	    }

        const parameter = {};
        parameter[NAME_FIELD] = name;
        parameter[URL_FIELD] = url;
	    parameters.push( parameter );
	});
	if (parameters.length == 0 && parameterDivs.length > 0) {
	    error.textContent = errors;
	} else {
	    storage.set({[STORAGE_ITEM] : parameters}, () => {error.textContent = _browser.runtime.lastError;} );
	}
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
    const parameterDiv = document.createElement('div');
    parameterDiv.className = PARAMETER_CLASS;
    
    const nameRowDiv = document.createElement('div');
    nameRowDiv.className = 'name_row';
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name: ';
    const nameInput = document.createElement('input');
    nameInput.className = NAME_CLASS;
    nameInput.placeholder = 'example';
    nameRowDiv.appendChild(nameLabel);
    nameRowDiv.appendChild(nameInput);
    
    const urlRowDiv = document.createElement('div');
    urlRowDiv.className = 'url_row';
    const urlLabel = document.createElement('label');
    urlLabel.textContent = 'URL: ';
    const urlInput = document.createElement('input');
    urlInput.className = URL_CLASS;
    urlInput.placeholder = 'http://example.com/{?}/open?p={?}';
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    deleteBtn.textContent = 'X';
    urlRowDiv.appendChild(urlLabel);
    urlRowDiv.appendChild(urlInput);
    urlRowDiv.appendChild(deleteBtn);
    
    parameterDiv.appendChild(nameRowDiv);
    parameterDiv.appendChild(urlRowDiv);    
    
    nameInput.value = name || "";
    nameInput.addEventListener("keydown", inputListener, false);
    urlInput.value = url || "";
    urlInput.addEventListener("keydown", inputListener, false);
    deleteBtn.addEventListener( "click", ()=>{parameterDiv.remove();} );

    return parameterDiv;
}

function inputListener(e) {
	if (e.keyCode == 13) {
		saveOptions();
	} else if (e.key == '/') {
	    console.log(e);
	    this.value = this.value + e.key;
	    e.preventDefault();
	}
	
}


document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
document.getElementById("add").addEventListener("click", addUrl);



