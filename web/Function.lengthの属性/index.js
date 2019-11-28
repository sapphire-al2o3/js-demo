function test() {}

(function() {
    'use strict';
    console.log(Object.getOwnPropertyDescriptor(test, 'length'));
    //test.length = 1; // strict で writable: false なのでエラー
    function test2() {}
    
    console.log(Object.getOwnPropertyDescriptor(test2, 'length'));
    
    test2.length = 1; // chrome だと writable: true になるのでエラーじゃない
})();

console.log(Object.getOwnPropertyDescriptor(test, 'length'));
test.length = 1; // strict mode じゃないので writtable: false でもエラーにならない
