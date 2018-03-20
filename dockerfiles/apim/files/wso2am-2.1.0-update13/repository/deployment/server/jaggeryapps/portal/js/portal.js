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
    var dashboards = [];
    var isStillLoading = false;
    var nextStart = 0;
    var hasMore = true;

    /**
     * Page count.
     * @const
     */
    var PAGE_COUNT = 10;

    // Pre-compiling handlebar templates
    var dashboardsListHbs = Handlebars.compile($("#ues-dashboards-list-hbs").html());
    var dashboardThumbnailHbs = Handlebars.compile($("#ues-dashboard-thumbnail-hbs").html());
    var dashboardConfirmHbs = Handlebars.compile($("#ues-dashboard-confirm-hbs").html());
    var dashboardsEmptyHbs = Handlebars.compile($("#ues-dashboards-empty-hbs").html());
    Handlebars.registerPartial('ues-dashboard-thumbnail-hbs', dashboardThumbnailHbs);

    /**
     * Find the dashboard using dashboard id.
     * @param id
     * @return {object}
     * @private
     * */
    var findDashboard = function (id) {
        var i;
        var dashboard;
        var length = dashboards.length;
        for (i = 0; i < length; i++) {
            dashboard = dashboards[i];
            if (dashboard.id === id) {
                return dashboard;
            }
        }
    };

    /**
     * Delete the selected dashboard
     * @param el:-selected dashboard element
     * @private
     * */
    var deleteDashboard = function (el) {
        var button = Ladda.create(el[0]);
        button.start();
        var id = el.closest('.ues-dashboard').data('id');
        $.ajax({
            url: dashboardsApi + '/' + id,
            method: 'DELETE',
            success: function () {
                button.stop();
                location.reload();
            },
            error: function () {
                button.stop();
            }
        });
    };

    /**
     * Load the list of dashboards available.
     * @private
     * */
    var loadDashboards = function () {
        isStillLoading = true;

        if (!hasMore) {
            isStillLoading = false;
            return;
        }
        ues.store.assets('dashboard', {
            start: nextStart,
            count: PAGE_COUNT
        }, function (err, data) {
            var dashboardsEl = $('#ues-portal').find('.ues-dashboards');
            hasMore = data.length;
            if (!hasMore && nextStart === 0) {
                dashboardsEl.append(dashboardsEmptyHbs());
                return;
            }

            nextStart += PAGE_COUNT;
            dashboards = dashboards.concat(data);
            dashboardsEl.append(dashboardsListHbs(data));

            var win = $(window);
            var doc = $(document);
            isStillLoading = false;
            if (doc.height() > win.height()) {
                return;
            }

            loadDashboards();

            $(".disable").on('click', function (event) {
                event.preventDefault();
            });
        });
    };

    /**
     * Initialize the UI functionality such as binding events.
     * @private
     * */
    var initUI = function () {
        var portal = $('#ues-portal');
        portal.on('click', '.ues-dashboards .ues-dashboard-trash-handle', function (e) {
            e.preventDefault();
            var thiz = $(this);
            var dashboardEl = thiz.closest('.ues-dashboard');
            var id = dashboardEl.data('id');
            var dashboard = findDashboard(id);
            dashboardEl.html(dashboardConfirmHbs(dashboard));
        });

        portal.on('click', '.ues-dashboards .ues-dashboard-trash-confirm', function (e) {
            e.preventDefault();
            deleteDashboard($(this));
        });

        portal.on('click', '.ues-dashboards .ues-dashboard-trash-cancel', function (e) {
            e.preventDefault();
            var thiz = $(this);
            var dashboardEl = thiz.closest('.ues-dashboard');
            var id = dashboardEl.data('id');
            var dashboard = findDashboard(id);
            dashboardEl.html(dashboardThumbnailHbs(dashboard));
        });
        
        portal.on('click', '.ues-view:not(.disable)', function(e) {
            e.preventDefault();
            window.open($(this).attr('href'), '_blank');
        })

        $(window).scroll(function () {
            var win = $(window);
            var doc = $(document);
            if (win.scrollTop() + win.height() < doc.height() - 100) {
                return;
            }

            if (!isStillLoading) {
                loadDashboards();
            }
        });
    };

    initUI();
    loadDashboards();
});