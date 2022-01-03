
(import :drewc/db/postgresql  :drewc/db/postgresql-driver

        :drewc/db/dbi
        :drewc/pgui/catalog
        :drewc/pgui/api/login
        :drewc/ftw :std/sugar (only-in :std/error error-irritants))

(def (pgui-simple-sql-query conn str)
  (def db (if (string? conn) (uuid->db conn) conn))
  (def q (postgresql-query db str))
  (def (res->hash res)
    (def type (if (postgresql-statement? res) "statement" "command"))
    (def complete (postgresql-command-complete res))
    (def params (and (postgresql-statement? res)
                     (postgresql-statement-params res)))
    (def cols (and (postgresql-statement? res)
                   (postgresql-statement-cols res)))
    (def rows (map (lambda (row) (if (= (length cols) 1) (vector row) row))
                   (sql-query res)))
    (hash (type: type)
          (complete: complete)
          (params: params)
          (columns: cols)
          (rows: rows)))
  (parameterize ((current-catalog simple-catalog))
    (let (res (sql-query q))
      (def notices (map car (postgresql-command-notices q)))
      (def results (map res->hash res))
      (hash (type: "query")
            (db: (if (string? conn) conn "uuid not present"))
            (notices: notices)
            (results: results)))))


(define-endpoint simple-query "^/api/simple-query")

(def (simple-query/POST)
  (try
   (def jso (http-request-body-json*))
   (let-hash jso
     (def uuid (hash-get .server 'uuid))
     (def res (pgui-simple-sql-query uuid .string))
     (respond/JSON res))
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
