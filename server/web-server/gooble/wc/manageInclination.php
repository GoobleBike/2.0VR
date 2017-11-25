<?php
/*
 * This program is free software; you can redistribuite it and/or modify it 
 * under the terms of the GNU/General Pubblic License as published the Free software Foundation; 
 * either version 3 of the License, or (at your opinion) any later version
 */

$myConnection = new mysqli('localhost', 'root', '123456', 'gooble');
$myConnection->query("UPDATE `inclination` 
SET  `inc_value` =  '" . $_REQUEST['value'] . "' 
");

echo $_REQUEST['value'];
?>
