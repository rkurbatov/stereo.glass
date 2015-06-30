#!/usr/bin/env bash
# Copyright by Jesta (Aaron Cox)

ssh -L27018:localhost:27017 stglass@stereo.glass -p 2222 '
    echo "Connected on Remote End, sleeping for 10";
    sleep 10;
    exit' &
echo "Waiting 5 sec on local";
sleep 5;
echo "Connecting to Mongo and piping in script";
cat pull-db.mongo | mongo