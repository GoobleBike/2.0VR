#!/usr/bin/python
#udp client per yun
import socket
import time
import select
import atexit
import sys
sys.path.insert(0,'/usr/lib/python2.7/bridge/')
from bridgeclient import BridgeClient
def closeSock():
    clientSock.close()
atexit.register(closeSock)
debug = True
#debug = False
remoteIP = "192.168.1.64"  #test sull'interfaccia fisica
port = 40000
speed = 0
angle = -135
#debug: diagnostica locale
if debug:
    print "udp-client v 2.0BY"
#apre la connessione con il bridge
bridge=BridgeClient()
if debug:
    print "connessione con bridge"
#apre la connessione udp
try:
    clientSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
except socket.error:
    if debug:
        print "errore apertura di socket"
        exit(1)
#loop di comunicazione
while True:
    time.sleep(1)
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
