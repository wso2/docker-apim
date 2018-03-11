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

    var DEFAULT_STORE = 'fs';
    var LEGACY_STORE = 'store';
    /**
     * Find a component.
     * @param {String} type Type of the plugin
     * @return {Object}
     */
    var findPlugin = function (type) {
        var plugin = ues.plugins.components[type];
        if (!plugin) {
            throw 'ues dashboard plugin for ' + type + ' cannot be found';
        }
        return plugin;
    };

    /**
     * Create a component inside a container.
     * @param {Object} container Gadget container
     * @param {Object} component Component object
     * @param {function} done Callback function
     * @return {null}
     */
    var createComponent = function (container, component, done) {
        var type = component.content.type;
        var plugin = findPlugin(type);

        var sandbox = container.find('.ues-component');
        sandbox.attr('id', component.id).attr('data-component-id', component.id);

        if (component.content.styles.hide_gadget) {
            hideGadget(sandbox);
        } else {
            showGadget(sandbox);
        }
        plugin.create(sandbox, component, ues.hub, done);
    };

    /**
     * Update a particular component.
     * @param {Object} component Component object
     * @param {function} done Callback function
     * @return {null}
     */
    var updateComponent = function (component, done) {
        var plugin = findPlugin(component.content.type);
        var container = $('#' + component.id);
        if (component.content.styles.hide_gadget) {
            hideGadget(container);
        } else {
            showGadget(container);
        }
        plugin.update(container, component, ues.hub, done);
    };

    /**
     * Destroy a component.
     * @param {Object} component Component object
     * @param {function} done Callback function
     * @return {null}
     */
    var destroyComponent = function (component, done) {
        var plugin = findPlugin(component.content.type);
        var container = $('#' + component.id);
        plugin.destroy(container, component, ues.hub, done);
    };

    /**
     * Hide gadget
     * @param sandbox
     */
    var hideGadget = function (sandbox) {
        sandbox.addClass('ues-hide-gadget');
        sandbox.find('.ues-component-body').hide();
    };

    /**
     * Show Gadget the gadget
     * @param sandbox
     */
    var showGadget = function (sandbox) {
        sandbox.removeClass('ues-hide-gadget');
        sandbox.find('.ues-component-body').show();
    };

    /**
     * Get a component ID.
     * @param {String} clientId Container ID
     * @return {String} Gadget ID
     */
    var componentId = function (clientId) {
        return clientId.replace('sandbox-gadget-', '');
    };

    var wirings;

    // Overriding publish for clients method
    var publishForClient = ues.hub.publishForClient;
    ues.hub.publishForClient = function (container, topic, data) {
        var clientId = componentId(container.getClientID());
        var channels = wirings[clientId + '.' + topic];
        if (!channels) {
            return;
        }
        channels.forEach(function (channel) {
            publishForClient.apply(ues.hub, [container, channel, data]);
        });
    };

    //overriding publish method
    var publish = ues.hub.publish;
    ues.hub.publish = function (topic, data) {
        $(".gadgets-grid").find('.ues-component').each(function () {
            var id = $(this).attr('id');
            var channel = id + "." + topic;
            publish.apply(ues.hub, [channel, data]);
        });
    };

    var wires = function (page, pageType) {
        var content = page.content[pageType];
        var area;
        var blocks;
        var wirez = {};

        var wire = function (wirez, id, listeners) {
            var event;
            var listener;
            for (event in listeners) {
                if (listeners.hasOwnProperty(event)) {
                    listener = listeners[event];
                    if (!listener.on) {
                        continue;
                    }
                    listener.on.forEach(function (notifier) {
                        var channel = notifier.from + '.' + notifier.event;
                        var wire = wirez[channel] || (wirez[channel] = []);
                        wire.push(id + '.' + event);
                    });
                }
            }
        };

        for (area in content) {
            if (content.hasOwnProperty(area)) {
                blocks = content[area];
                blocks.forEach(function (block) {
                    var listeners = block.content.listen;
                    if (!listeners) {
                        return;
                    }
                    wire(wirez, block.id, listeners);
                });
            }
        }
        return wirez;
    };

    /**
     * Set page title.
     * @param {Object} dashboard Dashboard object
     * @param {Object} page Page object
     */
    var setDocumentTitle = function (dashboard, page) {
        document.title = dashboard.title + ' | ' + page.title;
    };

    /**
     * Convert JSON layout to Gridstack.
     * @param {Object} json Layout object
     * @return {String} HTML markup
     */
    var getGridstackLayout = function (json) {
        var componentBoxListHbs = Handlebars.compile($("#ues-component-box-list-hbs").html());
        var container = $('<div />').addClass('grid-stack');
        $(componentBoxListHbs(json)).appendTo(container);
        return container;
    }

    /**
     * Renders a page in the dashboard designer and the view modes.
     * @param {Object} element Gadget container wrapper
     * @param {Object} dashboard Dashboard object
     * @param {Object} page Page object
     * @param {String} pageType Type of the page
     * @param {function} done Callback function
     * @param {Boolean} isDesigner Flag to indicate the designer
     * @return {null}
     */
    var renderPage = function (element, dashboard, page, pageType, done, isDesigner) {
        setDocumentTitle(dashboard, page);
        wirings = wires(page, pageType);
        var layout = (pageType === 'anon' ? $(page.layout.content.anon) : $(page.layout.content.loggedIn));
        content = page.content[pageType];
        componentBoxContentHbs = Handlebars.compile($('#ues-component-box-content-hbs').html() || '');
        // this is to be rendered only in the designer. in the view mode, the template is rendered in the server
        element.html(getGridstackLayout(layout[0]));
        // render gadget contents
        isDesignerView = isDesigner;
        doneCallback = done;
        componentBoxNum = 0;
        componentBoxList = $('.ues-component-box');
        sortGadgets();
        renderGadget();
        if (!doneCallback) {
            return;
        }
        doneCallback();
    };

    var sortGadgets = function () {
        var defaultPriorityVal = ues.global.dashboard.defaultPriority;
        componentBoxList.sort(function (componentBoxA, componentBoxB) {
            var contentA = content[$(componentBoxA).attr('id')];
            var contentB = content[$(componentBoxB).attr('id')];
            if (contentA && contentB) {
                if(contentA[0] && contentB[0]){
                    var priorityA = contentA[0].content.settings ? contentA[0].content.settings['priority'] ? contentA[0].content.settings['priority'] : defaultPriorityVal : defaultPriorityVal;
                    var priorityB = contentB[0].content.settings ? contentB[0].content.settings['priority'] ? contentB[0].content.settings['priority'] : defaultPriorityVal : defaultPriorityVal;
                    return (priorityB - priorityA);
                }
                else{
                    return 1;
                }
            }
        });
    };

    var finishedLoading = function () {
        componentBoxNum++;
        renderGadget();
        if (!doneCallback) {
            return;
        }
        doneCallback();

    };

    var renderGadget = function () {
        var container;
        if (componentBoxList[componentBoxNum]) {
            container = $(componentBoxList[componentBoxNum]);
            // Calculate the data-height field which is required to render the gadget
            if (isDesignerView) {
                var gsItem = $('.grid-stack-item'),
                    node = gsItem.data('_gridstack_node'),
                    gsHeight = node ? node.height : parseInt(gsItem.attr('data-gs-height')),
                    height = (gsHeight * 150) + ((gsHeight - 1) * 30);

                container.attr('data-height', height);
            } else {
                container.attr('data-height', container.height());
            }

            var id = container.attr('id'),
                hasComponent = content.hasOwnProperty(id) && content[id][0];

            // the component box content (the skeleton) should be added only in the designer mode and
            // the view mode only if there is a component
            if (isDesignerView || hasComponent) {
                container.html(componentBoxContentHbs());
            }
            if (hasComponent) {
                createComponent(container, content[id][0], function (err) {
                    if (err) {
                        log(err);
                    }
                });
            }
            else {
                finishedLoading();
            }

        }
    };

    /**
     * Find a particular page within a dashboard
     * @param {Object} dashboard Dashboard object
     * @param {String} id Page id
     * @return {Object} Page object
     */
    var findPage = function (dashboard, id) {
        var i;
        var page;
        var pages = dashboard.pages;
        var length = pages.length;
        for (i = 0; i < length; i++) {
            page = pages[i];
            if (page.id === id) {
                return page;
            }
        }
    };

    /**
     * Find a given component in the current page
     * @param {Number} id
     * @returns {Object}
     * @private
     */
    var findComponent = function (id, page) {
        var i;
        var length;
        var area;
        var component;
        var components;
        var content = (ues.global.dbType === 'anon' ? page.content.anon : page.content.default);
        for (area in content) {
            if (content.hasOwnProperty(area)) {
                components = content[area];
                length = components.length;
                for (i = 0; i < length; i++) {
                    component = components[i];
                    if (component.id === id) {
                        return component;
                    }
                }
            }
        }
    };

    /**
     * Render the dashboard.
     * @param {Object} element Gadget container element
     * @param {Object} dashboard Dashboard object
     * @param {String} name Name of the page
     * @param {String} pageType Type of the page
     * @param {function} done Callback function
     * @param {Boolean} isDesigner Flag to indicate the designer mode
     * @return {null}
     */
    var renderDashboard = function (element, dashboard, name, pageType, done, isDesigner) {
        isDesigner = isDesigner || false;
        name = name || dashboard.landing;
        var page = findPage(dashboard, name);
        if (!page) {
            throw 'requested page : ' + name + ' cannot be found';
        }
        renderPage(element, dashboard, page, pageType, done, isDesigner);
    };

    var rewireDashboard = function (page, pageType) {
        wirings = wires(page, pageType);
    };

    /**
     * Resolve URI.
     * @param {String} uri URI
     * @return {String} Resolved path
     */
    var resolveURI = function (uri) {
        var index = uri.indexOf('://');
        var scheme = uri.substring(0, index);
        if(scheme === LEGACY_STORE){
            uri.replace(LEGACY_STORE,DEFAULT_STORE);
            scheme = DEFAULT_STORE;
        }
        var uriPlugin = ues.plugins.uris[scheme];
        if (!uriPlugin) {
            return uri;
        }
        var path = uri.substring(index + 3);
        return uriPlugin(path);
    };

    ues.components = {
        create: createComponent,
        update: updateComponent,
        destroy: destroyComponent
    };

    ues.dashboards = {
        render: renderDashboard,
        rewire: rewireDashboard,
        findPage: findPage,
        resolveURI: resolveURI,
        finishedLoadingGadget: finishedLoading,
        findComponent : findComponent
    };

    ues.assets = {};

    ues.plugins = {
        assets: {},
        components: {},
        uris: {}
    };
}());
