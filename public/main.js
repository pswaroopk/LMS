$(document).ready(function() {
  $('#search').on('keyup', function(event)/*.delay(300)*/ {
    $.ajax('/book/search?q=' + event.target.value, function (data) {
      console.log(data);
    })
  })
})



var lmsApp = angular.module('lmsApp', ['ui.bootstrap']);

lmsApp.controller('mainController',['$scope','$http', function($scope, $http, audio) {
    $scope.formData = {};
    $scope.searchResults = [];

    $scope.search = function(query) {
        $http.get('/book/search?q=' + query) // .isbn + '&title=' + query.title + '&author=' + query.author
            .success(function(data) {
                $scope.books = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deleteBookmark = function(id) {
        //console.log('delete bm',id);
        $http.delete('/api/bookmarks/' + id)
            .success(function(data) {
                $scope.bookmarks = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };



    //pagination data
    // $scope.filteredResults = []
    // ,$scope.currentPage = 0
    // ,$scope.numPerPage = 12
    // ,$scope.maxSize = 5;
    //
    // $scope.setPage = function (pageNo) {
    //     $scope.currentPage = pageNo;
    // };
    //
    // $scope.$watch('currentPage + numPerPage', function() {
    //     var begin = (($scope.currentPage - 1) * $scope.numPerPage)
    //     , end = begin + $scope.numPerPage;
    //     if($scope.searchResults.length > 0){
    //         $scope.filteredResults = $scope.searchResults.slice(begin, end);
    //     }
    // });

    //selected word
    $scope.setSelectedWord = function(word){
        $scope.selected_word = word;
        $scope.word_selected = 'true';
    };

    $scope.play = function(songPath){
        audio.play(songPath);
    };

}]);

lmsApp.controller('ChildController', ['$scope', function($scope) {

}]);



lmsApp.directive('keypress', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.keypress);
                });

                event.preventDefault();
            }
        });
    };
});
