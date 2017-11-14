#!/usr/bin/python
#udp server 2B: si collega con un unico controller vel/ang/pend
import socket
import select
import MySQLdb
import atexit
import sys
#rilascia socket in uscita
def closeSock():
    serverSock.close()
atexit.register(closeSock)
#linea di comando: python udp-server2B.py "<localip>" <localport> <debug>
#sys.argv[0]: udp-server2B.py
#sys.argv[1]: "<localip>"
#sys.argv[2]: <localport>
#sys.argv[3]: True = debug, False no debug
#TEMPORANEO: simulazione parametri per debug in Python IDE RIMUOVERE!!!
sys.argv = [sys.argv[0], "0.0.0.0",40000,True]
#FINE TEMPORANEO!!!
if len(sys.argv)<4:
    print "parametri mancanti"
    exit(1)
else:
    localIP = sys.argv[1]
    port = sys.argv[2]
    debug=sys.argv[3]
    if debug:
        print sys.argv
#debug: diagnostica locale
if debug:
    print "udp-server v 2B"
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
try:
    serverSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    serverSock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    serverSock.bind((localIP, port))
    if debug:
        print "server associato a",localIP,port
except socket.error:
    if debug:
        print "errore apertura di socket"
        exit(1)
#loop di comunicazione
while True:
    #verifica se eventi di r(ead), (e)x(ception)
    r,w,x = select.select([serverSock],[],[serverSock])
    if serverSock in r:
        #riceve dal controller
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
                if debug:
                    print "sent message:", p, "to", addr
            except socket.error:
                if debug:
                    print "errore di socket"
        except MySQLdb.Error:
            if debug:
                print "errore di accesso al DBMS"
    if serverSock in x:
        #eccezione
        if debug:
            print "socket error"
