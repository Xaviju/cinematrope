(function () {
    'use strict';

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
