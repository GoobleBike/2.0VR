/* $Id: GooblePoint.js 147 2013-10-03 14:50:17Z ragno $ */

/*
 * This program is free software; you can redistribuite it and/or modify it 
 * under the terms of the GNU/General Pubblic License as published the Free software Foundation; 
 * either version 3 of the License, or (at your opinion) any later version
 */

//GooblePoint incapsula un punto di un percorso Gooble
//contiene: latitudine, longitudine, elevazione, angolazione rispetto al punto successivo, distanza dal precedente, distanza dall'inizio
function GooblePoint(lat, lng, elv, pov, dst, inc, tot) {
    this.lat = lat;
    this.lng = lng;
    this.elv = elv;
    this.pov = pov;
    this.dst = dst;
    this.inc = inc;
    this.tot = tot;
    this.elv2 = 0;
}


