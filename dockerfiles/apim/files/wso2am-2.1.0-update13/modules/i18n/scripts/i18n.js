
(function () {
    var localeResourcesBasePath = '',
            localizations = {};
    fallBackLocalizations = {};
    //initialization with the request and loads the correct localization resources
    this.init = function (req, localeResourcePath) {
        var locale = req.getLocale();
        try {
            if (localeResourcePath) {
                localeResourcesBasePath = localeResourcePath;
            }
            var file = new File(localeResourcesBasePath + 'locale_' + locale + '.json');
            //Check relevant locale file exists
            if (file.isExists()) {
                localizations = require(localeResourcesBasePath + 'locale_' + locale + '.json');
                fallBackLocalizations = require(localeResourcesBasePath + 'locale_default.json');
            } else {  //If not reading Strings from default English locale file.
                localizations = require(localeResourcesBasePath + 'locale_default.json');
            }
        } catch (e) {
            localizations = {};
        }
    };

    var getLocalString = function (key) {
        if (localizations[key]) {
            return localizations[key]
        } else if(fallBackLocalizations[key]) {
            return fallBackLocalizations[key];
        } else {
            return null;
        }

    };


    this.localize = function (key, fallback) {
        var localized = getLocalString(key);
        if (localized) {
            return localized;
        } else {
            return fallback;
        }
    };
})();
