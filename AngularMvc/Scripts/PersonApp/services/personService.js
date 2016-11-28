personApp.service('PersonService', ['$http', function ($http) {

    var PersonService = {};
    var urlBase = 'api/PersonApi/';

    PersonService.getPersons = function () {
        return $http.get(urlBase);
    };

    PersonService.upsertPerson = function (person) {
        return $http.post(urlBase, person); //must have ,person !!!!!!!!!!
    };

    PersonService.removePerson = function (id) {
        return $http.delete(urlBase + id);
    };

    return PersonService;

}]);