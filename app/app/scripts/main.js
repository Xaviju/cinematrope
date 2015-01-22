(function () {
    'use strict';

    var app = angular.module('cinephaghia', []);

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

    // Convert Movie Form into objet to be passed to MovieController
    app.service('movieSelectedService', function () {
        var movieSelected = {};

        return {
            with_genres: function (genre) {
                if (genre) {
                    movieSelected.genre = genre;
                }
            },
            releaselteSelected: function (releaselte) {
                if (releaselte) {
                    movieSelected.releaselte = releaselte;
                }
            },
            releasegteSelected: function (releasegte) {
                if (releasegte) {
                    movieSelected.releasegte = releasegte;
                }
            },
            voteSelected: function (vote) {
                if (vote) {
                    movieSelected.vote = vote;
                }
            },
            movieSelected: movieSelected
        };

    });

    // Select movie form
    app.controller('SelectMovieController', ['$scope', '$rootScope', 'movieSelectedService', function ($scope, $rootScope, movieSelectedService) {

        //Sends params to
        $scope.movie = {};
        $scope.submit = function () {
            if ($scope.genre) {
                movieSelectedService.with_genres($scope.genre);
            }
            if ($scope.year) {
                var releaselte = $scope.year + '-01-01';
                var releasegte = ($scope.year - 10) + '-01-01';
                movieSelectedService.releaselteSelected(releaselte);
                movieSelectedService.releasegteSelected(releasegte);
            }
            if ($scope.vote) {
                movieSelectedService.voteSelected($scope.vote);
            }

            $rootScope.$broadcast('MovieSelectedEvent');
            $scope.movie = {};
        };
    }]);

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

    // Get genres from API
    app.controller('GenreController', ['$http', 'movieApi', function ($http, movieApi) {
        var list = this;
        list.genres = [];

        var GetGenres = movieApi.getGenres();
        GetGenres.then(function (result) {
            list.genres = result;
        });
    }]);


})();

// https://api.themoviedb.org/3/discover/movie?api_key=247e0e9d8f8cadd19b1cc9b925a68270&vote_average.gte=8
