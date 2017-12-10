

//delle prossime due va attivata una sola
var CFG_PRESET="20131122";//firmware dhcp
//var CFG_PRESET="20131005";//makerfair

switch(CFG_PRESET){
  case  "20131122"://firmware dhcp
    /*
     METRI_PER_CLICK
     corrispondenza fra click e distanza percorsa
     */
    //var METRI_PER_CLICK=15.0; //Roma, maker faire: più brillantezza nella resa!
//    var METRI_PER_CLICK=10.0; //un click corrisponde a 10 metri percorsi sia in vecchio firmware sia in nuovo con LIMIT1
    var METRI_PER_CLICK=5.0; //un click corrisponde a 5 metri percorsi in nuovo firmware con LIMIT0

    /*
     MAX_SPEED in km/h
     è la massima velocità prevista, e viene utilizzata per impostare
     il tachimetro che porta il fondo scala a MAX_SPEED+10
     */
    //var MAX_SPEED=3.6*METRI_PER_CLICK;// Vecchio firmware: max frequenza è 1 click al secondo
    var MAX_SPEED=36;//nuovo firmware: non dipende più dai mperclick, è solo questione di resa in vista
    /*
     MIN_SPEED in km/h
     è la minima velocità al di sotto della quale il firmware considera fermo
     */
    //var MIN_SPEED=3.6; //corrisponde ad almeno 8 impulsi di basso livello per secondo => 1 m/sec
    var MIN_SPEED=3.6;

    /*
    questo fattore separa la velocità reale e quella virtuale
    se vale 1 c'è identità fra le due grandezze
    se vale <1 la velocità simulata è minore di quella reale (periferia della ruota) per cui in salita si accentua il senso di affaticamento
     */
    var FATTORE_VIRTUALIZZ_VELOCITA=0.5;

    /*
     TIMEOUT_PER_FERMO in msec
     riconosce il fermo e azzera tachimetro
     */
    // vecchio firmware: la velocità minima corrisponde a 10800 msec, quindi a 10900 considero fermo.
    //var TIMEOUT_PER_FERMO=10900;
    // nuovo firmware: la velocità minima corrisponde 8 impulsi di basso livello per secondo -> 1 m/sec => T=V*S
    // nuovo firmware: la velocità minima è riconosciuta se trascorre un T = Vmin *Sperclick +1%
    var TIMEOUT_PER_FERMO=FATTORE_VIRTUALIZZ_VELOCITA*(MIN_SPEED/3.6)*METRI_PER_CLICK*1000*1.01;

    var DELTATMIN=(METRI_PER_CLICK*3600.0/MAX_SPEED)*0.95; //msec S/V => METRI_PER_CLICK/(3.6*METRI_PER_CLICK) - 5%
    var DELTAV_PEROVERFLOW=3;//incremento di velocità max se ho overflow



    //distanza minima al di sotto della quale i segmenti vanno "fusi"
    var MIN_LUNG_SEGMENTO=15.0;
    //var MIN_LUNG_SEGMENTO=1.2*METRI_PER_CLICK;
    break;
  case  "20131005"://makerfair
  default:
    var FATTORE_VIRTUALIZZ_VELOCITA=1.0;//rende ininfluente questo fattore
    //corrispondenza fra click e distanza percorsa
    //var METRI_PER_CLICK=10.0; //un click corrisponde a 10 metri percorsi
    var METRI_PER_CLICK=15.0; //un click corrisponde a 10 metri percorsi
    var MAX_SPEED=3.6*METRI_PER_CLICK;//in km/h, sappiamo che max frequenza e 1 click al secondo
    var MIN_SPEED=3.6;
    var TIMEOUT_PER_FERMO=10900; // la velocità minima corrisponde a 10800 msec, quindi a 10900 considero fermo.
    var DELTATMIN=1000.0*0.95; //msec S/V con tolleranza 5%
    var DELTAV_PEROVERFLOW=5;//incremento di velocità max se ho overflow

    //distanza minima al di sotto della quale i segmenti vanno "fusi"
    //var MIN_LUNG_SEGMENTO=20.0;
    var MIN_LUNG_SEGMENTO=1.2*METRI_PER_CLICK;
  break;
}

/*
 AVERAGE_SPEED=MAX_SPEED
 serve solo in modo DEVELOP, è la velocità simulata in Autorun
*/
//var AVERAGE_SPEED=10.75; // 10,75m/sec, 38,7 km/h è la vel max rilevata dal rullo
//var AVERAGE_SPEED=10.0; // 10m/sec, 36 km/h
var AVERAGE_SPEED=MAX_SPEED; //


