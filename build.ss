#!/usr/bin/env gxi
(import :std/build-script)

(defbuild-script
  '("conf" "catalog" "server/httpd" "api/login" "api/prepare" "api/query"))
