<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "percorso".
 *
 * @property int $id
 * @property string $desc
 *
 * @property Segmento[] $segmentos
 */
class Percorso extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'percorso';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['desc'], 'required'],
            [['desc'], 'string', 'max' => 255],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'desc' => 'Desc',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getSegmentos()
    {
        return $this->hasMany(Segmento::className(), ['per_id' => 'id']);
    }

    /**
     * @inheritdoc
     * @return PercorsoQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new PercorsoQuery(get_called_class());
    }
}
