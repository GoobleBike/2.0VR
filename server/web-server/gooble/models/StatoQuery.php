<?php

namespace app\models;

/**
 * This is the ActiveQuery class for [[Stato]].
 *
 * @see Stato
 */
class StatoQuery extends \yii\db\ActiveQuery
{
    /*public function active()
    {
        return $this->andWhere('[[status]]=1');
    }*/

    /**
     * @inheritdoc
     * @return Stato[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return Stato|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
