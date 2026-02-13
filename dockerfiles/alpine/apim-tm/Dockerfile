# ------------------------------------------------------------------------
#
# Copyright 2025 WSO2, LLC. (http://wso2.com)
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

# set base Docker image to Alpine
FROM alpine:3.23

ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en' LC_ALL='en_US.UTF-8'

# install dependencies
RUN apk add --no-cache tzdata musl-locales musl-locales-lang bash libxml2-utils netcat-openbsd \
    && rm -rf /var/cache/apk/*

ENV JAVA_VERSION=jdk-21.0.5+11
ENV JAVA_HOME=/opt/java/openjdk \
    PATH="/opt/java/openjdk/bin:$PATH"

# install Temurin OpenJDK 21
RUN set -eux; \
    ARCH="$(apk --print-arch)"; \
    case "${ARCH}" in \
       aarch64) \
         ESUM='f22e32b869dd0e5e3f248646f62bffaa307b360299488ac8764e622923d7e747'; \
         BINARY_URL='https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.5%2B11/OpenJDK21U-jdk_aarch64_alpine-linux_hotspot_21.0.5_11.tar.gz'; \
         ;; \
       x86_64) \
         ESUM='8da7da49101d45f646272616f20e8b10d57472bbf5961d64ffb07d7ba93c6909'; \
         BINARY_URL='https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.5%2B11/OpenJDK21U-jdk_x64_alpine-linux_hotspot_21.0.5_11.tar.gz'; \
         ;; \
       *) \
         echo "Unsupported arch: ${ARCH}"; \
         exit 1; \
         ;; \
    esac; \
    wget -O /tmp/openjdk.tar.gz ${BINARY_URL}; \
    echo "${ESUM} */tmp/openjdk.tar.gz" | sha256sum -c -; \
    mkdir -p /opt/java/openjdk; \
    tar --extract \
        --file /tmp/openjdk.tar.gz \
        --directory /opt/java/openjdk \
        --strip-components 1 \
        --no-same-owner \
    ; \
    rm -rf /tmp/openjdk.tar.gz;


LABEL maintainer="WSO2 Docker Maintainers <dev@wso2.org>"  \
      com.wso2.docker.source="https://github.com/wso2/docker-apim/releases/tag/v4.6.0.1"

# set Docker image build arguments
# build arguments for user/group configurations
ARG USER=wso2carbon
ARG USER_ID=10001
ARG USER_GROUP=wso2
ARG USER_GROUP_ID=10001
ARG USER_HOME=/home/${USER}
# build arguments for WSO2 product installation
ARG WSO2_SERVER_NAME=wso2am-tm
ARG WSO2_SERVER_VERSION=4.6.0
ARG WSO2_SERVER_ZIP_VERSION=${WSO2_SERVER_VERSION}
ARG WSO2_SERVER_REPOSITORY=product-apim
ARG WSO2_SERVER=${WSO2_SERVER_NAME}-${WSO2_SERVER_VERSION}
ARG WSO2_SERVER_ZIP=${WSO2_SERVER_NAME}-${WSO2_SERVER_ZIP_VERSION}
ARG WSO2_SERVER_HOME=${USER_HOME}/${WSO2_SERVER}
ARG WSO2_SERVER_DIST_URL=https://github.com/wso2/${WSO2_SERVER_REPOSITORY}/releases/download/v${WSO2_SERVER_ZIP_VERSION}/${WSO2_SERVER_ZIP}.zip
# build argument for MOTD
ARG MOTD='printf "\n\
 Welcome to WSO2 Docker Resources \n\
 --------------------------------- \n\
 This Docker container comprises of a WSO2 product, running with its latest GA release \n\
 which is under the Apache License, Version 2.0. \n\
 Read more about Apache License, Version 2.0 here @ http://www.apache.org/licenses/LICENSE-2.0.\n"'
ENV ENV=${USER_HOME}"/.ashrc"

# create the non-root user and group and set MOTD login message
RUN \
    addgroup -S -g ${USER_GROUP_ID} ${USER_GROUP} \
    && adduser -S -u ${USER_ID} -h ${USER_HOME} -G ${USER_GROUP} ${USER} \
    && echo ${MOTD} > "${ENV}"

# copy init script to user home
COPY --chown=wso2carbon:wso2 docker-entrypoint.sh ${USER_HOME}/
    
# add the WSO2 product distribution to user's home directory
RUN \
    wget -O ${WSO2_SERVER_ZIP}.zip "${WSO2_SERVER_DIST_URL}" \
    && unzip -d ${USER_HOME} ${WSO2_SERVER_ZIP}.zip \
    && EXTRACTED_DIR=$(ls -1 ${USER_HOME} | grep "^${WSO2_SERVER_NAME}-" | head -1) \
    && if [ "${EXTRACTED_DIR}" != "${WSO2_SERVER}" ]; then mv ${USER_HOME}/${EXTRACTED_DIR} ${USER_HOME}/${WSO2_SERVER}; fi \
    && chown wso2carbon:wso2 -R ${WSO2_SERVER_HOME} \
    && mkdir ${USER_HOME}/wso2-tmp \
    && bash -c 'mkdir -p ${USER_HOME}/solr/{indexed-data,database}' \
    && chown wso2carbon:wso2 -R ${USER_HOME}/solr \
    && cp -r ${WSO2_SERVER_HOME}/repository/deployment/server/executionplans ${USER_HOME}/wso2-tmp \
    && rm -f ${WSO2_SERVER_ZIP}.zip

# remove unnecesary packages
RUN apk del netcat-openbsd

# set the user and work directory
USER ${USER_ID}
WORKDIR ${USER_HOME}

# set environment variables
ENV WORKING_DIRECTORY=${USER_HOME} \
    WSO2_SERVER_HOME=${WSO2_SERVER_HOME}

# expose ports
EXPOSE 9763 9443 9999 11111 8280 8243 5672 9711 9611 9099

# initiate container and start WSO2 Carbon server
ENTRYPOINT ["/home/wso2carbon/docker-entrypoint.sh"]
