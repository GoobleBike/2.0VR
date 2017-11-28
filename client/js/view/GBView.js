//per la vista mappa/panorama
const VISTAMAPPA="vistaMappa";
const VISTAPANORAMA="vistaPanorama";

/* 
 * Gestione degli accessi al DOM in generale
 * NB fa uso di jQuery
 */
class GBView{
    
    constructor(mode) {
        this.mode=mode;
        this.setStatusModeView();
        this._tipoVista=VISTAMAPPA;
        //progress bar
//        this.progressBar=new ProgressBar();
        //landmeter
        this.landmeter=new Landmeter("canvas_pendenza",200,100);
        //speedometer
        this.speedometer=new Speedometer("canvas_tachimetro",200,100,MAX_SPEED);
        this.updateTargetDir();
    }
    set tipoVista(v){
        this._tipoVista=v;
    }
    get tipoVista(){
        return this._tipoVista;
    }
    swapCruscottoOnPreloadOff(){
        $("#preload").hide();
        $("#cruscotto").show(1);
    }

    swapCruscottoOffPreloadOn(){
        $("#cruscotto").hide();
        $("#preload").show(1);
    }

    setStatusModeView(){
        var mappa = $("#map");
        var main = $("#main");
        var empty = $("#empty");
        if (this.mode===DEVELOP){
            //DEVELOP
            mappa.width("100%");
            mappa.height("33%");
            $("splash").hide();
            $("#status_panel").show(1);
            this.statusMessage("Modo di lavoro DEVELOP, si passa a PRODUCTION modificando la costante GOOBLE_CONTROL_MODE in testa a GoobleControl.js");
        }
        else {
            //PRODUCTION
            mappa.width("100%");
            mappa.height("100%");
            var h=mappa.height()-105;
            mappa.height(h+"px");
            main.height(h+"px");
            empty.height(h+"px");
            empty.width("100%");
        }
    };

    showSplash(){
        if (this.mode===PRODUCTION){
            $("#splash").show(2000);
//            $("#splash").show(2000,setTimeout(function(){ $("#splash").hide(); }, 5000));
        }
        else {
            //DEVELOP
            $("#splash").hide();
        }
    };

    hideSplash(){
        $("#splash").hide();
        $("#splash2").hide();
    };

    statusMessage(msg){
        $("#status_message").html("<p>"+msg+"</p>");
    };

    /**
     * Effettua il dump del punto 
     * @param {GooblePoint} point
     * @param {int} passo 
     * @returns {undefined}
     */
    dumpPoint(point,i){
        //N	Lat	Lng	Pov	Dst	Elv	Inc	DstTOT	Elv2
        if (true || this.mode===DEVELOP){
            var p = point;
            var righe="";
            righe+="<tr>";
            righe+="<td>"+i+"</td>";//N
            righe+="<td>"+p.lat.toFixed(4)+"</td>";
            righe+="<td>"+p.lng.toFixed(4)+"</td>";
            righe+="<td>"+p.pov.toFixed(2)+"</td>";
            righe+="<td>"+p.dst.toFixed(2)+"</td>";
            righe+="<td>"+p.elv.toFixed(2)+"</td>";
            righe+="<td"+(p.inc<0?" style='background:red'":"")+">"+p.inc.toFixed(2)+"</td>";
            righe+="<td>"+p.tot.toFixed(2)+"</td>";
            righe+="<td>"+p.elv2.toFixed(2)+"</td>";
      //      righe+="<td>"++"</td>";
      //      righe+="<td>"++"</td>";
            righe+="</tr>";
            $("#pointTableBody").html(righe);
        }
    }
    /**
     * Effettua il dump del percorso nella apposuita table arrayTableBody
     * @param {GooblePath} path
     * @returns {void}
     */
    dumpPath(path){
        //N	Lat	Lng	Pov	Dst	Elv	Inc	DstTOT	Elv2
        if (true || this.mode===DEVELOP){
            var righe="";
            var it=path.getGoobleIterator();
            var i=0;
            while (it.hasNext()){
                var p = it.next();
                righe+="<tr>";
                righe+="<td>"+i+"</td>";//N
                righe+="<td>"+p.lat.toFixed(4)+"</td>";
                righe+="<td>"+p.lng.toFixed(4)+"</td>";
                righe+="<td>"+p.pov.toFixed(2)+"</td>";
                righe+="<td>"+p.dst.toFixed(2)+"</td>";
                righe+="<td>"+p.elv.toFixed(2)+"</td>";
          //      righe+="<td>"+p.inc.toFixed(2)+"</td>";
                righe+="<td"+(p.inc<0?" style='background:red'":"")+">"+p.inc.toFixed(2)+"</td>";
                righe+="<td>"+p.tot.toFixed(2)+"</td>";
                righe+="<td>"+p.elv2.toFixed(2)+"</td>";
          //      righe+="<td>"++"</td>";
          //      righe+="<td>"++"</td>";
                righe+="</tr>";
                i++;
            }
            $("#arrayTableBody").html(righe);
        }
        else {
            //PRODUCTION - fa nulla
        }

    };

    msgFinePath(){
        app.em.log("GBView.msgFinePath: Fine percorso, complimenti!");
    };

    updateDashboard(){
//        this.progressBar.drawImage(app.getPercentPercorso().toFixed(0));
        this.landmeter.drawWithInputValue(app.getPendenza());
//        $("#pendenza").html("Pendenza<br>"+app.getPendenza().toFixed(2)+"%");
        this.speedometer.drawWithInputValue(app.getActualSpeed());
//        $("#tachimetro").html("velocità km/h<br>"+app.getActualSpeed().toFixed(1));
        $("#contakm").html("Km<br>"+app.getKmPercorsi().toFixed(3));
//        $("#toNextImg").html("to next panorama<br>m "+(app.getToNextPoint()>0?app.getToNextPoint().toFixed(1):0));
        if (app.mode==DEVELOP) {
            $("#cruscotto_develop").html("pendenza="+(app.getPendenza()).toFixed(2)+" | ultimo intertempo="+(app.getUltimoIntertempo()/1000).toFixed(2)+"% | velocità km/h="+app.getActualSpeed().toFixed(1));
        }
//        $("#cruscotto").html("Pendenza="+app.getPendenza().toFixed(2)+"% - Km percorsi="+app.getKmPercorsi().toFixed(3)+" - % percorsa="+app.getPercentPercorso().toFixed(2)+" - velocità km/h="+app.getActualSpeed().toFixed(1)+(app.mode==DEVELOP?"<br>ultimo intertempo="+(app.getUltimoIntertempo()/1000).toFixed(2)+" - al prossimo punto="+app.getToNextPoint().toFixed(2):""));
//        $("#cruscotto").html("Km percorsi="+app.getKmPercorsi()+" - % percorsa="+app.getPercentPercorso()+" - velocità km/h="+app.getActualSpeed());
    };

    openDashboard(){
//        $("#progressbar").show(1);
//        $("#progressbar").hide();
        this.landmeter.draw()
        this.speedometer.draw()
      //  $("#splash").show(2000);
    };

    closeDashboard(){
//        $("#progressbar").hide();
    };

    mostraPresetPercorsi(percorsi){
        var bottoni="";
        for (var i =0; i<percorsi.length; i++){
          bottoni+='<input type="button" value="'+percorsi[i][2]+'" style=" float:left; height:48px; margin=1px" onclick="app.makeRoute(\''+percorsi[i][0]+'\', \''+percorsi[i][1]+'\')">';
      //    $("#from1").text(percorsi[i][0]);
      //    $("#to1").val(percorsi[i][1]);
        }
        $("#preload_buttons").html(bottoni);
    };
    updateTargetDirTxt(){
        var t="---";
        if(app.currentTarget==0){
            t="-^-";
        }
        else if (app.currentTarget<0){
            t="<--";
        }
        else {
            t="-->";
        }
        $("#targetdir").html(t);
    }
    updateTargetDir(){
        $("#targetlt").hide();
        $("#targetfwd").hide();
        $("#targetrt").hide();
        
        if(app.currentTarget==0){
            //fwd
            $("#targetfwd").show();
        }
        else if (app.currentTarget<0){
            //lt
            $("#targetlt").show();
        }
        else {
            //rt
            $("#targetrt").show();
        }
    }

}