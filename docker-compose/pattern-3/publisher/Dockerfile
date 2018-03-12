FROM wso2am:2.2.0-SNAPSHOT

COPY pattern-3/publisher/carbon/ /home/wso2carbon/wso2-artifacts

COPY artifacts/mysql-connector-java-5.1.34-bin.jar /home/wso2carbon/wso2-artifacts/repository/components/lib/


RUN rm -r /home/wso2carbon/wso2am-2.2.0-SNAPSHOT/repository/deployment/server/synapse-configs/default/inbound-endpoints/WebSocketInboundEndpoint.xml