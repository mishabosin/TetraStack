angular.module('mobgolab', ['ngResource']).
    factory('ScoreService', function($resource) {
        return $resource('https://api.mongolab.com/api/1/databases/tetrastack/collections/scores',
            {
                apiKey: '4f995a38e4b02de50f16d518'
            });
    });
