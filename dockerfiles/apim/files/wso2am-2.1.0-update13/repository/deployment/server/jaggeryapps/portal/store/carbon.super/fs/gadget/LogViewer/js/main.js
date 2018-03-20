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
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var from = gadgetUtil.timeFrom();
var to = gadgetUtil.timeTo();
var receivedData = [];
var filteredMessage;
var filteredTime;
var nanoScrollerSelector = $(".nano");
var canvasDiv = "#canvas";
var prefs = new gadgets.Prefs();
var svrUrl = gadgetUtil.getGadgetSvrUrl(prefs.getString(PARAM_TYPE));
var client = new AnalyticsClient().init(null,null,svrUrl);

function initialize() {
    $(canvasDiv).html(gadgetUtil.getCustemText("No content to display","Please click on a View button from the above table" +
        " to access all the log events in the time period surrounding an event."));
    nanoScrollerSelector.nanoScroller();
}

$(document).ready(function () {
    initialize();
});

function fetch() {
    receivedData.length = 0;
    var queryInfo;
    var queryForSearchCount = {
        tableName: "LOGANALYZER",
        searchParams: {
            query: "_eventTimeStamp: [" + from + " TO " + to + "]",
        }
    };

    client.searchCount(queryForSearchCount, function (d) {
        if (d["status"] === "success") {
            var totalRecordCount = d["message"];
            queryInfo = {
                tableName: "LOGANALYZER",
                searchParams: {
                    query: "_eventTimeStamp: [" + from + " TO " + to + "]",
                    start: 0, //starting index of the matching record set
                    count: totalRecordCount //page size for pagination
                }
            };
            client.search(queryInfo, function (d) {
                var obj = JSON.parse(d["message"]);
                if (d["status"] === "success") {
                    for (var i = 0; i < obj.length; i++) {
                        receivedData.push([{
                            date: new Date(parseInt(obj[i].values._eventTimeStamp)).toUTCString(),
                            level: obj[i].values._level,
                            class: obj[i].values._class,
                            content: obj[i].values._content,
                            trace: (obj[i].values._trace ? obj[i].values._trace : ""),
                            timestamp: parseInt(obj[i].values._eventTimeStamp)
                        }]);
                    }
                    drawLogViewer();
                }
            }, function (error) {
                console.log(error);
                error.message = "Internal server error while data indexing.";
                onError(error);
            });
        }
    }, function (error) {
        console.log(error);
        error.message = "Internal server error while data indexing.";
        onError(error);
    });
}

function drawLogViewer() {
    $(canvasDiv).empty();
    var selectedDiv = "";
    for (var i = 0; i < receivedData.length; i++) {
        var receivedContent = receivedData[i][0].content;
        receivedContent = receivedContent.replace(/[\r\n]/g, "");
        if (receivedData[i][0].level === "ERROR") {
            if (receivedContent === filteredMessage && receivedData[i][0].timestamp === filteredTime) {
                $(canvasDiv).append(createLogList("selectedError",receivedData[i][0]));
                selectedDiv = "selectedError";
            } else {
                $(canvasDiv).append(createLogList("logError",receivedData[i][0]));
            }
        } else if (receivedData[i][0].level === "WARN") {
            if (receivedContent === filteredMessage && receivedData[i][0].timestamp === filteredTime) {
                $(canvasDiv).append(createLogList("selectedWarn",receivedData[i][0]));
                selectedDiv = "selectedWarn";
            } else {
                $(canvasDiv).append(createLogList("logWarn",receivedData[i][0]));
            }
        } else if (receivedData[i][0].level === "DEBUG") {
            $(canvasDiv).append(createLogList("logDebug",receivedData[i][0]));
        }else if (receivedData[i][0].level === "FATAL") {
            $(canvasDiv).append(createLogList("logFatal",receivedData[i][0]));
        } else {
            $(canvasDiv).append(createLogList("logInfo",receivedData[i][0]));
        }
    }
    nanoScrollerSelector[0].nanoscroller.reset();
    document.getElementById(selectedDiv).scrollIntoView();
}

function subscribe(callback) {
    gadgets.HubSettings.onConnect = function () {
        gadgets.Hub.subscribe("subscriber", function (topic, data, subscriber) {
            callback(topic, data, subscriber)
        });
    };
}

subscribe(function (topic, data, subscriber) {
    $(canvasDiv).html(gadgetUtil.getLoadingText());
    filteredTime = parseInt(data["timestamp"]);
    filteredMessage = data["message"];
    var fromDate = filteredTime - (gadgetConfig.timeDomain);
    var toDate = filteredTime + (gadgetConfig.timeDomain);
    from = fromDate;
    to = toDate;
    fetch();
});

function onError(msg) {
    $(canvasDiv).html(gadgetUtil.getErrorText(msg));
}

function createLogList(templateName, templateData){
    return "<ul id="+templateName+" class="+templateName+"><li class='date'>"+templateData.date+"</li><li class='level'>"+templateData.level+"</li>" +
    "<li class='class'>"+templateData.class+"</li><li class='content'>"+templateData.content+"</li><li class='trace'>"+templateData.trace+"</li></ul>";
}
