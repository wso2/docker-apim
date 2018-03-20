var log = new Log();

var authenticate = function (username, password) {
    var HTTPConstants = Packages.org.apache.axis2.transport.http.HTTPConstants;
    var AuthStub = Packages.org.wso2.carbon.authenticator.stub.AuthenticationAdminStub;
    var carbon = require("carbon");
    var AUTH_SERVICE = "/services/AuthenticationAdmin";
    var authUrl;
    var carbonServerAddress = carbon.server.address("https");
    var carbonUrlArrayed = carbonServerAddress.split(":");
    var authUrlProtocol = carbonUrlArrayed[0];
    var authUrlPort = carbonUrlArrayed[2];
    var serverConfigService = carbon.server.osgiService('org.wso2.carbon.base.api.ServerConfigurationService');
    hostName = serverConfigService.getFirstProperty("HostName");
    if ( hostName == null || hostName === '' || hostName === 'null' || hostName.length <= 0 ){
        authUrl = carbon.server.address("https") + AUTH_SERVICE;
    } else {
        authUrl = authUrlProtocol + "://" + hostName + ":" + authUrlPort + AUTH_SERVICE;
    }

    var authAdminClient = new AuthStub(authUrl);

    if (authAdminClient.login(username, password, "localhost")) {
        var serviceContext = authAdminClient._getServiceClient().getLastOperationContext().getServiceContext();
        var sessionCookie = serviceContext.getProperty(HTTPConstants.COOKIE_STRING);
        log.debug('Session cookie ' + sessionCookie);
        return sessionCookie;
    } else {
        log.info('Authentication failure');
        return false;
    }
};
