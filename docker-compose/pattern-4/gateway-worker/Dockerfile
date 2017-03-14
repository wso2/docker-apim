FROM docker.wso2.com/wso2am:2.1.0

COPY pattern-4/gateway-worker/carbon/ /mnt/wso2-artifacts

COPY artifacts/mysql-connector-java-5.1.34-bin.jar /mnt/wso2-artifacts/repository/components/lib/
COPY artifacts/svnkit-all-1.8.7.wso2v1.jar /mnt/wso2/carbon-home/repository/components/dropins/
COPY artifacts/trilead-ssh2-1.0.0-build215.jar /mnt/wso2/carbon-home/repository/components/lib/

RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/webapps/am#sample#calculator#v1.war
RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/webapps/api#am#publisher#v0.11.war
RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/webapps/api#am#store#v0.11.war
RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/webapps/client-registration#v0.11.war
RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/webapps/oauth2.war
RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/webapps/shindig.war
RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/webapps/throttle#data#v1.war

RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/jaggeryapps/*

USER root
RUN adduser --quiet --disabled-password --shell /bin/bash --home /home/rsyncuser --gecos "User" rsyncuser
RUN usermod -aG sudo rsyncuser
RUN adduser rsyncuser sudo
RUN echo "rsyncuser:rsyncuser" | chpasswd

RUN apt-get update && apt-get install -y apt-utils rsync ssh openssh-server sshpass supervisor
RUN mkdir -p  /var/run/sshd /var/log/supervisor
COPY pattern-4/supervisor/supervisord-gateway-worker.conf /etc/supervisor/conf.d/supervisord.conf
COPY pattern-4/gateway-worker/worker-manager-rsync.sh /usr/bin/worker-manager-rsync

RUN chmod +x /usr/bin/worker-manager-rsync

EXPOSE 22 80
CMD ["/usr/bin/supervisord"]
