<?php

namespace app\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\models\Stato;

/**
 * StatoSearch represents the model behind the search form of `app\models\Stato`.
 */
class StatoSearch extends Stato
{
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['who', 'what', 'how', 'ts'], 'safe'],
            [['id'], 'integer'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    /**
     * Creates data provider instance with search query applied
     *
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params)
    {
        $query = Stato::find();

        // add conditions that should always apply here

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        $this->load($params);

        if (!$this->validate()) {
            // uncomment the following line if you do not want to return any records when validation fails
            // $query->where('0=1');
            return $dataProvider;
        }

        // grid filtering conditions
        $query->andFilterWhere([
            'id' => $this->id,
            'ts' => $this->ts,
        ]);

        $query->andFilterWhere(['like', 'who', $this->who])
            ->andFilterWhere(['like', 'what', $this->what])
            ->andFilterWhere(['like', 'how', $this->how]);

        return $dataProvider;
    }
}
