/*
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var getAsset, getAssets, addAsset, deleteAsset, getDashboardsFromRegistry;

(function () {
    var log = new Log();

    var carbon = require('carbon');
    var utils = require('/modules/utils.js');
    var config = require('/configs/designer.json');
    var DEFAULT_STORE_TYPE = 'fs';
    var LEGACY_STORE_TYPE = 'store';


    var STORE_EXTENSIONS_LOCATION = '/extensions/stores/';
    var DEFAULT_THUMBNAIL = 'local://images/gadgetIcon.png';

    var registryPath = function (id) {
        var path = '/_system/config/ues/dashboards';
        return id ? path + '/' + id : path;
    };

    var storeExtension = function (storeType) {
        return STORE_EXTENSIONS_LOCATION + storeType + '/index.js';
    };

    getDashboardsFromRegistry = function (start, count) {

        var server = new carbon.server.Server();
        var registry = new carbon.registry.Registry(server, {
            system: true
        });
        return registry.content(registryPath(), {
            start: start,
            count: count
        });
    };

    var findDashboards = function (ctx, type, query, start, count) {
        if (!ctx.username) {
            return [];
        }

        var server = new carbon.server.Server();
        var registry = new carbon.registry.Registry(server, {
            system: true
        });
        var um = new carbon.user.UserManager(server, ctx.tenantId);
        var userRoles = um.getRoleListOfUser(ctx.username);

        var dashboards = getDashboardsFromRegistry(start, count);
        if (!dashboards) {
            return [];
        }
        var allDashboards = [];
        dashboards.forEach(function (dashboard) {
            allDashboards.push(JSON.parse(registry.content(dashboard)));
        });

        var userDashboards = [];
        allDashboards.forEach(function (dashboard) {
            var permissions = dashboard.permissions,
                data = {
                    id: dashboard.id,
                    title: dashboard.title,
                    description: dashboard.description,
                    pagesAvailable: dashboard.pages.length > 0,
                    editable: true
                };

            if (utils.allowed(userRoles, permissions.editors)) {
                userDashboards.push(data);
                return;
            }
            if (utils.allowed(userRoles, permissions.viewers)) {
                data.editable = false;
                userDashboards.push(data);
            }
        });
        return userDashboards;
    };

    /**
     * To provide backward compatibility for gadgets
     * @param url
     * @param storeType
     * @returns corrected url
     */
    var fixLegacyURL = function (url, storeType) {
        if (url) {
            var index = url.indexOf('://');
            var currentStore = url.substring(0, index);
            if (currentStore === LEGACY_STORE_TYPE) {
                return url.replace(LEGACY_STORE_TYPE, DEFAULT_STORE_TYPE);
            }
        } else {
            log.error('url is not defined in asset.json file');
        }
        return storeType.concat('://' + url);
    };

    /**
     * Find an asset based on the type and asset id
     * @param type
     * @param id
     * @returns {*}
     */
    getAsset = function (type, id) {
        var storeTypes = config.store.types;
        for (var i = 0; i < storeTypes.length; i++) {
            var specificStore = require(storeExtension(storeTypes[i]));
            var asset = specificStore.getAsset(type, id);
            if (asset) {
                break;
            }
        }
        return asset;
    };

    /**
     * Fetch assets from all the plugged in stores and aggregate
     * @param type
     * @param query
     * @param start
     * @param count
     * @returns {Array}
     */
    getAssets = function (type, query, start, count) {
        var ctx = utils.currentContext();
        if (type === 'dashboard') {
            return findDashboards(ctx, type, query, start, count);
        }
        var allAssets = [];
        var storeTypes = config.store.types;
        for (var i = 0; i < storeTypes.length; i++) {
            var specificStore = require(storeExtension(storeTypes[i]));
            var assets = specificStore.getAssets(type, query);
            if (assets) {
                for (var j = 0; j < assets.length; j++) {
                    if (assets[j].thumbnail) {
                        assets[j].thumbnail = fixLegacyURL(assets[j].thumbnail, storeTypes[i]);
                    }
                    else {
                        log.warn('Thumbnail url is missing in ' + assets[j].title);
                        assets[j].thumbnail = DEFAULT_THUMBNAIL;
                    }
                    if (type === 'gadget' && assets[j].data && assets[j].data.url) {
                        assets[j].data.url = fixLegacyURL(assets[j].data.url,storeTypes[i]);
                    }
                    else if (type === 'layout' && assets[j].url) {
                        assets[j].url = fixLegacyURL(assets[j].url,storeTypes[i]);
                    }
                    else{
                        log.warn('Url is not defined for ' + assets[j].title);
                    }
                }
                allAssets = assets.concat(allAssets);
            }
        }
        var end = start + count;
        end = end > allAssets.length ? allAssets.length : end;
        allAssets = allAssets.slice(start, end);
        return allAssets;
    };

    addAsset = function (asset) {

    };

    deleteAsset = function (id) {

    };
}());
