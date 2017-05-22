#!/usr/bin/env bash
bash build.sh -v 2.1.0 -r puppet -s kubernetes -p $1 -m wso2am_analytics or die "error"
docker save wso2am-analytics-kubernetes-pattern-${1}:2.1.0 > /Users/anuruddha/kube-solo/kubernetes/analytics_kube$1.tar
