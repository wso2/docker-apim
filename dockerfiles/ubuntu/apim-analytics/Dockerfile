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

# set to latest Ubuntu LTS
FROM ubuntu:16.04
MAINTAINER WSO2 Docker Maintainers "dev@wso2.org"

# set user configurations
ARG USER=wso2carbon
ARG USER_ID=802
ARG USER_GROUP=wso2
ARG USER_GROUP_ID=802
ARG USER_HOME=/home/${USER}
# set dependant files directory
ARG FILES=./files
# set jdk configurations
ARG JDK=jdk1.8.0*
ARG JAVA_HOME=${USER_HOME}/java
# set wso2 product configurations
ARG WSO2_SERVER=wso2am-analytics
ARG WSO2_SERVER_VERSION=2.5.0
ARG WSO2_SERVER_PACK=${WSO2_SERVER}-${WSO2_SERVER_VERSION}
ARG WSO2_SERVER_HOME=${USER_HOME}/${WSO2_SERVER_PACK}

# install required packages
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    curl \
    netcat && \
    rm -rf /var/lib/apt/lists/* && \
    echo '[ ! -z "$TERM" -a -r /etc/motd ] && cat /etc/motd' \
    >> /etc/bash.bashrc \
    ; echo "\n\
    Welcome to WSO2 Docker Resources \n\
    --------------------------------- \n\
    This Docker container comprises of a WSO2 product, running with its latest updates \n\
    which are under the End User License Agreement (EULA) 2.0. \n\
    Read more about EULA 2.0 here @ https://wso2.com/licenses/wso2-update/2.0 \n" \
    > /etc/motd

# create a user group and a user
RUN groupadd --system -g ${USER_GROUP_ID} ${USER_GROUP} && \
    useradd --system --create-home --home-dir ${USER_HOME} --no-log-init -g ${USER_GROUP_ID} -u ${USER_ID} ${USER}

# copy the jdk and wso2 product distributions to user's home directory
COPY --chown=wso2carbon:wso2 ${FILES}/${JDK} ${USER_HOME}/java/
COPY --chown=wso2carbon:wso2 ${FILES}/${WSO2_SERVER_PACK}/ ${WSO2_SERVER_HOME}/
# copy shared artifacts to a temporary location
COPY --chown=wso2carbon:wso2 ${FILES}/${WSO2_SERVER_PACK}/repository/deployment/ ${USER_HOME}/wso2-tmp/deployment/
# copy init script to user home
COPY --chown=wso2carbon:wso2 init.sh ${USER_HOME}/
# copy mysql connector jar to the server as a third party library
COPY --chown=wso2carbon:wso2 ${FILES}/mysql-connector-java-*-bin.jar ${WSO2_SERVER_HOME}/repository/components/lib/
# add libraries for Kubernetes membership scheme based clustering
ADD --chown=wso2carbon:wso2 https://repo1.maven.org/maven2/dnsjava/dnsjava/2.1.8/dnsjava-2.1.8.jar ${WSO2_SERVER_HOME}/repository/components/lib/
ADD --chown=wso2carbon:wso2 https://repo1.maven.org/maven2/org/wso2/carbon/kubernetes/artifacts/kubernetes-membership-scheme/1.0.5/kubernetes-membership-scheme-1.0.5.jar ${WSO2_SERVER_HOME}/repository/components/dropins/

# set environment variables
ENV WSO2_SERVER_HOME=${USER_HOME}/${WSO2_SERVER_PACK} \
    JAVA_OPTS="-Djava.util.prefs.systemRoot=${USER_HOME}/.java -Djava.util.prefs.userRoot=${USER_HOME}/.java/.userPrefs"

# set the user and work directory
USER ${USER_ID}
WORKDIR ${USER_HOME}

# set environment variables
ENV JAVA_HOME=${JAVA_HOME} \
    PATH=$JAVA_HOME/bin:$PATH \
    WSO2_SERVER_HOME=${WSO2_SERVER_HOME} \
    WORKING_DIRECTORY=${USER_HOME}

# expose ports
EXPOSE 9764 9444 7712 7612 4041

# initiate container and start WSO2 Carbon server
ENTRYPOINT ${WORKING_DIRECTORY}/init.sh
