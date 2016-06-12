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
        },{
            id: "rating_usersrated",
            alias: "rating_usersrated",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "rating_average",
            alias: "rating_average",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "rating_bayesaverage",
            alias: "rating_bayesaverage",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "rating_stddev",
            alias: "rating_stddev",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "rating_median",
            alias: "rating_median",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "owned",
            alias: "owned",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "trading",
            alias: "trading",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "wanting",
            alias: "wanting",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "wishing",
            alias: "wishing",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "rating_numcomments",
            alias: "rating_numcomments",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "rating_numweights",
            alias: "rating_numweights",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "rating_averageweight",
            alias: "rating_averageweight",
            dataType: tableau.dataTypeEnum.float
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

        connectionData = JSON.parse(tableau.connectionData);
        boardgame_id = connectionData.boardgame_id;
        boardgame_count = connectionData.boardgame_count;
        if(boardgame_count < 1)
            boardgame_count = 1;

        for(i = 0; i < boardgame_count; i++) {       
            url = "http://localhost:8889/www.boardgamegeek.com/xmlapi2/thing?stats=1&id=" + (boardgame_id+i);
                // have to use CORS proxy of course.
            $.ajax({url: 'http://localhost:8889/www.boardgamegeek.com/xmlapi2/thing?stats=1&id=' + (boardgame_id+i), 
                success: function (xml) {
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
                    $ratings = $item.find("ratings");
                    rating_usersrated = parseInt($ratings.find("usersrated").attr('value'));
                    rating_average = parseFloat($ratings.find("average").attr('value'));
                    rating_bayesaverage = parseFloat($ratings.find("bayesaverage").attr('value'));
                    rating_stddev = parseFloat($ratings.find("stddev").attr('value'));
                    rating_median = parseFloat($ratings.find("median").attr('value'));
                    rating_owned = parseInt($ratings.find("owned").attr('value'));
                    rating_trading = parseInt($ratings.find("trading").attr('value'));
                    rating_wanting = parseInt($ratings.find("wanting").attr('value'));
                    rating_wishing = parseInt($ratings.find("wishing").attr('value'));
                    rating_numcomments = parseInt($ratings.find("numcomments").attr('value'));
                    rating_numweights = parseInt($ratings.find("numweights").attr('value'));
                    rating_averageweight= parseFloat($ratings.find("averageweight").attr('value'));
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
                            "minage": minage,
                            "rating_usersrated": rating_usersrated,
                            "rating_average": rating_average,
                            "rating_bayesaverage": rating_bayesaverage,
                            "rating_stddev": rating_stddev,
                            "rating_median": rating_median,
                            "owned": rating_owned,
                            "trading": rating_trading,
                            "wanting": rating_wanting,
                            "wishing": rating_wishing,
                            "rating_numcomments": rating_numcomments,
                            "rating_numweights": rating_numweights,
                            "rating_averageweight": rating_averageweight
                        });
                }, 
                async: false});
        }
         
        table.appendRows(tableData);
        doneCallback();    
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            boardgame_id = parseInt($('#boardgame_id').val());         
            boardgame_count = parseInt($('#boardgame_count').val());

            
            tableau.connectionName = "Boardgame Geek Feed"; // This will be the data source name in Tableau
            tableau.connectionData = JSON.stringify({'boardgame_id': boardgame_id, 'boardgame_count': boardgame_count});
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
