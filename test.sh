export S1=`curl -sS http://104.155.201.151:5984/healthcheck/$1 | json sockets`
#export S2=`curl -sS http://104.155.201.151:5984/healthcheck/$2 | json sockets`

echo [`date`] Server1: $S1
#echo Server2: $S2
#echo Total: $((${S1} + ${S2}))
