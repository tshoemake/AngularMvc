/// <reference path="angular.min.js" />
var PersonApp = angular.module('PersonApp', []);
PersonApp.controller('PersonController', function ($scope, PersonService) {

    getPersons();
    function getPersons() {
        PersonService.getPersons()
            .success(function (person) {
                $scope.persons = person;
                console.log($scope.persons);
            })
            .error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
                console.log($scope.status);
            });

        $scope.sortColumn = 'id';
        $scope.reverseSort = false;

        $scope.sortData = function (column) {
            $scope.reverseSort = ($scope.sortColumn == column) ? !$scope.reverseSort : false;
            $scope.sortColumn = column;
        }

        $scope.getSortClass = function (column) {
            if ($scope.sortColumn == column) {
                return $scope.reverseSort ? 'arrow-down' : 'arrow-up'
            }

            return '';
        }
    }
});

PersonApp.factory('PersonService', ['$http', function ($http) {

    var PersonService = {};
    PersonService.getPersons = function () {
        return $http.get('/Home/GetPersons');
    };
    return PersonService;

}]);