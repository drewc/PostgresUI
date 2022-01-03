(export #t)
(import :drewc/db/postgresql  :drewc/db/postgresql-driver
        :drewc/db/dbi
        :drewc/pgui/conf
        :drewc/pgui/catalog
        :drewc/pgui/api/login
        :drewc/ftw
        :std/sugar (only-in :std/error error-irritants)
        :std/text/json
        :std/misc/uuid
        :std/misc/ports
        )

(def (report-path-expand path)
  (path-expand path pgui-report-path))

(def (save-report r)
  (let-hash r
    (write-file-string
     (report-path-expand (string-append .uuid ".json"))
     (with-output-to-string "" (cut write-json r)))))

(define-json-endpoint save-report "/api/save-report")

(def (save-report/POST)
   (def r  (http-request-body-json*))
   (let (u (hash-get r 'uuid))
     (unless u (hash-put! r 'uuid (uuid->string (random-uuid)))))
   (try
    (save-report r)
    (respond/JSON r)
    (catch (e)
      (respond/JSON
      ; code: 500
       (list->hash-table
        `((error . ,(with-output-to-string
                      ""
                      (cut ##display-exception e (current-output-port))))))))))
