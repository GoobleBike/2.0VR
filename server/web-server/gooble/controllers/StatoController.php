<?php

namespace app\controllers;

use Yii;
use app\models\Stato;
use app\models\StatoSearch;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;

/**
 * StatoController implements the CRUD actions for Stato model.
 */
class StatoController extends Controller
{
    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'delete' => ['POST'],
                ],
            ],
        ];
    }

    /**
     * Lists all Stato models.
     * @return mixed
     */
    public function actionIndex()
    {
        $searchModel = new StatoSearch();
        $dataProvider = $searchModel->search(Yii::$app->request->queryParams);

        return $this->render('index', [
            'searchModel' => $searchModel,
            'dataProvider' => $dataProvider,
        ]);
    }

    /**
     * Displays a single Stato model.
     * @param string $who
     * @param integer $id
     * @param string $what
     * @return mixed
     */
    public function actionView($who, $id, $what)
    {
        return $this->render('view', [
            'model' => $this->findModel($who, $id, $what),
        ]);
    }

    /**
     * Creates a new Stato model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */
    public function actionCreate()
    {
        $model = new Stato();

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['view', 'who' => $model->who, 'id' => $model->id, 'what' => $model->what]);
        } else {
            return $this->render('create', [
                'model' => $model,
            ]);
        }
    }

    /**
     * Updates an existing Stato model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param string $who
     * @param integer $id
     * @param string $what
     * @return mixed
     */
    public function actionUpdate($who, $id, $what)
    {
        $model = $this->findModel($who, $id, $what);

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['view', 'who' => $model->who, 'id' => $model->id, 'what' => $model->what]);
        } else {
            return $this->render('update', [
                'model' => $model,
            ]);
        }
    }

    /**
     * Deletes an existing Stato model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     * @param string $who
     * @param integer $id
     * @param string $what
     * @return mixed
     */
    public function actionDelete($who, $id, $what)
    {
        $this->findModel($who, $id, $what)->delete();

        return $this->redirect(['index']);
    }

    /**
     * Finds the Stato model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param string $who
     * @param integer $id
     * @param string $what
     * @return Stato the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($who, $id, $what)
    {
        if (($model = Stato::findOne(['who' => $who, 'id' => $id, 'what' => $what])) !== null) {
            return $model;
        } else {
            throw new NotFoundHttpException('The requested page does not exist.');
        }
    }
}
