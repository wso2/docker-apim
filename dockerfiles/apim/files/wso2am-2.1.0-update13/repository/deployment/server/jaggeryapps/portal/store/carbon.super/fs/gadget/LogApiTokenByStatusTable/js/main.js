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

var client = new AnalyticsClient().init(null, null, "https://"+location.hostname +":"+ location.port +"/admin/modules/la/log-analyzer-proxy.jag");
var canvasDiv = "#canvas";
var receivedData = [];
var filteredMessage;
var filteredCount;
var fromTime;
var toTime;
var nanoScrollerSelector = $(".nano");

var meta = {
    "names": ["timestamp", "Status", "Content", "actions"],
    "types": ["ordinal", "ordinal", "ordinal", "ordinal"]
};

var configTable = {
    key: "timestamp",
    title: "FilteredMessages",
    charts: [{
        type: "table",
        columns: ["timestamp", "Status", "Content", "actions"],
        columnTitles: ["Timestamp", "Status", "Content", "Actions"]
    }
    ],
    width: $('body').width(),
    height: $('body').height(),
    padding: {"top": 40, "left": 80, "bottom": 70, "right": 100}
};

function initialize() {
    $(canvasDiv).html(gadgetUtil.getCustemText("No content to display","Please click on an error category from the above" +
        " chart to view the log events."));
    nanoScrollerSelector.nanoScroller();
}


$(document).ready(function () {
    initialize();
});

function fetch() {
    receivedData.length = 0;
    var queryInfo;
    queryInfo = {
        tableName: "LOGANALYZER_APIKEY_STATUS",
        searchParams: {
            query: "status: \"" + filteredMessage + "\" AND  _timestamp: [" + fromTime + " TO " + toTime + "]",
            start: 0, //starting index of the matching record set
            count: filteredCount //page size for pagination
        }
    };
    client.search(queryInfo, function (d) {
        var obj = JSON.parse(d["message"]);
        if (d["status"] === "success") {
            for (var i = 0; i < obj.length; i++) {
                receivedData.push([new Date(obj[i].timestamp).toUTCString(), obj[i].values.status, obj[i].values.content,
                    "<a href='#' class='btn padding-reduce-on-grid-view' onclick= 'viewFunction(\""+obj[i].timestamp+
                    "\",\""+obj[i].values.content+"\")'> <span class='fw-stack'><i class='fw fw-ring fw-stack-2x'></i> " +
                    "<i class='fw fw-view fw-stack-1x'></i> </span> <span class='hidden-xs'>View</span> </a>"]);
            }
            drawTokenStatusTable();

        }
    }, function (error) {
        console.log(error);
        error.message = "Internal server error while data indexing.";
        onError(error);
    });
}

function drawTokenStatusTable() {
    try {
        $(canvasDiv).empty();
        var table = new vizg(
            [
                {
                    "metadata": this.meta,
                    "data": receivedData
                }
            ],
            configTable
        );
        table.draw(canvasDiv);
        var dataTable = $('#FilteredMessages').DataTable({
            dom: '<"dataTablesTop"' +
            'f' +
            '<"dataTables_toolbar">' +
            '>' +
            'rt' +
            '<"dataTablesBottom"' +
            'lip' +
            '>'
        });
        nanoScrollerSelector[0].nanoscroller.reset();
        dataTable.on('draw', function () {
            nanoScrollerSelector[0].nanoscroller.reset();
        });
    } catch (error) {
        console.log(error);
        error.message = "Error while drawing log event chart.";
        error.status = "";
        onError(error);
    }
}
function publish(data) {
    gadgets.Hub.publish("publisher", data);
};


function subscribe(callback) {
    gadgets.HubSettings.onConnect = function () {
        gadgets.Hub.subscribe("api-keys-subscriber", function (topic, data, subscriber) {
            callback(topic, data, subscriber)
        });
    };
}

subscribe(function (topic, data, subscriber) {
    $(canvasDiv).html(gadgetUtil.getLoadingText());
    filteredMessage = data["selected"];
    filteredCount = data["count"];
    fromTime = data["fromTime"];
    toTime = data["toTime"];
    fetch();
});

function viewFunction(timestamp, content) {
    publish({
        timestamp: timestamp,
        message: content
    });
}

function onError(msg) {
    $(canvasDiv).html(gadgetUtil.getErrorText(msg));
}