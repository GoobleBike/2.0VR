/* $Id: GoobleIterator.js 147 2013-10-03 14:50:17Z ragno $ */

/*
 * This program is free software; you can redistribuite it and/or modify it 
 * under the terms of the GNU/General Pubblic License as published the Free software Foundation; 
 * either version 3 of the License, or (at your opinion) any later version
 */

//implementa un iteratore su un elenco di punti tramite un riferimento ad un array
function GoobleIterator(path) {
    this.path = path;
    this.position = 0;
}
//restituisce il punto successivo del percorso
GoobleIterator.prototype.next = function() {
    var ris = this.path[this.position];
    this.position++;
    return ris;
};

/**
 * restituisce il punto successivo del percorso senza avanzara se disponibile, false in caso contrario
 * @returns {GooblePoint}
 */
GoobleIterator.prototype.nextNoMove = function() {
    var ris = false;
    if (this.position < this.path.length) {
      ris = this.path[this.position];
    }
    return ris;
};
//verifica se esiste un elemento successivo
GoobleIterator.prototype.hasNext = function() {
    var ris = false;
    if (this.position < this.path.length)
        ris = true;
    return ris;
};



