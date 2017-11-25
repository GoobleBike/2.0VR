<?php
use yii\helpers\Html;

/* @var $this yii\web\View */
$this->title = 'Simulazione di WebClient';
$this->params['breadcrumbs'][] = $this->title;
?>
<div>
<h1><?= Html::encode($this->title) ?></h1>

<p>Ogni secondo viene chiamata la api <b>setp_getv?id=0&p=15&f=1</b></p>

<div>
    <div id="totale" style="font-size: 150px;">...connecting</div>
    <div id="edit" style="font-size: xx-large">Stato inviato:
        <button id="minus" >-</button>
        <input id="stato" value="10" readonly="readonly" />
        <button id="plus" >+</button>
    </div>
    <div id="orologio" style="font-size: xx-large"></div>
</div>
    
</div>
<script type="text/javascript">
$(function(){
    setInterval(eachSecond, 1000);
});

function eachSecond() {
//    var ora=new Date(2011, 0, 1, 2, 3, 4);
    var d=new Date();
    var ora=d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    var sec=d.getSeconds();
    $("#orologio").html(ora);
    //ogni 5 secondi
//    if (sec % 5 == 0){
        //chiamata ajax per aggiornare totale
        $.ajax({
            dataType: 'json',
//            url: "<?= yii\helpers\Url::to(['api/setp_getv','id'=>0,'p'=>15,'f'=>1],true) ?>"
            url: "<?= yii\helpers\Url::to(['api/setp_getv','id'=>0],true) ?>"+"&p="+$("#stato").val()+"&f=1"
    //        beforeSend: function ( xhr ) {
    //          xhr.overrideMimeType("text/plain; charset=x-user-defined");
    //        }
        }).done(function ( data ) {
            $("#totale").html('<pre>'+JSON.stringify(data,null,4)+'</pre>')
//            $("#totale").html(JSON.stringify(data))
    //        if( console && console.log ) {
    //          console.log("Sample of data:", data.slice(0, 100));
    //        }
        });
//    }
}    
$("#plus").click(function(){
    s=eval($("#stato").val());
    if (s<30){
        s++;
    }    
    $("#stato").val(s);
});
$("#minus").click(function(){
    s=eval($("#stato").val());
    if (s>0){
        s--;
    }    
    $("#stato").val(s);
});
</script>