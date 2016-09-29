FROM dockerhub.private.wso2.com/wso2am:1.10.0

COPY pattern-4/pub-store/carbon/ /mnt/wso2/carbon-home/

COPY artifacts/mysql-connector-java-5.1.34-bin.jar /mnt/wso2/carbon-home/repository/components/lib/
COPY artifacts/svnkit-all-1.8.7.wso2v1.jar /mnt/wso2/carbon-home/repository/components/dropins/
COPY artifacts/trilead-ssh2-1.0.0-build215.jar /mnt/wso2/carbon-home/repository/components/lib/
