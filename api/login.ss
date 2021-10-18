(import :drewc/ftw :std/ misc/uuid :std/sugar
        :std/db/postgresql :std/db/dbi)

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
