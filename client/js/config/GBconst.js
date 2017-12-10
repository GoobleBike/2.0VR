
/*
 * costanti di configurazione
 */


//costanti per modo di visualizzazione
const DEVELOP="DEVELOP";
const PRODUCTION="PRODUCTION";
const DEMO="DEMO";
const CALLDB=true;
//delle prossime due va attivata una sola
//const GOOBLE_CONTROL_MODE=DEVELOP;
const GOOBLE_CONTROL_MODE=PRODUCTION;
//abilita i log di debug
const LOGGERENABLE=true;

/**
 * identificazione
 * @type Number
 */
const MYID=0;

//API host 
const LOGHOST="localhost";
const LOGAPI=LOGHOST+"/gooble/api/log?id="+MYID+"";


/*
 * costanti di temporizzazione
 */
const IMAGE_REFRESH_TIME = 4000;
const VIEW_REFRESH_TIME = 950;
//const VIEW_REFRESH_TIME = 5000;
//const VIEW_REFRESH_TIME = 1900;
const DATA_REFRESH_TIME = 1000;
const ANG_POLL_TIME=1200;//intervallo di polling per l'angolo del manubrio

// costante per mappa di default
//const DEFAULT_MAP_ORIGIN="via Rizzoli,2 Bologna";
const DEFAULT_MAP_ORIGIN="via degli annibaldi, roma";

//funzionzionalità
const GB_1="GB 1";
const GB_BOEXP="GB BO Exp";
const GB_2="GB 2 VR";

//costanti per scelta di filtro inclinazione
const IF_NONE="nessun filtro inclinazione";
const IF_BATCH="filtro inclinazione batch su percorso"; //raggruppa i segmenti piccoli
const IF_ABSORBER="filtro inclinazione ammortizzatore"; //diluisce nello spazio le variazioni di inclinazione (oltre a raggruppare segmenti)
const INCLINATION_FILTER_MODE=IF_ABSORBER;

//API per aggiornamento velocità
const URL = "http://localhost/gooble/api/setp_getv?id="+MYID+"&p=";
const ANGLEURL = "http://localhost/gooble/api/getdump?id="+MYID;
const LOCATIONURL = "http://localhost/gooble/api/setloc?id="+MYID;

/*
 * soglie di filtro per l'ngolo di sterzata
 */
RT_ANGLE_THR=16;//soglia destra
LT_ANGLE_THR=-16;//soglia sinistra

//const PRESET_PERCORSI=[
//  ["Piazza della Pace, 40134 Bologna","Santuario Madonna di San Luca, Via di San Luca, 36, 40135 Bologna","Via di San Luca<br>from Piazza della Pace<br>to Santuario di San Luca"],// 
//];

const PRESET_PERCORSI=[
  ["via degli annibaldi, roma","colosseo roma","Roma"],//Piazza Malpighi
  ["Palazzo Belloni, Via Barberia, 19, 40123 Bologna","Piazza Maggiore, 40124 Bologna","Old town<br>from Palazzo Belloni<br>to PiazzaMaggiore"],//Piazza Malpighi
  ["Piazza Maggiore, 40124 Bologna","Piazza Giuseppe Verdi, 40126 Bologna","Old town<br>from Piazza Maggiore<br>to Piazza Verdi"],// Via Rizzoli e Via Zamboni
  ["Piazza Giuseppe Verdi, 40126 Bologna","Scalinata Del Pincio, Piazza XX Settembre, 40121 Bologna","Old town<br>from Piazza Verdi<br>to Piazza XX Settembre"],// Via dell'Indipendenza
  ["Piazza della Pace, 40134 Bologna","Santuario Madonna di San Luca, Via di San Luca, 36, 40135 Bologna","Via di San Luca<br>from Piazza della Pace<br>to Santuario di San Luca"],// 
  ["Paderno, Città Metropolitana di Bologna","Parco Cavaioni, 40136 Bologna BO","Hills of Bologna<br>from Paderno<br>to Parco Cavaioni"],// Via dei Colli e Via Cavaioni
  ["Dulcamara, Via Tolara di Sopra, 78, 40064 Ozzano dell'Emilia BO","Osteria La Palazzina, Via Bianchina, 1, 40064 Ciagnano, Ozzano dell'Emilia BO","Parco dei gessi<br>near Ozzano dell'Emilia"],// Via del Pilastrino
  ["Piazza de' Celestini, 40123 Bologna","Basilica di Santo Stefano, Via Santo Stefano, 24, 40125 Bologna","Old town<br>from Piazza de' Celestini<br>to Basilica di Santo Stefano"],// Via Clavature
  ["Basilica di Santo Stefano, Via Santo Stefano, 24, 40125 Bologna","Basilica di San Martino Maggiore, Via Guglielmo Oberdan, 25, 40126 Bologna","Old town<br>from Basilica di Santo Stefano<br>to Basilica di San Martino Maggiore"],// Via Santo Stefano e Via Guglielmo Oberdan
  ["Basilica di San Martino Maggiore, Via Guglielmo Oberdan, 25, 40126 Bologna","Basilica di San Francesco, Piazza Malpighi, 9, 40123 Bologna","Old town<br>from Basilica di San Martino Maggiore<br>to Basilica di San Francesco"],// Via Marsala
  ["44.670073, 11.282401","44.682515, 11.265338","Countryside<br>near Castello d'Argile"],// strade senza nome in mezzo ai campi
  ["Piazza della Rinascita, 7, 40015 Galliera BO","Via Castello, 17, 40015 Galliera BO","Countryside<br>near Galliera"],// Via Coronella/SP12
  ["Via di Mezzo, 13, 40017 San Giovanni in Persiceto BO","Via Budrie, 107, 40017 Budrie BO","Countryside<br>from San Giovanni in Persiceto<br>to Le Budrie"],// Via di Mezzo e Via Budrie
  ["Via Bertoloni, 29, 40069 Zola Predosa BO","Via F. Raibolini il Francia, 84, 40069 Zola Predosa BO","Hills<br>near Zola Predosa"],// Via F. Raibolini il Francia
  ["Viale Medardo Bottonelli, 40136 Bologna","Basilica di San Domenico, Piazza S. Domenico, 13, 40124 Bologna","Old town<br>from Viale Medardo Bottonelli<br>to Basilica di San Domenico"],// Via Castiglione
  ["Basilica di San Domenico, Piazza S. Domenico, 13, 40124 Bologna","Palazzo Belloni, Via Barberia, 19, 40123 Bologna","Old town<br>from Basilica di San Domenico<br>to Palazzo Belloni"],// Via Barberia

];
/*
//var presetPercorsi=[
//  ["44.489623,11.309306","44.479385,11.296335","San Luca"],
//  ["Via Siepelunga, 2 Bologna","Via Santa Liberata Bologna","Monte Donato"],
//  ["via del genio 3 bologna","via di gaibola 6 bologna","via Del Genio"]
////  ["46.607300, 12.277274","46.609857, 12.296371","3 Cime Di Lavaredo"]
//];

var presetPercorsi=[
//  ["Via ugo bassi, 2 Bologna","piazza medaglie d'oro Bologna","centro"],
  ["Piazza maggiore Bologna","stazione centrale Bologna","Old town<br>from Piazza Maggiore<br>to Stazione Centrale"],
  ["porta castiglione bologna","porta saragozza bologna","from Porta Castiglione<br>to porta Saragozza"],
//  ["via del genio 3 bologna","via di gaibola 6 bologna","via Del Genio"]
  ["via del genio 3 bologna","via del genio 13 bologna","via Del Genio"]
//  ["46.607300, 12.277274","46.609857, 12.296371","3 Cime Di Lavaredo"]
];

//var presetPercorsi=[
//  ["Via Siepelunga, 2 Bologna","Via Siepelunga,20 Bologna","Monte Donato"],
//  ["Via Monte Donato, 2 Bologna","Via Monte Donato,10 Bologna","Monte Donato"],
//  ["via del genio 3 bologna","via del genio 15 bologna","via Del Genio"],
//  ["46.607300, 12.277274","46.609857, 12.296371","3 Cime Di Lavaredo"]
//];

*/

