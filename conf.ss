(export #t)

(def pgui-wwwroot (current-directory))

(def (conf-value . vars)
  (if (eq? (car vars) 'pgui-wwwroot)
    pgui-wwwroot
    (void)))
