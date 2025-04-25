<?php 
global $redirect, $current_theme;
$redirect = true;
require("index.php");
?>
<!DOCTYPE HTML>
<html>
<head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title></title> 
        <script type="text/javascript">
		// DONT FORGET TO CHANGE http://designingmedia.com/html/fbar to http://yoursite.com/fbar/
		top.location.href = 'http://designingmedia.com/html/fbar/?theme=<?php echo $current_theme; ?>';
        </script>     
</head>
<body>

</body>
</html>