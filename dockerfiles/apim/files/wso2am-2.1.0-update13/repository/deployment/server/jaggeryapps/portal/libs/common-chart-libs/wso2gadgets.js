/*
 * Copyright (c)  2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

(function() {

    var wso2gadgets = window.wso2gadgets || {};
    window.wso2gadgets = wso2gadgets;
   
    //Collection of view defintions
    var views = {};

    //Reference to currenr view defintion
    var currentView;

    //Reference to the vizg object of currentView object
    var chart;

    var canvas;

    var MODE_REDRAW = "redraw";
    var MODE_APPEND = "append";

    /* 
     * Initialise the wso2gadgets object by passing the canvas element and view definitions.
     * View definitions can be an array or a single view definition object
     * Optionally default view can be passed (view that should be loaded first) 
     * E.g wso2gadgets.init("#canvas",views,"chart-0");
     */
    wso2gadgets.init = function(el, configs, defaultView) {
        canvas = el;
        if (configs.constructor === Array) {
            configs.forEach(function(view) {
                views[view.id] = view;
            });
        } else if (typeof configs === 'object') {
            views[configs.id] = configs;
        }
        if (defaultView) {
            wso2gadgets.load(defaultView);
        }
    };

    wso2gadgets.load = function(id, context) {
        currentView = views[id];
        if (!currentView) {
            throw new Error("View with specified id [" + id + "] does not exist.");
        }
        //load data into current view using view's data configuration
        if (currentView.data && typeof currentView.data === "function") {
            currentView.data(context);
        }
        //initialize inter-gadget subscriptions
        // gadgets.HubSettings.onConnect = function() {
        //     if (currentView.subscriptions) {
        //         currentView.subscriptions.forEach(function(subscription) {
        //             gadgets.Hub.subscribe(subscription.topic, subscription.callback);
        //         });
        //     }
        // };
    };

    /*
    * This method needs to be called by interested parties with necessary data in their hands.
    * data should be in VizGrammar compatible format
    * drawMode redraw || append. 'redraw' forces the chart to be redrawn with new data while 'append' just adds the new entries in to the chart.
    * Usually in realtime chart, this method needs to be called with drawMode='append'
    */
    wso2gadgets.onDataReady = function(data, drawMode) {
        try {
            if (data.length == 0) {
                $(canvas).html();
                return;
            }
            //setting the data for the underlying VizGrammar chart
            currentView.schema[0].data = data;
            //calling the draw function on the current view object
            if (drawMode) {
                if(drawMode === MODE_REDRAW) {
                    wso2gadgets.draw(currentView);
                } else if(drawMode === MODE_APPEND) {
                    wso2gadgets.update(data);
                }
            } else {
                wso2gadgets.draw(currentView);  //if the drawMode parameter has been specified, use it, otherwise just redraw
            }
        } catch (e) {
            wso2gadgets.onError(e);
        }
    };

    wso2gadgets.draw = function(view) {
        if (!view.chartConfig.width) {
            view.chartConfig.width = $('body').width();
        }
        if (!view.chartConfig.height) {
            view.chartConfig.height = $('body').height();
        }
        $(canvas).empty();
        chart = new vizg(view.schema, view.chartConfig);
        if (view.callbacks && view.callbacks.length > 0) {
            chart.draw(canvas, view.callbacks);
        } else {
            chart.draw(canvas);
        }
    };

    wso2gadgets.update = function(data) {
        if (chart) {
            chart.insert(data);
        } else {
            wso2gadgets.draw(currentView);  //if this is the very first time we render the chart. E.g CEP usecase
        }
    };

    wso2gadgets.onError = function(e) {
        $(canvas).html();
    };


})();