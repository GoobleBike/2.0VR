/* $Id: GooblePath.js 147 2013-10-03 14:50:17Z ragno $ */

/*
 * This program is free software; you can redistribuite it and/or modify it 
 * under the terms of the GNU/General Pubblic License as published the Free software Foundation; 
 * either version 3 of the License, or (at your opinion) any later version
 */

//GooglePath incapsula un elenco di oggetti GooblePoint ordinati lungo un percorso
//espone un metodo di inserimento ed un iteratore per la navigazione nell'elenco
function GooblePath() {
    //array dei punti gooble
    this.path = new Array();
}

//restituisce il numero di punti del percorso
GooblePath.prototype.size = function() {
    return this.path.length;
};
//aggiunge un punto in fondo al percorso
GooblePath.prototype.add = function(point) {
    this.path.push(point);
};
//crea un iteratore per muoversi nel percorso e lo restituisce al chiamante
GooblePath.prototype.getGoobleIterator = function() {
    return new GoobleIterator(this.path);
};
//restituisce il punto
GooblePath.prototype.get = function(pos) {
    var ris = this.path[pos];
    return ris;
};
//cancella il percorso
GooblePath.prototype.clear = function() {
    this.path.length = 0;
};

GooblePath.prototype.toGooglePoint = function() {

    var i = 0;
    var googlePointPath = new Array();
    while (i < this.path.length) {

        var curPoint = new google.maps.LatLng(this.path[i].lat, this.path[i].lng);
        googlePointPath[i] = curPoint;
        i++;
    }
    return googlePointPath;
};

//lunghezza del percorso
GooblePath.prototype.getPathLength = function() {
    var ultimo=this.path.length-1;
    var lun=this.path[ultimo-1].tot
    return lun;
};

