/// <reference path="angular.min.js" />
var PersonApp = angular.module('PersonApp', []);
PersonApp.controller('PersonController', function ($scope, PersonDataFactory) {

    getPersons();

    function getPersons() {
        PersonDataFactory.getPersons()
            .success(function (person) {
                $scope.persons = person;
            })
            .error(function (error) {
                $scope.status = 'Unable to load person data: ' + error.message;
                console.log('error' + $scope.status);
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

    $scope.editPerson = function (person) {
        $scope.modalPerson = person;
    }

    $scope.updatePerson = function (personDetails) {
        
        console.log(personDetails);
        PersonDataFactory.updatePerson(personDetails)
            .success(function (personDetails) {
                angular.element('#myModal').modal('hide');
            })
            .error(function (error) {
                $scope.status = 'Unable to update person data: ' + error.message;
                console.log($scope.status);
            });
    }
});

PersonApp.factory('PersonDataFactory', ['$http', function ($http) {

    var PersonDataFactory = {};
    PersonDataFactory.getPersons = function () {
        return $http.get('/Home/GetPersons');
    };

    PersonDataFactory.updatePerson = function (person) {
        return $http.post('/Home/UpdatePerson/' + person.Id, person);
    };

    return PersonDataFactory;

}]);


