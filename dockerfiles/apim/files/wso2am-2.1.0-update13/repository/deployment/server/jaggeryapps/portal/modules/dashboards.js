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
var log = new Log();
var carbon = require('carbon');
var utils = require('/modules/utils.js');

/**
 * Get registry reference.
 * @return {Object} registry object
 */
var getRegistry = function () {
    var server = new carbon.server.Server();
    return new carbon.registry.Registry(server, {
        system: true
    });
};

//TODO: what happen when the context is changed or mapped via reverse proxy
/**
 * Get the registry path for the id.
 * @param {String} id                       Id of the dashboard
 * @return {String}                         Registry Path to dashboard
 * */
var registryPath = function (id) {
    var path = '/_system/config/ues/dashboards';
    return id ? path + '/' + id : path;
};

/**
 * Get the user registry path for dashboard.
 * @param {String} id                       Id of the dashboard
 * @param {String} username                 Username of the user
 * @return {String}                         Path to user
 * */
var registryUserPath = function (id, username) {
    var path = '/_system/config/ues/' + username + '/dashboards';
    return id ? path + '/' + id : path;
};

/**
 * Get location where to store an OAuth application credentials
 * @param id
 * @returns string path
 */
var registryOAuthApplicationPath = function (id) {
    var path = '/_system/config/ues/application';
    return id ? path + '/' + id : path;
};

/**
 * If an OAuth application already has been created get application credentials
 * @param applicationId   resource location in the registry
 * @param callBack
 */
var getOAuthApplication = function (applicationId, callBack) {
    var registry = getRegistry();
    var path = registryOAuthApplicationPath(applicationId);
    if (registry.exists(path)) {
        callBack(JSON.parse(registry.content(path)));
    } else {
        callBack(null);
    }
};

/**
 * Create an OAuth application against portal app
 * @param applicationId          resource location in the registry
 * @param clientCredentials      OAuth application credentials
 * @returns {boolean}            check whether  OAuth application's credentials are stored in registry
 */
var createOAuthApplication = function (applicationId, clientCredentials) {
    var server = new carbon.server.Server();
    var registry = getRegistry();
    var userManager = new carbon.user.UserManager(server);
    var path = registryOAuthApplicationPath(applicationId);
    try {
        registry.put(path, {
            content: JSON.stringify(clientCredentials),
            mediaType: 'application/json'
        });
        userManager.denyRole('internal/everyone', path, 'read');
        return true;
    } catch (exception) {
        throw "Error occurred while creating an OAuth application, " + exception;
    }
};

/**
 * Finds a dashboard by its ID.
 * @param {String} id                       ID of the dashboard
 * @param {Boolean} originalDashboardOnly   Original dashboard only
 * @return {Object} Dashboard object
 */
var getAsset = function (id, originalDashboardOnly) {
    originalDashboardOnly = originalDashboardOnly || false;
    var registry = getRegistry();
    var usr = require('/modules/user.js');
    var user = usr.current();
    var path = registryPath(id);
    var originalDB;
    var isCustom = false;
    if (user) {
        var originalDBPath = registryPath(id);
        if (registry.exists(originalDBPath)) {
            originalDB = JSON.parse(registry.content(originalDBPath));
        }
        if (!originalDashboardOnly) {
            var userDBPath = registryUserPath(id, user.username);
            if (registry.exists(userDBPath)) {
                path = userDBPath;
                isCustom = true;
            }
        }
    }
    var content = registry.content(path);
    var dashboard = JSON.parse(content);
    if (dashboard) {
        dashboard.isUserCustom = isCustom;
        dashboard.isEditorEnable = false;
        if (!originalDashboardOnly && originalDB) {
            var carbon = require('carbon');
            var server = new carbon.server.Server();
            var um = new carbon.user.UserManager(server, user.tenantId);
            user.roles = um.getRoleListOfUser(user.username);
            for (var i = 0; i < user.roles.length; i++) {
                for (var j = 0; j < originalDB.permissions.editors.length; j++) {
                    if (user.roles[i] == originalDB.permissions.editors[j]) {
                        dashboard.isEditorEnable = true;
                        break;
                    }
                }
            }
        }
        var banner = getBanner(id, (user ? user.username : null));
        dashboard.banner = {
            globalBannerExists: banner.globalBannerExists,
            customBannerExists: banner.customBannerExists
        };
    }
    return dashboard;
};

/**
 * Find dashboards available in the registry.
 * @param {Object} paging                      Paging query.
 * @return {Object} dashboardz                 Array containing dashboards.
 * */
var getAssets = function (paging) {
    var registry = getRegistry();
    var dashboards = registry.content(registryPath(), paging);
    var dashboardz = [];
    dashboards.forEach(function (dashboard) {
        dashboardz.push(JSON.parse(registry.content(dashboard)));
    });
    return dashboardz;
};

/**
 * Create dashboard with given dashboard id and the content.
 * @param {Object} dashboard                    Dashboard object to be saved.
 * @return {null}
 * */
var create = function (dashboard) {
    var server = new carbon.server.Server();
    var registry = getRegistry();
    var userManager = new carbon.user.UserManager(server);
    var path = registryPath(dashboard.id);
    if (registry.exists(path)) {
        throw 'a dashboard exists with the same id ' + dashboard.id;
    }
    registry.put(path, {
        content: JSON.stringify(dashboard),
        mediaType: 'application/json'
    });
    userManager.denyRole('internal/everyone', path, 'read');
};

/**
 * Update an existing dashboard with given data.
 * @param {Object} dashboard                    Dashboard object to be updated.
 * @return {null}
 * */
var update = function (dashboard) {
    var registry = getRegistry();
    var usr = require('/modules/user.js');
    var user = usr.current();
    if (!user) {
        throw 'User is not logged in ';
    }
    var path = registryUserPath(dashboard.id, user.username);
    if (!registry.exists(path) && !dashboard.isUserCustom) {
        path = registryPath(dashboard.id);
        if (!registry.exists(path)) {
            throw 'a dashboard cannot be found with the id ' + dashboard.id;
        }
    }
    registry.put(path, {
        content: JSON.stringify(dashboard),
        mediaType: 'application/json'
    });
};

/**
 * Copy a dashboard to an user path.
 * @param {Object} dashboard                    Dashboard object to be copied.
 * @return {null}
 * */
var copy = function (dashboard) {
    var registry = getRegistry();
    var usr = require('/modules/user.js');
    var user = usr.current();
    if (!user) {
        throw 'User is not logged in ';
    }
    var path = registryUserPath(dashboard.id, user.username);
    if (!registry.exists(path)) {
        registry.put(path, {
            content: JSON.stringify(dashboard),
            mediaType: 'application/json'
        });
    }
};

/**
 * Remove the dashboard which copied to a user path.
 * @param {String} id                           Id of the dashboard.
 * @return {null}
 * */
var reset = function (id) {
    var registry = getRegistry();
    var usr = require('/modules/user.js');
    var user = usr.current();
    if (!user) {
        throw 'User is not logged in ';
    }
    var path = registryUserPath(id, user.username);
    if (registry.exists(path)) {
        registry.remove(path);
    }
    deleteBanner(id, user.username);
};

/**
 * Remove an existing dashboard from registry.
 * @param {String} id                          Id of the dashboard.
 * @return {null}
 * */
var remove = function (id) {
    var registry = getRegistry();
    var path = registryPath(id);
    if (registry.exists(path)) {
        registry.remove(path);
    }
};

/**
 * Check if user has permission for the dashboard.
 * @param {Object} dashboard                   Dashboard Object.
 * @param {Object} permission                  Array of available permission for dashboard.
 * @return {Boolean}                           True if user has permission false if user doesn't.
 * */
var allowed = function (dashboard, permission) {
    var usr = require('/modules/user.js');
    var user = usr.current();
    var permissions = dashboard.permissions;
    if (permission.edit) {
        return utils.allowed(user.roles, permissions.editors);
    }
    if (permission.view) {
        return utils.allowed(user.roles, permissions.viewers);
    }
};

/**
 * Find a particular page within a dashboard
 * @param {Object} dashboard Dashboard object
 * @param {String} id Page id
 * @return {Object} Page object
 */
var findPage = function (dashboard, id) {
    var i;
    var page;
    var pages = dashboard.pages;
    var length = pages.length;
    for (i = 0; i < length; i++) {
        page = pages[i];
        if (page.id === id) {
            return page;
        }
    }
};

/**
 * Find a given component in the current page
 * @param {Number} id
 * @returns {Object}
 * @private
 */
var findComponent = function (id, page) {
    var i;
    var length;
    var area;
    var component;
    var components;
    var type;

    if ((user.domain != superDomain && user.domain != urlDomain) ||
        (urlDomain && user.domain == superDomain && urlDomain != superDomain)) {
        type = 'anon';
    }

    var content = (type === 'anon' ? page.content.anon : page.content.default)
    for (area in content) {
        if (content.hasOwnProperty(area)) {
            components = content[area];
            length = components.length;
            for (i = 0; i < length; i++) {
                component = components[i];
                if (component.id === id) {
                    return component;
                }
            }
        }
    }
};

/**
 * Save banner in the registry.
 * @param {String} dashboardId   ID of the dashboard
 * @param {String} username      Username
 * @param {String} filename      Name of the file
 * @param {String} mime mime     Type of the file
 * @param {Object} stream        Bytestream of the file
 * @return {null}
 */
var saveBanner = function (dashboardId, username, filename, mime, stream) {
    var uuid = require('uuid');
    var registry = getRegistry();
    var path = registryBannerPath(dashboardId, username);
    var resource = {
        content: stream,
        uuid: uuid.generate(),
        mediaType: mime,
        name: filename,
        properties: {}
    };
    registry.put(path, resource);
};

/**
 * Delete dashboard banner (if the username is empty, then the default banner will be removed, otherwise the custom
 * banner for the user will be removed).
 * @param {String} dashboardId   ID of the dashboard
 * @param {String} username      Username
 * @return {null}
 */
var deleteBanner = function (dashboardId, username) {
    getRegistry().remove(registryBannerPath(dashboardId, username));
};

/**
 * Render banner.
 * @param {String} dashboardId ID of the dashboard
 * @param {String} username    Username
 * @return {null}
 */
var renderBanner = function (dashboardId, username) {
    var registry = getRegistry();
    var FILE_NOT_FOUND_ERROR = 'requested file cannot be found';
    var banner = getBanner(dashboardId, username);
    if (!banner) {
        response.sendError(404, FILE_NOT_FOUND_ERROR);
        return;
    }
    var r = registry.get(banner.path);
    if (r == null || r.content == null) {
        response.sendError(404, FILE_NOT_FOUND_ERROR);
        return;
    }
    response.contentType = r.mediaType;
    print(r.content);
};

/**
 * Path to customizations directory in registry.
 * @return {String} Path to the customization registry
 */
var registryCustomizationsPath = function () {
    return '/_system/config/ues/customizations';
};

/**
 * Get saved registry path for a banner.
 * @param   {String} dashboardId ID of the dashboard
 * @param   {String} username    Current user's username
 * @returns {String} Path to the banner
 */
var registryBannerPath = function (dashboardId, username) {
    return registryCustomizationsPath() + '/' + dashboardId + (username ? '/' + username : '')
        + '/banner';
};

/**
 * Get banner details (banner type and the registry path).
 * @param   {String} dashboardId ID of the dashboard
 * @param   {String} username    Username
 * @returns {Object} Banner details
 */
var getBanner = function (dashboardId, username) {
    var registry = getRegistry();
    var path;
    var result = {globalBannerExists: false, customBannerExists: false, path: null};
    // check to see whether the custom banner exists
    path = registryBannerPath(dashboardId, username);
    if (registry.exists(path)) {
        var resource = registry.get(path);
        if (!resource.content || new String(resource.content).length == 0) {
            return result;
        }
        result.customBannerExists = true;
        result.path = path;
    }
    // check to see if there is any global banner
    path = registryBannerPath(dashboardId, null);
    if (registry.exists(path)) {
        result.globalBannerExists = true;
        result.path = result.path || path;
    }
    return result;
};

/**
 * Generate Bootstrap layout from JSON layout
 * @param   {String} pageId     ID of the dashboard page
 * @param   {String} isAnon     Is anon mode
 * @returns {String}            Bootstrap layout markup
 */
var getBootstrapLayout = function (pageId, isAnon) {
    var bitmap;
    var err = [];
    var content = '';
    var unitHeight = 150;

    /**
     * Process the data object and build the grid.
     * @param {Array} data Array of data objects
     * @return {Array} Array of grid elements
     * @private
     */
    function initGrid(data) {
        var grid = [];
        data.forEach(function (d) {
            // if there is no second dimension array, create it
            if (typeof grid[d.y] === 'undefined') {
                grid[d.y] = [];
            }
            grid[d.y][d.x] = {"id": d.id, "width": d.width, "height": d.height, "banner": d.banner || false};
        });
        return grid;
    };

    /**
     * Generate bitmap to mark starts and ends of the blocks.
     * @param {Array} grid Grid array
     * @param {Number} sx Start x index
     * @param {Number} sy Start y index
     * @param {Number} ex End x index
     * @param {Number} ey End y index
     * @return {Array} Bitmap to mark the starts and ends of the blocks
     * @private
     */
    function generateBitmap(grid, sx, sy, ex, ey) {
        var x;
        var y;
        var i;
        var extra = 0;
        var localMax;
        bitmap = [];
        // calculate the total height of the bitmap
        for (y = sy; y <= ey; y++) {
            if (typeof grid[y] === 'undefined') {
                continue;
            }
            localMax = 0;
            for (x = sx; x <= ex; x++) {
                if (typeof grid[y][x] === 'undefined') {
                    continue;
                }
                localMax = Math.max(localMax, grid[y][x].height);
            }
            extra = Math.max(--extra, 0) + localMax - 1;
        }
        // create a x * y bitmap and initialize into false state
        for (y = sy; y <= extra + ey; y++) {
            bitmap[y] = [];
            for (x = sx; x <= ex; x++) {
                bitmap[y][x] = false;
            }
        }
        // traverse through the entire grid and mark cells appropriately
        for (y = sy; y <= ey; y++) {
            if (typeof grid[y] === 'undefined') {
                continue;
            }
            for (x = sx; x <= ex; x++) {
                if (typeof grid[y][x] === 'undefined') {
                    continue;
                }
                // this is for multi-row blocks. iterate through all the rows and mark the starts and offsets
                for (i = y; i < y + grid[y][x].height; i++) {
                    bitmap[i][x] = true;                    // start of the block
                    bitmap[i][x + grid[y][x].width] = true; // end of the block
                }
            }
        }
        return bitmap;
    }

    /**
     * Prints a single Bootstrap row.
     * @param {Array} grid Grid array
     * @param {Number} y Row number
     * @param {Number} sx Start x index
     * @param {Number} ex End x index
     * @param {Number} parentWidth Width of the parent column
     * @return {String} HTML markup to print a row
     * @private
     */
    function printRow(grid, y, sx, ex, parentWidth) {
        parentWidth = parentWidth || 12;
        var x;
        var width;
        var el;
        var classes;
        var row;
        var left;
        var offset = 0;
        var previousEndPoint = 0;
        var processedRow = [];
        var content = '';
        var height = 0;
        // calculate new indices and widths depending on the parent's width
        for (x = sx; x <= ex; x++) {
            var el = grid[y][x];
            if (typeof el === 'undefined') {
                continue;
            }
            left = Math.ceil((x - sx) * 12) / (12 - sx);
            width = Math.ceil((el.width * 12) / parentWidth);
            processedRow[left] = {id: el.id, height: el.height, width: width, left: left, banner: el.banner};
        }
        // draw the bootstrap columns
        for (x = 0; x <= 11; x++) {
            if (typeof processedRow[x] === 'undefined') {
                continue;
            }
            height = unitHeight * processedRow[x].height;
            classes = 'col-md-' + processedRow[x].width + ' ues-component-box';
            if (processedRow[x].banner) {
                classes += ' ues-banner-placeholder';
            }
            var styles = 'height: ' + height + 'px;';
            offset = x - previousEndPoint;
            if (offset > 0) {
                classes += ' col-md-offset-' + offset;
            }
            previousEndPoint += processedRow[x].width + offset;
            content += '<div id="' + processedRow[x].id + '" class="' + classes + '" ';
            if (styles) {
                content += 'style="' + styles + '" ';
            }
            content += 'data-height="' + processedRow[x].height + '"></div>';
        }
        return '<div class="row">' + content + '</div>';
    }

    /**
     * Process the grid and generate the Bootstrap template.
     * @param {Array} grid Grid array
     * @param {Number} sx Start x index
     * @param {Number} sy Start y index
     * @param {Number} ex End x index
     * @param {Number} ey End y index
     * @reuturn {String} HTML markup to generate the grid using Bootstrap
     * @private
     */
    function process(grid, sx, sy, ex, ey, parentWidth) {
        // initialize optional parameters
        sx = sx || 0;
        ex = ex || 11;
        ey = ey || grid.length - 1;
        parentWidth = parentWidth || 12;
        // if the start row not defined, get the first defined row
        if (!sy) {
            for (y = 0; y <= ey; y++) {
                if (typeof grid[y] === 'undefined') {
                    continue;
                }
                sy = y;
                break;
            }
        }
        var x;
        var previousHeight;
        var varyingHeight = false;
        var y = sy;
        var rowSpan = 1;
        var startRow = sy;
        var endRow = -1;
        var content = '';
        bitmap = bitmap || generateBitmap(grid, sx, sy, ex, ey);
        // traverse through all the rows in the grid and process row-by-row
        while (y <= ey) {
            previousHeight = undefined;
            // calculate the row span (height of the row)
            for (x = sx; x <= ex; x++) {
                if (typeof grid[y] === 'undefined' || typeof grid[y][x] === 'undefined') {
                    continue;
                }
                if (typeof previousHeight === 'undefined') {
                    previousHeight = grid[y][x].height;
                }
                if (previousHeight != grid[y][x].height) {
                    varyingHeight = true;
                }
                rowSpan = Math.max(rowSpan, grid[y][x].height);
                previousHeight = grid[y][x].height;
            }
            // decrease the row span by 1 since the current row is being processed.
            rowSpan--;
            // if the rowSpan = 0, then we can safety split the above rows from the rest
            if (rowSpan == 0 || y == ey) {
                endRow = y;
                // if the heights of each block is not varying, then the section can be
                // printed as a single row. otherwise the row block needc to be processed.
                if (!varyingHeight) {
                    content += printRow(grid, startRow, sx, ex, parentWidth);
                } else {
                    // now we have a block of rows. so try to split it vertically if possible. if not, this kind of 
                    // layout cannot be rendered using bootstrap.
                    // split vertically (by columns)
                    // identify the columns which have aligned margins
                    var columnStatus = [];
                    for (x = sx; x <= ex; x++) {
                        columnStatus[x] = true;
                        for (var i = startRow; i <= endRow; i++) {
                            columnStatus[x] = columnStatus[x] && bitmap[i][x];
                        }
                    }
                    var startCol;
                    var endCol;
                    var child;
                    var width;
                    var row;
                    var child = '';
                    // iterate through all the column, identify the start and end columns
                    // and process the sub-grid recursively
                    for (x = sx; x <= ex; x++) {
                        if (columnStatus[x] || x == ex) {
                            if (typeof startCol === 'undefined') {
                                startCol = (x == sx) ? x : x - 1;
                                continue;
                            }
                            endCol = (x == ex) ? x : x - 1;
                            width = endCol - startCol + 1;
                            var subContent = '';
                            if (startCol == sx && endCol == ex) {
                                err.push({
                                    name: 'UnsupportedLayoutError',
                                    message: 'Unable to properly render the layout using Bootstrap'
                                });
                                // fallback to the failsafe mode
                                var refinedGrid = [];
                                var i = 0;
                                var x2;
                                var y2;
                                // read the non-renderable section from the grid and create a renderable grid with refined indices
                                for (y2 = startRow; y2 <= endRow; y2++) {
                                    if (typeof grid[y2] === 'undefined') {
                                        continue;
                                    }
                                    for (x2 = sx; x2 <= ex; x2++) {
                                        var el = grid[y2][x2];
                                        if (typeof el === 'undefined') {
                                            continue;
                                        }
                                        refinedGrid[i] = [el];
                                        i += el.height;
                                    }
                                }
                                // print each row from the non-renderable grid
                                for (y2 = 0; y2 < refinedGrid.length; y2++) {
                                    if (typeof refinedGrid[y2] === 'undefined') {
                                        continue;
                                    }
                                    for (x2 = 0; x2 <= 11; x2++) {
                                        if (typeof refinedGrid[y2][x2] === 'undefined') {
                                            continue;
                                        }
                                        subContent += printRow(refinedGrid, y2, 0, 11, 12);
                                    }
                                }
                            } else {
                                subContent += process(grid, startCol, startRow, endCol, endRow, width);
                            }
                            child += '<div class="col-md-' + width + '">' + subContent + '</div>';
                            startCol = endCol + 1;
                        }
                    }
                    content += '<div class="row">' + child + '</div>';
                }
                // skip the rows until a defined row is found
                for (y = endRow + 1; y <= ey && typeof grid[y] === 'undefined'; y++);
                rowSpan = 1;
                startRow = y;
                varyingHeight = false;
            } else {
                // if this is not a row cut, skip to the next row
                y++;
            }
        }
        return content;
    };
    var page;
    var result = '';
    dashboard.pages.forEach(function (p) {
        if (p.id == pageId) {
            page = p;
            return;
        }
    });
    if (!page) {
        response.sendError(404, 'Not found');
        return;
    }
    try {
        var json = (isAnon ? page.layout.content.anon.blocks : page.layout.content.loggedIn.blocks);
        content = process(initGrid(json));
    } catch (e) {
        err.push(e);
    }
    if (err.length > 0) {
        var errMessage = '';
        err.forEach(function (e) {
            errMessage += e.message + '\n';
        });
        log.error('Errors found when generating Bootstrap layout: ' + errMessage);
    }
    return content;
};
