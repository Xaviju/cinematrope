(function(){
    var app = angular.module('cinephaghia', []);

    // Convert Movie Form into objet to be passed to MovieController
    app.service('movieSelectedService', function() {
        var movieSelected = {};

        return {
            with_genres: function(genre) {
                if(genre) {
                    movieSelected.genre = genre;
                }
            },
            releaselteSelected: function(releaselte) {
                if(releaselte) {
                    movieSelected.releaselte = releaselte;
                }
            },
            releasegteSelected: function(releasegte) {
                if(releasegte) {
                    movieSelected.releasegte = releasegte;
                }
            },
            voteSelected: function(vote) {
                if(vote) {
                    movieSelected.vote = vote;
                }
            },
            movieSelected: movieSelected
        };

    });

    // Select movie form
    app.controller('SelectMovieController', ['$scope','$rootScope', 'movieSelectedService', function($scope, $rootScope, movieSelectedService) {

        //Sends params to
        $scope.movie = {};
        $scope.submit = function() {
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
    app.controller('MovieController', ['$scope', '$http', 'movieSelectedService', function($scope, $http, movieSelectedService) {
        var list = this;
        list.movies = [];

        // If movieSelectedService broadcasted Params
        $scope.$on('MovieSelectedEvent', function(event) {
            $scope.params = movieSelectedService;
            $http({
                url: 'https://api.themoviedb.org/3/discover/movie',
                method: "GET",
                params: {
                    api_key: '247e0e9d8f8cadd19b1cc9b925a68270',
                    'with_genres': $scope.params.movieSelected.genre,
                    'release_date.lte': $scope.params.movieSelected.releaselte,
                    'release_date.gte': $scope.params.movieSelected.releasegte,
                    'vote_average.lte': $scope.params.movieSelected.vote,
                    'vote_count.gte': 30,
                    sort_by: 'popularity.desc'
                }
            }).success(function(data){
                list.movies = data;
            });
        });

        // Default Init movie search
        $http({
            url: 'https://api.themoviedb.org/3/discover/movie',
            method: "GET",
            params: {
                api_key: '247e0e9d8f8cadd19b1cc9b925a68270',
                'vote_average.gte': 8,
                'vote_count.gte': 500,
                sort_by: 'vote_average.desc'
            }
        }).success(function(data){
            list.movies = data;
        });

    }]);

    // Get genres from API
    app.controller('GenreController', ['$http', function($http) {
        var list = this;
        list.genres = [];
        $http({
            url: 'http://api.themoviedb.org/3/genre/movie/list',
            method: "GET",
            params: {
                api_key: '247e0e9d8f8cadd19b1cc9b925a68270'
            }
        }).success(function(data){
            list.genres = data;
        });
    }]);


})();

// https://api.themoviedb.org/3/discover/movie?api_key=247e0e9d8f8cadd19b1cc9b925a68270&vote_average.gte=8
