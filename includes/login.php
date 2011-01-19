<?php
//get the posted values
$username=htmlspecialchars($_POST['username'],ENT_QUOTES);
$password=md5($_POST['password']);
// load xml to get requested data of user
// perform an xpath search
// if search for user matches noone, return '0'
// otherwise check password field and return ok if everything goes right

echo 'fail';
?>
