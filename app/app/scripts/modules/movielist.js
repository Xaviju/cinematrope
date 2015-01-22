(function () {
    'use strict';

    // Show movies
    app.controller('MovieController', ['$scope', '$http', 'movieSelectedService', 'movieApi', function ($scope, $http, movieSelectedService, movieApi) {
        var list = this;
        list.movies = [];

        // If movieSelectedService broadcasted Params
        $scope.$on('MovieSelectedEvent', function() {
            $('.movie-list .movie-shot').fadeOut();
            $('.movie-list .spinner').show();

            var movieFormData = movieSelectedService.movieSelected;
            var getSelectedMovies = movieApi.getSelectedMovie(movieFormData);

            getSelectedMovies.then(function (result) {
                console.log(result);
                $('.movie-list .spinner').hide();
                list.movies = result;
                setTimeout(function () {
                    $('.movie-list .movie-shot').fadeIn();
                }, 100);
            });
        });

        // Default Init movie search
        var GetMovies = movieApi.getMovies();
        $('.movie-list .spinner').show();

        GetMovies.then(function (result) {
            $('.movie-list .spinner').hide();
            list.movies = result;
            setTimeout(function () {
                $('.movie-list .movie-shot').fadeIn();
            }, 100);
        });

    }]);

})();
