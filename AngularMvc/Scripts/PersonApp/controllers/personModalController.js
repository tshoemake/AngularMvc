personApp.controller('ModalController', ['$scope', function ($scope, $uibModalInstance) {

    $scope.close = function () {
        $scope.$uibModalInstance.close();
        var modalId = $scope.modalModel.Id;
        for (var i = 0; i < $scope.persons.length; i++) {
            var person = $scope.persons[i];
            if (person.Id === $scope.oldValues.Id) {
                $scope.persons[i].firstName = $scope.oldValues.firstName;
                $scope.persons[i].lastName = $scope.oldValues.lastName;
                $scope.persons[i].birthDate = $scope.oldValues.birthDate;
                break;
            }
        };
    };

    $scope.save = function () {
        $scope.$uibModalInstance.dismiss('cancel');
    };

    $scope.format = 'MM/dd/yyyy';
    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.popup1 = {
        opened: false
    };
}]);