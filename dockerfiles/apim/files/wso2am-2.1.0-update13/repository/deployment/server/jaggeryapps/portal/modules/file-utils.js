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
var HANDLEBARS = require('/modules/handlebars.js').Handlebars;

/**
 * create directories recursively.
 * eg : if path = 'a/b/m.txt', 'a' and 'a/b' will
 * be created inside the site.
 *
 * @param path path to a file (eg: a/b/m.txt)
 */
function createDirs(path) {
    var parts = path.split('/');
    var dirPath = '';
    for (var i = 0; i < parts.length - 1; i++) {
        var part = parts[i];
        dirPath = dirPath + '/' + part;
        try {
            var file = new File(dirPath);
            file.mkdir();
        } catch (e) {
            // ASSUME: Error is due to dir already existing, thus ignore
        }
    }
}

/**
 * Copy files to the given destination creating the directories if not exist
 * @param file
 * @param destPath location where file needs to be copied
 */
function copyFile(file, destinationPath) {
    createDirs(destinationPath);
    var outFile = new File(destinationPath);
    outFile.open('w');
    var stream = file.getStream();
    outFile.write(stream);
    stream.getStream().close();
    outFile.close();
}


function copyDir(sourceFile, destinationPath) {
    if (sourceFile.isExists()) {
        if (sourceFile.isDirectory()) {
            var files = sourceFile.listFiles();
            for (var i = 0; i < files.length; i++) {
                var subFile = files[i];
                copyDir(subFile, destinationPath + '/' +sourceFile.getName());
            }
        } else {
            copyFile(sourceFile, destinationPath + '/' + sourceFile.getName());
        }
    }
}

/**
 * Dynamically inject data into hbs files
 * @param sourceFilePath
 * @param destinationPath
 * @param data
 */
function transformCopyFile(sourceFilePath, destinationPath, data) {
    createDirs(destinationPath);
    var sourceFile = new File(sourceFilePath);
    var outFile = new File(destinationPath);
    outFile.open('w');
    sourceFile.open('r');
    var template = HANDLEBARS.compile(sourceFile.readAll());
    template = template(data);
    outFile.write(template);
    sourceFile.close();
    outFile.close();
}


function getFileNameList(dirPath) {
    var Dir = new File(dirPath);
    var files = Dir.listFiles();
    var fileNameList = [];
    files.forEach(function (file) {
        fileNameList.push(file.getName());
    });
    return fileNameList;
}
