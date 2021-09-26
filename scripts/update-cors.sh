#!/usr/bin/env bash

curl "https://storage.googleapis.com/upload.example.com/?cors" \
  --request PUT \
  --header "Authorization: Bearer $(gcloud auth application-default print-access-token)" \
  --header "Content-Type: application/xml" \
  --data @- << EOF
<?xml version='1.0' encoding='UTF-8'?>
<CorsConfig>
  <Cors>
    <Origins>
      <Origin>https://example.com</Origin>
    </Origins>
    <Methods>
      <Method>GET</Method>
      <Method>HEAD</Method>
      <Method>PUT</Method>
      <Method>OPTIONS</Method>
    </Methods>
    <ResponseHeaders>
      <ResponseHeader>Content-Type</ResponseHeader>
      <ResponseHeader>Access-Control-Allow-Origin</ResponseHeader>
    </ResponseHeaders>
    <MaxAgeSec>3600</MaxAgeSec>
  </Cors>
</CorsConfig>
EOF

curl "https://storage.googleapis.com/test-upload.example.com/?cors" \
  --request PUT \
  --header "Authorization: Bearer $(gcloud auth application-default print-access-token)" \
  --header "Content-Type: application/xml" \
  --data @- << EOF
<?xml version='1.0' encoding='UTF-8'?>
<CorsConfig>
  <Cors>
    <Origins>
      <Origin>*</Origin>
    </Origins>
    <Methods>
      <Method>GET</Method>
      <Method>HEAD</Method>
      <Method>PUT</Method>
      <Method>OPTIONS</Method>
    </Methods>
    <ResponseHeaders>
      <ResponseHeader>Content-Type</ResponseHeader>
      <ResponseHeader>Access-Control-Allow-Origin</ResponseHeader>
    </ResponseHeaders>
    <MaxAgeSec>3600</MaxAgeSec>
  </Cors>
</CorsConfig>
EOF
