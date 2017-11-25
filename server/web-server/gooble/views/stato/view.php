<?php

use yii\helpers\Html;
use yii\widgets\DetailView;

/* @var $this yii\web\View */
/* @var $model app\models\Stato */

$this->title = $model->who;
$this->params['breadcrumbs'][] = ['label' => 'Statos', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="stato-view">

    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        <?= Html::a('Update', ['update', 'who' => $model->who, 'id' => $model->id, 'what' => $model->what], ['class' => 'btn btn-primary']) ?>
        <?= Html::a('Delete', ['delete', 'who' => $model->who, 'id' => $model->id, 'what' => $model->what], [
            'class' => 'btn btn-danger',
            'data' => [
                'confirm' => 'Are you sure you want to delete this item?',
                'method' => 'post',
            ],
        ]) ?>
    </p>

    <?= DetailView::widget([
        'model' => $model,
        'attributes' => [
            'who',
            'id',
            'what',
            'how',
            'ts',
        ],
    ]) ?>

</div>
