<?php
/* $Id: peer.php 147 2013-10-03 14:50:17Z ragno $ */
/*
 * This program is free software; you can redistribuite it and/or modify it 
 * under the terms of the GNU/General Pubblic License as published the Free software Foundation; 
 * either version 3 of the License, or (at your opinion) any later version
 */

//speed rx
//$remoteHost="127.0.0.1"; //localhost for simulation
$remoteHost = "172.16.1.125"; //SCUOLA
//$remoteHost = "46.255.82.123"; //SALABORSA
$localPort = 20000; //local port
$remotePort = 20000; //remote port


echo "starting server\n";
$socket = @socket_create(AF_INET, SOCK_DGRAM, getprotobyname('udp'));
if ($socket == FALSE) {
    die(socket_strerror(socket_last_error($socket)));
}
echo "socket created\n";
$bound = @socket_bind($socket, "0.0.0.0", $localPort);
if ($bound == FALSE) {
    die(socket_strerror(socket_last_error($socket)));
}
echo "socket bound to port \n";
while (true) {
    sleep(1);

    //get connetion object from dbms
    $connDb = new mysqli('localhost', 'root', '123456', 'gooble');
    //query info to connection object
    $result = $connDb->query("SELECT * FROM inclination LIMIT 1");
    //get info object from result
    $info = $result->fetch_object();
    //get elevation field from result object
    $elv = $info->inc_value;
    //format to four digits                 
    // $format = "%1$04d\r\n";
    // $msg=sprintf($format, $elv);

    $msg = sprintf("%1$02d\r\n", $elv);
    $ris = socket_sendto($socket, $msg, strlen($msg), 0, $remoteHost, $remotePort);
    if ($ris == false) {
        echo "error\n";
    }
	//receive from controller
	$ris=socket_recvfrom($socket, $speed, 3, MSG_DONTWAIT, $remoteHost, $remotePort);
    if ($ris == false) {
        echo "error\n";
    }
	$result=$connDb->query("UPDATE speed SET speed_value = $speed LIMIT 1");
}
socket_close($socket);
echo "shutdown\n";
?>
