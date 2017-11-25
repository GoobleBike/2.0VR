<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "log".
 *
 * @property int $id
 * @property int $lid
 * @property string $lkey
 * @property string $lvalue
 * @property string $ts
 */
class Log extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'log';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['lid', 'lkey', 'lvalue'], 'required'],
            [['lid'], 'integer'],
            [['ts'], 'safe'],
            [['lkey'], 'string', 'max' => 255],
            [['lvalue'], 'string', 'max' => 5000],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'lid' => 'Lid',
            'lkey' => 'Lkey',
            'lvalue' => 'Lvalue',
            'ts' => 'Ts',
        ];
    }

    /**
     * @inheritdoc
     * @return LogQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new LogQuery(get_called_class());
    }
}
