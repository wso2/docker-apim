FROM docker.wso2.com/wso2am:2.1.0

COPY pattern-4/keymanager/carbon/ /mnt/wso2-artifacts

COPY artifacts/mysql-connector-java-5.1.34-bin.jar /mnt/wso2-artifacts/repository/components/lib/

USER root

RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/synapse-configs/default/inbound-endpoints/WebSocketInboundEndpoint.xml