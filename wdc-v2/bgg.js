(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "boardgame_id",
            alias: "boardgame_id",
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

        var tableInfoBoardgame = {
            id: "boardgames",
            alias: "BoardgameGeek Game Info",
            columns: cols
        };

        var colsPlay = [
        {
            id: "play_id",
            alias: "play_id",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "quantity",
            alias: "quantity",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "date",
            alias: "date",
            dataType: tableau.dataTypeEnum.date
        },{
            id: "boardgame_id",
            alias: "boardgame_id",
            dataType: tableau.dataTypeEnum.int
        }];
        
        var tableInfoPlay = {
            id: "plays",
            alias: "BoardgameGeek Play Info",
            columns: colsPlay
        };

        schemaCallback([tableInfoPlay, tableInfoBoardgame]);
    };

    function parseBoardgame(item) {
        boardgame_id = parseInt(item.attr("id"));
        name = item.find("name").attr("value");
        thumbnail = item.find("thumbnail").text()
        image = item.find("image").text()
        yearpublished = parseInt(item.find("yearpublished").attr('value'));
        minplayers = parseInt(item.find("minplayers").attr('value'));
        maxplayers = parseInt(item.find("maxplayers").attr('value'));
        playingtime = parseInt(item.find("playingtime").attr('value'));
        minplaytime = parseInt(item.find("minplaytime").attr('value'));
        maxplaytime = parseInt(item.find("maxplaytime").attr('value'));
        minage = parseInt(item.find("minage").attr('value'));
        $ratings = item.find("ratings");
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

        return {"boardgame_id": boardgame_id,
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
            };
    }

    function getBoardgameData(table, boardgame_ids) {
        tableData = [];

        ids_per_request = 20;

        while(boardgame_ids.length !== 0 ) {
            idn = [];
            idn.push(boardgame_ids.pop());
            while(idn.length != 20 && boardgame_ids.length != 0) {
                idn.push(boardgame_ids.pop());
            }

            ids = ""
            // corener cases I'm sure..
            for(n = 0; n < idn.length-1; n++) {
                id = idn[n];
                ids += id + ",";
            }
            ids += idn[idn.length-1];
            url = "http://localhost:8889/www.boardgamegeek.com/xmlapi2/thing?stats=1&id=" + ids;
                // have to use CORS proxy of course.
            $.ajax({url: url, 
                success: function (xml) {
                    $xml = $( xml )
                    // assume it always works. 
                    $items = $xml.find( "items" ).children();
                    $items.each(function(){
                        tableData.push(parseBoardgame($(this)));  
                    });
                
                }, 
                async: false});
        }
        table.appendRows(tableData);
    }

    function parsePlay(play) {
        play_id = play.attr('id');
        quantity = play.attr('quantity');
        date = play.attr('date');
        boardgame_id = play.find('item').attr('objectid');
        myConnector.boardgames.push(parseInt(boardgame_id));
        return {"play_id": play_id,
                "quantity": quantity,
                "date": date,
                "boardgame_id": boardgame_id};
    }

    function sort_unique(arr) {
        arr = arr.sort(function (a, b) { return a*1 - b*1; });
        var ret = [arr[0]];
        for (var i = 1; i < arr.length; i++) { // start loop at 1 as element 0 can never be a duplicate
            if (arr[i-1] !== arr[i]) {
                ret.push(arr[i]);
            }
        }
        return ret;
    }
    // Download the data
    myConnector.getData = function(table, doneCallback) {
        // build board game ids
        tableData = [];
        plays = [];
        
        if(table.tableInfo.id === "plays") {
            connectionData = JSON.parse(tableau.connectionData);
            username = connectionData.username;

            // gotta handle paged plays. 
            // add page=N until plays is zero.. 
            url = "http://localhost:8889/www.boardgamegeek.com/xmlapi2/plays?username=" + username;
            $.ajax({url: url, 
                success: function (xml) {
                    $xml = $( xml )
                    // assume it always works. 
                    $items = $xml.find( "plays" ).children();
                    $items.each(function(){
                        plays.push(parsePlay($(this)));  
                    });
                }, 
                async: false});
            table.appendRows(plays);
            doneCallback();
        } else {

            getBoardgameData(table,sort_unique(myConnector.boardgames));
            doneCallback();
        }
        
    };

    myConnector.boardgames = [];
    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            username = $('#username').val();
            
            tableau.connectionName = "Boardgame Geek Feed"; // This will be the data source name in Tableau
            tableau.connectionData = JSON.stringify({'username': username });
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
