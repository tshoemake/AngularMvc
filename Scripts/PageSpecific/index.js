/// <reference path="angular.min.js" />
var PersonApp = angular.module('PersonApp', []);
PersonApp.controller('PersonController', function ($scope, PersonDataFactory, $filter) {

    getPersons();


    function getPersons() {
        PersonDataFactory.getPersons()
            .success(function (personList) {
                $scope.persons = personList;
                for (var i = 0; i < $scope.persons.length; i++) {
                    var value = formatDate($scope.persons[i].birthDate);
                    $scope.persons[i].birthDate = $filter('date')(value, 'MM/dd/yyyy');
                }
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
        $scope.modalModel = {
            Id: 0,
            firstName: '',
            lastName: '',
            birthDate: ''
        };
    }

    $scope.editPerson = function (person) {
        $scope.modalModel = person;
    }

    $scope.upsertPerson = function (personDetails) {

        //insert
        if (personDetails.Id == 0) {
            var dataObj = {
                Id: 0,
                firstName: personDetails.firstName,
                lastName: personDetails.lastName,
                birthDate: personDetails.birthDate
            };
            PersonDataFactory.upsertPerson(dataObj)
           .success(function (dataObj) {
               dataObj.birthDate = formatDate(dataObj.birthDate);
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

    function formatDate(date) {
        return new Date(parseInt(date.replace("/Date(", "").replace(")/", ""), 10));
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




