<?php header('Content-Type: text/html; charset=UTF-8');?>
<!DOCTYPE html
PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<?

    /**
     * This generates static HTML to copy and paste into a CMS. This script is NOT mean to run live.
     */

    ini_set('display_errors', 'On'); error_reporting(E_ALL);
    $INTERACTIVE_NAME = 'travolta';
    $MIN = false;
    $PATH = '';
        //$PATH = 'http://slate.com/features/2014/03/travolta/';
        //$PATH = '/features/2014/03/travolta/';
    //$LIB_PATH = 'http://www.slate.com/features/2013/lib/';
?>
<html><head>
    <link type="text/css" href="http://slate-static-prod.s3.amazonaws.com/etc/designs/slate/css/article.56c8e5b1.css" rel="stylesheet" media="screen" />
    <link type="text/css" href="http://slate-static-prod.s3.amazonaws.com/etc/designs/slate/css/screen.d41d8cd9.css" rel="stylesheet" media="screen" />
    <script type="text/javascript" src="lib/jquery-1.8.2.min.js"></script>
    <title><? echo $INTERACTIVE_NAME?></title></head><body style="width:588px">
    <div id="fb-root"></div><script>window.fbAsyncInit = function(){FB.init({appId:'172274439518228',status:true,xfbml:true});};(function(d, s, id){var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) {return;}js = d.createElement(s); js.id = id;js.src = "//connect.facebook.net/en_US/all.js";fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'facebook-jssdk'));</script>

    <!-- paste into RenderHTML-->
    <!--header scripts-->
    <script type="text/javascript" src="<?=$PATH?>lib/seedrandom-compatibility.js"></script>
    <?='<script type="text/javascript">'?>
        //<![CDATA[
        // Code by Chris Kirk, Interactives Editor, Slate.com. cperryk.com
        (function(){
        <?=file_get_contents('names.js')?>;
        <?=file_get_contents($INTERACTIVE_NAME.($MIN?'.min':'').'.js');?>
        }())
        //]]>
    <?='</script>'?>
    <style type="text/css"><?=str_replace("url(","url(".$PATH,file_get_contents($INTERACTIVE_NAME.($MIN?'.min':'').'.css'));?></style>

    <div id="int">
        <div id="frame_1">
            <p class="int_top_title">Travoltify Your Name</p>
            <div class="inputs">
                <div class="input_label">Name: </div><input class="unedited int_input" type="text" id="input_name" value="e.g. John Smith" maxlength="30"/>
            </div>
            <div id="btn_generate">Do It!</div>
        </div>
        <div id="frame_2">
            <p class="your_card_is">"<span class="real_name_here btn_edit"></span>" Travoltified is...</p>
            <div class="results_box">
                <table><tr><td>
                    <img src="<?=$PATH?>graphics/travolta2.jpg"/>
                    <span class="name_here"></span>
                </td></tr></table>
            </div>
            <div id="bottom_btns">
                <div class="btn_edit btn_share"><img src="<?=$PATH?>graphics/pencil.png" class="btn_share_icon"/><span class="btn_label">New Name</span></div>
                <div id="btn_fb_share" class="btn_share"><img src="<?=$PATH?>graphics/fb_icon.png" class="btn_share_icon"/>Share Name</div>
                <div id="btn_tw_share" class="btn_share"><img src="<?=$PATH?>graphics/twitter_icon.png" class="btn_share_icon"/>Tweet Name</div>
                <div id="btn_email_share" class="btn_share"><img src="<?=$PATH?>graphics/email.png" class="btn_share_icon"/>Email Name</div>
            </div>
        </div>

    </div><!--end interactive -->
    
</body></html>