#!/bin/bash
mkdir ~/.ssh
cd ~/.ssh
ssh-keygen -f gatewayworker.rsa -t rsa -N ''
sshpass -p "rsyncuser" ssh-copy-id -o "StrictHostKeyChecking no"  -i ~/.ssh/gatewayworker.rsa.pub rsyncuser@gateway-manager

while true 
do
rsync -rtvu -e 'ssh -i gatewayworker.rsa -o StrictHostKeyChecking=no' rsyncuser@gateway-manager:/mnt/wso2am-2.1.0-update13/repository/deployment/server/synapse-configs/ /mnt/wso2am-2.1.0-update13/repository/deployment/server/synapse-configs/  --delete
sleep 10
done
