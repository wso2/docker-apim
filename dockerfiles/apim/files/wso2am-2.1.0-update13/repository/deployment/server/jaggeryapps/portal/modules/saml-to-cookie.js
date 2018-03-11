var log = new Log();

var utils = require('/modules/utils.js');

var SAML2SSO_AUTH_SERVICE = "/services/SAML2SSOAuthenticationService";
var HTTPS_TRANSPORT = "https";

//Exchanges the SAML response to a session cookie to invoke backend admin services. This will be required 
var exchangeSAMLTokenForCookie = function (samlResponse) {
    var sessionCookie = null;
    var HTTPConstants = Packages.org.apache.axis2.transport.http.HTTPConstants;
    var SAML2SSOAuthenticationServiceStub =  Packages.org.wso2.carbon.identity.authenticator.saml2.sso.stub.SAML2SSOAuthenticationServiceStub;
    var AuthReqDTO = Packages.org.wso2.carbon.identity.authenticator.saml2.sso.stub.types.AuthnReqDTO;
    var authRequest = new AuthReqDTO();
    authRequest.setResponse(samlResponse);

    var authUrl = utils.getCarbonServerAddress(HTTPS_TRANSPORT) + SAML2SSO_AUTH_SERVICE;

    var ssoStub = new SAML2SSOAuthenticationServiceStub(authUrl);
    var ssoClient =  ssoStub._getServiceClient();
    var ssoOptions = ssoClient.getOptions();
    ssoOptions.setManageSession(true);
    try {
        ssoStub.login(authRequest);
        var authToken = ssoStub._getServiceClient().getServiceContext().getProperty(HTTPConstants.COOKIE_STRING);
        log.info("Exchanged the SAML token to session cookie: " + authToken);
        return authToken;
    } catch(e) {
        log.error(e);
    }
};