var handle = function (user) {
    var log = new Log();
    log.debug('a user logged into the portal username: ' + user.username + ', domain:' + user.domain);
};