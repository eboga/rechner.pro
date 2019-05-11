(function() {
    function displaySearchResults(results, store) {
        var searchResults = document.getElementById('c-SearchResults-list');

        console.log(results);

        if (results.length) { // Are there any results?
            var appendString = '';

            for (var i = 0; i < results.length; i++) {  // Iterate over the results
                var item = store[results[i].ref];
                appendString += '<li class="c-SearchResults-item">';
                appendString += '<h3 class="c-SearchResults-heading">';
                appendString += '<a class="c-SearchResults-link" href="' + item.url + '">' + item.title + '</a>';
                appendString += '</h3>'
                appendString += '<p class="c-SearchResults-text">';
                appendString += '<a class="c-SearchResults-link" href="' + item.url + '">' + item.content.substring(0, 150) + '...</a>';
                appendString += '</p>';
                appendString += '</li>';
            }

            searchResults.innerHTML = appendString;
        } else {
            searchResults.innerHTML = '<li class="c-SearchResults-item">No results found</li>';
        }
    }

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');

        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');

            if (pair[0] === variable) {
                return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
            }
        }
    }

    var searchTerm = getQueryVariable('query');

    if (searchTerm) {
        document.getElementById('c-HeaderSearch-input').setAttribute("value", searchTerm);

        // Initialize lunr with the fields it will be searching on. I've given title
        // a boost of 10 to indicate matches on this field are more important.
        var idx = lunr(function () {
            this.ref('id');
            this.field('title', { boost: 10 });
            this.field('heading');
            this.field('excerpt');
            this.field('name');
            this.field('url');
            this.field('content');
            for (var key in window.store) {
                this.add({
                    "id": key,
                    "title": window.store[key].title,
                    "heading": window.store[key].heading,
                    "excerpt": window.store[key].excerpt,
                    "name": window.store[key].name,
                    "url": window.store[key].url,
                    "content": window.store[key].content
                });


            }
        });

        console.log("idx" + idx);

        var results = idx.search(searchTerm); // Get lunr to perform a search
        displaySearchResults(results, window.store); // We'll write this in the next section
    }
})();
