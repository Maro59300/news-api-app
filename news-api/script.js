 var apiKey = '&apiKey=d91a9446cf80433699e5929a9ab72017';
var pageSize = 100;
var page = 1;
var country = 'us';
var category = 'business';



$(document).ready(function() {
    // Fetch news data from the API
    $.ajax({
        url: 'https://newsapi.org/v2/top-headlines?country='+country + '&' + 'category' + category + '&' + page + '&' + pageSize + apiKey,
        type: 'GET',
        success: function(data) {
            if (data.articles && data.articles.length > 0) {
                //store data in a separate Array
                var articlesRaw = data.articles;
                var badArticles = getBadArticles(articlesRaw);
                var goodArticles = getGoodArticles(articlesRaw);
                
                console.log(badArticles);
                console.log(goodArticles);
                populateCarousel(goodArticles.slice(0, 5)); // Top 5 news for the carousel
                populateNewsGrid(goodArticles.slice(5));   // Remaining news for the grid
            } else {
                $('#news-container').append('<p>No news articles found.</p>');
            }
        },
        error: function() {
            $('#news-container').append('<p>Error loading news articles.</p>');
        }
    });

    //function to remove any bad article in articles 

    function getBadArticles(articles) {
        return articles.filter(function(article) {
            return !article.urlToImage || !article.title || !article.description || article.content === "[Removed]";
        });
    }
    
    function getGoodArticles(articles) {
        return articles.filter(function(article) {
            return article.urlToImage && article.title && article.description && article.content !== "[Removed]";
        });
    }



    function populateCarousel(articles) {
        articles.forEach(function(article, index) {
            var isActive = index === 0 ? 'active' : '';
            var isActiveOnly = 'active';
            var indexOnly
            var carouselItem = $('<div class="carousel-item ' + isActive + ' rounded-lg">')
                .append('<img src="' + (article.urlToImage || 'img1.png') + '" alt="Slide Image">')
                .append('<div class="carousel-caption d-none d-md-block "><h5 class="font-weight-bolder">' + article.title + '</h5><p class="font-weight-bold">' + article.description + '</p></div>');
            $('#carousel-inner').append(carouselItem);
            var carouselIndicator = $('<li data-target="#topNewsCarousel" data-slide-to="'+index+'" class="'+isActive+'"></li>');
                
                $('#carousel-indicators').append(carouselIndicator);
            
        });
    }

    function populateNewsGrid(articles) {
        articles.forEach(function(article) {
            var newsCardHtml = 
                '<div class="col-md-4 mb-3">' +
                    '<div class="card news-card" data-toggle="modal" data-target="#newsModal" data-title="' + article.title + '" data-content="' + article.description + '" data-url="' + article.url + '">' +
                        '<img src="' + (article.urlToImage || 'img1.png') + '" class="card-img-top" alt="News Image">' +
                        '<div class="card-body">' +
                            '<h5 class="card-title">' + article.title + '</h5>' +
                            '<p class="card-text">' + article.description + '</p>' +
                        '</div>' +
                    '</div>' +
                '</div>';
    
            $('#news-container').append(newsCardHtml);
        });
    
        // Modal functionality
        $('#news-container').on('click', '.news-card', function() {
            var title = $(this).data('title');
            var content = $(this).data('content');
            var url = $(this).data('url');
            $('#newsModalLabel').text(title);
            $('#newsModal .modal-body').html('<p>' + content + '</p><p><a href="' + url + '" target="_blank" class="btn btn-primary mt-3">Read More</a></p>');
        });
        
    }
    
    

    // Modal functionality
    $('#news-container').on('click', '.news-card', function() {
        var title = $(this).data('title');
        var content = $(this).data('content');
        $('#newsModal .modal-content').html('<div class="modal-header"><h5 class="modal-title">' + title + '</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body">' + content + '</div>');
    });
});
