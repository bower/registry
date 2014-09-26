#!/bin/bash
su postgres -c "/usr/lib/postgresql/9.3/bin/pg_ctl start"
node /registry/index.js
