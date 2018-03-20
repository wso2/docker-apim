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
var logLineArray = [];
var template = '<span class="logLine"><div class="logTimeStamp">{{time}}</div><div class="logLevel">{{level}}</div><div class="logClassName">{{className}}</div><div class="logContent">{{content}}</div><div class="logTrace">{{trace}}</div></span>';
var initialRecordCount = -1;
var currentRecordCount;
var $ptty;

$(document).ready(function () {
    $ptty = $('#terminal').Ptty({
        theme : 'livelog',
        i18n : {
            welcome : 'Welcome to the live log viewer.',
            error_not_found : 'command not found'
        }
    });
        fetchInitialRecordCount();
});

/**
 * This method fetches the initial record count in the LOGANALYZER table and if it is successful,
 * sets the data fetching operation
 *
 */
function fetchInitialRecordCount(){
    var countQueryInfo = {
        tableName: "LOGANALYZER",
        searchParams: {
            query: "*:*",
        }
    };
    client.searchCount(countQueryInfo, function(count) {
        if (count["status"] === "success"){
            initialRecordCount = count["message"];
            if(initialRecordCount >= 0){
                setInterval(fetchCurrentRecordCount, 5000);
            }
        }
        return initialRecordCount;
    }, function(error) {
        console.log("error occured: " + error);
    });
}

/**
 * This method fetches the current record count in the LOGANALYZER table and if there are any
 * new records, fetches the excess data.
 *
 */
function fetchCurrentRecordCount() {
    var countQueryInfo = {
        tableName: "LOGANALYZER",
        searchParams: {
            query: "*:*",
        }
    };

    client.searchCount(countQueryInfo, function(count) {
        currentRecordCount = count["message"];
        var logCountDifference = currentRecordCount - initialRecordCount;
        if(logCountDifference > 0){
            fetchRecords(logCountDifference);
        }
    }, function(error) {
        console.log("error occured: " + error);
    });
}

/**
 * This method fetches the newly added data to the table
 *
 */
function fetchRecords(logCountDifference){
    initialRecordCount = currentRecordCount;
    logLineArray.length = 0;
    var queryInfo;
    queryInfo = {
        tableName: "LOGANALYZER",
        searchParams: {
            query: "*:*",
            start: 0,
            count: logCountDifference,
            sortBy : [
                {
                    field : "_timestamp",
                    sortType : "DESC",
                    reversed : "true"
                }
            ]
        }
    };

    var lineItem = {time : 'Fri, 20 May 2016 12:30:21 GMT ',
        className : 'fooClass',
        content: 'fooContent',
        trace : 'fooTrace'};

    client.search(queryInfo, function (data) {
        var obj = JSON.parse(data["message"]);
        if (data["status"] === "success") {
            for (var i = 0; i < obj.length; i++) {
                var tempDay = new Date(parseInt(obj[i].values._eventTimeStamp)).toString();

                var lineItem = {
                    time: tempDay,
                    level: obj[i].values._level,
                    className: obj[i].values._class,
                    content: obj[i].values._content,
                    trace: obj[i].values._trace
                };

                if(lineItem.trace == null){
                    lineItem.trace = "";
                }
                writeToLogViewer(lineItem);
            }
        }
    }, function (error) {
        console.log("error occurred: " + error);
    });
}

/**
 * This method writes the data to the log viewer
 *
 */
function writeToLogViewer(dataLine) {
    $ptty.echo((createLogList(dataLine)));
}

function createLogList(templateData){
    return '<span class="logLine"><div class="logTimeStamp">' +templateData.time + '</div><div class="logLevel">'+templateData.level+'</div><div class="logClassName">' + templateData.className + '</div><div class="logContent">' + templateData.content + '</div><div class="logTrace">' + templateData.trace + '</div></span>';
}
