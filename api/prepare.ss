(export #t)
(import :std/db/postgresql :std/db/dbi :drewc/pgui/api/login
        :drewc/ftw :std/sugar (only-in :std/error error-irritants))


(def default-statement-table (make-hash-table))
(def current-statement-table (make-parameter default-statement-table))

(begin (def (stmt<-name name) (hash-get (current-statement-table) name))
       (def name->stmt stmt<-name))

(defstruct pgui-sql-statement (text stmt))

(def (pgui-sql-statement-name pgui-stmt)
  (std/db/dbi#statement-e (pgui-sql-statement-stmt pgui-stmt)))

(def (pgui-sql-prepare db-uuid text)
  (def db (db<-uuid db-uuid))
  (def stmt (sql-prepare db text))
  (def pgui-stmt (make-pgui-sql-statement text stmt))
  (def name (pgui-sql-statement-name pgui-stmt))
  (hash-put! (current-statement-table) name pgui-stmt)
  name)

(define-endpoint prepare "^/api/prepare")

(def (prepare/POST)
  (try
   (def jso (http-request-body-json*))
   (let-hash jso
     (def name (pgui-sql-prepare .uuid .text))
     (respond/JSON (hash (name: name))))
   (catch (e)
     (respond/JSON
      code: 500
      (hash (error:
             (hash (display:
                    (with-output-to-string
                      "" (cut ##display-exception e (current-output-port))))
                   (code: (assget #\C (error-irritants e)))
                   (message: (assget #\M (error-irritants e)))
                   (type: (##type-name (object-type e))))))))))
