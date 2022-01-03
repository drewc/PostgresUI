(export #t)
(import :drewc/ftw :std/misc/uuid :std/sugar
        :drewc/db/postgresql :drewc/db/dbi :std/error
        :drewc/pgui/api/login)


(define-json-endpoint status "/api/status")

(def (status/POST)
  (def jso (http-request-body-json*))
  (def uuid (hash-get jso 'uuid))
  (try
   (let (connected (db<-uuid uuid))
     (respond/JSON (list->hash-table`((connected . ,(not (not connected)))))))
   (catch (e) (respond/JSON code: 401
                            (list->hash-table
                             `((error . ,(with-output-to-string
                                           ""
                                           (cut ##display-exception e)))))))))
