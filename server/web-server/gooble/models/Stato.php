<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "stato".
 *
 * @property string $who
 * @property int $id
 * @property string $what
 * @property string $how
 * @property string $ts
 */
class Stato extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'stato';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['who', 'id', 'what', 'how'], 'required'],
            [['id'], 'integer'],
            [['ts'], 'safe'],
            [['who', 'what', 'how'], 'string', 'max' => 255],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'who' => 'Who',
            'id' => 'ID',
            'what' => 'What',
            'how' => 'How',
            'ts' => 'Ts',
        ];
    }

    /**
     * @inheritdoc
     * @return StatoQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new StatoQuery(get_called_class());
    }
}
