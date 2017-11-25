<?php
/* @var $this yii\web\View */
$this->title = 'Gooble Bike client 0.9.1';
?>
        <style type="text/css">
            html { height: 100% }
            body { height: 100%; margin: 0; padding: 0 }
            #map_canvas { height: 100% } 
        </style>
        <!-- <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB0F3Hfcp-7-bM7NsMLxQrS84RRIsG_FCA&sensor=false"></script> -->
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>
        <!--
        <script type="text/javascript" src="goobleclasses.js"></script>
        /*
        * da 0.9.1 non va più incluso questo file, ma i file
        * js/GoobleControl.js
        * js/GooblePath.js
        * js/GooblePoint.js
        * js/GoobleIterator.js
        * js/GoobleButtons.js
        */
        -->
        <script type="text/javascript">
            //intercetta la generica pressione del mouse
            document.onmousedown = mouseDownAction;
            //questa è l'unica variabile globale!
            var goobleControl = null;
            //funzione di avvio del controller (solo dopo il completo caricamento della pagina)
            function startup() {
                //setup controller
                goobleControl = new GoobleControl();
            }
            //metodo delegato sull'evento onMouseDown
            function mouseDownAction(event) {
                goobleControl.mouseDown(event);
            }
        </script>
    </head>
    <!-- il body gestisce l'evento onload per avviare il control solo a fine caricamento e l'evento oncontextmenu per disabilitarlo (sarà sostituito da uno personalizzato --> 
    <body  oncontextmenu="return false;" onload="startup()">
        <!-- Splash screen con il logo posizionato sopra la mappa -->
        <img id="splash"  src="images/logo_bevel_003.png" style="display:none; z-index: 2; position:absolute; top: 100px; left: 200px; z-index: 2;" />
        <!-- map canvas -->
        <!-- attenzione, il parametro height è fissato dal metodo GoobleView.setStatusModeView --> 
        <div  id="map_canvas" style="float:left; width:100%; height:80%;"></div>
        <!-- pannello di comando -->
        
        <div style="float:left; width:100%; height:100px; background-color: #ececc8; " id="bottom_panel">
        <div style="float:left; width:24%; height:100px;" id="control_panel">
          <!--span id="bottoni"  style="display:inline; width:25%; height:50px;"-->
          <span id="bottoni" >
            <!--<form id="control_form">
                from<br>
                <input id="from" size="17" value="Via Siepelunga, 2 Bologna" /><br>
                to<br>
                <input id="to" size="17" value="Via Santa Liberata Bologna" /><br>
                <!--<input value="Make route" id="route"  onclick="goobleControl.makeRoute(document.getElementById('from').value, document.getElementById('to').value)" type="button"/><br>-->
                <!--<input value="Auto run" id="autorun" onclick="goobleControl.autoRun()" type="button"/><br>-->
                <input value="START" id="startButton" onclick="goobleControl.bikeRideStart()" type="button" style=" float:left; width:50%; height:100px;" ALIGN="CENTER"/>
                <!--<input value="Stop" id="stop" onclick="goobleControl.bikeRideStop()" type="button"/><br>-->
                <input value="NEW ROUTE" id="newRoute" onclick="goobleControl.clearRoute()" type="button" style=" float:left; width:50%; height:100px;" ALIGN="CENTER"/>
          </span>
          
               
        </div>   
        <div style="float:left; width:75%; height:100px;" id="cruscotto_or_preload">
          <div style="display: none;  float:left; width:100%; height:100px;" id="cruscotto">
                 <!-- display progress bar -->
           <span id="progressbar"   style=" float:left; width:20%; height:33px; margin-top:33px" ><canvas id="progress" width="206" height="33"></canvas>
           </span>
                 <span id="pendenza" style="float:left; width:20%; height:100px; padding-left: 3px; ;text-align: center;"><canvas id="canvas_pendenza" width="200" height="100">
                         Canvas not available.
                 </canvas></span>
                 <span id="tachimetro" style="float:left; width:20%; height:100px; text-align: center; margin-top:8px"><canvas id="canvas_tachimetro" width="200" height="100">
                         Canvas not available.
                 </canvas></span>
                 <span id="contakm" style="float:left; width:19%; height:50px; text-align: center; margin-top:13px; font-family: sans-serif; font-size: 1.6em;"></span>
                 <span id="toNextImg" style="float:left; width:19%; height:50px; text-align: center; margin-top:0px; font-family: sans-serif; font-size: 1.6em"></span>
          </div>
          <div style="float:left; width:100%; height:100px; padding-left:10px;" id="preload">
            <div style="float:left; width:30%; height:100px; padding-left:10px;text-align: right;" id="preload_form">
            <br>from 
                <input id="from1" size="40" value="Via Siepelunga, 2 Bologna" /><br>
                to 
                <input id="to1" size="40" value="Via Santa Liberata Bologna" /><br>
                <input value="Make route" id="route1"  onclick="goobleControl.makeRoute(document.getElementById('from1').value, document.getElementById('to1').value)" type="button"/>
            </div>
            <div style="float:left; width:60%; height:100px; padding-left:10px;" id="preload_buttons">
              
            </div>
          </div>
        </div>
        </div><!-- end bottom panel -->
        
            <!-- pannello di stato -->
            <div id="status_panel" style="display:none; ">
              <div id="cruscotto_develop" style="display: block; clear: both; float:left; width: 100%; height:50px; padding-left: 25%; text-align: center"></div>
              <div id="status_message"></div>
              
            <form id="control_form">
                from 
                <input id="from" size="17" value="Via Siepelunga, 2 Bologna" />
                to 
                <input id="to" size="17" value="Via Santa Liberata Bologna" /><br>
                <input value="Make route" id="route"  onclick="goobleControl.makeRoute(document.getElementById('from').value, document.getElementById('to').value)" type="button"/>
                <input value="Auto run" id="autorun" onclick="goobleControl.autoRun()" type="button"/> 
                <input value="Ride" id="ride" onclick="goobleControl.bikeRideStart()" type="button"/>
                <input value="Stop" id="stop" onclick="goobleControl.bikeRideStop()" type="button"/>
                <input value="Restart" id="restart" onclick="goobleControl.clearRoute()" type="button"/><br>
                <input value="Filtra" id="filtra" onclick="goobleControl.filtraPath()" type="button"/> i dati<br>
            </form>              
                <table border="1">
                    <thead>
                        <tr>
                            <th>N</th>
                            <th>Lat</th>
                            <th>Lng</th>
                            <th>Pov</th>
                            <th>Dst</th>
                            <th>Elv</th>
                            <th>Inc</th>
                            <th>Dst TOT</th>
                            <th>Elv2</th>
                        </tr>
                    </thead>
                    <tbody id="pointTableBody"></tbody>
                </table>
              <div id="Lat"></div>
              <div id="Lng"></div>
              <div id="Elv"></div>
              <div id="Pov"></div>
              <div id="Inc"></div>
              <div id="Dst"></div>
              <div id="Tot"></div>
              <div id="Elv2"></div>
              <div id="array">
                <table border="1">
                    <thead>
                        <tr>
                            <th>N</th>
                            <th>Lat</th>
                            <th>Lng</th>
                            <th>Pov</th>
                            <th>Dst</th>
                            <th>Elv</th>
                            <th>Inc</th>
                            <th>Dst TOT</th>
                            <th>Elv2</th>
                        </tr>
                    </thead>
                    <tbody id="arrayTableBody"></tbody>
                </table>
              </div>
            </div>
    </body>
