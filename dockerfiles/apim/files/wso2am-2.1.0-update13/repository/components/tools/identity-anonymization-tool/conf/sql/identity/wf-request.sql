UPDATE WF_REQUEST
SET CREATED_BY = `pseudonym`
WHERE CREATED_BY = `username`
      AND TENANT_ID = `tenant_id`