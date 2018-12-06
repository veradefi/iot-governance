var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var data = JSON.stringify({
  "scope": "catalogue",
  "code": "catalogue",
  "table": "catdata3",
  "json": "true"
});

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    console.log(this.responseText);
  }
});

xhr.open("POST", "http://127.0.0.1:8888/v1/chain/get_table_rows");

xhr.send(data);
