#!/bin/bash
mkdir ~/.ssh
cd ~/.ssh
ssh-keygen -f gatewayworker2.rsa -t rsa -N ''
sshpass -p "rsyncuser" ssh-copy-id -o "StrictHostKeyChecking no"  -i ~/.ssh/gatewayworker2.rsa.pub rsyncuser@gateway-manager-2

while true 
do
rsync -rtvu -e 'ssh -i gatewayworker2.rsa -o StrictHostKeyChecking=no' rsyncuser@gateway-manager-2:/mnt/wso2am-2.1.0/repository/deployment/server/synapse-configs/ /mnt/wso2am-2.1.0/repository/deployment/server/synapse-configs/  --delete
sleep 10
done
