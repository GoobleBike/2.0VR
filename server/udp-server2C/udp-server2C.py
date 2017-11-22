#!/usr/bin/python
#udp server 2C: si collega con due controller vel/pend e ang
import socket
import select
import sys
import MySQLdb
import atexit
#rilascia socket in uscita, chiude log
def closeSock():
    serverSock.close()
    log.write("process terminated\n")
    log.close()
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
#log su file
log = open("log-udp-server.txt","w",0)
log.write("starting script\n")
#tenta di aprire la connessione con dbms
mysqlConnect = False
while mysqlConnect == False:
    try:
        db = MySQLdb.connect(host="localhost",user="gooble",passwd="Bike2017",db="gooble")
        mysqlConnect = True
        if debug:
            print "Connesso al DBMS"
    except MySQLdb.Error:
        log.write("mysql connection error\n")
        if debug:
            print "Errore di connessione al DBMS"
log.write("mysql connected\n")
db.autocommit(True)
c=db.cursor()
#tenta di aprire il servizio UDP
udpConnect = False
while udpConnect == False:
    try:
        serverSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        serverSock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        serverSock.bind((localIP, port))
        udpConnect = True
        if debug:
            print "server associato a",localIP,port
    except socket.error:
        log.write("socket creation error\n")
        if debug:
            print "errore apertura di socket"
log.write("udp bound\n")
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
                        log.write("mysql update error\n")
                        if debug:
                            print "Errore di accesso al DBMS"
                except ValueError:
                    log.write("dato A non numerico\n")
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
                        log.write("mysql update error\n")
                        if debug:
                            print "Errore di accesso al DBMS"
                except ValueError:
                    log.write("dato V non numerico\n")
                    if debug:
                        print "dato V non numerico"
                #risposta: estrae pendenza
                try:
                    c.execute("SELECT how FROM stato WHERE what='p'")
                    r=c.fetchone()
                    strPend=r[0]
                    try:
                        pend=int(strPend)
                        if pend<0:
                            pend=0
                        msg=str(pend).zfill(2)+'\r\n'
                        #invia msg al controller
                        try:
                            serverSock.sendto(msg,addr)
                            if debug:
                                print "sent message:", p, "to", addr
                        except socket.error:
                            log.write("socket send error\n")
                            if debug:
                                print "errore di socket"
                    except ValueError:
                        log.write("P value not numeric\n")
                        if debug:
                            print "dato P non numerico"
                except MySQLdb.Error:
                    log.write("mysql select error\n")
                    if debug:
                        print "errore di accesso al DBMS"
        except socket.error:
            log.write("socket recv error\n")
            if debug:
                print "errore di socket"
    if serverSock in x:
        #eccezione
        log.write("socket exception\n")
        if debug:
            print "socket error"
