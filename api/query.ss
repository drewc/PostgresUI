(export #t)
(import :drewc/db/postgresql  :drewc/db/postgresql-driver

        :drewc/db/dbi
        :drewc/pgui/catalog
        :drewc/pgui/api/login :drewc/pgui/api/prepare
        :drewc/ftw :std/sugar (only-in :std/error error-irritants))

(def (pgui-sql-query db-uuid stmt . args)
  
  (when (string? stmt)
    (set! stmt (stmt<-name
                (pgui-sql-prepare db-uuid stmt))))
  (def sql-stmt (pgui-sql-statement-stmt stmt))
  (parameterize ((current-catalog simple-catalog))
    (unless (null? args)
      (apply sql-bind sql-stmt args))
    (begin0
        (sql-query sql-stmt)
      (sql-reset sql-stmt)
      (sql-clear sql-stmt))))

(define-endpoint query "^/api/query")

(def (query/POST)
  (try
   (def jso (http-request-body-json*))
   (let-hash jso
     (def pgstmt (stmt<-name .name))
     (def stmt (pgui-sql-statement-stmt pgstmt))
     (def args (or .?args []))
     (def cols (drewc/db/postgresql#postgresql-statement-cols stmt))
     (def res (apply pgui-sql-query .uuid pgstmt args))
     (respond/JSON (hash (name: .name)
                         (uuid: .uuid)
                         (args: args)
                         (columns: cols)
                         (results: res))))
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
