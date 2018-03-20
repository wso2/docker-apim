/**
 *  Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */

(function () {
    // Change the encoding type of the form
    var form = ($('#form-asset-update').length > 0) ? $('#form-asset-update') : $('#form-asset-create');
    form.attr('enctype', 'multipart/form-data');

    // Handler for gadget file change event
    $('#gadget_gadgetarchive').on('change', function () {
        // Create formData element to be sent as multipart data
        var formData = new FormData();
        formData.append('gadget_gadgetarchive', $(this)[0].files[0]);

        $.ajax({
            url: '/publisher/assets/dsgadget/apis/gadgets',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data && confirm('Gadget configurations found within the gadget zip file. \nDo you want to populate the form using those configurations?')) {
                    var gadgetConf = JSON.parse(data);

                    if (gadgetConf.hasOwnProperty('id') && !$('#overview_id').prop('disabled')) {
                        $('#overview_id').val(gadgetConf.id);
                    }

                    if (gadgetConf.hasOwnProperty('title') && !$('#overview_name').prop('disabled')) {
                        $('#overview_name').val(gadgetConf.title);
                    }

                    if (gadgetConf.hasOwnProperty('version') && !$('#overview_version').prop('disabled')) {
                        $('#overview_version').val(gadgetConf.version);
                    }

                    if (gadgetConf.hasOwnProperty('type')) {
                        $('#overview_type option')
                            .removeAttr('selected')
                            .filter(function () {
                                return $(this).text().toLowerCase() == gadgetConf.type.toLowerCase();
                            }).attr('selected', '');
                    }

                    if (gadgetConf.hasOwnProperty('description')) {
                        $('#overview_description').val(gadgetConf.description);
                    }

                    if (gadgetConf.hasOwnProperty('category')) {
                        $('#overview_gadgetcategory').val(gadgetConf.category);
                    }

                    if (gadgetConf.hasOwnProperty('data') && gadgetConf.data.hasOwnProperty('url')) {
                        $('#overview_gadgetxmlurl').val(gadgetConf.data.url);
                    }

                    if (gadgetConf.hasOwnProperty('thumbnail')) {
                        $('#overview_thumbnailurl').val(gadgetConf.thumbnail);
                    }

                    if (gadgetConf.hasOwnProperty('settings')) {
                        var settings = [];
                        for (var setting in gadgetConf.settings) {
                            if (gadgetConf.settings.hasOwnProperty(setting)) {
                                settings.push({
                                    key: setting,
                                    value: gadgetConf.settings[setting]
                                });
                            }
                        }
                        $('#table_settings tbody').html('');
                        for (var i = 0; i < settings.length; i++) {
                            $('.js-add-unbounded-row[data-name="settings"]').click();
                        }
                        var i = 0;
                        $('#table_settings tbody tr').each(function () {
                            $(this).find('#settings_Key').val(settings[i].key);
                            $(this).find('#settings_Value').val(settings[i].value);
                            i++;
                        });
                    }

                    if (gadgetConf.hasOwnProperty('options')) {
                        var options = [];
                        for (var option in gadgetConf.options) {
                            if (gadgetConf.options.hasOwnProperty(option)) {
                                options.push({
                                    key: option,
                                    type: gadgetConf.options[option].type
                                });
                            }
                        }
                        $('#table_options tbody').html('');
                        for (var i = 0; i < options.length; i++) {
                            $('.js-add-unbounded-row[data-name="options"]').click();
                        }
                        var i = 0;
                        $('#table_options tbody tr').each(function () {
                            $(this).find('#options_Key').val(options[i].key);
                            $(this).find('#options_Type option')
                                .filter(function () {
                                    return $(this).text().toLowerCase() == options[i].type.toLowerCase();
                                }).attr('selected', '');
                            i++;
                        });
                    }

                    if (gadgetConf.hasOwnProperty('styles')) {
                        var styles = [];
                        for (var style in gadgetConf.styles) {
                            if (gadgetConf.styles.hasOwnProperty(style)) {
                                styles.push({
                                    key: style,
                                    value: gadgetConf.styles[style]
                                });
                            }
                        }
                        $('#table_styles tbody').html('');
                        for (var i = 0; i < styles.length; i++) {
                            $('.js-add-unbounded-row[data-name="styles"]').click();
                        }
                        var i = 0;
                        $('#table_styles tbody tr').each(function () {
                            $(this).find('#styles_Key').val(styles[i].key);
                            $(this).find('#styles_Value').val(styles[i].value);
                            i++;
                        });
                    }

                    if (gadgetConf.hasOwnProperty('notify')) {
                        var notifiers = [];
                        for (var notifier in gadgetConf.notify) {
                            if (gadgetConf.notify.hasOwnProperty(notifier)) {
                                notifiers.push({
                                    event: notifier,
                                    dataType: gadgetConf.notify[notifier].type,
                                    description: gadgetConf.notify[notifier].description
                                });
                            }
                        }
                        $('#table_notifiers tbody').html('');
                        for (var i = 0; i < notifiers.length; i++) {
                            $('.js-add-unbounded-row[data-name="notifiers"]').click();
                        }
                        var i = 0;
                        $('#table_notifiers tbody tr').each(function () {
                            $(this).find('#notifiers_Event').val(notifiers[i].event);
                            $(this).find('#notifiers_DataType').val(notifiers[i].dataType);
                            $(this).find('#notifiers_Description').val(notifiers[i].description);
                            i++;
                        });
                    }

                    if (gadgetConf.hasOwnProperty('listen')) {
                        var listeners = [];
                        for (var listener in gadgetConf.listen) {
                            if (gadgetConf.listen.hasOwnProperty(listener)) {
                                listeners.push({
                                    event: listener,
                                    dataType: gadgetConf.listen[listener].type,
                                    description: gadgetConf.listen[listener].description
                                });
                            }
                        }
                        $('#table_listeners tbody').html('');
                        for (var i = 0; i < listeners.length; i++) {
                            $('.js-add-unbounded-row[data-name="listeners"]').click();
                        }
                        var i = 0;
                        $('#table_listeners tbody tr').each(function () {
                            $(this).find('#listeners_Event').val(listeners[i].event);
                            $(this).find('#listeners_DataType').val(listeners[i].dataType);
                            $(this).find('#listeners_Description').val(listeners[i].description);
                            i++;
                        });
                    }
                }
            }
        });
    });
})();