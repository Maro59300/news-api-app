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
                var goodArticles = getGoodArticle(articlesRaw);
                
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
        var badArticles = [];
        articles.forEach(function(article) {
            if (article.urlToImage === null || article.content === "[Removed]") {
                badArticles.push(article);
                
            }
        });
        return badArticles;
    }

    function getGoodArticle(articles) {
        var goodArticles = [];
        articles.forEach(function(article) {
            if (article.urlToImage !== null || article.content !== "[Removed]") {
                goodArticles.push(article);
            }
        });
        return goodArticles;
    }



    function populateCarousel(articles) {
        articles.forEach(function(article, index) {
            var isActive = index === 0 ? 'active' : '';
            var isActiveOnly = 'active';
            var indexOnly
            var carouselItem = $('<div class="carousel-item ' + isActive + '">')
                .append('<img src="' + (article.urlToImage || 'img1.png') + '" alt="Slide Image">')
                .append('<div class="carousel-caption d-none d-md-block">')
                .append('<h5>' + article.title + '</h5>')
                .append('<p>' + article.description + '</p>');
            $('#carousel-inner').append(carouselItem);
            var carouselIndicator = $('<li data-target="#topNewsCarousel" data-slide-to="'+index+'" class="'+isActive+'"></li>');
                
                $('#carousel-indicators').append(carouselIndicator);
            
        });
    }

    function populateNewsGrid(articles) {
        articles.forEach(function(article) {
            var newsCard = $('<div class="col-md-4 mb-3">')
                .append('<div class="card news-card" data-toggle="modal" data-target="#newsModal" data-title="' + article.title + '" data-content="' + article.content + '">')
                .append('<img src="' + (article.urlToImage || 'img1.png') + '" class="card-img-top" alt="News Image">')
                .append('<div class="card-body">')
                .append('<h5 class="card-title">' + article.title + '</h5>')
                .append('<p class="card-text">' + article.description + '</p>');
            $('#news-container').append(newsCard);
        });
    }

    // Modal functionality
    $('#news-container').on('click', '.news-card', function() {
        var title = $(this).data('title');
        var content = $(this).data('content');
        $('#newsModal .modal-content').html('<div class="modal-header"><h5 class="modal-title">' + title + '</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body">' + content + '</div>');
    });
});
