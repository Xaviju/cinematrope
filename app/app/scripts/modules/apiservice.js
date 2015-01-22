(function () {
    'use strict';

    app.service('movieApi', ['$http', function ($http) {

        // Get Default reference movies
        var getMovies = function () {
            return $http({
                method: "GET",
                url: "https://api.themoviedb.org/3/discover/movie",
                params: {
                    api_key: '247e0e9d8f8cadd19b1cc9b925a68270',
                    'vote_average.gte': 8,
                    'vote_count.gte': 500,
                    sort_by: 'vote_average.desc'
                }
            }).then(function (result) {
                return result.data;
            });
        };

        // Get A selected Movie from form
        var getSelectedMovie = function (data) {
            console.log(data);
            return $http({
                method: "GET",
                url: 'https://api.themoviedb.org/3/discover/movie',
                params: {
                    api_key: '247e0e9d8f8cadd19b1cc9b925a68270',
                    'with_genres': data.genre,
                    'release_date.lte': data.releaselte,
                    'release_date.gte': data.releasegte,
                    'vote_average.lte': data.vote,
                    'vote_count.gte': 30,
                    sort_by: 'popularity.desc'
                }
            }).then(function (result) {
                return result.data;
            });
        };

        // Get Genres
        var getGenres = function () {
            return $http({
                url: 'http://api.themoviedb.org/3/genre/movie/list',
                method: "GET",
                params: {
                    api_key: '247e0e9d8f8cadd19b1cc9b925a68270'
                }
            }).then(function (result) {
                return result.data;
            });
        };
        // Returned accesible functions
        return {
            getMovies: getMovies,
            getSelectedMovie: getSelectedMovie,
            getGenres: getGenres,
        };

    }]);

})();

