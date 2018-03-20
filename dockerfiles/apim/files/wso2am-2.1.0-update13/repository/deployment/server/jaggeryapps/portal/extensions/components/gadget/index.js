/*
 * Copyright (c) 2015, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

(function () {
    /**
     * Gadget prefix.
     * @const
     */
    var GADGET_PREFIX = (osapi.container.GadgetHolder.IFRAME_ID_PREFIX_ = 'sandbox-');
    
    /**
     * Gadget container prefix.
     * @const
     */
    var CONTAINER_PREFIX = 'gadget-';
    
    var gadgets = {};
    var server = ues.global.server;
    var host = ues.global.host;
    var resolveURI = ues.dashboards.resolveURI;
    var context = ues.global.context;

    var resolveGadgetURL = function (uri) {
        uri = resolveURI(uri);
        if (uri.match(/^https?:\/\//i)) {
            return uri;
        }
        uri = uri.replace(/^(..\/)*/i, '');

        var hostname = host.hostname ? host.hostname : window.location.hostname,
            port = host.port ? host.port : window.location.port,
            protocol = host.protocol ? (host.protocol + ":") : window.location.protocol;

        port = port ? (":" + port) : "";
        return protocol + '//' + hostname + port + context + '/' + uri;
    };

    var subscribeForClient = ues.hub.subscribeForClient;

    var containerId = function (id) {
        return CONTAINER_PREFIX + id;
    };

    var gadgetId = function (id) {
        return GADGET_PREFIX + CONTAINER_PREFIX + id;
    };

    ues.hub.subscribeForClient = function (container, topic, conSubId) {
        var clientId = container.getClientID();
        var data = gadgets[clientId];
        if (!data) {
            return subscribeForClient.apply(ues.hub, [container, topic, conSubId]);
        }
        var component = data.component;
        var channel = component.id + '.' + topic;
        console.log('subscribing container:%s topic:%s, channel:%s by %s', clientId, topic, channel);
        return subscribeForClient.apply(ues.hub, [container, channel, conSubId]);
    };

    var component = (ues.plugins.components['gadget'] = {});
    
    var hasCustomUserPrefView = function (metadata, comp) {
        if (metadata.views.hasOwnProperty('settings')) {
            comp.hasCustomUserPrefView = true;
        }
    };

    var hasCustomFullView = function (metadata, comp) {
        if (metadata.views.hasOwnProperty('full')) {
            comp.hasCustomFullView = true;
        }
    };

    var loadLocalizedTitle = function (styles, comp) {
        var userLang = navigator.languages ?
            navigator.languages[0] : (navigator.language || navigator.userLanguage || navigator.browserLanguage);
        var locale_titles = comp.content.locale_titles || {};
        styles.title = locale_titles[userLang] || comp.content.title;
        comp.content.locale_titles = locale_titles || {};
    };

    component.create = function (sandbox, comp, hub, done) {
        var content = comp.content;
        var url = resolveGadgetURL(content.data.url);
        var settings = content.settings || {};
        var styles = content.styles || {};
        var options = content.options || (content.options = {});
        ues.gadgets.preload(url, function (err, metadata) {
            var pref;
            var name;
            var option;
            var params = {};
            var prefs = metadata.userPrefs;
            for (pref in prefs) {
                if (prefs.hasOwnProperty(pref)) {
                    pref = prefs[pref];
                    name = pref.name;
                    option = options[name] || {};
                    options[name] = {
                        type: option.type || pref.dataType,
                        title: option.title || pref.displayName,
                        value: option.value || pref.defaultValue,
                        options: option.options || pref.orderedEnumValues,
                        required: option.required || pref.required
                    };
                    params[name] = option.value;
                }
            }
            
            loadLocalizedTitle(styles, comp);
            var cid = containerId(comp.id);
            var gid = gadgetId(comp.id);
            sandbox.find('.ues-component-title').text(styles.title);
            if (styles.no_heading) {
                sandbox.addClass('ues-no-heading');
                sandbox.find('.ues-component-heading').hide();
            } else {
                sandbox.removeClass('ues-no-heading');
                sandbox.find('.ues-component-heading').show();
            }
            
            var titlePositon = 'ues-component-title-' + (styles.titlePosition || 'left');
            sandbox.find('.ues-component-heading')
                .removeClass('ues-component-title-left ues-component-title-center ues-component-title-right')
                .addClass(titlePositon);

            if (ues.global.dbType === 'default') {
                hasCustomUserPrefView(metadata, comp);
                hasCustomFullView(metadata, comp);
            }
            
            var container = $('<div />').attr('id', cid);
            sandbox.find('.ues-component-body').html(container);
            var hasHeading = !sandbox.closest('.ues-component').hasClass('ues-no-heading');
            var renderParams = {};
            renderParams[osapi.container.RenderParam.HEIGHT] = 
                parseInt(sandbox.closest('.ues-component-box').height()) -
                (hasHeading ? sandbox.closest('.ues-component-box').find('.ues-component-heading').height() : 0) - 2;
            renderParams[osapi.container.RenderParam.VIEW] = comp.viewOption || 'home';
            var site = ues.gadgets.render(container, url, params, renderParams);
            gadgets[gid] = {
                component: comp,
                site: site
            };
            done(false, comp);
        });
    };

    component.update = function (sandbox, comp, hub, done) {
        component.destroy(sandbox, comp, hub, function (err) {
            if (err) {
                throw err;
            }
            component.create(sandbox, comp, hub, done);
        });
    };

    component.destroy = function (sandbox, comp, hub, done) {
        var gid = gadgetId(comp.id);
        var data = gadgets[gid];
        var site = data.site;
        ues.gadgets.remove(site.getId());
        $('.ues-component-box-gadget', sandbox).remove();
        done(false);
    };
}());