UPDATE AM_SUBSCRIBER
SET UPDATED_BY = `pseudonym`
WHERE UPDATED_BY = `username`
      AND TENANT_ID = `tenant_id`
