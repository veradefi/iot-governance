var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;



function getCat() {
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
      //console.log(this.responseText);
      var jsonText=JSON.parse(this.responseText);
      //console.log(jsonText)
      var hrefToId={}
      jsonText.rows.map(item => {
        hrefToId[item.href]=item;
      })
      //console.log(hrefToId)
      getMeta(hrefToId);
    }
  });

  xhr.open("POST", "http://127.0.0.1:8888/v1/chain/get_table_rows");

  xhr.send(data);
}

function getMeta(cb) {
  var data2 = JSON.stringify({
    "scope": "catalogue",
    "code": "catalogue",
    "table": "metadata3",
    "json": "true"
  });
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      //console.log(this.responseText);
      var jsonText=JSON.parse(this.responseText);
      //console.log(jsonText)
      var hrefToId={}
      jsonText.rows.map(item => {
        if (!(item.hrefName in hrefToId)) {
          hrefToId[item.hrefName]=[];
        }
        hrefToId[item.hrefName].push({ 'rel': item.rel, 'val' : item.val});
      })
      //console.log(hrefToId)
      getgraph(hrefToId, cb);
    }
  });

  xhr.open("POST", "http://127.0.0.1:8888/v1/chain/get_table_rows");

  xhr.send(data2);
}

function getgraph(metaData, cb) {
  var data2 = JSON.stringify({
    "scope": "catalogue",
    "code": "catalogue",
    "table": "graphdata3",
    "json": "true"
  });
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      //console.log(this.responseText);
      var jsonText=JSON.parse(this.responseText);
      //console.log(jsonText)
      var hrefToId={}
      var rootHref=''
      jsonText.rows.map(item => {
        if (!(item.hrefName in hrefToId)) {
          hrefToId[item.hrefName]=[]
        }
        if (!rootHref) {
          rootHref=item.hrefName;
        }

        hrefToId[item.hrefName].push(item.hrefName2)
      })
      //console.log(hrefToId)
      
      var cat={};
      cat.href=rootHref;
      cat["catalogue-metadata"]=metaData[rootHref];
      cat["items"]=hrefToId[rootHref].map(item => {
        return { href:item, 
                 "catalogue-metadata" : metaData[item], 
                 "items": item in hrefToId ? hrefToId[item].map(item2 => {
                   return { href:item2, 
                            "catalogue-metadata": metaData[item2]}
                 }) : [] }
      });

      cb(cat);
      /*
        Object.keys(metaData).map(href => {
        var catItem={};
        catItem.href=item.hrefName2;
        catItem["catalogue-metadata"]=metaData[item.hrefName2];
        catItem["items"]=[];

      })
      */
    }
  });

  xhr.open("POST", "http://127.0.0.1:8888/v1/chain/get_table_rows");

  xhr.send(data2);
}


getMeta( (cat) => {
  
  console.log(cat);

});