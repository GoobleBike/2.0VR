<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model app\models\Stato */
/* @var $form yii\widgets\ActiveForm */
?>

<div class="stato-form">

    <?php $form = ActiveForm::begin(); ?>

    <?= $form->field($model, 'who')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'id')->textInput() ?>

    <?= $form->field($model, 'what')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'how')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'ts')->textInput() ?>

    <div class="form-group">
        <?= Html::submitButton('Save', ['class' => 'btn btn-success']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
