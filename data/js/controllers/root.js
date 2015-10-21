'use strict';

angular.module('RestedApp')
.controller('RootCtl', ['DEFAULT_REQUEST', 'THEMES', 'DEFAULT_SELECTED_COLLECTION', '$rootScope', 'DB', 'Collection', 'Modal',
function(DEFAULT_REQUEST, THEMES, DEFAULT_SELECTED_COLLECTION, $rootScope, DB, Collection, Modal) {

  $rootScope.request = angular.copy(DEFAULT_REQUEST);
  $rootScope.selectedCollectionIndex = DEFAULT_SELECTED_COLLECTION;
  $rootScope.themes = THEMES;
  $rootScope.collections = [];
  $rootScope.urlVariables = [];

  var errorHandler = Modal.errorHandler;
  // Data is saved in the db like so:
  //  [
  //   {
  //     name: 'Collection',
  //     requests: [
  //       {
  //         url: 'www.vg.no',
  //         headers: [
  //          {
  //            name: 'Content-Type',
  //            value: 'angular/awesomeness'
  //          }
  //         ],
  //         method: 'GET'
  //       }
  //     ],
  //     minimized: true
  //   }
  // ]
  DB.collections.get().then(function(data) {
    $rootScope.collections = data;
  }, errorHandler);

  // Data is saved in db like so:
  //  [
  //   {
  //     name: 'urlVariables',
  //     variables: [
  //       {
  //         name: 'TLD',
  //         value: '.no'
  //       }
  //     ]
  //   }
  // ]
  DB.urlVariables.get().then(function(data) {
    // Defensive programming ftw
    $rootScope.urlVariables = data && data[0] && data[0].variables ? data[0].variables : [];
  }, errorHandler);

  // Data is saved in db like so:
  //  [
  //   {
  //     name: 'options',
  //     options: {
  //       key: 'value'
  //     }
  //   }
  // ]
  DB.options.get().then(function(data) {
    $rootScope.options = data && data[0] && data[0].options ? data[0].options : {};
  }, errorHandler);

  // Called on request removal
  // This is exposed to lower scopes
  $rootScope.removeRequestFromCollection = Collection.removeRequestFromCollection;

  // Called when new urlVariables are added
  $rootScope.newVariable = function() {
    $rootScope.urlVariables.push({
      name: null,
      value: null
    });
  };

  $rootScope.setTheme = function(theme) {
    $rootScope.options.theme = theme;
    DB.options.set({name: 'options', options: $rootScope.options}).then(null, errorHandler);
  };
}]);

