#!/bin/bash
# A Shell Script To Deploy The To Do App Back-end Locally 
# Michael Louie Boñon - 14/Mar/2021

# Start Back-end (Express)
cd "$(dirname "$0")"
echo $PWD
echo "Executing... node server.js"
node server.js