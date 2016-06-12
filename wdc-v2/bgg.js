(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "id",
            alias: "id",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "name",
            alias: "name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "thumbnailurl",
            alias: "thumbnailurl",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "imageurl",
            alias: "imageurl",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "yearpublished",
            alias: "yearpublished",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "minplayers",
            alias: "minplayers",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "maxplayers",
            alias: "maxplayers",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "playingtime",
            alias: "playingtime",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "minplaytime",
            alias: "minplaytime",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "maxplaytime",
            alias: "maxplaytime",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "minage",
            alias: "minage",
            dataType: tableau.dataTypeEnum.int
        }];

        var tableInfo = {
            id: "boardgamegeekFeed",
            alias: "BoardgameGeek Game Info",
            columns: cols
        };

        schemaCallback([tableInfo]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {


       tableData = [];        
        
            // have to use CORS proxy of course.
        $.get("http://localhost:8889/www.boardgamegeek.com/xmlapi2/thing?stats=1&id=1", function (xml) {
              $xml = $( xml )
              $items = $xml.find( "items" )
              $item = $items.find("item");
              id = parseInt($item.attr("id"));
              name = $item.find("name").attr("value");
              thumbnail = $item.find("thumbnail").text()
              image = $item.find("image").text()
              yearpublished = parseInt($item.find("yearpublished").attr('value'));
              minplayers = parseInt($item.find("minplayers").attr('value'));
              maxplayers = parseInt($item.find("maxplayers").attr('value'));
              playingtime = parseInt($item.find("playingtime").attr('value'));
              minplaytime = parseInt($item.find("minplaytime").attr('value'));
              maxplaytime = parseInt($item.find("maxplaytime").attr('value'));
              minage = parseInt($item.find("minage").attr('value'));
              // things to add..
              // various categories?, family?, designer?
              // publisher? (for family if I detect Country: XX then add that as country), artist?, stats
              
              
               tableData.push({
                    "id": id,
                    "name": name,
                    "thumbnailurl": thumbnail,
                    "imageurl": image,
                    "yearpublished": yearpublished,
                    "minplayers" : minplayers,
                    "maxplayers" : maxplayers,
                    "playingtime": playingtime,
                    "minplaytime": minplaytime,
                    "maxplaytime": maxplaytime,
                    "minage": minage
                });
                 
        });
         
        table.appendRows(tableData);
        doneCallback();    
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Boardgame Geek Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
