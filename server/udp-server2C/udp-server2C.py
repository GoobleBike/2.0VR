#!/usr/bin/python
#udp server 2B: si collega con due controller vel/pend e ang
import socket
import select
import sys
import MySQLdb
import atexit
#rilascia socket in uscita
def closeSock():
    serverSock.close()
atexit.register(closeSock)
#linea di comando: python udp-server2C.py "<localip>" <localport> <debug>
#sys.argv[0]: udp-server2C.py
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
    print "udp-server v 2C"
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
        #riceve da uno dei due controller
        try:
            data, addr = serverSock.recvfrom(1024)    
            if debug:
                print "received message:", data, "from", addr
            #estrae dati dal msg
            if data[0]=='A':
                #dato ang da pot
                strAngle=data[1:5]
                #converte in numerico
                try:
                    angle=int(strAngle)
                    #aggiorna banca dati
                    try:
                        c.execute("UPDATE stato SET how='"+strAngle+"',ts=CURRENT_TIMESTAMP WHERE what='a'")
                    except MySQLdb.Error:
                        if debug:
                            print "Errore di accesso al DBMS"
                except ValueError:
                    if debug:
                        print "dato A non numerico"
            if data[0]=='V':
                #dato vel da controller
                strSpeed=data[1:3]
                #converte in numerico
                try:
                    speed=int(strSpeed)
                    #aggiorna banca dati
                    try:
                        c.execute("UPDATE stato SET how='"+strSpeed+"',ts=CURRENT_TIMESTAMP WHERE what='v'")
                    except MySQLdb.Error:
                        if debug:
                            print "Errore di accesso al DBMS"
                except ValueError:
                    if debug:
                        print "dato V non numerico"
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
        except socket.error:
            if debug:
                print "errore di socket"
    if serverSock in x:
        #eccezione
        if debug:
            print "socket error"
