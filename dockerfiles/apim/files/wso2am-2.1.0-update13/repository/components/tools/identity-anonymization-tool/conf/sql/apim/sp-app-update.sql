UPDATE SP_APP 
SET USERNAME = `pseudonym`, APP_NAME = `modifiedAppName`, DESCRIPTION = `modifiedDescription` 
WHERE USERNAME = `username` AND USER_STORE = `user_store_domain` AND TENANT_ID = `tenant_id`
