var log = new Log();
var constants = require("/modules/constants.js");

var relativePrefix = function (path) {
    var parts = path.split('/');
    var prefix = '';
    var i;
    var count = parts.length - 3;
    for (i = 0; i < count; i++) {
        prefix += '../';
    }
    return prefix;
};

var tenantedPrefix = function (prefix, domain) {
    if (!domain) {
        return prefix;
    }
    var configs = require('/configs/designer.json');
    return prefix + configs.tenantPrefix.replace(/^\//, '') + '/' + domain + '/';
};

var sandbox = function (context, fn) {
    var carbon = require('carbon');
    var options = {};

    if (context.urlDomain) {
        options.domain = context.urlDomain;
    } else {
        options.domain = String(carbon.server.superTenant.domain);
    }

    if (options.domain === context.userDomain) {
        options.username = context.username;
    }

    options.tenantId = carbon.server.tenantId({
        domain: options.domain
    });
    carbon.server.sandbox(options, fn);
};

var allowed = function (roles, allowed) {
    var carbon = require('carbon');
    var server = new carbon.server.Server();
    var tenantId = carbon.server.tenantId();
    var userManager = new carbon.user.UserManager(server, tenantId);
    var adminRole = userManager.getAdminRoleName();
    var hasRole = function (role, roles) {
        var i;
        var length = roles.length;
        for (i = 0; i < length; i++) {
            if (roles[i] == role) {
                return true;
            }
        }
        return false;
    };
    if (hasRole(adminRole, roles)) {
        return true;
    }
    var i;
    var length = allowed.length;
    for (i = 0; i < length; i++) {
        if (hasRole(allowed[i], roles)) {
            return true;
        }
    }
    return false;
};

var context = function (user, domain) {
    var ctx = {
        urlDomain: domain
    };
    if (user) {
        ctx.username = user.username;
        ctx.userDomain = user.domain;
    }
    return ctx;
};

var tenantExists = function (domain) {
    var carbon = require('carbon');
    var tenantId = carbon.server.tenantId({
        domain: domain
    });
    return tenantId !== -1;
};

var currentContext = function () {
    var PrivilegedCarbonContext = Packages.org.wso2.carbon.context.PrivilegedCarbonContext;
    var context = PrivilegedCarbonContext.getThreadLocalCarbonContext();
    var username = context.getUsername();
    return {
        username: username,
        domain: context.getTenantDomain(),
        tenantId: context.getTenantId()
    };
};

var findJag = function (path) {
    var file = new File(path);
    if (file.isExists()) {
        return path;
    }
    path = path.replace(/\/[^\/]*$/ig, '');
    if (!path) {
        return null;
    }
    return findJag(path + '.jag');
};

var handlers = function (name) {
    var handlersDir = '/extensions/handlers/';
    var handlerScript = function (handler, script) {
        return handlersDir + handler + '/' + script;
    };
    var file = new File(handlersDir + name);
    if (!file.isExists() && !file.isDirectory()) {
        return true;
    }
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var handlers = file.listFiles();
    handlers.forEach(function (file) {
        var script = require(handlerScript(name, file.getName()));
        var handle = script.handle;
        if (!handle) {
            return;
        }
        handle.apply(script, args);
    });
};

var store = function () {
    return require('/js/store-manager.js');
};

/**
 * If there is a custom theme defined for the dashboard,
 * this method returns the file path to the custom theme folder
 * @returns {String} path to custom themes
 */
var getThemeStylesPath = function () {
    var theme = "";
    if (dashboard.theme) {
        theme = dashboard.theme;
    }
    var stylesPath = getCustomThemePath() + theme + constants.CSS_PATH;
    var folder = new File('/' + stylesPath);
    var list = folder.listFiles();
    if (list.length > 0) {
        return stylesPath;
    }
    return null;
};

/**
 * If there is a custom theme script, this returns the path of
 * custom script file, else returns the default file path
 * @param fileName name of the script file
 * @returns {String} path to script file
 */
var getThemeScriptPath = function (fileName) {
    var theme = "";
    if (dashboard.theme) {
        theme = dashboard.theme;
    }
    var path = getCustomThemePath() + theme + '/' + constants.JS_PATH + fileName + '.js';
    var defaultPath = constants.JS_PATH + fileName + '.js';
    var file = new File('/' + path);
    return file.isExists() ? path : defaultPath;
};

/**
 * If there is a custom theme template, this returns the path of
 * custom template file, else returns the default file path
 * @param fileName name of the template file
 * @returns {String} path to template file
 */
var getThemeTemplatePath = function (path) {
    var theme = "";
    if (dashboard.theme) {
        theme = dashboard.theme;
    }
    var extendedPath = getCustomThemePath() + theme + '/' + path;
    var defaultPath = '/theme/' + path;
    var file = new File(extendedPath);
    return file.isExists() ? extendedPath : defaultPath;
};

var dashboardLayouts = function () {
    var path = constants.EXTENSIONS_THEMES_PATH;
    var folder = new File('/' + path);
    var list = folder.listFiles();
    list.forEach(function (file) {

    });
};

var getScript = function (fileName) {
    var config = require('/configs/designer.json');
    var theme = config.theme;
    var path = constants.EXTENSIONS_THEMES_PATH + theme + '/' + constants.JS_PATH + fileName + '.js';
    var file = new File('/' + path);
    return file.isExists() ? path : null;
};

var getStyle = function (fileName) {
    var config = require('/configs/designer.json');
    var theme = config.theme;
    var path = constants.EXTENSIONS_THEMES_PATH + theme + constants.CSS_PATH + '/' + fileName + '.css';
    var file = new File('/' + path);
    return file.isExists() ? path : null;
};

var resolvePath = function (path) {
    var config = require('/configs/designer.json');
    var theme = config.theme;
    var extendedPath = constants.EXTENSIONS_THEMES_PATH + theme + '/' + path;
    var file = new File(extendedPath);
    return file.isExists() ? extendedPath : '/' + constants.THEME_PATH + path;
};

var resolveUrl = function (path) {
    var config = require('/configs/designer.json');
    var theme = config.theme;
    var extendedPath = constants.EXTENSIONS_THEMES_PATH + theme + '/' + path;
    var file = new File('/' + extendedPath);
    return file.isExists() ? extendedPath : constants.THEME_PATH + path;
};

var getCarbonServerAddress = function (trans) {
    var carbon = require('carbon');
    var config = require('/configs/designer.json');
    var host = config.host;
    var url;
    var carbonServerAddress = carbon.server.address(trans);
    var carbonUrlArrayed = carbonServerAddress.split(":");
    var authUrlProtocol = host.protocol || carbonUrlArrayed[0];
    var authUrlPort = host.port || carbonUrlArrayed[2];
    var serverConfigService = carbon.server.osgiService('org.wso2.carbon.base.api.ServerConfigurationService');
    var hostName = host.hostname || serverConfigService.getFirstProperty("HostName");
    if (hostName == null || hostName === '' || hostName === 'null' || hostName.length <= 0) {
        url = carbonServerAddress;
    } else {
        url = authUrlProtocol + "://" + hostName + ":" + authUrlPort;
    }
    return url;
};

var getLocaleResourcePath = function () {
    return constants.EXTENSIONS_LOCALES_PATH;
};

var resolvePassword = function (passwordAlias) {
    var secretResolverFactory = org.wso2.securevault.SecretResolverFactory;
    var omAbstractFactory = org.apache.axiom.om.OMAbstractFactory;

    var omFactory = omAbstractFactory.getOMFactory();
    var nameSpace = omFactory.createOMNamespace("http://org.wso2.securevault/configuration", "svns");
    var rootElement = omFactory.createOMElement("password", nameSpace);

    omFactory.createOMText(rootElement, passwordAlias);

    var alias = passwordAlias.split(":");
    var reslover = secretResolverFactory.create(rootElement, true);
    return reslover.resolve(alias[1]);
};

/**
 * Returns the custom path after appending the current user domain
 * @returns {String} path to custom themes
 */
var getCustomThemePath = function () {
    var carbon = require('carbon');
    return constants.STORE_PATH + carbon.userDomain + constants.FS_THEME_PATH;
};

/**
 * If the dashboard theme defined in the json file is available,
 * returns the theme name, else return "Default Theme"
 * @param dashboardTheme dashboard theme name
 * @returns {String} dashboard theme
 */
var getDashboardTheme = function (dashboardThemeName) {
    var themePath = getCustomThemePath() + dashboardThemeName;
    var folder = new File(themePath);
    if (dashboardThemeName !== undefined && folder.isExists()) {
        return dashboardThemeName;
    } else {
        return constants.DEFAULT_THEME;
    }
};
