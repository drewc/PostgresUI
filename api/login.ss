(export #t)
(import :drewc/ftw :std/misc/uuid :std/sugar
        :std/db/postgresql :std/db/dbi :std/error)

(def default-connection-table (make-hash-table))
(def current-connection-table (make-parameter default-connection-table))

(begin
  (def (db<-uuid uuid)
    (hash-get (current-connection-table) uuid))
       
  (def uuid->db db<-uuid))

(def (pgui-sql-connect . args)
  (def uuid (uuid->string (random-uuid)))
  (def db (apply sql-connect postgresql-connect args))
  (hash-put! (current-connection-table) uuid db)
  uuid)

(define-json-endpoint pgLogin "/api/pgLogin")

(def (pgLogin/POST)
  (def jso (http-request-body-json*))
  (def s (hash-get jso 'host))
  (def po (hash-get jso 'port))
  (def u (hash-get jso 'user))
  (def p (hash-get jso 'passwd))
  (def d (hash-get jso 'db))
  (try
   (let ((uuid (pgui-sql-connect host: s user: u passwd: p db: d)))
     (respond/JSON (list->hash-table`((uuid . ,uuid)))))
   (catch (e) (respond/JSON code: 401
                            (list->hash-table
                             `((error . ,(with-output-to-string
                                           ""
                                           (cut ##display-exception e)))))))))
