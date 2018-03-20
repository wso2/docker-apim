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
 * Handlebars helpers
 */
// Check whether a particular object has a property.
Handlebars.registerHelper('has', function () {
    var has = function (o) {
        if (!o) {
            return false;
        }
        if (o instanceof Array && !o.length) {
            return false;
        }
        var key;
        for (key in o) {
            if (o.hasOwnProperty(key)) {
                return true;
            }
        }
        return false;
    };
    var args = Array.prototype.slice.call(arguments);
    var options = args.pop();
    var length = args.length;
    if (!length) {
        return new Handlebars.SafeString(options.inverse(this));
    }
    var i;
    for (i = 0; i < length; i++) {
        if (has(args[i])) {
            return new Handlebars.SafeString(options.fn(this));
        }
    }
    return new Handlebars.SafeString(options.inverse(this));
});

// Check whether the left hand side equals to the right hand side.
Handlebars.registerHelper('equals', function (left, right, options) {
    if (left === right) {
        return options.fn(this);
    }
    return options.inverse(this);
});

Handlebars.registerHelper('equalsIgnoreCase', function (left, right, options) {
    if (left.toLowerCase() === right.toLowerCase()) {
        return options.fn(this);
    }
    return options.inverse(this);
});

// Check whether the left hand side does not equals to the right hand side.
Handlebars.registerHelper('if_neq', function (a, b, blocks) {
    if (a != b) {
        return blocks.fn(this);
    } else {
        return blocks.inverse(this);
    }
});

// JSON stringify a particular object.
Handlebars.registerHelper('dump', function (o) {
    return JSON.stringify(o);
});

// Resolve a URI.
Handlebars.registerHelper('resolveURI', function (path) {
    return ues.dashboards.resolveURI(path);
});

//handlebar helper which returns menu hierachy
Handlebars.registerHelper('traverseMenu', function (menu, designer, isAnonView, user, isHidden) {
    var divTree = "<ul class='nav nav-pills nav-stacked menu-customize'>";
    var checked = isHidden ? "checked=''": "" ;

    if(designer){
        divTree += "<li class='ds-menu-root' style='margin: 0 0 10px 0;' id='ds-menu-root'>" +
        "<i class='fw fw-up'></i> Make Root</li>" + 
            "<li class='hide-all' style='margin: 0 0 10px 0;'><input type='checkbox' " + checked +
                " name='ds-menu-hide-all' value='hide' id='ds-menu-hide-all'> <i class='fw fw-view'></i> Hide All</li>";
    }

    updateSubordinates(menu, null);
    divTree += "</ul>"

    function updateSubordinates(menu, parent){
        for (var i = 0; i < menu.length; i++) {
                if (designer) {
                    //todo use fw-hide class once latest wso2 icon project released
                    var iClass = menu[i].ishidden ? "<i class='fw fw-block'></i>" : "<i class='fw fw-view'></i>";
                    divTree +="<li id='" + menu[i].id +"' data-parent='" + parent +
                        "' data-id='"+ menu[i].id + "' data-anon='" + menu[i].isanon + "' class='menu-hierarchy'>" +
                                "<span>" + menu[i].title + "<span class='controls hide-menu-item hide-" + menu[i].ishidden + "' id='" +menu[i].id + 
                                "'>" + iClass + "</span></span>";
                } else {
                    var divLi = "<li><a href='" + menu[i].id + "'>" + menu[i].title + "</a>";
                    if(!menu[i].ishidden){
                        if (isAnonView || !user) {
                            if (menu[i].isanon) {
                                // Anonymous viewing. So render only anonymous pages links.
                                divTree += divLi;
                            }
                        } else {
                            divTree += divLi;
                        }
                    }
                }

                if(menu[i].subordinates.length > 0){
                    divTree += "<ul class='' id='"+ menu[i].id + "' data-anon='" + menu[i].isanon + "'>";
                    updateSubordinates(menu[i].subordinates, menu[i].id);
                    divTree += "</ul>";
                } else{
                    divTree += "</li>";
                }
        }
    }
    return divTree;
});
