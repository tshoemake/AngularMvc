personApp.controller('PersonController', ['$scope', '$uibModal', 'PersonService', function ($scope, $uibModal, PersonService) {

    getPersonsList();

    function getPersonsList() {
        PersonService.getPersons()
            .success(function (personList) {
                $scope.persons = personList;
                for (var i = 0; i < $scope.persons.length; i++) {
                    //$scope.persons[i].birthDate = $filter('date')($scope.persons[i].birthDate, 'MM/dd/yyyy');
                    //console.log($scope.persons[i].birthDate);
                    //$scope.persons[i].birthDate = formatDate($scope.persons[i].birthDate);
                }
                paginateGrid();
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
            birthDate: new Date()
        };
        $scope.$uibModalInstance = $uibModal.open({
            templateUrl: '/Modal/AddEditPersonModal',
            controller: 'ModalController',
            scope: $scope
        })
    }

    $scope.editPerson = function (person) {
        //person.birthDate = $filter('date')(person.birthDate, 'MM/dd/yyyy');
        person.birthDate = formatDate(person.birthDate);
        $scope.modalModel = person;
        $scope.oldValues = {
            Id: $scope.modalModel.Id,
            firstName: $scope.modalModel.firstName,
            lastName: $scope.modalModel.lastName,
            birthDate: $scope.modalModel.birthDate
        };
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
        PersonService.removePerson(id)
                   .success(function (data) {
                       console.log($scope.persons.length);
                       for (var i = 0; i < $scope.persons.length; i++) {
                           var person = $scope.persons[i];
                           if (person.Id == id) {
                               $scope.persons.splice(i, 1);
                               paginateGrid();
                               $scope.$uibModalInstance.dismiss('cancel');
                               break;
                           }
                       }
                   })
                   .error(function (error) {
                       $scope.status = 'Unable to remove person: ' + error.message;
                   });
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
            PersonService.upsertPerson(dataObj)
           .success(function (data) {

               data.birthDate = formatDate(data.birthDate);
               $scope.persons.push(data);
               paginateGrid();
               $scope.$uibModalInstance.dismiss('cancel');
           })
           .error(function (error) {
               $scope.status = 'Unable to add person data: ' + error.message;
           });
        }

            //update
        else {
            PersonService.upsertPerson(personDetails)
                .success(function (data) {
                    $scope.$uibModalInstance.dismiss('cancel');
                })
                .error(function (error) {
                    $scope.status = 'Unable to update person data: ' + error.message;
                    console.log($scope.status);
                });
        }
    }

    /* Paginate Grid Code */
    $scope.filteredPersons = []
      , $scope.currentPage = 1
      , $scope.numPerPage = 10
      , $scope.maxSize = 5;


    $scope.$watch("currentPage + numPerPage", function () {
        if ($scope.persons) {
            paginateGrid();
        }
    });

    function paginateGrid() {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

        $scope.filteredPersons = $scope.persons.slice(begin, end);
    }

    /* Misc Fns */
    function formatDate(date) {
        var newDate = new Date(Date.parse(date));
        return newDate;
    }

}]);