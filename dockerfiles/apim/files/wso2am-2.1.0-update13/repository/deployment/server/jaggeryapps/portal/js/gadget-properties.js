/*
 * Copyright (c) WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file exceptin compliance with the License.
 *
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var dashboardsApi = ues.utils.tenantPrefix() + 'apis/dashboards';

var resolveURI = ues.dashboards.resolveURI;
var DEFAULT_DASHBOARD_VIEW = 'default';

var dashboard;

var page;

var pageType;

var findPage = ues.dashboards.findPage;

var clone = function (o) {
    return JSON.parse(JSON.stringify(o));
};

/**
 * update component properties panel and save
 * @param sandbox
 */
var updateComponentProperties = function (sandbox, component) {
    var options = {};

    saveOptions(sandbox, options);

    saveComponentProperties(component, {
        options: options
    });
};

/**
 * save component properties
 * @param component
 * @param data
 */
var saveComponentProperties = function (component, data) {
    var o;
    var opt;
    var block = component;
    var content = block.content;

    //save options
    var options = content.options;
    var opts = data.options;
    for (opt in opts) {
        if (opts.hasOwnProperty(opt)) {
            o = options[opt] || (options[opt] = {});
            o.value = opts[opt];
        }
    }

    var event;
    var listener;
    var notifiers = data.notifiers;
    var listen = content.listen;
    for (event in notifiers) {
        if (notifiers.hasOwnProperty(event)) {
            listener = listen[event];
            listener.on = notifiers[event];
        }
    }
    updateComponent(component);
    
    var prevFullViewPoped = component.fullViewPoped, 
        prevViewOption = component.viewOption;
    
    component.fullViewPoped = false;
    component.viewOption = DEFAULT_DASHBOARD_VIEW;
    
    saveDashboard(component);
    
    component.fullViewPoped = prevFullViewPoped;
    component.viewOption = prevViewOption;
    
    ues.dashboards.rewire(page, pageType);
};

/**
 * saves the dashboard content
 */
var saveDashboard = function (component) {
    url = dashboardsApi + '/' + dashboard.id +'?personalize=true';
    $.ajax({
        url: url,
        method: 'PUT',
        data: JSON.stringify(dashboard),
        contentType: 'application/json'
    }).success(function (data) {
        console.log('dashboard saved successfully');
    }).error(function () {
        console.log('error saving dashboard');
    });
};

/**
 * triggers update hook of a given component
 * @param component
 */
var updateComponent = function (component) {
    ues.components.update(component, function (err) {
        if (err) {
            throw err;
        }
    });
};

/**
 * saves page options of the component
 * @param sandbox
 * @param options
 */
var saveOptions = function (sandbox, options) {
    $('.ues-options input', sandbox).each(function () {
        var el = $(this);
        var type = el.attr('type');
        var name = el.attr('name');
        if (type === 'text') {
            options[name] = el.val();
            return;
        }
        if (type === 'checkbox') {
            options[name] = el.is(':checked');
        }
        if (type === 'enum') {
            options[name] = el.val();
            return;
        }
    });
    $('.ues-options select', sandbox).each(function () {
        var el = $(this);
        options[el.attr('name')] = el.val();
    });
    $('.ues-options textarea', sandbox).each(function () {
        var el = $(this);
        options[el.attr('name')] = el.val();
    });
};

var initDashboard = function (db, pageId, type) {
    dashboard = (ues.global.dashboard = db);
    page = findPage(dashboard, pageId);
    pageType = type ? type : DEFAULT_DASHBOARD_VIEW;
};

initDashboard(ues.global.dashboard, ues.global.page, ues.global.dbType);