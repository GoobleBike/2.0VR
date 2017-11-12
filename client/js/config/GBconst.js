
/*
 * costanti di configurazione
 */


//costanti per modo di visualizzazione
const DEVELOP="DEVELOP";
const PRODUCTION="PRODUCTION";
const DEMO="DEMO";
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
//const VIEW_REFRESH_TIME = 950;
//const VIEW_REFRESH_TIME = 5000;
const VIEW_REFRESH_TIME = 1900;
const DATA_REFRESH_TIME = 1000;

// costante per mappa di default
const DEFAULT_MAP_ORIGIN="via Rizzoli,2 Bologna";

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
