<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\models\Stato */

$this->title = 'Update Stato: ' . $model->who;
$this->params['breadcrumbs'][] = ['label' => 'Statos', 'url' => ['index']];
$this->params['breadcrumbs'][] = ['label' => $model->who, 'url' => ['view', 'who' => $model->who, 'id' => $model->id, 'what' => $model->what]];
$this->params['breadcrumbs'][] = 'Update';
?>
<div class="stato-update">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
