const _browser = this.chrome;
const storage = _browser.storage.sync;

function setErrorText(errorText) {
	var divError=document.getElementById("error");
	divError.innerText=errorText + "\n";
};

function openWindow(url, parameter) {
    _browser.tabs.create({
            url: url + parameter
        }, (tab) => {}
    );
    window.close();
};

function tryOpenWindow(url, parameter) {
        parameter = parameter.trim();
	
	    if (parameter === "") {
		    setErrorText("Please insert parameter");
	    } else if (url === undefined) {
		    setErrorText("Please define URL in Options");
	    } else {
		    openWindow(url, parameter);
	    }
}

function inputParameterListener(e) {
	if (e.keyCode === 13) {
		const url = e.target.getAttribute("data-url");
	    const parameter = e.target.value;
	    tryOpenWindow(url, parameter);
	}
};

function onLoad() {
    storage.get(STORAGE_ITEM, (item) => {
        const parameters = item[STORAGE_ITEM];
        const parametersEl = document.getElementById("parameters");
        if (parameters == undefined || parameters.length == 0) {
            setErrorText("Please add URL in Options");
            const optionsBtn = document.createElement('button');
            optionsBtn.textContent = 'Options';
            optionsBtn.addEventListener('click', function() {
                _browser.runtime.openOptionsPage();
                window.close();
            });
            parametersEl.appendChild(optionsBtn);
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
            input.addEventListener("keydown", inputParameterListener, false);

            const btn = document.createElement("button");
            btn.title = `Open ${parameter[NAME_FIELD]}`;
            btn.innerHTML = "»";
            btn.addEventListener("click", () => {tryOpenWindow(parameter[URL_FIELD], input.value.trim())}, false);
            input.addEventListener("input", () => {btn.title = `Open ${parameter[NAME_FIELD]} ${input.value}`;}, false);
            
            div.appendChild(label);
            div.appendChild(input);
            div.appendChild(btn);
            parametersEl.appendChild(div);
        }
    });
};

document.addEventListener("DOMContentLoaded", onLoad);
