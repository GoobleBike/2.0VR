<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace app\assets_b;

use yii\web\AssetBundle;

/**
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @author Kartik Visweswaran <kartikv2@gmail.com>
 * @since 2.0
 */
class AppAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web/assets_b';
    public $css = [
        //'css/site.css',
    ];
	public $jsOptions = [
		'position' => \yii\web\View::POS_HEAD
	];
    public $js = [
        'js/GoobleControl.js',
        'js/GoobleView.js',
        'js/GooblePath.js',
        'js/GooblePoint.js',
        'js/GoobleIterator.js',
        'js/GoobleButtons.js',
        'js/GooblePanorama.js',
        'js/GoobleInclinationFilter.js',
        'js/ProgressBar.js',
        'js/BaseMeter.js',
        'js/Landmeter.js',
        'js/Speedometer.js',
    ];
    public $depends = [
        'yii\web\YiiAsset',
        //'yii\bootstrap\BootstrapAsset',
    ];
}