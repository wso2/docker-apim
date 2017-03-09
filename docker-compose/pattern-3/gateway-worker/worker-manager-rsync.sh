#!/bin/bash
while true 
do
sshpass -p "rsyncuser" rsync -rtvu  rsyncuser@gateway-manager:/mnt/wso2am-2.1.0/repository/deployment/server/synapse-configs/ /mnt/wso2am-2.1.0/repository/deployment/server/synapse-configs/  --delete
sleep 10
done
