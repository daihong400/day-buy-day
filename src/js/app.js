/**
 * Created by rodai on 16/12/2017.
 */

require('../css/index.css');
require('angular');
console.log('index');

var myApp = angular.module('myApp', [require('angular-ui-router')]).config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function ($stateProvider, $urlRouterProvider, $locationProvider){

    $locationProvider.hashPrefix('');
    $urlRouterProvider.otherwise('/index');
    $stateProvider
        .state("templateOne", { //导航用的名字，如<a ui-sref="login">login</a>里的login
            url: '/templateOne',    //访问路径
            template: require('../template/template1.html'),
            controller: 'templateOneController'
        })
        .state("templateTwo", { //导航用的名字，如<a ui-sref="login">login</a>里的login
            url: '/templateTwo',    //访问路径
            template: require('../template/template2.html'),
            controller: 'templateTwoController'
        })

}]);

module.exports = myApp;