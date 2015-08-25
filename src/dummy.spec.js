var test_1 = require('angular2/test');
console.log('Before describe');
test_1.describe('dummy tests:', function () {
    console.log('Inside describe');
    test_1.it('sync test works', function () { return test_1.expect(true).toBe(true); });
    // Doesn't actually work because Ng Test framework  overwrites Jasmine methods
    // althought test passes synchronously
    test_1.it('async test works', function (done) {
        // done is undefined at this point
        setTimeout(function () {
            test_1.expect(false).toBe(false); // this assertion passes
            done(); // uncaught exception (if gets here) because done is not defined.
        }, 500);
        // test completes before timeout callback runs
    });
    test_1.it('async test2 works', test_1.inject([test_1.TestComponentBuilder, test_1.AsyncTestCompleter], function (tcb, async) {
        setTimeout(function () {
            test_1.expect(false).toBe(false);
            async.done();
        }, 50);
    }));
    test_1.it('another async test', test_1.inject([test_1.TestComponentBuilder, test_1.AsyncTestCompleter], function (tcb, async) {
        test_1.expect(false).toBe(false);
        async.done();
    }));
});
//# sourceMappingURL=dummy.spec.js.map