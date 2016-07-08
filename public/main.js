var lmsApp = angular.module('lmsApp', ['ui.bootstrap']);

lmsApp.controller('mainController',['$scope','$http', function($scope, $http, audio) {
    $scope.formData = {};
    $scope.searchResults = [];

    $(".dropdown-menu").on('click', 'li a', function(){
      $(".btn:first-child").text($(this).text());
      $(".btn:first-child").val($(this).attr('value'));
    });

    $scope.search = function(query) {
      var branch = $(".btn:first-child").val();
      branch = branch === "" ? '-1' : branch;
      $http.get('/book/search?q=' + query + '&branch=' + branch) // .isbn + '&title=' + query.title + '&author=' + query.author
          .success(function(data) {
              $scope.searchResults = data;
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

    $scope.sanitizeAuthors = function (authors) {
      return authors.map(function (author) {
        return author.name;
      })
    }



    //pagination data
    // $scope.filteredResults = []
    // ,$scope.currentPage = 0
    // ,$scope.numPerPage = 12
    // ,$scope.maxSize = 5;

    // $scope.setPage = function (pageNo) {
    //     $scope.currentPage = pageNo;
    // };

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
