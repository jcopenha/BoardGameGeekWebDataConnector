function append(connector){
    var grid = document.querySelector('#grid');
    var item = document.createElement('div');
    
    var h = '<div>';
        h += '<div class="thumbnail">';
        h += '<div class="connector_title">'
        h += '<h2><a href="' + connector.url + '" alt="Connector Link">' + connector.name + '</a>'
        h += '</div>';
        h += '<div class="caption">';
        
        if (connector.github_username) {
            h += '<p><b>Written by: </b><a href="https://github.com/' + connector.github_username + '" alt="GH Link">' + connector.author + '</a></p>';
        } else {
            h += '<p><b>Written by: </b>' + connector.author + '</p>';
        }
        
        if (connector.source_code) {
            h += '<p><a href="' + connector.source_code + '" alt="Source code link">Source Code Available</a></p>';
        }
        
        if (connector.description) {
            h += '<p><b>Description: </b>' + connector.description + '</p>';
        }
        
        connector.tags.forEach(function(tag) {
            h += '<span class="label label-pill label-primary">' + tag + '</span>' 
        });
      
        h += '</div>';
        h += '</div>';    
     
    salvattore['append_elements'](grid, [item])
    item.outerHTML = h;
}

$.getJSON("./community_connectors.json", function(data){
    $(data).each(function(i, connector) {
         append(connector);
    });
});