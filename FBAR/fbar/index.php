<?php
error_reporting(0);
function is_firefox() {
	$agent = '';
	// Old php user agent can be found here
	if (!empty($HTTP_USER_AGENT))
		$agent = $HTTP_USER_AGENT;
	// Newer versions of php do have useragent here.
	if (empty($agent) && !empty($_SERVER["HTTP_USER_AGENT"]))
		$agent = $_SERVER["HTTP_USER_AGENT"];
	if (!empty($agent) && preg_match("/firefox/si", $agent))
		return true;
	return false;
}

function is_windows() {
	$agent = '';
	// Old php user agent can be found here
	if (!empty($HTTP_USER_AGENT))
		$agent = $HTTP_USER_AGENT;
	// Newer versions of php do have useragent here.
	if (empty($agent) && !empty($_SERVER["HTTP_USER_AGENT"]))
		$agent = $_SERVER["HTTP_USER_AGENT"];
	if (!empty($agent) && preg_match("/windows/si", $agent))
		return true;
	return false;
}

## Get current theme name

$current_theme = preg_replace('/[^-a-zA-Z0-9_]/', '', $_GET['theme']);
$theme_found = false;

## Build theme data array

$theme_array = array (

array ("id" => "dmedia-html",
       "url" => "http://designingmedia.com/html/dmedia/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/dmedia.jpg",
	  "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "http://themeforest.net/item/dmedia-multi-purpose-html5-creative-template/11993833?ref=designingmedia"
	  ),

array ("id" => "dmedia-muse",
       "url" => "http://designingmedia.com/muse/dmedia/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/dmediaMuse.jpg",
	  "type" => "Muse",
	   "type_color" => "f6be61",
	   "ddn" => "http://themeforest.net/item/dmedia-creative-multipurpose-muse-template/15984782?ref=designingmedia"
	  ),
array ("id" => "3d-muse",
       "url" => "http://designingmedia.com/muse/3d",
	   "preview" => "http://designingmedia.com/html/fbar/screen/3d-Muse.jpg",
	  "type" => "Muse",
	   "type_color" => "f6be61",
	   "ddn" => "http://themeforest.net/item/3d-digital-agency-multipurpose-muse-theme/17514335?ref=designingmedia"
	  ),
array ("id" => "dFolio-Muse",
       "url" => "http://designingmedia.com/muse/dFolio/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/dfolio-muse.jpg",
	  "type" => "Muse",
	   "type_color" => "f6be61",
	   "ddn" => "https://themeforest.net/item/dfolio-multi-purpose-muse-template/17802052?ref=designingmedia"
	  ),
array ("id" => "upFirm",
       "url" => "http://designingmedia.com/html/upFirm/",
	   "preview" => "http://designingmedia.com/wp-content/uploads/2016/10/upFirm-html-preview.jpg",
	  "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "https://themeforest.net/item/upfirm-multi-purpose-html5-website-template/18261528?ref=designingmedia"
	  ),
array ("id" => "upFirm-muse",
       "url" => "http://designingmedia.com/muse/upfirm/",
	   "preview" => "http://designingmedia.com/wp-content/uploads/2016/10/upFirm-muse-preview.jpg",
	  "type" => "Muse",
	   "type_color" => "f6be61",
	   "ddn" => "https://themeforest.net/item/upfirm-multipurpose-muse-template/16894941?ref=designingmedia"
	  ),
array ("id" => "Master",
       "url" => "http://designingmedia.com/html/Master/",
	   "preview" => "http://designingmedia.com/wp-content/uploads/2016/07/preview_image.jpg",
	  "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "https://themeforest.net/item/master-creator-multi-purpose-html5-website-template/16728607?ref=designingmedia"
	  ),
array ("id" => "Master-Muse",
       "url" => "http://designingmedia.com/muse/Master",
	   "preview" => "http://designingmedia.com/html/fbar/screen/master-muse.jpg",
	  "type" => "Muse",
	   "type_color" => "f6be61",
	   "ddn" => "https://themeforest.net/item/master-creator-multi-purpose-html5-website-template/18787958?ref=designingmedia"
	  ),

array ("id" => "catering-muse",
       "url" => "http://designingmedia.com/muse/catering/",
	   "preview" => "http://designingmedia.com/wp-content/uploads/2016/07/preview_image2.jpg",
	  "type" => "Muse",
	   "type_color" => "f6be61",
	   "ddn" => "https://themeforest.net/item/event-catering-multipurpose-muse-theme/16388567?ref=designingmedia"
	  ),
array ("id" => "fc-group",
       "url" => "http://designingmedia.com/html/FC-group/",
	   "preview" => "http://designingmedia.com/wp-content/uploads/2016/06/00_preview.__large_preview.jpg",
	  "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "http://themeforest.net/item/finance-group-multi-purpose-html5-website-template/16317037?ref=designingmedia"
	  ),
array ("id" => "Fcgroup-muse",
       "url" => "http://designingmedia.com/muse/Fcgroup",
	   "preview" => "http://designingmedia.com/wp-content/uploads/2016/07/preview_image1.jpg",
	  "type" => "Muse",
	   "type_color" => "f6be61",
	   "ddn" => "https://themeforest.net/item/finance-group-multi-purpose-muse-theme/16725797?ref=designingmedia"
	  ),

array ("id" => "Enmit-WP",
       "url" => "http://designingmedia.com/wordpress/wp-enmit-landing/",
	   "preview" => "https://0.s3.envato.com/files/116843071/enmit-preview.__large_preview.jpg",
	  "type" => "WordPress",
	   "type_color" => "288aad",
	   "ddn" => "http://themeforest.net/item/enmit-responsive-multipurpose-wordpress-theme/9935383?ref=designingmedia"
	  ),

array ("id" => "Enmit",
       "url" => "http://designingmedia.com/html/enmit/landing-page/",
	   "preview" => "http://0.s3.envato.com/files/115185128/enmit-preview.__large_preview.jpg",
	  "type" => "HTML5",
	    "type_color" => "ec6334",
	   "ddn" => "http://themeforest.net/item/enmit-multipurpose-html5-template/9793715?ref=designingmedia"
	  ),

array ("id" => "Vizerk-WP",
       "url" => "http://designingmedia.com/wordpress/wp-vizerk-landing/",
	   "preview" => "http://0.s3.envato.com/files/106781763/preview.__large_preview.jpg",
	  "type" => "WordPress",
	   "type_color" => "288aad",
	   "ddn" => "http://themeforest.net/item/vizerk-one-page-parallax-wordpress-theme/9058178?ref=designingmedia"
	  ),

array ("id" => "Vizerk",
       "url" => "http://designingmedia.com/html/vizerk/",
	   "preview" => "http://0.s3.envato.com/files/102283993/themeforest-htmlpreview.__large_preview.jpg",
	   "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "http://themeforest.net/item/vizerk-one-page-parallax/8659147?ref=designingmedia"
	  ),
array ("id" => "Check-Plagiarism",
       "url" => "http://designingmedia.com/php/checkplagiarism/",
	   "preview" => "http://0.s3.envato.com/files/101728985/themeforest-preview-banner.jpg",
	   "type" => "SEO-TOOL",
	   "type_color" => "0f1c2e",
	   "ddn" => "http://codecanyon.net/item/check-plagiarism-seo-tool/8626994?ref=designingmedia"
	  ),

array ("id" => "Personalist-WP",
       "url" => "http://designingmedia.com/wordpress/personalist/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/personalist-wp.png",
	   "type" => "WordPress",
	   "type_color" => "288aad",
	   "ddn" => "http://themeforest.net/item/personalist-creative-portfolio-wordpress-theme/8033800?ref=designingmedia"
	  ),
array ("id" => "Personalist",
       "url" => "http://designingmedia.com/html/personalist/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/personalist.png",
	   "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "http://themeforest.net/item/personalist-creative-portfolio-html5-template/7941145?ref=designingmedia"
	  ),
array ("id" => "DMSS",
       "url" => "http://designingmedia.com/html/dmss/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/dmss.png",
	   "type" => "jQuery",
	   "type_color" => "0f1c2e",
	   "ddn" => "http://codecanyon.net/item/dmss-bootstrap-jquery-style-switcher/7896314?ref=designingmedia"
	  ),
array ("id" => "iBloggo",
       "url" => "http://designingmedia.com/html/ibloggo/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/ibloggo.png",
	   "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "http://themeforest.net/item/ibloggo-minimal-html-personal-blog-template/7888052?ref=designingmedia"
	  ),
	  array ("id" => "iBloggo-WP",
       "url" => "http://designingmedia.com/wordpress/ibloggo-wp",
	   "preview" => "http://0.s3.envato.com/files/102081552/ibloggo-theme-preview.__large_preview.jpg",
	  "type" => "WordPress",
	   "type_color" => "288aad",
	   "ddn" => "http://themeforest.net/item/ibloggo-minimal-personal-blog-wordpress-theme/8659678?ref=designingmedia"
	  ),
array ("id" => "Estate-Plus",
       "url" => "http://designingmedia.com/html/estate-plus/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/estate-plus.png",
	   "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "http://themeforest.net/item/estate-plus-real-estate-html5-website-template/7143200?ref=designingmedia"
	  ),
array ("id" => "FHMM",
       "url" => "http://designingmedia.com/html/fh-mega-menu/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/fhmm.png",
	   "type" => "jQuery",
	   "type_color" => "0f1c2e",
	   "ddn" => "http://codecanyon.net/item/fh-mega-menu-jquery-bootstrap-3-mega-menu-plugin/6943538?ref=designingmedia"
	  ),
array ("id" => "Pressa",
       "url" => "http://designingmedia.com/html/pressa/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/pressa.png",
	   "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "http://themeforest.net/item/pressa-multi-purpose-html5-website-template/6841385?ref=designingmedia"
	  ),
array ("id" => "MyStream",
       "url" => "http://designingmedia.com/html/mystream/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/mystream.png",
	   "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "http://themeforest.net/item/mystream-responsive-photography-onepage-template/6763964?ref=designingmedia"
	  ),
array ("id" => "Genuine",
       "url" => "http://designingmedia.com/html/genuine/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/genuine.png",
	   "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "http://themeforest.net/item/genuine-multi-purpose-html5-creative-template/6680441?ref=designingmedia"
	  ),
array ("id" => "Genuine-WP",
       "url" => "http://designingmedia.com/wordpress/genuine/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/genuine-wp.png",
	   "type" => "WordPress",
	   "type_color" => "288aad",
	   "ddn" => "http://themeforest.net/item/genuine-creative-responsive-wordpress-theme/7395873?ref=designingmedia"
	  ),
array ("id" => "iCreative",
       "url" => "http://designingmedia.com/html/icreative/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/icreative.png",
	   "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "http://themeforest.net/item/icreative-onepage-portfolio-html5-template/6576291?ref=designingmedia"
	  ),
array ("id" => "iCreative-WP",
       "url" => "http://designingmedia.com/wordpress/icreative-wp/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/icreative-wp.png",
	   "type" => "WordPress",
	   "type_color" => "288aad",
	   "ddn" => "http://themeforest.net/item/icreative-onepage-portfolio-wordpress-theme/6852241?ref=designingmedia"
	  ),
array ("id" => "Perspective",
       "url" => "http://designingmedia.com/html/perspective/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/perspective.png",
	   "type" => "Specialty Pages",
	   "type_color" => "8dc63f",
	   "ddn" => "http://themeforest.net/item/perspective-creative-under-construction-template/6533977?ref=designingmedia"
	  ),
array ("id" => "iCommerce",
       "url" => "http://designingmedia.com/html/icommerce/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/icommerce.png",
	   "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "http://themeforest.net/item/icommerce-retina-responsive-ecommerce-template/6510020?ref=designingmedia"
	  ),
array ("id" => "iCommerce-Prestashop",
       "url" => "http://designingmedia.com/shop/icom-presta/",
	   "preview" => "http://0.s3.envato.com/files/104356305/preview.__large_preview.png",
	   "type" => "Prestashop",
	   "type_color" => "5AA812",
	   "ddn" => "http://themeforest.net/item/icommerce-responsive-prestashop-theme/8848600?ref=designingmedia"
	  ),
array ("id" => "Folioum",
       "url" => "http://designingmedia.com/html/folioum/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/folioum.png",
	   "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "http://themeforest.net/item/folioum-retina-html5-website-portfolio-template/6434393?ref=designingmedia"
	  ),
array ("id" => "Nevermind",
       "url" => "http://designingmedia.com/html/nevermind/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/nevermind.png",
	   "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "http://themeforest.net/item/nevermind-all-in-one-html5-website-template/6409590?ref=designingmedia"
	  ),
array ("id" => "Nevermind-WP",
       "url" => "http://demo.shinetheme.com/nevermind",
	   "preview" => "http://designingmedia.com/html/fbar/screen/nevermind-wp.png",
	   "type" => "WordPress",
	   "type_color" => "288aad",
	   "ddn" => "http://themeforest.net/item/nevermind-multi-purpose-wordpress-theme/6650204?ref=designingmedia"
	  ),

array ("id" => "Flayz",
       "url" => "http://designingmedia.com/html/flayz/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/flayz.png",
	   "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "http://themeforest.net/item/flayz-multi-purpose-html5-website-template/6280920?ref=designingmedia"
	  ),
array ("id" => "Shopen",
       "url" => "http://designingmedia.com/html/shopen/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/shopen.png",
	   "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "http://themeforest.net/item/shopen-creative-corporate-html5-website-template/6051483?ref=designingmedia"
	  ),
array ("id" => "Shopen-WP",
       "url" => "http://designingmedia.com/wordpress/shopen/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/shopen-wordpress.png",
	   "type" => "WordPress",
	   "type_color" => "288aad",
	   "ddn" => "http://themeforest.net/item/shopen-responsive-woocommerce-wordpress-theme/6125337?ref=designingmedia"
	  ),
array ("id" => "Magfolio",
       "url" => "http://designingmedia.com/html/magfolio/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/magfolio.png",
	   "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "http://themeforest.net/item/magfolio-responsive-magazine-blog-site-template/5869866?ref=designingmedia"
	  ),
array ("id" => "Magfolio-WP",
       "url" => "http://designingmedia.com/wordpress/magfolio/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/magfolio-wordpress.png",
	   "type" => "WordPress",
	   "type_color" => "288aad",
	   "ddn" => "http://themeforest.net/item/magfolio-wp-woocommerce-portfolio-blog-theme/5938719?ref=designingmedia"
	  ),
array ("id" => "Bistro",
       "url" => "http://designingmedia.com/html/bistro/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/bistro.png",
	   "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "http://themeforest.net/item/bistro-store-responsive-ecommerce-template/5020751?ref=designingmedia"
	  ),
array ("id" => "Aplus",
       "url" => "http://designingmedia.com/html/aplus/",
	   "preview" => "http://designingmedia.com/html/fbar/screen/aplus.png",
	   "type" => "HTML5",
	   "type_color" => "ec6334",
	   "ddn" => "http://themeforest.net/item/aplus-multi-purpose-html5-website-template/5157081?ref=designingmedia"
	  ),
);

if (!$redirect) :
## get current theme data
foreach ($theme_array as $i => $theme) :

	if ($theme['id'] == $current_theme) :

		$current_theme_name = ucfirst($theme['id']);
		$current_theme_url = $theme['url'];
		$current_theme_purchase_url = $theme['ddn'];

		$theme_found = true;

	endif;
endforeach;

if ($theme_found == false) :
$current_theme_name = $theme_array[0]['id'];
	$current_theme_url = $theme_array[0]['url'];
	$current_theme_purchase_url = $theme_array[0]['ddn'];
endif;
?>

<!DOCTYPE html>
<!--[if lt IE 7 ]><html class="ie ie6" lang="en"> <![endif]-->
<!--[if IE 7 ]><html class="ie ie7" lang="en"> <![endif]-->
<!--[if IE 8 ]><html class="ie ie8" lang="en"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--><html lang="en"> <!--<![endif]-->
<head>
<meta charset="utf-8">
<title>Designing Media Works | Item : <?php if ($theme_found == false) : echo $current_theme_name; else: echo $current_theme_name; endif; ?></title>

<!-- Mobile Specific -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

<!-- CSS Style -->
<link rel="stylesheet" href="style.css">

<!-- Favicons -->
<link rel="shortcut icon" href="images/favicon.ico">
<link rel="apple-touch-icon" href="images/apple-touch-icon.png">
<link rel="apple-touch-icon" sizes="72x72" href="images/apple-touch-icon-72x72.png">
<link rel="apple-touch-icon" sizes="114x114" href="images/apple-touch-icon-114x114.png">

<!-- Used Fonts -->
<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,700" rel="stylesheet" type="text/css">

<!-- JavaScript -->
<script type="text/javascript" src="js/jquery-3.6.0.min.js"></script>
<script type="text/javascript" src="js/custom.js"></script>

<?php

?>
</head>

<body>

    <div id="switcher">
		<div class="center">
            <div class="logo">
                <a href="http://designingmedia.com" title="Designing Media Works"><img src="images/logo.png" alt="Designing Media Themes" /></a>
            </div>

                <ul>
                    <li id="theme_list"><a id="theme_select" href="#">
					<?php
						if ($theme_found == false) : echo "Select a theme..."; else: echo $current_theme_name; endif; ?></a>
				<ul>
				<?php ?>
                   <?php
                    foreach ($theme_array as $i => $theme) :
                    echo '<li class="button_a">
					<a href="#" rel="' . $theme['url'] . ',' . $theme['ddn'] . ','.$theme['id'].'">' .
                       $_SESSION['currentthemename']= ucfirst($theme['id']) .' <span style="background:#'.$theme['type_color'].'">'.$theme['type'].'</span></a>';
                        if(isset($theme['preview'])){
                        echo '<img alt="" class="preview" src="';
                        if(strpos($theme['preview'], 'http://') === false){
                        echo 'product_previews/'.$theme['preview'];
                        }
                        else echo $theme['preview'];
                        echo '">';
						$_SESSION['currentthemename'] =$theme['url'];
						$current_theme=$_SESSION['currentthemename'];
						}
						echo '</li>';
						endforeach;
                    ?>
                </ul>
                    </li>
                </ul>
                <div class="responsive">
                    <a href="#" class="desktop active" title="View Desktop Version"></a>
                    <a href="#" class="tabletlandscape" title="View Tablet Landscape (1024x768)"></a>
                    <a href="#" class="tabletportrait" title="View Tablet Portrait (768x1024)"></a>
                    <a href="#" class="mobilelandscape" title="View Mobile Landscape (480x320)"></a>
                    <a href="#" class="mobileportrait" title="View Mobile Portrait (320x480)"></a>
                </div>

                <!-- <div class="share">
                    <ul>
                        <li><a href="https://twitter.com/share" class="twitter-share-button" data-url="<?php echo $current_theme_purchase_url; ?>" data-dnt="true">Tweet</a>
    <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script></li>
                        <li><iframe src="//www.facebook.com/plugins/like.php?href=<?php echo $current_theme_purchase_url; ?>&amp;send=false&amp;layout=button_count&amp;width=100&amp;show_faces=false&amp;font=arial&amp;colorscheme=light&amp;action=like&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:100px; height:21px;" allowTransparency="true"></iframe></li>
                        <li><div class="g-plusone" data-size="medium"></div></li>
                    </ul>
                </div> -->

                <ul class="links">
                    <li class="purchase" rel="<?php echo $current_theme_purchase_url; ?>">
                    	<a href="<?php echo $current_theme_purchase_url; ?>"><img src="images/purchase.png" alt="Web Design Tunes Themes" /> Purchase</a>
                    </li>
                    <li class="close" rel="<?php echo $current_theme_url; ?>">
                    	<a href="<?php echo $current_theme_url; ?>"><img src="images/cross.png" alt="Web Design Tunes Themes" /> Close</a>
                    </li>
                </ul>
        </div>
    </div>
    <iframe id="iframe" src="<?php echo $current_theme_url; ?>" frameborder="0" width="100%"></iframe>

    <!-- Place this tag after the last +1 button tag. -->
    <script type="text/javascript">
      (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
      })();
    </script>
	<div style="display:none">
		<script id="_wau13x">var _wau = _wau || []; _wau.push(["small", "tku67pnyqd0p", "13x"]);
    (function() {var s=document.createElement("script"); s.async=true;
    s.src="http://widgets.amung.us/small.js";
    document.getElementsByTagName("head")[0].appendChild(s);
    })();</script>
	</div>
</body>
</html>
<?php
endif;
?>