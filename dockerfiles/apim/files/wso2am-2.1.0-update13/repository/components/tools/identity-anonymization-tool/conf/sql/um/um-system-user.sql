UPDATE UM_SYSTEM_USER
SET UM_USER_NAME = `pseudonym`
WHERE UM_USER_NAME = `username`
      AND UM_TENANT_ID = `tenant_id`