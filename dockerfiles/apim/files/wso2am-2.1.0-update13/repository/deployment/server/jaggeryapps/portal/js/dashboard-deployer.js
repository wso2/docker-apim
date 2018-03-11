/**
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
 * -------------------------------------------------------------------------
 * This will auto deploy all available dashboards in the extensions/dashboards
 */

var log = new Log();
var dashboard = {};
try {
    dashboard = require("/modules/dashboards.js");
    var dashboardDirectory = new File("/extensions/dashboards");
    if (!dashboardDirectory.isDirectory()) {
        log.error("Cannot find the dashboards directory in extensions.");
    } else {
        var files = dashboardDirectory.listFiles();
        for (var index = 0; index < files.length; index++) {
            var file = files[index];
            var dashboardJson = require(file.getPath());

            if (dashboardJson.id) {
                log.info("Deleting existing dashboard by same id: " + dashboardJson.id);
                dashboard.remove(dashboardJson.id);
                log.info("Deploying the dashboard: " + dashboardJson.title);
                dashboard.create(dashboardJson);
                file.del();
            }
        }
    }
} catch (exception) {
    log.error("Error retrieving required files for auto dashboard deployer: " + exception.toString());
}






