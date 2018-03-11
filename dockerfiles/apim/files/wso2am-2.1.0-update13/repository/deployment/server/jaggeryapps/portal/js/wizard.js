var newIndex = 0;
var provider;
var chartType;
var wizardData = {};
var previewData = [];
var columns = [];
var step0Done = false;
var step1Done = false;
var step2Done = false;
var isPaginationSupported = true;
var selectedTableCoulumns = [];
var defaultTableColumns = [];

var PROVIDER_LOCATION = 'extensions/providers/';
var CHART_LOCATION = 'extensions/chart-templates/';
var DYNAMIC_JS_LOCATION = '/js/';

var PROVIDER_CONF = 'provider-conf';
var PROVIDER_NAME = 'provider-name'
var CHART_CONF = 'chart-conf';
var CHART_NAME = 'chart-name';

/**
 * Show error style for given element
 * @param1 element
 * @param2 errorElement
 * @private
 * */
var showInlineError = function (element, errorElement, message) {
    element.val('');
    element.parent().addClass("has-error");
    element.addClass("has-error");
    errorElement.removeClass("hide");
    if (message != null)
        errorElement.html(message);
    errorElement.addClass("show");
};

/**
 * Hide error style for given element
 * @param1 element
 * @param2 errorElement
 * @private
 * */
var hideInlineError = function (element, errorElement) {
    element.parent().removeClass("has-error");
    element.removeClass("has-error");
    errorElement.removeClass("show");
    errorElement.addClass("hide");
};
///////////////////////////////////////////// event handlers //////////////////////////////////////////

$('#rootwizard').bootstrapWizard({
    onNext: function(tab, navigation, index) {
        var isRequiredFieldsFilled = true;
        if(index == 2) {
            $('input[required="true"]').each(function () {
                if (!$.trim($(this).val())) {
                    isRequiredFieldsFilled = false;
                    showInlineError($(this), $("#" + $(this).attr("name") + "-error"));
                }
                else{
                    hideInlineError($(this), $("#" + $(this).attr("name") + "-error"));
                }
            });
            if(isRequiredFieldsFilled){
                $('#lastTab').removeClass("tab-link-disabled");
            }
        }
        
        
        return isRequiredFieldsFilled;
    },
    onTabShow: function (tab, navigation, index) {
        if (index == 0 && !step0Done) {
            step0Done = true;
            getProviders();
            $("#btnPreview").hide();
            $('#rootwizard').find('.pager .next').addClass("disabled");
            $('#rootwizard').find('.pager .finish').hide();
        }else if (index == 1 && !step1Done) {
                step1Done = true;
                getProviderConfig();
        } else if (index == 2 && !step2Done) {
            step2Done = true
            wizardData = getProviderConfigData();
            getChartList();
            $('#chart-list').change();
        }
    }
});

$('#provider-list').change(function () {
    step1Done = false;
    provider = $("#providers").val();
});

$('#show-data').click(function () {
    var pConfig = getProviderConfigData();
    $.ajax({
        url: ues.utils.relativePrefix() + 'apis/createGadget?action=getData',
        method: "POST",
        data: JSON.stringify(pConfig),
        contentType: "application/json",
        async: false,
        success: function (data) {
            if(!data.error) {
                $('#sample-data-message').show();
                $('#tab2-validation-errors').html('');
                var dataPreviewHbs = Handlebars.compile($('#data-preview-hbs').html());
                $('#data-preview').html(dataPreviewHbs(data));
                $('#rootwizard').find('.pager .next').removeClass("disabled");
            } else {
                $('#tab2-validation-errors').html(data.message);
                $('#data-preview').html('');
                $('#rootwizard').find('.pager .next').addClass("disabled");
            }
        },
        error: function (xhr, message, errorObj) {
            //When 401 Unauthorized occurs user session has been log out
            if (xhr.status == 401) {
                //reload() will redirect request to login page with set current page to redirect back page
                location.reload();
            }
            var source = $("#wizard-error-hbs").html();
            ;
            var template = Handlebars.compile(source);
            $("#rootwizard").empty();
            $("#rootwizard").append(template({
                error: xhr.responseText
            }));

        }
    });
});

$('#chart-list').change(function(){
    chartType = $("#chart-type").val();
    wizardData['chartType'] = chartType;
    getChartConfig(wizardData);
});

$('#gadget-name').on('keyup', function () {
    if ($(this).val()) {
        hideInlineError($(this), $("#gadget-name-error"));
    }

});

$('#tab2').on('keypress', function() {
    $('input[required="true"]').each(function () {
        $(this).on('keyup', function (e) {
            if ($(this).val()) {
                hideInlineError($(this), $("#" + $(this).attr("name") + "-error"));
            }
        });
    });
});

$("#preview").click(function () {
    $("#generate").removeAttr("style");
    $('#rootwizard').find('.pager .finish').show();
    $('#rootwizard').find('.pager .finish').removeClass('disabled');
    delete wizardData['chartType'];
    wizardData[CHART_CONF] = getChartConfigData();

    if (!$.trim($("#gadget-name").val())) {
        showInlineError($("#gadget-name"),$("#gadget-name-error"),null);
    }
    else {
        $.ajax({
            url: ues.utils.relativePrefix() + 'apis/createGadget?action=preview',
            method: "POST",
            data: JSON.stringify(wizardData),
            contentType: "application/json",
            async: false,
            success: function (data) {
                if (!data.error) {
                    hideInlineError($("#gadget-name"), $("#gadget-name-error"));
                    $('#preview-pane').html($('#preview-hbs').html());
                } else {
                    showInlineError($("#gadget-name"), $("#gadget-name-error"), data.message);
                    $('#preview-pane').html('');
                    $('#rootwizard').find('.pager .finish').hide();
                }
            },
            error: function (xhr, message, errorObj) {
                //When 401 Unauthorized occurs user session has been log out
                if (xhr.status == 401) {
                    //reload() will redirect request to login page with set current page to redirect back page
                    location.reload();
                }
                var source = $("#wizard-error-hbs").html();
                ;
                var template = Handlebars.compile(source);
                $("#rootwizard").empty();
                $("#rootwizard").append(template({
                    error: xhr.responseText
                }));
            }
        });
    }
});

$(".pager .finish").click(function() {
    $.ajax({
        url: ues.utils.relativePrefix() + 'apis/createGadget?action=addGadgetToStore',
        method: "POST",
        data: JSON.stringify(wizardData),
        contentType: "application/json",
        async: false,
        success: function (data) {
            $('#top-rootwizard').html($('#success-hbs').html());
        },
        error: function (xhr, message, errorObj) {
            //When 401 Unauthorized occurs user session has been log out
            if (xhr.status == 401) {
                //reload() will redirect request to login page with set current page to redirect back page
                location.reload();
            }
            var source = $("#wizard-error-hbs").html();
            ;
            var template = Handlebars.compile(source);
            $("#top-rootwizard").empty();
            $("#top-rootwizard").append(template({
                error: xhr.responseText
            }));
        }
    });

});



////////////////////////////////////////////////////// end of event handlers ///////////////////////////////////////////////////////////

function getProviders() {
    $.ajax({
        url: ues.utils.relativePrefix() + 'apis/createGadget?action=getProviders',
        method: "GET",
        contentType: "application/json",
        success: function (data) {
            if (data.length == 0) {
                var source = $("#wizard-zerods-hbs").html();
                var template = Handlebars.compile(source);
                $("#rootwizard").empty();
                $("#rootwizard").append(template());
                return;
            }
            var providerHbs = Handlebars.compile($('#datasource-providers-hbs').html());
            $("#provider-list").html(providerHbs(data));

        },
        error: function (xhr, message, errorObj) {

            //When 401 Unauthorized occurs user session has been log out
            if (xhr.status == 401) {
                //reload() will redirect request to login page with set current page to redirect back page
                location.reload();
            }

            var source = $("#wizard-error-hbs").html();
            ;
            var template = Handlebars.compile(source);
            $("#rootwizard").empty();
            $("#rootwizard").append(template({
                error: xhr.responseText
            }));
        }
    });
};

function getProviderConfig() {
    step1Done = true;
    provider = $("#providers").val();
    var data = {"provider": provider};
    $.ajax({
        url: ues.utils.relativePrefix() + 'apis/createGadget?action=getProviderConfig',
        method: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        async: false,
        success: function (data) {
            registerAdvancedProviderUI(data);
            var providerHbs = Handlebars.compile($('#ui-config-hbs').html());
            $("#provider-config").html(providerHbs(data));
        },
        error: function (xhr, message, errorObj) {
            //When 401 Unauthorized occurs user session has been log out
            if (xhr.status == 401) {
                //reload() will redirect request to login page with set current page to redirect back page
                location.reload();
            }
            var source = $("#wizard-error-hbs").html();
            var template = Handlebars.compile(source);
            $("#rootwizard").empty();
            $("#rootwizard").append(template({
                error: xhr.responseText
            }));
        }
    });
};

function registerAdvancedProviderUI(data) {
    for (var i = 0; i < data.length; i++) {
        (function (config, key) {
            if (config[key]['fieldType'].toLowerCase() === 'advanced') {
                var dynamicJsList = config[key]['dynamicJS'];
                for (var i in dynamicJsList){
                     var js = document.createElement('script');
                     js.src = PROVIDER_LOCATION + provider + DYNAMIC_JS_LOCATION + dynamicJsList[i] + '.js';
                     document.body.appendChild(js);
                }
                var data = {
                    "provider": provider,
                    "partial": config[key]['childPartial']
                };
                $.ajax({
                    url: ues.utils.relativePrefix() + 'apis/createGadget?action=getProviderAdvancedUI',
                    method: "POST",
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    dataType: 'text',
                    async: false,
                    success: function (partial) {
                        Handlebars.registerPartial(config[key]['childPartial'], partial);
                    }
                });
            }
        })(data, i);
    }
}

function getProviderConfigData() {
    var formData = $('#provider-config-form').serializeArray();
    var configInput = {};
    var providerConf = {};
    $.map(formData, function (n) {
        configInput[n['name']] = n['value'];
    });
    configInput[PROVIDER_NAME] = provider ;
    providerConf[PROVIDER_CONF] = configInput;
    return providerConf;
}

function getChartList() {
    $.ajax({
        url: ues.utils.relativePrefix() + 'apis/createGadget?action=getChartList',
        method: "GET",
        contentType: "application/json",
        async: false,
        success: function (chartList) {
            var chartListHbs = Handlebars.compile($('#chart-list-hbs').html());
            $("#chart-list").html(chartListHbs(chartList));
        }
    });
}

function getChartConfig(providerConfig) {
    $.ajax({
        url: ues.utils.relativePrefix() + 'apis/createGadget?action=getChartConfig',
        method: "POST",
        data: JSON.stringify(providerConfig),
        contentType: "application/json",
        async: false,
        success: function (chartConfig) {
            if(!chartConfig.error) {
                registerAdvancedChartUI(chartConfig);
                var chartHbs = Handlebars.compile($('#ui-config-hbs').html());
                $("#chart-config").html(chartHbs(chartConfig));
                $("#preview").removeAttr("style");
            }else {
                $('#tab3-validation-errors').html(chartConfig.message);
                $('#rootwizard').find('.pager .next').addClass("disabled");
            }
        }
    });
}

function registerAdvancedChartUI(data) {
    for (var i = 0; i < data.length; i++) {
        (function (config, key) {
            if (config[key]['fieldType'].toLowerCase() === 'advanced') {
                var dynamicJsList = config[key]['dynamicJS'];
                for (var i in dynamicJsList){
                    var js = document.createElement('script');
                    js.src = CHART_LOCATION + chartType + DYNAMIC_JS_LOCATION + dynamicJsList[i] + '.js';
                    document.body.appendChild(js);
                }
                var data = {
                    "chartType": chartType,
                    "partial": config[key]['childPartial']
                };
                $.ajax({
                    url: ues.utils.relativePrefix() + 'apis/createGadget?action=getChartAdvancedUI',
                    method: "POST",
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    dataType: 'text',
                    async: false,
                    success: function (partial) {
                        Handlebars.registerPartial(config[key]['childPartial'], partial);
                    }
                });
            }
        })(data, i);
    }
}

function getChartConfigData() {
    var formData = $('#chart-config-form').serializeArray();
    var configInput = {};
    $.map(formData, function (n) {
        configInput[n['name']] = n['value'];
    });
    configInput[$('#gadget-name').attr("name")] = $('#gadget-name').val();
    configInput[CHART_NAME] = chartType ;
    return configInput;
}

function getColumns(datasource, datasourceType) {
    if (datasourceType === "realtime") {
        console.log("Fetching stream definition for stream: " + datasource);
        var url = "/portal/apis/rt?action=getDatasourceMetaData&type=" + datasourceType + "&dataSource=" + datasource;
        $.getJSON(url, function (data) {
            if (data) {
                columns = data;
            }
        });
    } else {
        console.log("Fetching schema for table: " + datasource);
        var url = "/portal/apis/analytics?type=10&tableName=" + datasource;
        $.getJSON(url, function (data) {
            if (data) {
                columns = parseColumns(JSON.parse(data.message));
            }
        });
    }
};

function checkPaginationSupported(recordStore) {
    console.log("Checking pagination support on recordstore : " + recordStore);
    var url = "/portal/apis/analytics?type=18&recordStore=" + recordStore;
    $.getJSON(url, function (data) {
        if (data.status === "success") {
            if (data.message === "true" && datasourceType === "batch") {
                console.log("Pagination supported for recordstore: " + recordStore);
                $("#btnPreview").show();
                isPaginationSupported = true;
            } else {
                $("#btnPreview").hide();
                isPaginationSupported = false;
            }
        }
    });
};

function fetchData(callback) {
    var timeFrom = new Date("1970-01-01").getTime();
    var timeTo = new Date().getTime();
    var request = {
        type: 8,
        tableName: $("#dsList").val(),
        timeFrom: timeFrom,
        timeTo: timeTo,
        start: 0,
        count: 10
    };
    $.ajax({
        url: "/portal/apis/analytics",
        method: "GET",
        data: request,
        contentType: "application/json",
        success: function (data) {
            var records = JSON.parse(data.message);
            previewData = makeRows(records);
            if (callback != null) {
                callback(previewData);
            }
        }
    });
};

function renderPreviewPane(rows) {
    $("#previewPane").empty();
    $('#previewPane').show();
    var table = jQuery('<table/>', {
        id: 'tblPreview',
        class: 'table table-bordered'
    }).appendTo('#previewPane');

    //add column headers to the table
    var thead = jQuery("<thead/>");
    thead.appendTo(table);
    var th = jQuery("<tr/>");
    columns.forEach(function (column, idx) {
        var td = jQuery('<th/>');
        td.append(column.name);
        td.appendTo(th);
    });
    th.appendTo(thead);

    rows.forEach(function (row, i) {
        var tr = jQuery('<tr/>');
        columns.forEach(function (column, idx) {
            var td = jQuery('<td/>');
            td.append(row[idx]);
            td.appendTo(tr);
        });

        tr.appendTo(table);

    });
};

function renderChartConfig() {
    //hide all chart controls
    $(".attr").hide();
};

function getColumnIndex(columnName) {
    for (var i = 0; i < columns.length; i++) {
        if (columns[i].name == columnName) {
            return i;
        }
    }
};

/////////////////////////////////////////////////////// data formatting related functions ///////////////////////////////////////////////////////

function parseColumns(data) {
    if (data.columns) {
        var keys = Object.getOwnPropertyNames(data.columns);
        var columns = keys.map(function (key, i) {
            return column = {
                name: key,
                type: data.columns[key].type
            };
        });
        return columns;
    }
};

function makeRows(data) {
    var rows = [];
    for (var i = 0; i < data.length; i++) {
        var record = data[i];
        var row = [];
        for (var j = 0; j < columns.length; j++) {
            row.push("" + record.values[columns[j].name]);
        }
        rows.push(row);
    }
    ;
    return rows;
};

function makeMapDataTable(data) {
    var dataTable = new igviz.DataTable();
    if (columns.length > 0) {
        columns.forEach(function (column, i) {
            var type = "N";
            if (column.type == "STRING" || column.type == "string") {
                type = "C";
            }
            dataTable.addColumn(column.name, type);
        });
    }
    data.forEach(function (row, index) {
        for (var i = 0; i < row.length; i++) {
            if (dataTable.metadata.types[i] == "N") {
                data[index][i] = parseInt(data[index][i]);
            }
        }
    });
    dataTable.addRows(data);
    return dataTable;
};

var dataTable;
var chart;
var counter = 0;
var globalDataArray = [];
function drawRealtimeChart(data) {
    console.log("+++++++++++ drawRealtimeChart ");

    var config = constructChartConfigurations();

    if (chart != null) {
        var persistedChartType = chart.chart.config.charts[0].type;
        if (config.charts[0].type != persistedChartType) {
            chart = null;
        }
    }

    if (chart == null) {
        $("#chartDiv").empty();

        if (config.charts[0].type == "map") {
            var mapType = config.charts[0].mapType;

            if (mapType == "world") {
                config.helperUrl = document.location.protocol + "//" + document.location.host + '/portal/geojson/countryInfo/';
                config.geoCodesUrl = document.location.protocol + "//" + document.location.host + '/portal/geojson/world/';
            } else if (mapType == "usa") {
                config.helperUrl = document.location.protocol + "//" + document.location.host + '/portal/geojson/usaInfo/';
                config.geoCodesUrl = document.location.protocol + "//" + document.location.host + '/portal/geojson/usa/';
            } else if (mapType == "europe") {
                gadgetConfig.chartConfig.helperUrl = document.location.protocol + "//" + document.location.host + '/portal/geojson/countryInfo/';
                gadgetConfig.chartConfig.geoCodesUrl = document.location.protocol + "//" + document.location.host + '/portal/geojson/europe/';
            }
        }
        chart = new vizg(createDatatable(convertData(data)), config);
        chart.draw("#chartDiv");
    } else {
        chart.insert(convertData(data));
    }

};

function drawBatchChart(data) {
    console.log("+++++++++++ drawBatchChart ");
    $("#chartDiv").empty();

    var config = constructChartConfigurations();

    if (config.charts[0].type == "map") {
        var mapType = config.charts[0].mapType;

        if (mapType == "world") {
            config.helperUrl = document.location.protocol + "//" + document.location.host + '/portal/geojson/countryInfo/';
            config.geoCodesUrl = document.location.protocol + "//" + document.location.host + '/portal/geojson/world/';
        } else if (mapType == "usa") {
            config.helperUrl = document.location.protocol + "//" + document.location.host + '/portal/geojson/usaInfo/';
            config.geoCodesUrl = document.location.protocol + "//" + document.location.host + '/portal/geojson/usa/';
        } else if (mapType == "europe") {
            gadgetConfig.chartConfig.helperUrl = document.location.protocol + "//" + document.location.host + '/portal/geojson/countryInfo/';
            gadgetConfig.chartConfig.geoCodesUrl = document.location.protocol + "//" + document.location.host + '/portal/geojson/europe/';
        }
    }

    chart = new vizg(createDatatable(convertData(data)), config);
    chart.draw("#chartDiv");
}

function createDatatable(data) {
    var names = [];
    var types = [];

    for (var i = 0; i < columns.length; i++) {
        var type;
        names.push(columns[i]["name"]);

        var type = columns[i]["type"].toUpperCase();

        if (type === "INT" || type === "INTEGER" || type === "FLOAT" || type === "LONG" ||
            type === "DOUBLE") {
            type = "linear";
        } else if (type == "TIME") {
            type = "time";
        } else {
            type = "ordinal";
        }

        types.push(type);
    }

    var datatable = [
        {
            "metadata": {
                "names": names,
                "types": types
            },
            "data": data
        }
    ];

    return datatable;
}

function convertData(data) {
    for (var i = 0; i < data.length; i++) {
        for (var x = 0; x < data[i].length; x++) {

            var type = columns[x]["type"].toUpperCase();
            if (type != "STRING" && type != "BOOLEAN") {
                data[i][x] = parseFloat(data[i][x]);
            }
        }
    }

    return data;
}

function constructChartConfigurations() {

    var config = {};
    var chartType = $("#chartType").val();
    var xAxis = $("#xAxis").val();
    var yAxis = $("#yAxis").val();
    var maxDataLength = $("#maxDataLength").val();

    config.x = xAxis;
    config.maxLength = maxDataLength;
    config.padding = {top: 30, left: 45, bottom: 38, right: 55};

    if (chartType == "bar") {
        config.charts = [
            {type: chartType, y: yAxis}
        ];
    } else if (chartType === "line") {
        var colorAxis = $("#color").val();

        if (colorAxis != -1) {
            config.charts = [
                {type: chartType, y: yAxis, color: colorAxis}
            ];
        } else {
            config.charts = [
                {type: chartType, y: yAxis}
            ];
        }
    } else if (chartType === "area") {
        config.charts = [
            {type: chartType, y: yAxis}
        ];
    } else if (chartType === "tabular") {
        var columns = [];
        var columnTitles = [];
        var key = $("#key").val();
        var colorColumn = $("#tblColor").val();

        if (selectedTableCoulumns.length != 0) {
            for (i = 0; i < selectedTableCoulumns.length; i++) {
                var cusId = "#cusId" + selectedTableCoulumns[i] + "";
                columns.push(selectedTableCoulumns[i]);
                if ($(cusId).val() != "") {
                    columnTitles.push($(cusId).val());
                } else {
                    columnTitles.push(selectedTableCoulumns[i]);
                }
            }
        } else {
            for (i = 0; i < defaultTableColumns.length; i++) {
                columns.push(defaultTableColumns[i]);
                columnTitles.push(defaultTableColumns[i]);
            }
        }
        config.charts = [
            {type: "table", key: key, maxLength: maxDataLength, color: colorColumn, columns: columns, columnTitles: columnTitles}
        ];
    } else if (chartType === "scatter") {
        var pointSize = $("#pointSize").val();
        var pointColor = $("#pointColor").val();

        config.charts = [
            {type: chartType, y: yAxis, color: pointColor, size: pointSize,
                "maxColor": "#ffff00", "minColor": "#ff00ff"}
        ];
    } else if (chartType === "map") {
        var region;
        if ($("#region").val().trim() != "") {
            region = $("#region").val();
        }
        config.charts = [
            {type: chartType, y: yAxis, mapType: region}
        ];
    } else if (chartType === "number") {
        var attrDescription = $("#attrDescription").val();
        config.charts = [
            {type: chartType, title: attrDescription}
        ];
    }

    config.width = document.getElementById("chartDiv").offsetWidth;
    -110;
    config.height = 240 - 40;

    return config;
}


function addCustomColumns(selectedValue) {

    if (selectedValue != -1) {
        var index = selectedTableCoulumns.indexOf(selectedValue);

        if (index == -1) {
            selectedTableCoulumns.push(selectedValue);
            $("#dynamicElements").append('<tr id="' + selectedValue + '">' +
                '<td><div class="left"><input name="originalValue" type="text" value="' + selectedValue + '" style="width: 128px"id="title" readonly></div></td>' +
                '<td><div class="middle"><b style="padding-left: 4px;padding-right: 4px">AS</b></div></td>' +
                '<td><div class="right"><input name="cusId' + selectedValue + '" id="cusId' + selectedValue + '" type="text" style="width: 128px"id="title" placeholder="Column Name"></div></td>' +
                '<td><div class="buttonRemove" style="padding-left: 3px;"><input type="button" value="-" onclick="removeRow(\'' + selectedValue + '\');" /></div></td>' +
                '</tr>');
        }
    }

}

function removeRow(rowId) {
    var arrayIndex = selectedTableCoulumns.indexOf(rowId);
    selectedTableCoulumns.splice(arrayIndex, 1);
}

$('#dynamicElements').on('click', 'input[type="button"]', function () {
    $(this).closest('tr').remove();
});


/**
 * Generate Noty Messages as to the content given parameters
 * @param1 text {String}
 * @param2 ok {Object}
 * @param3 cancel {Object}
 * @param4 type {String}
 * @param5 layout {String}
 * @param6 timeout {Number}
 * @return {Object}
 * @private
 * */
var generateMessage = function (text, funPrimary, funSecondary, type, layout, timeout, close, mode) {
    var properties = {};
    properties.text = text;

    if (mode == undefined) {

        if (funPrimary || funSecondary) {
            properties.buttons = [
                {
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                    $noty.close();
                    if (funPrimary) {
                        funPrimary();
                    }
                }
                },
                {
                    addClass: 'btn btn-danger', text: 'Cancel', onClick: function ($noty) {
                    $noty.close();
                    if (funSecondary) {
                        funSecondary();
                    }
                }
                }
            ];
        }

    } else if (mode == "DEL_BLOCK_OR_ALL") {

        if (funPrimary || funSecondary) {
            properties.buttons = [
                {
                    addClass: 'btn btn-primary', text: 'Gadget & Block', onClick: function ($noty) {
                    $noty.close();
                    if (funPrimary) {
                        funPrimary();
                    }
                }
                },
                {
                    addClass: 'btn btn-primary', text: 'Gadget Only', onClick: function ($noty) {
                    $noty.close();
                    if (funSecondary) {
                        funSecondary();
                    }
                }
                },
                {
                    addClass: 'btn btn-danger', text: 'Cancel', onClick: function ($noty) {
                    $noty.close();
                }
                }
            ];
        }
    }


    if (timeout) {
        properties.timeout = timeout;
    }

    if (close) {
        properties.closeWith = close;
    }

    properties.layout = layout;
    properties.theme = 'wso2';
    properties.type = type;
    properties.dismissQueue = true;
    properties.killer = true;
    properties.maxVisible = 1;
    properties.animation = {
        open: {height: 'toggle'},
        close: {height: 'toggle'},
        easing: 'swing',
        speed: 500
    };

    return noty(properties);
};