class LogJSON extends HTMLElement {
    constructor() {
        super();

        var shadow = this.attachShadow({
            mode: 'open'
        });

        var sortLog = document.createElement("sort-log");
        document.getElementsByTagName("body")[0].appendChild(sortLog);

        var text = document.getElementsByTagName('sort-log')[0];
        var urlJSON = this.innerText || this.textContent;
        $.getJSON(urlJSON, function () {
                console.log("success");
            })
            .done(function (data) {
                console.log("done");
                text.innerText = JSON.stringify(data);
                console.log(data);
            })
            .fail(function () {
                console.log("error");
                text.innerText = "ERROR";
            });
        this.style.display = "none";
    }
}

customElements.define('log-json', LogJSON);