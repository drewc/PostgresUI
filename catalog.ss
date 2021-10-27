(export #t)
(import :std/db/postgresql  :std/db/postgresql-driver
        :std/db/dbi :std/text/json)

(extern namespace: "std/db/postgresql"
  serialize-boolean deserialize-boolean
  identity-string)

(defcatalog simple-catalog
  ;; BOOLOID
  ((16) serialize-boolean deserialize-boolean)
  ;; INT8OID INT2OID INT4OID FLOAT4OID FLOAT8OID NUMERICOID
  ((20 21 23 700 701 1700) number->string string->number)
  ;; CHAROID TEXTOID BPCHAROID VARCHAROID
  ((18 25 1042 1043) identity-string identity))

(def (serialize-json gerbil-json)
 (call-with-output-string "" (cut write-json gerbil-json <>)))

(def (deserialize-json str)
  (call-with-input-string str read-json))

(defcatalog-default ((114 3802) serialize-json deserialize-json))
