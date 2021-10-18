(import :std/db/postgresql :std/db/dbi)

(def (serialize-num-array vec)
  (def lst (if (vector? vec) (vector->list vec) vec))
  (if (string? vec)
    vec
    (with-output-to-string "{"(lambda ()
                                     (when (not (null? lst))
                                       (display (car lst))
                                       (for-each (lambda (a) (display ",") (display a))
                                                 (cdr lst)))
                                     (display "}")))))
(def (deserialize-num-array str)
  (def (read-items)
    (def char (peek-char))
    (when (char=? char #\,) (read-char))
    (if (char=? char #\}) []
        (cons (read) (read-items))))
  (with-input-from-string str
    (lambda ()
      (let ((start (read-char)))
        (if (not (equal? start #\{))
          (error "Cannot deserialize array from ~A" str)
          (list->vector (read-items)))))))

(defcatalog-default ((1007) serialize-num-array deserialize-num-array))
