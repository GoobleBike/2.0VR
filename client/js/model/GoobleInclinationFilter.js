/*
 * This program is free software; you can redistribuite it and/or modify it 
 * under the terms of the GNU/General Pubblic License as published the Free software Foundation; 
 * either version 3 of the License, or (at your opinion) any later version
 */

class GoobleInclinationFilter{
    constructor() {
        //costanti
        this.DIFFERENZIALE_PCENTO_SU_METRO=1.0/8.0;//impongo una variazione +/- 1% ogni 10m percorsi
        //attributi
        this.targetInclination=0;
        this.actualInclination=0;
    }

    //
    preset(inclination) {
        // forzo una inclinazione 
        this.targetInclination=inclination;
        this.actualInclination=inclination;
    };
    
    newPoint(inclination) {
        // Imposto per un nuovo punto
        //modifico il target
        this.targetInclination=inclination;
    };

    update(metri) {
        // ssono stati percorsi metri, per cui aggiorno la pendenza
        var delta=this.DIFFERENZIALE_PCENTO_SU_METRO*metri;
        if (this.actualInclination<this.targetInclination){
            //ascending
            this.actualInclination+=delta;
            if (this.actualInclination>this.targetInclination){
                this.actualInclination=this.targetInclination;
            }
        }
        else if (this.actualInclination>this.targetInclination) {
            //descending
            this.actualInclination-=delta;
            if (this.actualInclination<this.targetInclination){
                this.actualInclination=this.targetInclination;
            }
        }
        return this.actualInclination;
    };

    clear() {
        // pulisco tutto
        this.targetInclination=0;
        this.actualInclination=0;
    };

    getActualInclination(point) {
        return this.actualInclination;
    };

}
