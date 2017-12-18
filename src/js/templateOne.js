/**
 * Created by rodai on 16/12/2017.
 */
require('../css/templateOne.css');
var myApp = require('./app.js');

myApp.controller('templateOneController', function ($scope) {
    $scope.aads = 'aaa';
    console.log($scope.aads)
});