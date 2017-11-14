#!/usr/bin/python
# usb server 2A: i/f seriale tra controller e dbms
import serial
import sys
import MySQLdb
import time
#linea di comando: python udp-server2A.py <serialport> <debug>
#sys.argv[0]: udp-server2A.py
#sys.argv[1]: <serialport>
#sys.argv[3]: True = debug, False no debug
#TEMPORANEO: simulazione parametri per debug in Python IDE RIMUOVERE!!!
sys.argv = [sys.argv[0], "COM21",True]
#FINE TEMPORANEO!!!
if len(sys.argv)<2:
    print "parametri mancanti"
    exit(1)
else:
    com = sys.argv[1]
    debug=sys.argv[2]
    if debug:
        print sys.argv
if debug:
    print "usb-server v 2A"
    sys.argv = [sys.argv[0], 'COM21']
#Apre connessione con dbms
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
#Apre la connessione alla seriale
try:
    ser = serial.Serial(port=com, baudrate=250000, bytesize=8, parity='N',stopbits=1, timeout=None)
except serial.SerialException:
    if debug:
        print "Errore di apertura canale seriale"	
    exit(1)
#loop di comunicazione
while True:
    #lettura sospensiva del canale
    try:
        ris=ser.readline()
        if debug:
            print ris
        speed=ris[0:2]
        angle=ris[3:7]
        try:
            c.execute("UPDATE stato SET how='"+speed+"',ts=CURRENT_TIMESTAMP WHERE what='v'")
            c.execute("UPDATE stato SET how='"+angle+"',ts=CURRENT_TIMESTAMP WHERE what='a'")
            c.execute("SELECT how FROM stato WHERE what='p'")
            r=c.fetchone()
            p=r[0]
            p=str(p).zfill(2)+'\r\n'
            try:
                ser.write(p)
                if debug:
                    print p
            except serial.serialException:
                if debug:
                    print "errore di scrittura"
        except MySQLdb.Error:
            if debug:
                print "Erroce di accesso al DBMS"    
            try:
                db = MySQLdb.connect(host="localhost",user="gooble",passwd="Bike2017",db="gooble")
                db.autocommit(True)
                c=db.cursor()
            except MySQLdb.Error:
                print "Errore di connessione al DBMS"
    except serial.SerialException:
        print "Errore di comunicazione"        
    
