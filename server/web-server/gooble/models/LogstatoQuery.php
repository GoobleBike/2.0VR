<?php

namespace app\models;

/**
 * This is the ActiveQuery class for [[Logstato]].
 *
 * @see Logstato
 */
class LogstatoQuery extends \yii\db\ActiveQuery
{
    /*public function active()
    {
        return $this->andWhere('[[status]]=1');
    }*/

    /**
     * @inheritdoc
     * @return Logstato[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return Logstato|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
