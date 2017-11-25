<?php

namespace app\models;

/**
 * This is the ActiveQuery class for [[Segmento]].
 *
 * @see Segmento
 */
class SegmentoQuery extends \yii\db\ActiveQuery
{
    /*public function active()
    {
        return $this->andWhere('[[status]]=1');
    }*/

    /**
     * @inheritdoc
     * @return Segmento[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return Segmento|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
