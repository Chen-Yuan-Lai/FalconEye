#!/bin/bash

pg_dump \
--file=db/personal_project_"$(date --iso-8601='date')".sql \
--clean \
--create \
--no-owner \
--schema-only \
--dbname=personal_project \