/*
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var tokenUtil = function () {
    var module = {};
    var Base64 = Packages.org.apache.commons.codec.binary.Base64;
    var String = Packages.java.lang.String;
    var carbon = require('carbon');
    var sso = require("sso");
    var constants = require("/modules/constants.js");
    var configs = require('/configs/portal.js').config();
    var dashboards = require('/modules/dashboards.js');
    var log = new Log("/utils/tokenUtil.js");

    /**
     * This will create client id and client secret for a given application
     * @param properties    "callbackUrl": "",
     *                      "clientName": "",
     *                      "owner": "",
     *                      "applicationType": "",
     *                      "grantType": "",
     *                      "saasApp" :"",
     *                      "dynamicClientRegistrationEndPoint" : ""
     *
     * @returns {{clientId:*, clientSecret:*}}
     */
    module.getDynamicCredentials = function (properties) {
        var payload = {
            "callbackUrl": properties.callBackUrl,
            "clientName": properties.clientName,
            "tokenScope": properties.tokenScope,
            "owner": properties.owner,
            "applicationType": properties.applicationType,
            "grantType": properties.grantType,
            "saasApp": properties.saasApp
        };
        var xhr = new XMLHttpRequest();
        var tokenEndpoint = properties.dynamicClientRegistrationEndPoint;
        xhr.open(constants.HTTP_POST, tokenEndpoint, false);
        xhr.setRequestHeader(constants.CONTENT_TYPE_IDENTIFIER, constants.APPLICATION_JSON);
        xhr.send(payload);
        var clientData = {};
        if (xhr.status == 201) {
            var data = parse(xhr.responseText);
            clientData.clientId = data.client_id;
            clientData.clientSecret = data.client_secret;
        } else if (xhr.status == 400) {
            throw "While creating an OAuth application. Invalid client meta data";
        } else {
            throw "Error while creating an OAuth application, obtaining client id and secret";
        }
        return clientData;
    };

    /**
     * Encode the payload in Base64
     * @param payload
     * @returns {Packages.java.lang.String}
     */
    module.encode = function (payload) {
        return new String(Base64.encodeBase64(new String(payload).getBytes()));
    }

    /**
     * Decode the payload in Base64
     * @param payload
     * @returns {Packages.java.lang.String}
     */
    module.decode = function (payload) {
        return new String(Base64.decodeBase64(new String(payload).getBytes()));
    }

    /**
     * Get an AccessToken pair based on username and password
     * @param username
     * @param password
     * @param encodedClientKeys  {{clientId:"", clientSecret:""}}
     * @param scope              eg: PRODUCTION
     * @returns {{accessToken: *, refreshToken: *}}
     */
    module.getTokenWithPasswordGrantType = function (username, password, encodedClientKeys, scope, idPServer) {
        var xhr = new XMLHttpRequest();
        var tokenEndpoint = idPServer;
        xhr.open(constants.HTTP_POST, tokenEndpoint, false);
        xhr.setRequestHeader(constants.CONTENT_TYPE_IDENTIFIER, constants.APPLICATION_X_WWW_FOR_URLENCODED);
        xhr.setRequestHeader(constants.AUTHORIZATION_HEADER, constants.BASIC_PREFIX + encodedClientKeys);
        xhr.send("grant_type=password&username=" + username + "&password=" + password + "&scope=" + scope);
        var tokenPair = {};
        if (xhr.status == 200) {
            var data = parse(xhr.responseText);
            tokenPair.refreshToken = data.refresh_token;
            tokenPair.accessToken = data.access_token;
        } else if (xhr.status == 403) {
            log.error("Error in obtaining token with Password grant type, You are not authenticated yet");
            return null;
        } else {
            log.error("Error in obtaining token with Password grant type, This might be a problem with client meta " +
                "data which required for Password Grant type");
            return null;
        }
        return tokenPair;
    };

    /**
     * Get an AccessToken pair based on SAML assertion
     * @param assertion           SAML assertion
     * @param clientKeys          {{clientId:"", clientSecret:""}}
     * @param scope               eg: PRODUCTION
     * @param idPServer           identity provider ip address
     * @returns {{accessToken: *, refreshToken: *}}
     */
    module.getTokenWithSAMLGrantType = function (assertion, clientKeys, scope, idPServer) {

        var assertionXML = module.decode(assertion);
        var encodedExtractedAssertion;
        var extractedAssertion;
        var assertionStartMarker = "<saml2:Assertion";
        var assertionEndMarker = "<\/saml2:Assertion>";
        var assertionStartIndex = assertionXML.indexOf(assertionStartMarker);
        var assertionEndIndex = assertionXML.indexOf(assertionEndMarker);
        if (assertionStartIndex != -1 && assertionEndIndex != -1) {
            extractedAssertion = assertionXML.substring(assertionStartIndex, assertionEndIndex) + assertionEndMarker;
        } else {
            throw "Invalid SAML response. SAML response has no valid assertion string";
        }

        encodedExtractedAssertion = this.encode(extractedAssertion);

        var xhr = new XMLHttpRequest();
        var tokenEndpoint = idPServer;
        xhr.open(constants.HTTP_POST, tokenEndpoint, false);
        xhr.setRequestHeader(constants.CONTENT_TYPE_IDENTIFIER, constants.APPLICATION_X_WWW_FOR_URLENCODED);
        xhr.setRequestHeader(constants.AUTHORIZATION_HEADER, constants.BASIC_PREFIX + clientKeys);
        xhr.send("grant_type=urn:ietf:params:oauth:grant-type:saml2-bearer&assertion=" +
            encodeURIComponent(encodedExtractedAssertion) + "&scope=" + scope);
        var tokenPair = {};
        if (xhr.status == 200) {
            var data = parse(xhr.responseText);
            tokenPair.refreshToken = data.refresh_token;
            tokenPair.accessToken = data.access_token;
        } else if (xhr.status == 403) {
            throw "Error in obtaining token with SAML extension grant type, You are not authenticated yet";
        } else {
            throw "Error in obtaining token with SAML Extension Grant type, This might be a problem with client meta " +
            "data which required for SAML Extension Grant type";
        }
        return tokenPair;
    };

    /**
     * Get an AccessToken pair once existing access token is expired using previous refresh token
     * @param tokenPair     already existing access token and refresh token
     * @param clientData    {{clientId:"", clientSecret:""}}
     * @param scope         eg:PRODUCTION
     * @param idPServer     identity provider ip address
     * @returns {{accessToken: *, refreshToken: *}}
     */
    module.refreshToken = function (tokenPair, clientData, scope, idPServer) {
        var xhr = new XMLHttpRequest();
        var tokenEndpoint = idPServer;
        xhr.open(constants.HTTP_POST, tokenEndpoint, false);
        xhr.setRequestHeader(constants.CONTENT_TYPE_IDENTIFIER, constants.APPLICATION_X_WWW_FOR_URLENCODED);
        xhr.setRequestHeader(constants.AUTHORIZATION_HEADER, constants.BASIC_PREFIX + clientData);
        var url = "grant_type=refresh_token&refresh_token=" + tokenPair.refreshToken;
        if (scope) {
            url = url + "&scope=" + scope
        }
        xhr.send(url);
        var tokenPair = {};
        if (xhr.status == 200) {
            var data = parse(xhr.responseText);
            tokenPair.refreshToken = data.refresh_token;
            tokenPair.accessToken = data.access_token;
        } else if (xhr.status == 400) {
            tokenPair = session.get(constants.ACCESS_TOKEN_PAIR_IDENTIFIER);
        } else if (xhr.status == 403) {
            throw "Error in obtaining token with Refresh Token  Grant Type, You are not authenticated yet";
        } else {
            throw "Error in obtaining token with  Refresh Token Type";
        }
        return tokenPair;
    };

    /**
     * If access token is expired, try to refresh it using existing refresh token
     * @param callback
     */
    module.refreshAccessToken = function (callback) {
        try {
            if (module.checkOAuthEnabled()) {
                var clientCredentials;
                var dynamicClientProperties = module.getDynamicClientProperties();
                var applicationId = dynamicClientProperties.clientName;
                dashboards.getOAuthApplication(applicationId, function (credentials) {
                    if (credentials == null) {
                        log.error("An OAuth application has not been created yet");
                        callback(false);
                    }
                    clientCredentials = credentials;
                    var encodedClientKeys = module.encode(clientCredentials.clientId + ":"
                        + clientCredentials.clientSecret);
                    var tokenPair = session.get(constants.ACCESS_TOKEN_PAIR_IDENTIFIER);
                    tokenPair = module.refreshToken(tokenPair, encodedClientKeys,
                        dynamicClientProperties.tokenScope, module.getIdPServerURL());
                    session.put(constants.ACCESS_TOKEN_PAIR_IDENTIFIER, tokenPair);
                    if (log.isDebugEnabled()) {
                        log.debug("Access token has been updated");
                    }
                    callback(true);
                });
            } else {
                log.warn("You have not enable dynamic client yet");
                callback(false);
            }
        } catch (exception) {
            callback(false);
            throw "Error while refreshing existing access token, " + exception;
        }
    }

    /**
     * Set access token into xml http request header
     * @param xhr     xml http request
     * @returns {*}   xhr which has access token it's header
     */
    module.setAccessToken = function (xhr, callback) {
        var accessToken;
        if (module.checkOAuthEnabled()) {
            try {
                accessToken = session.get(constants.ACCESS_TOKEN_PAIR_IDENTIFIER).accessToken;
                xhr.setRequestHeader(constants.AUTHORIZATION_HEADER, constants.BEARER_PREFIX + accessToken);
            } catch (exception) {
                log.error("Access token hasn't been set yet, " + exception);
            } finally {
                callback(xhr);
            }
        }
        callback(xhr);
    }

    /**
     * Get access token of current logged user
     * @param callBack response with access token
     */
    module.getAccessToken = function (callBack) {
        var accessToken = null;
        if (module.checkOAuthEnabled()) {
            try {
                accessToken = session.get(constants.ACCESS_TOKEN_PAIR_IDENTIFIER).accessToken;
            } catch (exception) {
                log.error("Access token hasn't been set yet, " + exception);
            } finally {
                callBack(accessToken);
            }
        }
        callBack(accessToken);
    }

    /**
     * Create error message which adhere to xml http response object
     * @param statusCode       response status code
     * @param status           response status
     * @param responseText     response message
     * @returns {{statusCode: *, status: *, responseText: *}}
     */
    module.createXHRObject = function (statusCode, status, responseText) {
        return {"statusCode": statusCode, "status": status, "responseText": responseText};
    }

    /**
     * Check whether this application is oauth enable or not
     * @returns boolean if oauth enable
     */
    module.checkOAuthEnabled = function () {
        if (constants.AUTHORIZATION_TYPE_OAUTH === configs.authorization.activeMethod) {
            return true;
        }
        return false;
    }

    /**
     * Get dynamic client registration configuration properties
     * @returns {{"dynamicClientProperties": {
                    "callbackUrl": "*",
                    "clientName": "*",
                    "owner": "*",
                    "applicationType": "*",
                    "grantType": "*",
                    "saasApp": *,
                    "dynamicClientRegistrationEndPoint": "*",
                    "tokenScope": "*"
                }}}
     */
    module.getDynamicClientProperties = function () {
        return configs.authorization.methods.oauth.attributes.dynamicClientProperties;
    }

    /**
     * Get set access token and refresh token according to given grant type: SAML, Password
     * @param type           grate type: SAML, Password
     * @param properties     Password Grant Type:{username: *, password: *}, SAML Grant Type : {samlToken:*, user:*}
     * @param idPServer      identity provider url
     * @param callBack       check whether access token and refresh token is correctly set or not
     */
    module.setupAccessTokenPair = function (type, properties, idPServer, callBack) {
        var encodedClientKeys;
        var clientCredentials;
        var dynamicClientProperties = module.getDynamicClientProperties();
        var applicationId = dynamicClientProperties.clientName;
        try {
            dashboards.getOAuthApplication(applicationId, function (credentials) {
                if (credentials == null) {
                    clientCredentials = module.getDynamicCredentials(dynamicClientProperties);
                    if (dashboards.createOAuthApplication(applicationId, clientCredentials)) {
                        log.info("An OAuth application has been created against this portal application");
                    }
                } else {
                    clientCredentials = credentials;
                }
                encodedClientKeys = module.encode(clientCredentials.clientId + ":" +
                    clientCredentials.clientSecret);
                session.put(constants.ENCODED_CLIENT_KEYS_IDENTIFIER, encodedClientKeys);
                if (type == constants.GRANT_TYPE_PASSWORD) {
                    tokenPair = module.getTokenWithPasswordGrantType(properties.username, properties.password,
                        encodedClientKeys, dynamicClientProperties.tokenScope, idPServer);
                } else if (type == constants.GRANT_TYPE_SAML) {
                    tokenPair = module.getTokenWithSAMLGrantType(properties.samlToken,
                        encodedClientKeys, dynamicClientProperties.tokenScope, idPServer);
                }
                session.put(constants.ACCESS_TOKEN_PAIR_IDENTIFIER, tokenPair);
            });
            callBack(true);
        } catch (exception) {
            log.error("Error while setting up access token and refresh token, " + exception);
            callBack(false);
        }
    }

    /**
     * check whether user already logged to system before invoking any apis
     * @param callBack
     */
    module.isUserAuthorized = function (callBack) {
        if (session.get("Loged") !== constants.LOGIN_MESSAGE) {
            callBack(false);
        } else {
            callBack(true);
        }
    }

    /**
     * Get identity provider uir
     * @returns {*}
     */
    module.getIdPServerURL = function () {
        return configs.authorization.methods.oauth.attributes.idPServer;
    }
    return module;
}();
