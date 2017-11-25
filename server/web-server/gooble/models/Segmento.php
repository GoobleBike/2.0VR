<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "segmento".
 *
 * @property int $id
 * @property string $start
 * @property string $stop
 * @property string $descr
 * @property int $per_id
 * @property int $progr
 *
 * @property Percorso $per
 */
class Segmento extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'segmento';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['start', 'stop', 'descr', 'per_id', 'progr'], 'required'],
            [['per_id', 'progr'], 'integer'],
            [['start', 'stop', 'descr'], 'string', 'max' => 255],
            [['per_id'], 'exist', 'skipOnError' => true, 'targetClass' => Percorso::className(), 'targetAttribute' => ['per_id' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'start' => 'Start',
            'stop' => 'Stop',
            'descr' => 'Descr',
            'per_id' => 'Per ID',
            'progr' => 'Progr',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getPer()
    {
        return $this->hasOne(Percorso::className(), ['id' => 'per_id']);
    }

    /**
     * @inheritdoc
     * @return SegmentoQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new SegmentoQuery(get_called_class());
    }
}
