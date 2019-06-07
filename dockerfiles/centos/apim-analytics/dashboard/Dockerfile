# ------------------------------------------------------------------------
#
# Copyright 2018 WSO2, Inc. (http://wso2.com)
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

# set base Docker image to latest CentOS Docker image
FROM centos:7
LABEL maintainer="WSO2 Docker Maintainers <dev@wso2.org>"

# set Docker image build arguments
# build arguments for user/group configurations
ARG USER=wso2carbon
ARG USER_ID=802
ARG USER_GROUP=wso2
ARG USER_GROUP_ID=802
ARG USER_HOME=/home/${USER}
# set JDK configurations
ARG JAVA_HOME=${USER_HOME}/java
# build arguments for WSO2 product installation
ARG WSO2_SERVER_NAME=wso2am-analytics
ARG WSO2_SERVER_VERSION=2.6.0
ARG WSO2_SERVER=${WSO2_SERVER_NAME}-${WSO2_SERVER_VERSION}
ARG WSO2_SERVER_HOME=${USER_HOME}/${WSO2_SERVER}
ARG WSO2_SERVER_DIST_URL=https://bintray.com/wso2/binary/download_file?file_path=${WSO2_SERVER}.zip
# build arguments for external artifacts
ARG MYSQL_CONNECTOR_VERSION=5.1.47
# build argument for MOTD
ARG MOTD='printf "\n\
Welcome to WSO2 Docker resources.\n\
------------------------------------ \n\
This Docker container comprises of a WSO2 product, running with its latest GA release \n\
which is under the Apache License, Version 2.0. \n\
Read more about Apache License, Version 2.0 here @ http://www.apache.org/licenses/LICENSE-2.0.\n\n"'

# create the non-root user and group and set MOTD login message
RUN \
    groupadd --system -g ${USER_GROUP_ID} ${USER_GROUP} \
    && useradd --system --create-home --home-dir ${USER_HOME} --no-log-init -g ${USER_GROUP_ID} -u ${USER_ID} ${USER} \
    && echo ${MOTD} > /etc/profile.d/motd.sh

# copy init script to user home
COPY --chown=wso2carbon:wso2 docker-entrypoint.sh ${USER_HOME}/
# install required packages
RUN \
    yum -y update \
    && yum install -y \
        nc \
        unzip \
        wget \
    && rm -rf /var/cache/yum/*
# install AdoptOpenJDK HotSpot
RUN \
    mkdir -p ${JAVA_HOME} \
    && wget -O OpenJDK8U-jdk_x64_linux_hotspot.tar.gz https://github.com/AdoptOpenJDK/openjdk8-binaries/releases/download/jdk8u212-b03/OpenJDK8U-jdk_x64_linux_hotspot_8u212b03.tar.gz \
    && echo "dd28d6d2cde2b931caf94ac2422a2ad082ea62f0beee3bf7057317c53093de93  OpenJDK8U-jdk_x64_linux_hotspot.tar.gz" | sha256sum -c - \
    && tar -xf OpenJDK8U-jdk_x64_linux_hotspot.tar.gz -C ${JAVA_HOME} --strip-components=1 \
    && chown wso2carbon:wso2 -R ${JAVA_HOME} \
    && rm -f OpenJDK8U-jdk_x64_linux_hotspot.tar.gz
# add the WSO2 product distribution to user's home directory
RUN \
    wget --no-check-certificate -O ${WSO2_SERVER}.zip "${WSO2_SERVER_DIST_URL}" \
    && unzip -d ${USER_HOME} ${WSO2_SERVER}.zip \
    && chown wso2carbon:wso2 -R ${WSO2_SERVER_HOME} \
    && rm -rf ${WSO2_SERVER_HOME}/jdk \
    && rm -f ${WSO2_SERVER}.zip
# add MySQL JDBC connector to server home as a third party library
ADD --chown=wso2carbon:wso2 http://central.maven.org/maven2/mysql/mysql-connector-java/${MYSQL_CONNECTOR_VERSION}/mysql-connector-java-${MYSQL_CONNECTOR_VERSION}.jar ${WSO2_SERVER_HOME}/lib/

# set the user and work directory
USER ${USER_ID}
WORKDIR ${USER_HOME}

# set environment variables
ENV JAVA_HOME=${JAVA_HOME} \
    PATH=${JAVA_HOME}/bin:${PATH} \
    WORKING_DIRECTORY=${USER_HOME} \
    WSO2_SERVER_HOME=${WSO2_SERVER_HOME}

# expose ports
EXPOSE 9713 9643 9613 7713 7613

# initiate container and start WSO2 Carbon server
ENTRYPOINT ["/home/wso2carbon/docker-entrypoint.sh"]
