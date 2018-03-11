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

var href = parent.window.location.href,
    hrefLastSegment = href.substr(href.lastIndexOf('/') + 1),
    resolveURI = parent.ues.global.context+'/';

var TOPIC = "range-selected";
$(function () {
    var dateLabel = $('#reportrange .btn-label'),
        datePickerBtn = $('#btnCustomRange');
    //if there are url elements present, use them. Otherwise use last hour

    var timeFrom = moment().subtract(29, 'days');
    var timeTo = moment();
    var message = {};

    var qs = gadgetUtil.getQueryString();
    if (qs.timeFrom != null) {
        timeFrom = qs.timeFrom;
    }
    if (qs.timeTo != null) {
        timeTo = qs.timeTo;
    }
    var count = 0;

    //make the selected time range highlighted
    var timeUnit = qs.timeUnit;

    if (timeUnit != null) {
        $("#btnLast" + timeUnit).addClass("active");
    } else {
        $("#btnLastMonth").addClass("active");
    }

    callBack(moment().subtract(29, 'days'), moment());

    function callBack(start, end) {
        dateLabel.html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        if (count != 0) {
            message = {
                timeFrom: new Date(start).getTime(),
                timeTo: new Date(end).getTime(),
                timeUnit: "Custom"
            };
            gadgets.Hub.publish(TOPIC, message);
        }
        count++;
        if (message.timeUnit && (message.timeUnit == 'Custom')) {
            $("#date-select button").removeClass("active");
            $("#reportrange #btnCustomRange").addClass("active");
        }
    }

    $(datePickerBtn).on('apply.daterangepicker', function (ev, picker) {
        callBack(picker.startDate, picker.endDate);
    });

    $(datePickerBtn).on('show.daterangepicker', function (ev, picker) {
        $(this).attr('aria-expanded', 'true');
    });

    $(datePickerBtn).on('hide.daterangepicker', function (ev, picker) {
        $(this).attr('aria-expanded', 'false');
    });

    $(datePickerBtn).daterangepicker({
        "timePicker": false,
        "autoApply": false,
        "alwaysShowCalendars": true,
        "opens": "left"
    });

    $("#btnLastHour").click(function () {
        dateLabel.html(moment().subtract(1, 'hours').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
        $("#date-select button").removeClass("active");
        $(this).addClass("active");
        message = {
            timeFrom: new Date(moment().subtract(1, 'hours')).getTime(),
            timeTo: new Date(moment()).getTime(),
            timeUnit: "Hour"
        };
        gadgets.Hub.publish(TOPIC, message);
    });

    $("#btnLastDay").click(function () {
        dateLabel.html(moment().subtract(1,'days').startOf('day').format('MMMM D, YYYY'));
        $("#date-select button").removeClass("active");
        $(this).addClass("active");
        message = {
            timeFrom: new Date(moment().subtract(1,'days').startOf('day')).getTime(),
            timeTo: new Date(moment().subtract(1,'days').endOf('day')).getTime(),
            timeUnit: "Day"
        };
        gadgets.Hub.publish(TOPIC, message);
    });

    $("#btnLastMonth").click(function () {
        dateLabel.html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
        $("#date-select button").removeClass("active");
        $(this).addClass("active");
        message = {
            timeFrom: new Date(moment().subtract(29, 'days')).getTime(),
            timeTo: new Date(moment()).getTime(),
            timeUnit: "Month"
        };
        gadgets.Hub.publish(TOPIC, message);
    });

    $("#btnLastYear").click(function () {
        dateLabel.html(moment().subtract(1, 'year').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
        $("#date-select button").removeClass("active");
        $(this).addClass("active");
        message = {
            timeFrom: new Date(moment().subtract(1, 'year')).getTime(),
            timeTo: new Date(moment()).getTime(),
            timeUnit: "Year"
        };
        gadgets.Hub.publish(TOPIC, message);
    });

});

gadgets.HubSettings.onConnect = function () {
    gadgets.Hub.subscribe("chart-zoomed", function (topic, data, subscriberData) {
        onChartZoomed(data);
    });
};

function onChartZoomed(data) {
    message = {
        timeFrom: data.timeFrom,
        timeTo: data.timeTo,
        timeUnit: "Custom"
    };
    gadgets.Hub.publish(TOPIC, message);
    if (data.timeUnit && (data.timeUnit == 'Custom')) {
        $("#date-select button").removeClass("active");
        $("#reportrange #btnCustomRange").addClass("active");
    }
};

$(window).load(function () {
    var datePicker = $('.daterangepicker'),
        parentWindow = window.parent.document,
        thisParentWrapper = $('#' + gadgets.rpc.RPC_ID, parentWindow).closest('.grid-stack-item');

    $('head', parentWindow).append('<link rel="stylesheet" type="text/css" href="' + resolveURI + 'store/carbon.super/fs/gadget/Date_Range_Picker/css/daterangepicker.css" />');
    $('body', parentWindow).append('<script src="' + resolveURI + 'store/carbon.super/fs/gadget/Date_Range_Picker/js/daterangepicker.js" type="text/javascript"></script>');
    $(thisParentWrapper).append(datePicker);
    $(thisParentWrapper).closest('.ues-component-box').addClass('widget form-control-widget');
});