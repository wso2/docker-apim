UPDATE IDN_ASSOCIATED_ID
SET USER_NAME = `pseudonym`
WHERE USER_NAME = `username`
      AND DOMAIN_NAME = `user_store_domain`
      AND TENANT_ID = `tenant_id`