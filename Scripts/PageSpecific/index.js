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

    $scope.addPerson = function () {
        $scope.editPersonModel = {
            Id: 0,
            firstName: '',
            lastName: ''
        };
    }

    $scope.editPerson = function (person) {
        $scope.editPersonModel = person;
    }

    $scope.upsertPerson = function (personDetails) {

        //insert
        if (personDetails.Id == 0) {
        var dataObj = { Id: 0, firstName: personDetails.firstName, lastName: personDetails.lastName };
            PersonDataFactory.upsertPerson(dataObj)
           .success(function (dataObj) {
                   $scope.persons.push(dataObj);
               angular.element('#myModal').modal('hide');
           })
           .error(function (error) {
               $scope.status = 'Unable to add person data: ' + error.message;
               console.log($scope.status);
           });
        }

        //update
        else {
            PersonDataFactory.upsertPerson(personDetails)
                .success(function (data) {
                    angular.element('#myModal').modal('hide');
                })
                .error(function (error) {
                    $scope.status = 'Unable to update person data: ' + error.message;
                    console.log($scope.status);
                });
        }
    }

});

PersonApp.factory('PersonDataFactory', ['$http', function ($http) {

    var PersonDataFactory = {};
    PersonDataFactory.getPersons = function () {
        return $http.get('/Home/GetPersons');
    };

    PersonDataFactory.upsertPerson = function (person) {
        return $http.post('/Home/UpsertPerson/', person); //must have ,person !!!!!!!!!!
    };

    return PersonDataFactory;

}]);


