var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var axios=require("axios");
var tableURL="https://iotblock.io/eos/v1/chain/get_table_rows"

function getCat() {
  var data = JSON.stringify({
    "scope": "catalogue",
    "code": "catalogue",
    "table": "catdata3",
    "json": "true"
  });

  axios.post(tableURL, data)
  .then(function (response) {

      var jsonText=response.data;
      //console.log(jsonText)
      var hrefToId={}
      jsonText.rows.map(item => {
        hrefToId[item.href]=item;
      })
      //console.log(hrefToId)
      getMeta(hrefToId);
  }).catch(function (error) {
    console.log(error);
  });
}

function getMeta(cb) {
  var data2 = JSON.stringify({
    "scope": "catalogue",
    "code": "catalogue",
    "table": "metadata3",
    "json": "true"
  });
  axios.post(tableURL, data2)
  .then(function (response) {
    //console.log(response);
    var jsonText=response.data;
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
    
  }).catch(function (error) {
    console.log(error);
  });
}

function getgraph(metaData, cb) {
  var data2 = JSON.stringify({
    "scope": "catalogue",
    "code": "catalogue",
    "table": "graphdata3",
    "json": "true"
  });

  axios.post(tableURL, data2)
  .then(function (response) {
    //console.log(response);
    var jsonText=response.data;
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
    
  }).catch(function (error) {
    console.log(error);
  });
  

}


getMeta( (cat) => {
  
  console.log(cat);

});
