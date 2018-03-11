var opts = {};

module.exports.prepare = function(sandbox, hub) {

};

module.exports.create = function(sandbox, options, events, hub) {
    options = options || opts;
    var el = $(sandbox).datepicker(options);
    el.on('update', function(e) {
        hub.emit('selected', $(this).date());
    });
};

module.exports.update = function(sandbox, options, events, hub) {

};

module.exports.destroy = function(sandbox, hub) {
    $(sandbox).datepicker('destroy');
};