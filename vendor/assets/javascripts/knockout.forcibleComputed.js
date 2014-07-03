ko.forcibleComputed = function(readFunc, context, options) {
    var trigger = ko.observable().extend({notify:'always'}),
        target = ko.computed(function() {
            trigger();
            return readFunc.call(context);
        }, null, options);
    target.evaluateImmediate = function() {
        trigger.valueHasMutated();
    };
    return target;
};
