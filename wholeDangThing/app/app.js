"use strict";

var app = angular.module('app', ['ngRoute', 'LocalStorageModule'])
.constant('FirebaseURL', "https://tradesies-86101.firebaseio.com/");

app.config(function($routeProvider) {
    $routeProvider.
      when('/', {
      	templateUrl: 'partials/splash.html',
      	controller: 'NavCtrl'
      }).
      when('/profile', {
          templateUrl: 'partials/profile.html',
          controller: 'ProfileCtrl'
      // }).
      // when('/list/:id', {
      //     templateUrl: 'partials/board.html',
      //     controller: 'BoardCtrl'
      }).
      otherwise('/');
});
