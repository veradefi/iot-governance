<?php
$ch = curl_init();
$uri=$_SERVER['REQUEST_URI'];

if (preg_match('/.js/',$uri)) {
	header('Content-Type: application/javascript');
}
$url = 'http://localhost:8080' . $uri;
if (preg_match('/rpc/',$uri)) {
	$url = 'http://localhost:8545'; # . $uri;
	$json = file_get_contents("php://input");
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
	curl_setopt($ch, CURLOPT_PORT, 8545);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_URL,$url);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
	curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json']);
} else {
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_URL,$url);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
}
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
echo curl_exec($ch);
curl_close($ch);
?>
