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
$(function () {
    var dashboardsApi = ues.utils.tenantPrefix() + 'apis/dashboards';
    var rolesApi = ues.utils.relativePrefix() + 'apis/roles';
    var userApi = ues.utils.relativePrefix() + 'apis/user';
    var searchRolesApi = ues.utils.relativePrefix() + 'apis/roles/search';
    var maxLimitApi = ues.utils.relativePrefix() + 'apis/roles/maxLimit';
    var dashboard = ues.global.dashboard;
    var tokenUrl = ues.utils.tenantPrefix() + 'apis/tokensettings/' + dashboard.id;
    var permissions = dashboard.permissions;
    var viewers = permissions.viewers;
    var editors = permissions.editors;
    var url = dashboardsApi + '/' + dashboard.id;
    var user = null;

    // Pre-compiling handlebar templates
    var permissionMenuHbs = Handlebars.compile($("#permission-menu-hbs").html());
    var modalConfirmHbs = Handlebars.compile($('#ues-modal-confirm-hbs').html());
    var sharedRoleHbs = Handlebars.compile($("#ues-shared-role-hbs").html());

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
     * Show confirm message with yes/no buttons.
     * @param {String} title    Title of the confirmation box
     * @param {String} message  HTML content
     * @param {function} ok     Callback function for yes button
     * @return {null}
     * @private
     */
    var showConfirm = function (title, message, ok) {
        var content = modalConfirmHbs({title: title, message: message});
        showHtmlModal(content, function () {
            var el = $('#designerModal');
            el.find('#ues-modal-confirm-yes').on('click', function () {
                if (ok && typeof ok === 'function') {
                    ok();
                    el.modal('hide');
                }
            });
        });
    };

    /**
     * Generate Noty Messages as to the content given using parameters.
     * @param1 text {String}
     * @param2 ok {Object}
     * @param3 cancel {Object}
     * @param4 type {String}
     * @param5 layout {String}
     * @param6 timeout {Number}
     * @return {Object}
     * @private
     * */
    var generateMessage = function (text, ok, cancel, type, layout, timeout) {
        var properties = {};
        properties.text = text;
        if (ok || cancel) {
            properties.buttons = [{
                addClass: 'btn btn-primary',
                text: 'Ok',
                onClick: function ($noty) {
                    $noty.close();
                    if (ok) {
                        ok();
                    }
                }
            }, {
                addClass: 'btn btn-danger',
                text: 'Cancel',
                onClick: function ($noty) {
                    $noty.close();
                    if (cancel) {
                        cancel();
                    }
                }
            }];
        }

        if (timeout) {
            properties.timeout = timeout;
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

    /**
     * Save the dashboard details.
     * @param {function} callback Callback function when the dashboard saved successfully.
     * @return {null}
     * @private
     * */
    var saveDashboard = function (callback) {
        $.ajax({
            url: url,
            method: 'PUT',
            data: JSON.stringify(dashboard),
            contentType: 'application/json'
        }).success(function (data) {
            generateMessage("Dashboard saved successfully", null, null, "success", "topCenter", 2000);
            if (callback) {
                callback();
            }
        }).error(function (xhr, status, err) {
            if (xhr.status === 403) {
                window.location.reload();
                return;
            }
            generateMessage("Error saving the dashboard", null, null, "error", "topCenter", 2000);
        });
    };

    /**
     * Get the auth settings related details.
     * @private
     * */
    var getOauthSettings = function () {
        $.ajax({
            url: tokenUrl,
            type: "GET",
            dataType: "json",
            data: {
                id: dashboard.id
            }
        }).success(function (data) {
            if ($.trim(data.accessTokenUrl) == '' || $.trim(data.key) == '' || $.trim(data.secret) == '') {
                setOAuthSettingsFields('', '', '');
            } else {
                setOAuthSettingsFields(data.accessTokenUrl, data.key, data.secret);
                $("#ues-oauth-settings-inputs").show();
                generateMessage("Dashboard saved successfully", null, null, "success", "topCenter", 2000);
            }
        }).error(function () {
            generateMessage("Error getting OAuth settings", null, null, "error", "topCenter", 2000);
        });
    };

    /**
     * Set field values for OAuth settings
     * @param1 access token url
     * @param2 api key
     * @param3 api secret
     * @private
     * */
    var setOAuthSettingsFields = function (aturl, ak, as) {
        $("#ues-access-token-url").text(aturl);
        $("#ues-api-key").text(ak);
        $("#ues-api-secret").text(as);
    };

    /**
     * Add the available viewer permission for dashboard in to permission list.
     * @param1 el {Object} element of the list.
     * @param2 role {String}
     * @private
     * */
    var viewer = function (el, role) {
        var permissions = dashboard.permissions;
        var viewers = permissions.viewers;
        if (!isExistingPermission(viewers, role)) {
            viewers.push(role);
            $('#ues-dashboard-settings').find('.ues-shared-view').append(sharedRoleHbs(role));
        }
        el.typeahead('val', '');
    };

    /**
     * Add the available editor permission for the dashboard in to permission list.
     * @param1 el {Object} element of the list.
     * @param2 role {String}
     * @private
     * */
    var editor = function (el, role) {
        var permissions = dashboard.permissions;
        var editors = permissions.editors;
        if (!isExistingPermission(editors, role)) {
            editors.push(role);
            $('#ues-dashboard-settings').find('.ues-shared-edit').append(sharedRoleHbs(role));
        }
        el.typeahead('val', '');
    };

    /**
     * Sanitize the given event's key code.
     * @param1 event
     * @param1 regEx
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
        element.parent().find("span.glyphicon").removeClass("hide");
        element.parent().find("span.glyphicon").addClass("show");
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
        element.parent().find("span.glyphicon").removeClass("show");
        element.parent().find("span.glyphicon").addClass("hide");
        errorElement.removeClass("show");
        errorElement.addClass("hide");
    };

    var initExistingRoles = function () {
        var i;
        var role;

        var html = '';
        var length = viewers.length;
        for (i = 0; i < length; i++) {
            role = viewers[i];
            html += sharedRoleHbs(role);
        }

        var settings = $('#ues-dashboard-settings');
        settings.find('.ues-shared-view').append(html);

        html = '';
        length = editors.length;
        for (i = 0; i < length; i++) {
            role = editors[i];
            html += sharedRoleHbs(role);
        }
        settings.find('.ues-shared-edit').append(html);
    };

    /**
     * pops up the export dashboard page
     * @private
     */
    var exportDashboard = function () {
        window.open(dashboardsApi + '/' + dashboard.id, '_blank');
    };

    /**
     * Check whether permission is existing or not.
     * @param1 permissions {Object}
     * @param2 role {String}
     * @return {Boolean}
     * @private
     * */
    var isExistingPermission = function (permissions, role) {
        var isExist = false;
        for (var i = 0; i < permissions.length; i++) {
            if (permissions[i] == role) {
                isExist = true;
                break;
            }
        }
        return isExist;
    };

    /**
     * Get the user details.
     * @private
     * */
    var getUser = function () {
        $.ajax({
            url: userApi,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                if (data) {
                    user = data;
                }
            }
        });
    };

    /**
     * Get number of user roles in the dashboard permissions.
     * @param permission {String}
     * @return number
     * */
    var getNumberOfUserRolesInDashboard = function (permission) {
        var userRoles = 0;
        for (var i = 0; i < user.roles.length; i++) {
            for (var j = 0; j < permission.length; j++) {
                if (user.roles[i] == permission[j]) {
                    userRoles += 1;
                }
            }
        }
        return userRoles;
    };


    /**
     * Initialize the UI functionality.
     * @private
     * */
    var initUI = function () {
        var viewerSearchQuery = '';
        var maxLimit = 10;
        getUser();

        $.ajax({
            url: maxLimitApi,
            type: "GET",
            async: false,
            dataType: "json"
        }).success(function (data) {
            maxLimit = data;
        }).error(function () {
            console.log('Error calling max roles limit');
        });

        var viewerRoles = new Bloodhound({
            name: 'roles',
            limit: 10,
            prefetch: {
                url: rolesApi,
                filter: function (roles) {
                    return $.map(roles, function (role) {
                        return {name: role};
                    });
                },
                ttl: 60
            },
            sufficient: 10,
            remote: {
                url: searchRolesApi + '?maxLimit=' + maxLimit + '&query=' + viewerSearchQuery,
                filter: function (searchRoles) {
                    return $.map(searchRoles, function (searchRole) {
                        return {name: searchRole};
                    });
                },
                prepare: function (query, settings) {
                    viewerSearchQuery = query;
                    var currentURL = settings.url;
                    settings.url = currentURL + query;
                    return settings;
                },
                ttl: 60
            },
            datumTokenizer: function (d) {
                return d.name.split(/[\s\/.]+/) || [];
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace
        });

        viewerRoles.initialize();

        //TODO: improve typeahead to use single prefetch for both editors and viewers
        $('#ues-share-view').typeahead({
            hint: true,
            highlight: true,
            minLength: 0
        }, {
            name: 'roles',
            displayKey: 'name',
            limit: 10,
            source: viewerRoles.ttAdapter(),
            templates: {
                empty: [
                    '<div class="empty-message">',
                    'No Result Available',
                    '</div>'
                ].join('\n'),
                suggestion: permissionMenuHbs
            }
        }).on('typeahead:selected', function (e, role, roles) {
            viewer($(this), role.name);
        }).on('typeahead:autocomplete', function (e, role) {
            viewer($(this), role.name);
        });

        var editorRoles = new Bloodhound({
            name: 'roles',
            limit: 10,
            prefetch: {
                url: rolesApi,
                filter: function (roles) {
                    return $.map(roles, function (role) {
                        return {name: role};
                    });
                },
                ttl: 60
            },
            sufficient: 10,
            remote: {
                url: searchRolesApi + '?maxLimit=' + maxLimit + '&query=' + viewerSearchQuery,
                filter: function (searchRoles) {
                    return $.map(searchRoles, function (searchRole) {
                        return {name: searchRole};
                    });
                },
                prepare: function (query, settings) {
                    viewerSearchQuery = query;
                    var currentURL = settings.url;
                    settings.url = currentURL + query;
                    return settings;
                },
                ttl: 60
            },
            datumTokenizer: function (d) {
                return d.name.split(/[\s\/.]+/) || [];
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace
        });

        editorRoles.initialize();

        $('#ues-share-edit').typeahead({
            hint: true,
            highlight: true,
            minLength: 0
        }, {
            name: 'roles',
            displayKey: 'name',
            limit: 10,
            source: editorRoles.ttAdapter(),
            extraInfo: ues.global.dashboard,
            templates: {
                empty: [
                    '<div class="empty-message">',
                    'No Result Available',
                    '</div>'
                ].join('\n'),
                suggestion: permissionMenuHbs
            }
        }).on('typeahead:selected', function (e, role, roles) {
            editor($(this), role.name);
        }).on('typeahead:autocomplete', function (e, role) {
            editor($(this), role.name);
        });

        $('#ues-dashboard-settings').find('.ues-shared-edit').on('click', '.remove-button', function () {
            var el = $(this).closest('.ues-shared-role');
            var role = el.data('role');
            var removePermission = function () {
                editors.splice(editors.indexOf(role), 1);
                var removeElement = function () {
                    el.remove();
                };

                removeElement();
            };

            if ((editors.length == 1 || (getNumberOfUserRolesInDashboard(editors) == 1
                && isExistingPermission(user.roles, role)))
                && !user.isAdmin) {
                showConfirm("Removing Permission",
                    "After this permission removal only administrator will be able to edit this dashboard." +
                    " Do you want to continue?", removePermission);
            } else {
                removePermission();
            }
        }).end().find('.ues-shared-view').on('click', '.remove-button', function () {
            var el = $(this).closest('.ues-shared-role');
            var role = el.data('role');
            var removePermission = function () {
                viewers.splice(viewers.indexOf(role), 1);
                var removeElement = function () {
                    el.remove();
                };
                removeElement();
            };

            if ((viewers.length == 1 || (getNumberOfUserRolesInDashboard(viewers) == 1
                && isExistingPermission(user.roles, role)))
                && !user.isAdmin) {
                showConfirm("Removing Permission",
                    "After this permission removal only administrator will be able to view this dashboard." +
                    " Do you want to continue?", removePermission);
            } else {
                removePermission();
            }
        });

        // Dashboard title
        $('#ues-dashboard-title').on("keypress", function (e) {
            return sanitizeOnKeyPress(this, e, /[^a-z0-9-\s]/gim)
        }).on('change', function () {
            if ($.trim($(this).val()) == '') {
                showInlineError($(this), $("#title-error"));
            } else {
                hideInlineError($(this), $("#title-error"));
                dashboard.title = $(this).val();
            }
        });

        // Dashboard description
        $('#ues-dashboard-description').on('keypress', function (e) {
            return sanitizeOnKeyPress(this, e, /[^a-z0-9-.\s]/gim);
        }).on('change', function () {
            dashboard.description = $(this).val();
        });

        //Dashboard theme
        $('#ues-dashboard-theme').on("click", '.option li', function (e) {
            var text = $(this).children().text();
            $('#ues-dashboard-theme .selected').text(text);
            dashboard.theme = text;
        });

        // Enable Oauth settings
        $('#ues-enable-oauth').on('click', function () {
            dashboard.enableOauth = $(this).is(":checked");
            saveDashboard();
            if (dashboard.enableOauth) {
                $("#ues-oauth-settings-inputs").show();
            } else {
                $("#ues-oauth-settings-inputs").hide();
            }
        });

        // Refresh Oauth settings
        $('#ues-oauth-refresh').on('click', function () {
            getOauthSettings();
        });

        // Export dashboard
        $('#ues-dashboard-export').on('click', function () {
            exportDashboard();
        });

        // Save dashboard
        $('#ues-dashboard-saveBtn').on('click', function () {
            saveDashboard();
        });

        // Reset the changes
        $('#ues-dashboard-cancelBtn').on('click', function(){
            location.reload();
        });
    };

    initUI();
    initExistingRoles();
});
