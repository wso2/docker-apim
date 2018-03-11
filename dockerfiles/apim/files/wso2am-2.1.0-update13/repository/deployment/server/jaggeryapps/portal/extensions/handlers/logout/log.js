var handle = function (user) {
    var log = new Log();
    if(log.isDebugEnabled() && user){
        log.debug('a user logged out from the portal username: ' + user.username + ', domain:' + user.domain);
    }
};