#!/usr/bin/python
#udp server: usa la rete wifi, conn. mysql, non blocking
import socket
import select
#import sys
import MySQLdb
#import time
import atexit
def closeSock():
    serverSock.close()
atexit.register(closeSock)
#debug
debug = True
#debug = False
#debug: diagnostica locale
if debug:
    print "udp-server v 2.0B"
#apre la connessione con dbms
try:
    db = MySQLdb.connect(host="localhost",user="gooble",passwd="Bike2017",db="gooble")
    if debug:
        print "Connesso al DBMS"
except MySQLdb.Error:
    if debug:
        print "Errore di connessione al DBMS"
    exit(1)	
db.autocommit(True)
c=db.cursor()
#apre il servizio UDP
localIP = "0.0.0.0"        
port = 40000
try:
    serverSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    serverSock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    serverSock.bind((localIP, port))
except socket.error:
    if debug:
        print "errore apertura di socket"
        exit(1)
#loop di comunicazione
while True:
    r,w,x = select.select([serverSock],[],[serverSock])
    if serverSock in r:
        #riceve
        try:
            data, addr = serverSock.recvfrom(1024)    
            if debug:
                print "received message:", data, "from", addr
            #estrae dati dal msg
            strSpeed=data[0:2]
            strAngle=data[3:7]
            #converte in numerico
            try:
                speed=int(strSpeed)
                angle=int(strAngle)
                #aggiorna banca dati
                try:
                    c.execute("UPDATE stato SET how='"+strSpeed+"',ts=CURRENT_TIMESTAMP WHERE what='v'")
                    c.execute("UPDATE stato SET how='"+strAngle+"',ts=CURRENT_TIMESTAMP WHERE what='a'")
                except MySQLdb.Error:
                    if debug:
                        print "Errore di accesso al DBMS"
            except ValueError:
                if debug:
                    print "dato non numerico"
        except socket.error:
            if debug:
                print "errore di socket"
        #risposta: estrae pendenza
        try:
            c.execute("SELECT how FROM stato WHERE what='p'")
            r=c.fetchone()
            p=r[0]
            p=str(p).zfill(2)+'\r\n'
            #invia msg al controller
            try:
                serverSock.sendto(p,addr)
                print "sent message:", p, "to", addr
            except socket.error:
                if debug:
                    print "errore di socket"
        except MySQLdb.Error:
            if debug:
                print "errore di accesso al DBMS"
    if serverSock in x:
        #eccezione
        print "socket error"
