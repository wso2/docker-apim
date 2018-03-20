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
var getConfig, validate, getMode, getSchema, getData, registerCallBackforPush;

(function () {

    var PROVIDERS_LOCATION = '/extensions/providers/';

    /**
     * require the existing config.json and push any dynamic fields that needs to be populated in the UI
     */
    getConfig = function () {
        var formConfig = require(PROVIDERS_LOCATION + '/rdbms/config.json');
        return formConfig;
    };

    /**
     * validate the user input of provider configuration
     * @param providerConfig
     */
    validate = function (providerConfig) {
        try {
            var db = new Database(providerConfig['db_url'], providerConfig['username'], providerConfig['password']);
        } catch (e) {
            return {
                "error" : true,
                "message" : "Database connection failed"
            }
        } finally{
            db.close();
        }
        return true;
    };

    /**
     * returns the data mode either push or pull
     */
    getMode = function () {
        return 'pull';
    };

    /**
     * returns an array of column names & types
     * @param providerConfig
     */
    getSchema = function (providerConfig) {
        try {
            var databaseName = providerConfig['db_name'];
            var tableName = providerConfig['table_name'];
            var db_query = "SELECT column_name, column_type FROM INFORMATION_SCHEMA.columns where table_schema='" +
                databaseName + "' and table_name='" + tableName + "';";
            var db = new Database(providerConfig['db_url'], providerConfig['username'], providerConfig['password']);
            var schema = db.query(db_query);
        } catch (e) {
            return {
                "error": true,
                "message": "Schema Retrieval Failed"
            }
        } finally {
            db.close();
        }
        if(schema.length != 0) {
            for (var i in schema) {
                schema[i].fieldName = schema[i].column_name;
                schema[i].fieldType = schema[i].column_type;
                delete schema[i].column_name;
                delete schema[i].column_type;
            }
            return schema;
        } else {
            return {
                "error": true,
                "message": "Schema retrieval failed"
            }
        }
    };

    /**
     * returns the actual data
     * @param providerConfig
     * @param limit
     */
    getData = function (providerConfig, limit) {

        var db = new Database(providerConfig['db_url'], providerConfig['username'], providerConfig['password']);
        var query = providerConfig['query'];
        if(limit){
            query =query.replace(/^\s\s*/, '').replace(/\s\s*$/, '') + ' limit ' + limit;
        }
        return db.query(query);
    };

}());