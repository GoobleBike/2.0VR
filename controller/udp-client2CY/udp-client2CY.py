#!/usr/bin/python
#udp client per yun
#2CY comunica su UDP, velocità/pendenza
import socket
import time
import select
import atexit
import sys
sys.path.insert(0,'/usr/lib/python2.7/bridge/')
from bridgeclient import BridgeClient
#rilascia socket in uscita
def closeSock():
    clientSock.close()
atexit.register(closeSock)
#linea di comando: python udp-client2BY.py <remoteip> <remoteport> <debug>
#sys.argv[0]: udp-client2BY.py
#sys.argv[1]: <remoteip>
#sys.argv[2]: <remoteport>
#sys.argv[3]: True = debug, False no debug
#TEMPORANEO: simulazione parametri per debug in Python IDE RIMUOVERE!!!
sys.argv = [sys.argv[0], "192.168.1.64",40000,True]
#FINE TEMPORANEO!!!
if len(sys.argv)<4:
    print "parametri mancanti"
    exit(1)
else:
    remoteIP = sys.argv[1]
    port = sys.argv[2]
    debug=sys.argv[3]
    if debug:
        print sys.argv
#variabili
speed = 0
angle = +000
#debug: diagnostica locale
if debug:
    print "udp-client 2CY"
#apre la connessione con il bridge
try:
    bridge=BridgeClient()
    if debug:
        print "connessione con bridge ok"
except Exception:
    if debug:
        print "errore di connessione con bridge"
    exit(1)
#apre la connessione udp
try:
    clientSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    serverSock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
except socket.error:
    if debug:
        print "errore apertura di socket"
    exit(1)
#loop di comunicazione
while True:
    #ogni 1 S
    time.sleep(1)
    #verifica se eventi di r(ead), w(rite), (e)x(ception)
    r,w,x = select.select([clientSock],[clientSock],[clientSock])
    if clientSock in w:
        #trasmette
        try:
            strSpdAng = bridge.get("spdang")
            if debug:
                print "read speed/angle from bridge",strSpdAng
        except Exception:
            strSpdAng="00+000"
            if debug:
                print "errore di lettura bridge, forzo 00+000"
        msg = strSpdAng+"\r\n"
        try:
            clientSock.sendto(msg,(remoteIP,port))
            print "sent message", msg,"to",remoteIP,port
        except socket.error:
            print "write error"
    if clientSock in r:
        #riceve
        try:
            data, addr = clientSock.recvfrom(1024)
            if debug:
                print "received message",data,"from",addr
            strSlope=data[0:2]
            try:
                slope=int(strSlope)
                if debug:
                    print "ricevuta slope",slope
            except ValueError:
                strSlope="00"
                if debug:
                    print "dato non numerico, forzo 00"
            try:
                bridge.put("slope",strSlope)
                if debug:
                    print "slope trasferita a bridge", strSlope
            except Exception:
                if debug:
                    print "errore di scrittura bridge"              
        except socket.error:
            print "read error"
    if clientSock in x:
        #eccezione
        print "socket error"
