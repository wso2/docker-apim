FROM wso2am:2.1.0-update13

COPY pattern-3/publisher/carbon/ /home/wso2carbon/wso2-artifacts

COPY artifacts/mysql-connector-java-5.1.34-bin.jar /home/wso2carbon/wso2-artifacts/repository/components/lib/


RUN rm -r /home/wso2carbon/wso2am-2.1.0-update13/repository/deployment/server/synapse-configs/default/inbound-endpoints/WebSocketInboundEndpoint.xml