<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "config".
 *
 * @property string $conf_key
 * @property string $conf_value
 * @property string $conf_des
 */
class Config extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'config';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['conf_key'], 'required'],
            [['conf_key', 'conf_value', 'conf_des'], 'string', 'max' => 255],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'conf_key' => 'Conf Key',
            'conf_value' => 'Conf Value',
            'conf_des' => 'Conf Des',
        ];
    }

    /**
     * @inheritdoc
     * @return ConfigQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new ConfigQuery(get_called_class());
    }
}
