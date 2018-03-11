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
/**
 * Functionality of the Create Dashboard defined in create.js.
 * */
$(function () {
    var overridden = false;
    var modalInfoHbs = Handlebars.compile($('#ues-modal-info-hbs').html());

    /**
     * Show HTML modal.
     * @param {String} content      HTML content
     * @param {function} beforeShow Function to be invoked just before showing the modal
     * @return {null}
     * @private
     */
    var showHtmlModal = function (content, beforeShow) {
        var modalElement = $('#designerModal');
        modalElement.find('.modal-content').html(content);
        if (beforeShow && typeof beforeShow === 'function') {
            beforeShow();
        }
        modalElement.modal();
    };

    /**
     * Show the information message with ok button.
     * @param title {String}
     * @param message {String}
     * @return {null}
     * @private
     * */
    var showInformation = function (title, message) {
        var content = modalInfoHbs({title: title, message: message});
        showHtmlModal(content, null);
    };

    /**
     * Generate URL from the user entered title.
     * @param title
     * @return string
     * @private
     * */
    var generateUrl = function (title) {
        title = title.substring(0,100);
        return title.replace(/[^\w]/g, '-').toLowerCase();
    };

    /**
     * Update the URL in id textbox.
     * @private
     * */
    var updateUrl = function () {
        if (overridden) {
            return;
        }
        var title = $('#ues-dashboard-title').val();
        $('#ues-dashboard-id').val(generateUrl(title));
    };

    /**
     * Sanitize the given input of a user input controller.
     * @param input
     * @return string
     * @private
     * */
    var sanitizeInput = function (input) {
        return input.replace(/[^a-z0-9-\s]/gim, "");
    };

    /**
     * Sanitize the given event's key code.
     * @param event
     * @return boolean
     * @private
     * */
    var sanitizeOnKeyPress = function (element, event, regEx) {
        var code;
        if (event.keyCode) {
            code = event.keyCode;
        } else if (event.which) {
            code = event.which;
        }

        var character = String.fromCharCode(code);
        if (character.match(regEx) && code != 8 && code != 46) {
            return false;
        } else {
            return !($.trim($(element).val()) == '' && character.match(/[\s]/gim));
        }
    };

    /**
     * Show error style for given element
     * @param1 element
     * @param2 errorElement
     * @private
     * */
    var showInlineError = function (element, errorElement) {
        element.val('');
        element.parent().addClass("has-error");
        element.addClass("has-error");
        errorElement.removeClass("hide");
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

    // Bind event handlers for dashboard title field
    $('#ues-dashboard-title').on("keypress", function (e) {
        return sanitizeOnKeyPress(this, e, /[^a-z0-9-\s]/gim);
    }).on('keyup', function () {
        if ($(this).val()) {
            hideInlineError($(this), $("#title-error"));
        }
        updateUrl();
    }).on('change', function () {
        var sanitizedInput = sanitizeInput($(this).val());
        $(this).val(sanitizedInput);
        updateUrl();
    });

    // Bind event handlers for dashboard ID field
    $('#ues-dashboard-id').on("keypress", function (e) {
        return sanitizeOnKeyPress(this, e, /[^a-z0-9-\s]/gim);
    }).on('keyup', function (e) {
        overridden = overridden || true;
        if ($(this).val()) {
            hideInlineError($(this), $("#id-error"));
        }

        // If the key released is not a generic key other than space (E.g - arrow keys, backspace, delete), update the URL field
        if ((e.which == "number" && e.which > 0) || e.keyCode == 0 || e.keyCode == 32)
            $(this).val(generateUrl($(this).val()));
    });

    // Bind event handlers for dashboard description field
    $('#ues-dashboard-description').on("keypress", function (e) {
        return sanitizeOnKeyPress(this, e, /[^a-z0-9-.\s]/gim);
    });

    // Bind event handlers for the create button
    $('#ues-dashboard-create').on('click', function () {
        var title = $("#ues-dashboard-title");
        var id = $("#ues-dashboard-id");
        var form = $('#ues-dashboard-form');
        var url = form.data('action') + "/" + id.val();
        var apiUrl = form.data('api-url') + "/" + id.val();
        var titleError = $("#title-error");
        var idError = $("#id-error");

        if (!$.trim(title.val()) || !$.trim(id.val())) {
            !$.trim(title.val()) ? showInlineError(title, titleError) : showInlineError(id, idError);
        } else {
            form.attr('action', url);
            $.ajax({
                url: apiUrl,
                method: "GET",
                contentType: "application/json",
                success: function (data) {
                    showInformation("URL Already Exists",
                        "A dashboard with same URL already exists. Please enter a different dashboard URL.");
                },
                error: function (xhr) {
                    if (xhr.status == 404) {
                        //There's no dashboard exists with same id. We are good to go.
                        $("#ues-dashboard-form").submit();
                    }
                }
            });
        }
    });
});