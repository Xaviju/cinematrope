(function () {
    'use strict';

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

})();
