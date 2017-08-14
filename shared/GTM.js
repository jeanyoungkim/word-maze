(function(){
// Container IDs:
// Dev: "GTM-5Q6QK3"
// Prod: "GTM-P528B3"

var onProd = window.location.href.includes('nytimes.com')
var containerID = onProd ? "GTM-P528B3" : "GTM-5Q6QK3"
var gtmConfig = {
  container: containerID, // GTM Container ID
  dataLayer: "" //override dataLayer name
},
pageDataConfig = {
  event: "pageDataReady",
  application: {
      name: "games-crosswords" // set the sourceApp here
  }
  //Add any other data here
};

// Google Tag Manager
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script',gtmConfig.dataLayer||'dataLayer',gtmConfig.container);
// End Google Tag Manager

// Request Data from TAGX API and push to GTM
!function(e,t){var r={host:document.location.href.indexOf(".stg.")>-1?"tagx.stg.use1.nytimes.com":
"tagx.nytimes.com",referrer:document.referrer,assetUrl:document.location.href},n=new XMLHttpRequest;
n.withCredentials=!0,n.open("GET","https://"+r.host+"/api/v1/dlo/?sourceApp="+e.application.name+
"&referrer="+r.referrer+"&assetUrl="+r.assetUrl,!0),n.onload=function(){var r=JSON.parse(n.responseText);
r.event="userDataReady",window[t].push(r),window[t].push(e)},n.addEventListener("error",
function(){window[t].push(e)}),n.send()}(pageDataConfig,gtmConfig.dataLayer||"dataLayer");
// End Request Data from TAGX API and push to GTM
})();
