/// <reference path="C:\Users\Tim\Source\Workspaces\AngularMvc\dev\AngularMvc\Views/Modal/AddEditPersonModal.cshtml" />
/// <reference path="C:\Users\Tim\Source\Workspaces\AngularMvc\dev\AngularMvc\Views/Modal/AddEditPersonModal.cshtml" />
/// <reference path="angular.min.js" />

angular.module('PersonApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
angular.module('PersonApp').controller('PersonController', function ($scope, $uibModal, PersonDataFactory, $filter) {

    getPersonsList();

    function getPersonsList() {
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
        $scope.$uibModalInstance = $uibModal.open({
            templateUrl: '/Modal/AddEditPersonModal',
            controller: 'ModalController',
            scope: $scope
        })
    }

    $scope.editPerson = function (person) {
        $scope.modalModel = person;
        $scope.$uibModalInstance = $uibModal.open({
            templateUrl: '/Modal/AddEditPersonModal',
            controller: 'ModalController',
            scope: $scope
        })
    }

    $scope.removePersonDialog = function (person) {
        $scope.modalModel = person;
        $scope.$uibModalInstance = $uibModal.open({
            templateUrl: '/Modal/RemovePersonModal',
            controller: 'ModalController',
            scope: $scope
        })
    }

    $scope.removePerson = function (personDetails) {
        var id = JSON.stringify(personDetails.Id);
        PersonDataFactory.removePerson(id)
                   .success(function (data) {
                       console.log($scope.persons.length);
                       for (var i = 0; i < $scope.persons.length; i++) {
                           var person = $scope.persons[i];
                           if (person.Id == id) {
                               $scope.persons.splice(i, 1);
                               $scope.$uibModalInstance.dismiss('cancel');
                               break;
                           }
                       }
                   })
                   .error(function (error) {
                       $scope.status = 'Unable to remove person: ' + error.message;
                       // console.log($scope.status);
                   });
    }

    $scope.upsertPerson = function (personDetails) {
        //console.log(personDetails);
        //insert
        if (personDetails.Id == 0) {
            var dataObj = {
                Id: 0,
                firstName: personDetails.firstName,
                lastName: personDetails.lastName,
                birthDate: personDetails.birthDate
            };
            PersonDataFactory.upsertPerson(dataObj)
           .success(function (data) {
               data.birthDate = formatDate(data.birthDate);
               $scope.persons.push(data);
               $scope.$uibModalInstance.dismiss('cancel');
           })
           .error(function (error) {
               $scope.status = 'Unable to add person data: ' + error.message;
               // console.log($scope.status);
           });
        }

            //update
        else {
            PersonDataFactory.upsertPerson(personDetails)
                .success(function (data) {
                    $scope.$uibModalInstance.dismiss('cancel');
                })
                .error(function (error) {
                    $scope.status = 'Unable to update person data: ' + error.message;
                    console.log($scope.status);
                });
        }
    }



});

angular.module('PersonApp').controller('PaginationDemoCtrl', ['$scope', 'PersonDataFactory', '$filter', function ($scope, PersonDataFactory, $filter) {

    getPersons();

    function getPersons() {
        PersonDataFactory.getPersons()
            .success(function (personList) {
                $scope.persons = personList;
                for (var i = 0; i < $scope.persons.length; i++) {
                    var value = formatDate($scope.persons[i].birthDate);
                    $scope.persons[i].birthDate = $filter('date')(value, 'MM/dd/yyyy');
                }
                paginateGrid();
            })
            .error(function (error) {
                $scope.status = 'Unable to load person data: ' + error.message;
                console.log('error' + $scope.status);
            });
    }

    $scope.filteredPersons = []
  , $scope.currentPage = 1
  , $scope.numPerPage = 15
  , $scope.maxSize = 5;


    $scope.$watch("currentPage + numPerPage", function () {
        if ($scope.persons) {
            paginateGrid();
        }
    });

    function paginateGrid() {
       // $scope.numPages = Math.ceil($scope.persons.length / $scope.numPerPage);

        var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

        //console.log($scope.persons);

        $scope.filteredPersons = $scope.persons.slice(begin, end);
    }

}]);

angular.module('PersonApp').factory('PersonDataFactory', ['$http', function ($http) {

    var PersonDataFactory = {};

    PersonDataFactory.getPersons = function () {
        return $http.get('/Home/GetPersons');
    };

    PersonDataFactory.upsertPerson = function (person) {
        return $http.post('/Home/UpsertPerson/', person); //must have ,person !!!!!!!!!!
    };

    PersonDataFactory.removePerson = function (id) {
        return $http({ method: 'POST', url: '/Home/RemovePerson', params: { id: id } })
        //return $http.delete('/Home/RemovePerson/', { id: id });
    };

    return PersonDataFactory;

}]);

angular.module('PersonApp').controller('ModalController', ['$scope', function ($scope, $uibModalInstance) {

    $scope.close = function () {
        $scope.$uibModalInstance.close();
    };

    $scope.save = function () {
        $scope.$uibModalInstance.dismiss('cancel');
    };
}]);


//Global functions
function formatDate(date) {
    return new Date(parseInt(date.replace("/Date(", "").replace(")/", ""), 10));
}

