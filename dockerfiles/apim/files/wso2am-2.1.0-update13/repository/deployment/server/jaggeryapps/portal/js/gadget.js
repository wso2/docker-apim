/*
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
    /**
     * To render the specific gadget in a certain page
     */
    var renderGadget = function () {
        window.onresize = function () {
            location.reload();
        };
        var componentBox = $('.emb-gadget');
        var id = window.location.pathname.split("/").pop();
        var page = ues.dashboards.findPage(ues.global.dashboard, ues.global.page);
        var component = ues.dashboards.findComponent(id, page);
        var componentBoxContentHbs = Handlebars.compile($('#ues-component-box-content-hbs').html());
        componentBox.html(componentBoxContentHbs());
        ues.components.create(componentBox, component, function (err) {
            if (err)
                throw err;
        });
    };
    renderGadget();
});