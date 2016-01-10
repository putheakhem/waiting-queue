/**
 * Created by engraksa on 12/15/2014.
 */
var app = angular.module('waitingQue', []);
app.factory('waitSystem', function () {
    return {
        run: system
    }
});
app.controller('waitingQueController', ['$scope', 'waitSystem', function ($scope, $waitSystem) {
    $scope.showContent_file = false;
    $scope.showContent_time = false;
    //Read data
    var parser = function (text, callBack) {
        var forReturn = [];
        var arr_ = text.split(/\r*\n+/);
        //console.log(arr);
        arr_.forEach(function (ele) {
            var arr = ele.split(/\s+/);
            var res = {};
            //{id: 15, dInterArrive: 15, _dInterArrive: 15, dService: 10}
            var attrs = ['id', 'dInterArrive', 'dService'];
            if (arr.length == 3) {
                res[attrs[0]] = parseInt(arr[0]);
                res[attrs[1]] = parseInt(arr[1]);
                res['_' + attrs[1]] = parseInt(arr[1]);
                res[attrs[2]] = parseInt(arr[2]);
                forReturn.push(res);
            }
        });
        callBack(forReturn);
    };

    //Read data

    $scope.title = 'Waiting que';
    $scope.events = [
        //{
        //    id:0,
        //    time:10,
        //    clientId:1,
        //    eventType:0,
        //    waitingQue:3,
        //    stateOfServer:1,
        //    eventState:'(19,1,d), (25,2,a), (150,-,Stop)'
        //}
    ];

    //Timers
    $scope.times = [0, 100, 500, 1000];
    $scope.time = null;
    $scope.timeChamger = true;

    //Select change
    $scope.changeTime = function () {
        if($scope.time >= 0)
        {
            $scope.events = [];
            timeUnit = $scope.time;
            $waitSystem.run($scope);
            $scope.timeChamger = false;
        }
    };

    $scope.showContent_time = 0;
    $scope.changeDuration = function () {
        if($scope.showContent_time > 0){
            duration = $scope.showContent_time;
        }
    }
    $scope.handleFiles = function (files) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = (function (data) {
                parser(data.target.result, function (back) {
                    _clients = back;
                    $scope.$apply(function () {
                        $scope.showContent_file = back.length > 0;
                    });
                });
            });
            reader.readAsText(file);
            reader.readAsText(file);
        }
    };
}]);
