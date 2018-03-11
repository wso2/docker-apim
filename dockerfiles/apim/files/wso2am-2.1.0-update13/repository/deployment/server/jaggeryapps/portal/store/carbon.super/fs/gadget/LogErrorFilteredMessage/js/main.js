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

var prefs = new gadgets.Prefs();
var svrUrl = gadgetUtil.getGadgetSvrUrl(prefs.getString(PARAM_TYPE));
var client = new AnalyticsClient().init(null,null,svrUrl);
var fromTime;
var toTime;
var receivedData = [];
var filteredMessageArray  = [];
var filteringByField;
var nanoScrollerSelector = $(".nano");
var canvasDiv = "#canvas";
var iteratorCount = 0;
var dataTable;

function initialize() {
    $(canvasDiv).html(gadgetUtil.getCustemText("No content to display","Please click on an error category from the above" +
        " chart to view the log events."));
    nanoScrollerSelector.nanoScroller();
}

$(document).ready(function () {
    initialize();
});

function fetch(messageElement, countElement) {
    var queryInfo;
    queryInfo = {
        tableName: "LOGANALYZER",
        searchParams: {
            query: filteringByField + ": \"" + messageElement + "\" AND  _timestamp: [" + fromTime + " TO " + toTime + "] AND __level: \"ERROR\"",
            start: 0, //starting index of the matching record set
            count: countElement //page size for pagination
        }
    };
    client.search(queryInfo, function (d) {
        var obj = JSON.parse(d["message"]);
        if (d["status"] === "success") {
            iteratorCount++;
            for (var i = 0; i < obj.length; i++) {
                var msg = obj[i].values._content.replace('\n',"");
                msg = msg.replace(/[\r\n]/g, "");
                receivedData.push([moment(obj[i].timestamp).format("YYYY-MM-DD HH:mm:ss.SSS"), obj[i].values._content, obj[i].values._class,
                    '<a href="#" class="btn padding-reduce-on-grid-view" onclick= "viewFunction(\''+obj[i].values._eventTimeStamp+'\',\''+msg+'\')"> <span class="fw-stack"> ' +
                    '<i class="fw fw-ring fw-stack-2x"></i> <i class="fw fw-view fw-stack-1x"></i> </span> <span class="hidden-xs">View</span> </a>']);
            }
            if(iteratorCount < filteredMessageArray.length){
                fetch(filteredMessageArray[iteratorCount][0].replace(/\"/g, "\\\""), filteredMessageArray[iteratorCount][1]);
            }else{
                drawLogErrorFilteredTable();
            }
        }
    }, function (error) {
        console.log(error);
        error.message = "Internal server error while data indexing.";
        onError(error);
    });
}

function drawLogErrorFilteredTable() {
    try {
        $(canvasDiv).empty();
        if ( $.fn.dataTable.isDataTable( '#tblMessages' ) ) {
            dataTable.destroy();
        }
        dataTable = $("#tblMessages").DataTable({
            data: receivedData,
            columns: [
                { title: "Timestamp" },
                { title: "Message" },
                { title: "Class" },
                { title: "Action" }
            ],
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
        gadgets.Hub.subscribe("subscriber", function (topic, data, subscriber) {
            callback(topic, data, subscriber)
        });
    };
}

subscribe(function (topic, data, subscriber) {
    $(canvasDiv).html(gadgetUtil.getLoadingText());
    filteredMessageArray = data["selected"];
    fromTime = data["fromTime"];
    toTime = data["toTime"];
    filteringByField = data["filter"];
    if (filteringByField === "MESSAGE_LEVEL_ERROR") {
        filteringByField = "__content";
    } else {
        filteringByField = "__class";
    }
    iteratorCount=0;
    receivedData.length = 0;
    fetch(filteredMessageArray[0][0].replace(/\"/g, "\\\""),filteredMessageArray[0][1]);
});

function viewFunction(timestamp, message) {
    publish({
        timestamp: timestamp,
        message: message
    });
}

function onError(msg) {
    $(canvasDiv).html(gadgetUtil.getErrorText(msg));
}