<?php
use yii\helpers\Html;
use yii\helpers\Url;

/* @var $this yii\web\View */
$this->title = 'SD test';
$this->params['breadcrumbs'][] = $this->title;
?>
<div>
<h1><?= Html::encode($this->title) ?></h1>

<?= Html::a(
    'My Link with POST submit',
    ['api/sd'],
    [
        'onclick' => "
            $.ajax({
                url: '".Url::to(['api/sd'])."',
                type: 'POST',
                data: 'p=Xxx',
            })
        ",
    ]
) ?>

<!--<p>Ogni secondo viene chiamata la api <b>getall</b></p>

<div>
    <div id="totale" style="font-size: 150px">...connecting</div>
    <div id="orologio" style="font-size: xx-large"></div>
</div>-->
    
</div>
<script type="text/javascript">
//$(function(){
//    setInterval(eachSecond, 1000);
//});

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
            url: "<?= yii\helpers\Url::to(['api/getall'],true) ?>"
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
</script>