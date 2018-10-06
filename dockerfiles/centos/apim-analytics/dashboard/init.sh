#!/bin/sh
# ------------------------------------------------------------------------
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
# ------------------------------------------------------------------------
set -e

# volume mounts
config_volume=${WORKING_DIRECTORY}/wso2-config-volume
artifact_volume=${WORKING_DIRECTORY}/wso2-artifact-volume

# a grace period for mounts to be setup
echo "Waiting for all volumes to be mounted..."
sleep 5

verification_count=0
verifyMountBeforeStart()
{
  if [ ${verification_count} -eq 5 ]
  then
    echo "Mount verification timed out"
    return
  fi

  # increment the number of times the verification had occurred
  verification_count=$((verification_count+1))

  if [ ! -e $1 ]
  then
    echo "Directory $1 does not exist"
    echo "Waiting for the volume to be mounted..."
    sleep 5

    echo "Retrying..."
    verifyMountBeforeStart $1
  else
    echo "Directory $1 exists"
  fi
}

verifyMountBeforeStart ${config_volume}
verification_count=0
verifyMountBeforeStart ${artifact_volume}

# capture Docker container IP from the container's /etc/hosts file
docker_container_ip=$(awk 'END{print $1}' /etc/hosts)

# check if the WSO2 non-root user home exists
test ! -d ${WORKING_DIRECTORY} && echo "WSO2 Docker non-root user home does not exist" && exit 1

# check if the WSO2 product home exists
test ! -d ${WSO2_SERVER_HOME} && echo "WSO2 Docker product home does not exist" && exit 1

# copy any configuration changes mounted to config_volume
test -d ${config_volume}/ && cp -RL ${config_volume}/* ${WSO2_SERVER_HOME}/
# copy any artifact changes mounted to artifact_volume
test -d ${artifact_volume}/ && cp -RL ${artifact_volume}/* ${WSO2_SERVER_HOME}/

# start WSO2 Carbon server
sh ${WSO2_SERVER_HOME}/bin/dashboard.sh
