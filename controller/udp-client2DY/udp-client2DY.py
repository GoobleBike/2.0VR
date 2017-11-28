#!/usr/bin/python
#udp client per yun
#2DY comunica su UDP, velocita/angolo/pendenza
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
    log.write("process terminated\n")
    log.close()
atexit.register(closeSock)
#linea di comando: python udp-client2BY.py <remoteip> <remoteport> <debug>
#sys.argv[0]: udp-client2BY.py
#sys.argv[1]: <remoteip>
#sys.argv[2]: <remoteport>
#sys.argv[3]: True = debug, False no debug
#TEMPORANEO: simulazione parametri per debug in Python IDE RIMUOVERE!!!
#sys.argv = [sys.argv[0], "192.168.1.64",40000,True]
#FINE TEMPORANEO!!!
if len(sys.argv)<4:
    print "parametri mancanti"
    exit(1)
else:
    remoteIP = sys.argv[1]
    port = int(sys.argv[2])
    if sys.argv[3]=="True":
	    debug=True
    else:
        debug=False
    if debug:
        print sys.argv
#variabili
speed = 0      #velocita       
angle = +000   #angolo
#debug: diagnostica locale
if debug:
    print "udp-client 2DY"
#log su file
log = open("log-udp-client.txt","w",0)
log.write("starting script\n")
#tenta di aprire la connessione con il bridge
bridgeConnect = False
while bridgeConnect == False:
    try:
        bridge=BridgeClient()
        bridgeConnect = True
        if debug:
            print "connessione con bridge ok"
    except Exception:
        log.write("bridge cliente connection error\n")       
        if debug:
            print "errore di connessione con bridge"
log.write("bridge connected\n")
udpConnect = False
#tenta di aprire la connessione udp
while udpConnect == False:
    try:
        clientSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        clientSock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        udpConnect = True
    except socket.error:
        log.write("socket creation error\n")
        if debug:
            print "errore apertura di socket"
log.write("socket client created\n")
#loop di comunicazione
while True:
    #ogni 1000 mS
    time.sleep(1.0)
    #verifica se eventi di r(ead), w(rite), (e)x(ception)
    r,w,x = select.select([clientSock],[clientSock],[clientSock])
    if clientSock in w:
        #trasmette vel e ang al server
        try:
            strSpdAng = bridge.get("spdang")
            if debug:
                print "read speed/angle from bridge",strSpdAng
        except Exception:
            log.write("bridge client read error\n")
            strSpdAng="V00"
            if debug:
                print "errore di lettura bridge, forzo V00"
        msg = strSpdAng+"\r\n"
        try:
            clientSock.sendto(msg,(remoteIP,port))
            if debug:
                print "sent message", msg,"to",remoteIP,port
        except socket.error:
            log.write("udp client write error"); 
            if debug:
                print "write error"
    if clientSock in r:
        #riceve pend da server
        try:
            data, addr = clientSock.recvfrom(1024)
            if debug:
                print "received message",data,"from",addr
            strSlope=data[0:2]
            try:
                slope=int(strSlope)
                if slope<0:
                    slope=0
                if debug:
                    print "ricevuta slope",slope
            except ValueError:
                slope = 0
                log.write("dato P non numerico")
                if debug:
                    print "dato non numerico, forzo 00"
            try:
                msg=str(slope).zfill(2)
                bridge.put("slope",msg)
                if debug:
                    print "slope trasferita a bridge", strSlope
            except Exception:
                log.write("bridge client write error\n")
                if debug:
                    print "errore di scrittura bridge"              
        except socket.error:
            log.write("socket client read error\n")
            if debug:
                print "read error"
    if clientSock in x:
        #eccezione
        log.write("socket exception\n")
        if debug:
            print "socket error"
