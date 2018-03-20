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

var charts = [
    {
        name: "INVALID_LOGIN_ATTEMPT",
        columns: ["timestamp", "InvalidLoginCount", "tenantID"],
        additionalColumns: ["week"],
        orderedField: "InvalidLoginCount",
        schema: [{
            "metadata": {
                "names": ["day", "count", "tenantID"],
                "types": ["ordinal", "linear", "ordinal"]
            },
            "data": []
        }],
        "chartConfig": {
            type: "bar",
            x: "day",
            colorScale: [],
            colorDomain: [],
            xAxisAngle: true,
            color: "tenantID",
            charts: [{type: "bar", y: "count", mode: "stack"}],
            width: $(document).width()/1.27,
            height: $(document).height()/1.05,
            padding: {"top": 10, "left": 80, "bottom": 70, "right": 50},
            legend: false,
            tooltip: {
                "enabled": true,
                "color": "#e5f2ff",
                "type": "symbol",
                "content": ["tenantID", "count", "day"],
                "label": true
            }
        }
    }
];
