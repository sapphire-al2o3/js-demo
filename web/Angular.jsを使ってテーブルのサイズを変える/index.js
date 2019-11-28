function main($scope) {
    'use strict';
    
    // selectの初期値を設定しておく
    $scope.rows = 2;
    $scope.cols = 2;
    
    // Underscoreのrange関数を使う
    $scope.range = _.range;
}
