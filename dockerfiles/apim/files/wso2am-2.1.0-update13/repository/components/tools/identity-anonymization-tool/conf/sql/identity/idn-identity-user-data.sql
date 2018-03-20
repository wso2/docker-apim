UPDATE IDN_IDENTITY_USER_DATA
SET USER_NAME = `pseudonym`
WHERE USER_NAME =  `username`
      AND TENANT_ID = `tenant_id`