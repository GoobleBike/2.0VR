#!/usr/bin/python
# usb-server: i/f seriale tra controller e dbms
import serial
import sys
import MySQLdb
import time
#debug
debug=True
#debug=False
#debug: simula parametro su linea di comando e diagnostica locale
if debug:
    print "usb-peer v 2.0A"
    sys.argv = [sys.argv[0], 'COM21']
#Legge porta da linea di comando
if len(sys.argv) < 2:
    if debug:
        print "Parametro porta mancante"
    exit(1)
else: 
    com=sys.argv[1]
    if debug:
        print "Connessione con",com
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
        ser.write(p)
        if debug:
            print p
    except MySQLdb.Error:
        if debug:
            print "Erroce di accesso al DBMS"    
        try:
            db = MySQLdb.connect(host="localhost",user="gooble",passwd="Bike2017",db="gooble")
            db.autocommit(True)
            c=db.cursor()
        except MySQLdb.Error:
            print "Errore di connessione al DBMS"
    
