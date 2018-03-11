var current;
var login;
var logout;
var authorized;
var roles;
var searchRoles;
var maxRolesLimit;

(function () {
    var log = new Log();

    current = function () {
        var user = session.get('user');
        if (!user) {
            return null;
        }
        user.domain = String(user.domain);
        return user;
    };

    login = function (username, password) {
        var carbon = require('carbon');
        var server = new carbon.server.Server();
        try {
            if (!server.authenticate(username, password)) {
                return false;
            }
        } catch (e) {
            var message = "Invalid Domain Name";
            if (e.message.toLowerCase().indexOf(message.toLowerCase()) >= 0) {
                log.error("Invalid Domain Name: " + e.message);
                return false;
            }
        }

        var user = carbon.server.tenantUser(username);
        var utils = require('/modules/utils.js');
        var um = new carbon.user.UserManager(server, user.tenantId);
        user.roles = um.getRoleListOfUser(user.username);
        try {
            utils.handlers('login', user);
        } catch (e) {
            log.error(e);
            return false;
        }
        session.put('user', user);
        return true;
    };

    logout = function () {
        var utils = require('/modules/utils.js');
        var user = current();
        try {
            utils.handlers('logout', user);
        } catch (e) {
            log.error(e);
            return;
        }
        session.remove('user');
    };

    authorized = function (perm, action) {
        return true;
    };

    roles = function () {
        var carbon = require('carbon');
        var server = new carbon.server.Server();
        var user = session.get('user');
        var um = new carbon.user.UserManager(server, user.tenantId);
        return um.allRoles();
    };

    searchRoles = function (filter, maxItems) {
        var carbon = require('carbon');
        var server = new carbon.server.Server();
        var user = session.get('user');
        var um = new carbon.user.UserManager(server, user.tenantId);
        return um.searchRoles(filter, maxItems, true, true, true);
    };

    maxRolesLimit = function () {
        var carbon = require('carbon');
        var server = new carbon.server.Server();
        var user = session.get('user');
        var um = new carbon.user.UserManager(server, user.tenantId);
        var map = um.getMaxLimit('MaxRoleNameListLength');
        return map.get("PRIMARY");
    };
}());