UPDATE IDN_OAUTH_CONSUMER_APPS 
SET USERNAME = `pseudonym`, APP_NAME = `modifiedAppName` 
WHERE USERNAME = `username` AND USER_DOMAIN = `user_store_domain` AND TENANT_ID = `tenant_id`
