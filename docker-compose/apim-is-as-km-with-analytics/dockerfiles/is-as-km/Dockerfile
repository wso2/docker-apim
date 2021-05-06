# ------------------------------------------------------------------------
#
# Copyright 2020 WSO2, Inc. (http://wso2.com)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License
#
# ------------------------------------------------------------------------

# set base Docker image to WSO2 API Manager Docker image with latest WSO2 Updates
FROM docker.wso2.com/wso2is:5.11.0.0
LABEL maintainer="WSO2 Docker Maintainers <dev@wso2.org>"

# build arguments for external artifacts
ARG MYSQL_CONNECTOR_VERSION=8.0.17

# add MySQL JDBC connector to server home as a third party library
ADD --chown=wso2carbon:wso2 https://repo1.maven.org/maven2/mysql/mysql-connector-java/${MYSQL_CONNECTOR_VERSION}/mysql-connector-java-${MYSQL_CONNECTOR_VERSION}.jar ${WSO2_SERVER_HOME}/repository/components/dropins/

# copy extensions to the identity server home
COPY dropins ${WSO2_SERVER_HOME}/repository/components/dropins/
# copy customized webapps to the identity server home
COPY webapps ${WSO2_SERVER_HOME}/repository/deployment/server/webapps/
