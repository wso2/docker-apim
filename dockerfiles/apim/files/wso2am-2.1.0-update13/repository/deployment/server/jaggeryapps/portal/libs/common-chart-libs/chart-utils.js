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

var toVizGrammarSchema;

(function() {

    toVizGrammarSchema = function(_schema) {
        var schema = [{
            "metadata": {
                "names": [],
                "types": []
            }
        }];
        var types = {
            "FLOAT": "linear",
            "float": "linear",
            "INTEGER": "linear",
            "int": "linear",
            "double": "linear",
            "STRING": "ordinal",
            "varchar": "ordinal",
            "string": "ordinal"
        };

        _schema.forEach(function(field) {
            var fieldName = field["fieldName"];
            var fieldType = field["fieldType"];
            var typeKey = fieldType.split("(")[0];

            schema[0].metadata.names.push(fieldName);
            schema[0].metadata.types.push(types[typeKey]);
        });
        return schema;
    };


}());
