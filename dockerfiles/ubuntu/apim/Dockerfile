# ------------------------------------------------------------------------
#
# Copyright 2017 WSO2, Inc. (http://wso2.com)
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

# set base Docker image to Ubuntu Focal Docker image
FROM ubuntu:20.04

ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en' LC_ALL='en_US.UTF-8'

# install JDK Dependencies
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends tzdata curl ca-certificates fontconfig locales python-is-python3 \
    && echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen \
    && locale-gen en_US.UTF-8 \
    && rm -rf /var/lib/apt/lists/*

ENV JAVA_VERSION jdk8u322-b06

RUN set -eux; \
    ARCH="$(dpkg --print-architecture)"; \
    case "${ARCH}" in \
       aarch64|arm64) \
         ESUM='42ed3ff5a859f9015a1362fb7e650026b913d688eab471714f795651120be173'; \
         BINARY_URL='https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u322-b06/OpenJDK8U-jdk_aarch64_linux_hotspot_8u322b06.tar.gz'; \
         ;; \
       ppc64el|powerpc:common64) \
         ESUM='c7cc9c5b237e9e1f1e3296593aba427375823592e4604fadf89a8c234c2574e1'; \
         BINARY_URL='https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u322-b06/OpenJDK8U-jdk_ppc64le_linux_hotspot_8u322b06.tar.gz'; \
         ;; \
       amd64|i386:x86-64) \
         ESUM='3d62362a78c9412766471b05253507a4cfc212daea5cdf122860173ce902400e'; \
         BINARY_URL='https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u322-b06/OpenJDK8U-jdk_x64_linux_hotspot_8u322b06.tar.gz'; \
         ;; \
       *) \
         echo "Unsupported arch: ${ARCH}"; \
         exit 1; \
         ;; \
    esac; \
    curl -LfsSo /tmp/openjdk.tar.gz ${BINARY_URL}; \
    echo "${ESUM} */tmp/openjdk.tar.gz" | sha256sum -c -; \
    mkdir -p /opt/java/openjdk; \
    cd /opt/java/openjdk; \
    tar -xf /tmp/openjdk.tar.gz --strip-components=1; \
    rm -rf /tmp/openjdk.tar.gz;

ENV JAVA_HOME=/opt/java/openjdk \
    PATH="/opt/java/openjdk/bin:$PATH"

# Verify Java installation
RUN echo Verifying install ... \
    && echo javac -version && javac -version \
    && echo java -version && java -version \
    && echo Complete.

LABEL maintainer="WSO2 Docker Maintainers <dev@wso2.org>" \
      com.wso2.docker.source="https://github.com/wso2/docker-apim/releases/tag/v2.6.0.16"

# set Docker image build arguments
# build arguments for user/group configurations
ARG USER=wso2carbon
ARG USER_ID=802
ARG USER_GROUP=wso2
ARG USER_GROUP_ID=802
ARG USER_HOME=/home/${USER}
# build arguments for WSO2 product installation
ARG WSO2_SERVER_NAME=wso2am
ARG WSO2_SERVER_VERSION=2.6.0
ARG WSO2_SERVER=${WSO2_SERVER_NAME}-${WSO2_SERVER_VERSION}
ARG WSO2_SERVER_HOME=${USER_HOME}/${WSO2_SERVER}
ARG WSO2_SERVER_DIST_URL=https://bintray.com/wso2/binaryGA/download_file?file_path=${WSO2_SERVER}.zip
# build arguments for external artifacts
ARG MYSQL_CONNECTOR_VERSION=5.1.49
# build argument for MOTD
ARG MOTD="\n\
Welcome to WSO2 Docker resources.\n\
------------------------------------ \n\
This Docker container comprises of a WSO2 product, running with its latest GA release \n\
which is under the Apache License, Version 2.0. \n\
Read more about Apache License, Version 2.0 here @ http://www.apache.org/licenses/LICENSE-2.0.\n"

# create the non-root user and group and set MOTD login message
RUN \
    groupadd --system -g ${USER_GROUP_ID} ${USER_GROUP} \
    && useradd --system --create-home --home-dir ${USER_HOME} --no-log-init -g ${USER_GROUP_ID} -u ${USER_ID} ${USER} \
    && echo '[ ! -z "${TERM}" -a -r /etc/motd ] && cat /etc/motd' >> /etc/bash.bashrc; echo "${MOTD}" > /etc/motd

# create Java prefs dir
# this is to avoid warning logs printed by FileSystemPreferences class
RUN \
    mkdir -p ${USER_HOME}/.java/.systemPrefs \
    && mkdir -p ${USER_HOME}/.java/.userPrefs \
    && chmod -R 755 ${USER_HOME}/.java \
    && chown -R ${USER}:${USER_GROUP} ${USER_HOME}/.java

# copy init script to user home
COPY --chown=wso2carbon:wso2 docker-entrypoint.sh ${USER_HOME}/
# install required packages
RUN \
    DEBIAN_FRONTEND=noninteractive DEBIAN_PRIORITY=critical apt-get -y update \
    && DEBIAN_FRONTEND=noninteractive DEBIAN_PRIORITY=critical apt-get install -y --no-install-recommends \
        libxml2-utils \
        netcat \
        unzip \
        wget 
        
#Upgrade the existing packages
RUN \
    DEBIAN_FRONTEND=noninteractive DEBIAN_PRIORITY=critical  apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/*

# add the WSO2 product distribution to user's home directory
RUN \
    wget -O ${WSO2_SERVER}.zip "${WSO2_SERVER_DIST_URL}" \
    && unzip -d ${USER_HOME} ${WSO2_SERVER}.zip \
    && chown wso2carbon:wso2 -R ${WSO2_SERVER_HOME} \
    && mkdir ${USER_HOME}/wso2-tmp \
    && cp -r ${WSO2_SERVER_HOME}/repository/deployment/server/synapse-configs ${USER_HOME}/wso2-tmp \
    && cp -r ${WSO2_SERVER_HOME}/repository/deployment/server/executionplans ${USER_HOME}/wso2-tmp \
    && rm -f ${WSO2_SERVER}.zip
# add MySQL JDBC connector to server home as a third party library
ADD --chown=wso2carbon:wso2 https://repo1.maven.org/maven2/mysql/mysql-connector-java/${MYSQL_CONNECTOR_VERSION}/mysql-connector-java-${MYSQL_CONNECTOR_VERSION}.jar ${WSO2_SERVER_HOME}/repository/components/dropins/

# set the user and work directory
USER ${USER_ID}
WORKDIR ${USER_HOME}

# set environment variables
ENV JAVA_OPTS="-Djava.util.prefs.systemRoot=${USER_HOME}/.java -Djava.util.prefs.userRoot=${USER_HOME}/.java/.userPrefs" \
    WORKING_DIRECTORY=${USER_HOME} \
    WSO2_SERVER_HOME=${WSO2_SERVER_HOME}

# expose ports
EXPOSE 9763 9443 9999 11111 8280 8243 5672 9711 9611 7711 7611 10397 9099

# initiate container and start WSO2 Carbon server
ENTRYPOINT ["/home/wso2carbon/docker-entrypoint.sh"]
