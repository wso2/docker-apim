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

var gadgetConfig = {
    "id": "logEventChart",
    "title": "Log Event",
    "datasource": "LOGANALYZER",
    "level": ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"],
    "meta": {
        "names": ["LogLevel", "Frequency"],
        "types": ["ordinal", "linear"]
    },
    "chartConfig": {
        colorScale: ["#5CB85C", "#438CAD", "#EECA5A", "#D9483D", "#95A5A6"],
        type: "bar",
        x: "LogLevel",
        color: "LogLevel",
        charts: [{y: "Frequency"}],
        width: $('body').width(),
        height: $('body').height(),
        padding: {"top": 10, "left": 80, "bottom": 70, "right": 200}
    },
    "domain": "carbon.super"
};
