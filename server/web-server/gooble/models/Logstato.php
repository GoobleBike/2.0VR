<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "logstato".
 *
 * @property int $log_id
 * @property string $who
 * @property int $id
 * @property string $what
 * @property string $how
 * @property string $ts
 * @property string $note
 */
class Logstato extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'logstato';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['who', 'id', 'what', 'how', 'ts'], 'required'],
            [['id'], 'integer'],
            [['ts', 'note'], 'safe'],
            [['who', 'what', 'how', 'note'], 'string', 'max' => 255],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'log_id' => 'Log ID',
            'who' => 'Who',
            'id' => 'ID',
            'what' => 'What',
            'how' => 'How',
            'ts' => 'Ts',
            'note' => 'Note',
        ];
    }

    /**
     * @inheritdoc
     * @return LogstatoQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new LogstatoQuery(get_called_class());
    }
}
