#!/usr/bin/env gxi
(import :std/build-script)

(defbuild-script
  '("conf" "catalog" "server/httpd" "api/login" "api/status"
    "api/simple-query" "api/prepare" "api/query" "api/report"))
