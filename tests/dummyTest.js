"use strict";

let should = require('chai').should();

describe('Dummy test', function () {
    describe('Does 1 equal 1', function () {
        it ('should assert that 1===1', function () {
            let var1 = 1, var2 = 1;
            var1.should.equal(var2);
        });
    });
});