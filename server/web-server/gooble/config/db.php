<?php
if (file_exists(dirname(__FILE__)."/db.produzione.php")){
  return require dirname(__FILE__)."/db.produzione.php";
}

return [
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:host=localhost;dbname=gooble',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8',
];