/**
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
 * -------------------------------------------------------------------------
 * This will auto deploy all available dashboards in the extensions/dashboards
 */
(function () {
    var domain = ues.global.urlDomain || ues.global.userDomain;
    var assetsUrl = ues.utils.relativePrefix() + 'apis/assets';
    var store = (ues.store = {});

    store.asset = function (type, id, cb) {
        $.get(assetsUrl + '/' + id + '?' + (domain ? 'domain=' + domain + '&' : '') + 'type=' + type, function (data) {
            cb(false, data);
        }, 'json');
    };

    store.assets = function (type, paging, cb) {
        var query = 'type=' + type;
        query += domain ? '&domain=' + domain : '';
        if (paging) {
            query += paging.query ? '&query=' + paging.query : '';
            query += '&start=' + paging.start + '&count=' + paging.count;
        }
        $.get(assetsUrl + '?' + query, function (data) {
            cb(false, data);
        }, 'json');
    };
}());