// $Id: GoobleView.js 149 2013-10-05 08:45:35Z ragno $ 

/*
 * This program is free software; you can redistribuite it and/or modify it 
 * under the terms of the GNU/General Pubblic License as published the Free software Foundation; 
 * either version 3 of the License, or (at your opinion) any later version
 */

/* 
 * Gestione degli accessi al DOM in generale
 * NB fa uso di jQuery
 */
function GoobleView(mode) {
  this.mode=mode;
  this.setStatusModeView();
  //progress bar
  this.progressBar=new ProgressBar();
  //landmeter
  this.landmeter=new Landmeter("canvas_pendenza",200,100);
  //speedometer
  this.speedometer=new Speedometer("canvas_tachimetro",200,100,MAX_SPEED);
}

GoobleView.prototype.swapCruscottoOnPreloadOff=function(){
  $("#preload").hide();
  $("#cruscotto").show(1);
}

GoobleView.prototype.swapCruscottoOffPreloadOn=function(){
  $("#cruscotto").hide();
  $("#preload").show(1);
}

GoobleView.prototype.setStatusModeView=function(){
  var mappa = $("#map_canvas");
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
    mappa.height("80%");
  }
};

GoobleView.prototype.showSplash=function(){
  if (this.mode===PRODUCTION){
    $("#splash").show(2000);
  }
  else {
    //DEVELOP
    $("#splash").hide();
  }
};

GoobleView.prototype.hideSplash=function(){
  $("#splash").hide();
};

GoobleView.prototype.statusMessage=function(msg){
  $("#status_message").html("<p>"+msg+"</p>");
};

/**
 * Effettua il dump del punto 
 * @param {GooblePoint} point
 * @param {int} passo 
 * @returns {undefined}
 */
GoobleView.prototype.dumpPoint=function(point,i){
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
 * @returns {undefined}
 */
GoobleView.prototype.dumpPath=function(path){
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

  GoobleView.prototype.msgFinePath=function(){
    alert("Fine percorso, complimenti!");
  };

GoobleView.prototype.updateDashboard=function(){
  this.progressBar.drawImage(goobleControl.getPercentPercorso().toFixed(0));
  this.landmeter.drawWithInputValue(goobleControl.getPendenza());
//  $("#pendenza").html("Pendenza<br>"+goobleControl.getPendenza().toFixed(2)+"%");
  this.speedometer.drawWithInputValue(goobleControl.getActualSpeed());
//  $("#tachimetro").html("velocità km/h<br>"+goobleControl.getActualSpeed().toFixed(1));
  $("#contakm").html("Km<br>"+goobleControl.getKmPercorsi().toFixed(2));
  $("#toNextImg").html("to next panorama<br>m "+goobleControl.getToNextPoint().toFixed(1));
  if (goobleControl.mode==DEVELOP) {
    $("#cruscotto_develop").html("pendenza="+(goobleControl.getPendenza()).toFixed(2)+" | ultimo intertempo="+(goobleControl.getUltimoIntertempo()/1000).toFixed(2)+"% | velocità km/h="+goobleControl.getActualSpeed().toFixed(1));
  }
//  $("#cruscotto").html("Pendenza="+goobleControl.getPendenza().toFixed(2)+"% - Km percorsi="+goobleControl.getKmPercorsi().toFixed(3)+" - % percorsa="+goobleControl.getPercentPercorso().toFixed(2)+" - velocità km/h="+goobleControl.getActualSpeed().toFixed(1)+(goobleControl.mode==DEVELOP?"<br>ultimo intertempo="+(goobleControl.getUltimoIntertempo()/1000).toFixed(2)+" - al prossimo punto="+goobleControl.getToNextPoint().toFixed(2):""));
//  $("#cruscotto").html("Km percorsi="+goobleControl.getKmPercorsi()+" - % percorsa="+goobleControl.getPercentPercorso()+" - velocità km/h="+goobleControl.getActualSpeed());
  
};

GoobleView.prototype.openDashboard=function(){
  $("#progressbar").show(1);
  this.landmeter.draw()
  this.speedometer.draw()
//  $("#splash").show(2000);
};

GoobleView.prototype.closeDashboard=function(){
  $("#progressbar").hide();
};

GoobleView.prototype.mostraPresetPercorsi=function(percorsi){
  var bottoni="";
  for (var i =0; i<percorsi.length; i++){
    bottoni+='<input type="button" value="'+percorsi[i][2]+'" style=" float:left; height:48px; margin=1px" onclick="goobleControl.makeRoute(\''+percorsi[i][0]+'\', \''+percorsi[i][1]+'\')">';
//    $("#from1").text(percorsi[i][0]);
//    $("#to1").val(percorsi[i][1]);
  }
  $("#preload_buttons").html(bottoni);
};

