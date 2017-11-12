class MapTools{

    /**
     * Permette di calcolare l'inclinazione della strada partendo da due punti
     * @param {GooblePoint} curPoint
     * @param {GooblePoint} nextPoint
     * @returns {float} inclinazione per cento
     */
    static calcInclination(curPoint, nextPoint) {
        return ((nextPoint.elv - curPoint.elv) / curPoint.dst) * 100;

    };
    
}