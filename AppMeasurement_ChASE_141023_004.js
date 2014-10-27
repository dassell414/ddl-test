s = new AppMeasurement();

var s_account = "nationwidedev1";  //  BTL - logic TBD
s.account = s_account || "";

/* WARNING: Changing any of the below variables will cause drastic
changes to how your visitor data is collected. Changes should only be
made when instructed to do so by your account manager.*/
s.visitorNamespace="nationwide";
s.trackingServer="metrics.nationwide.co.uk";
s.trackingServerSecure="smetrics.nationwide.co.uk";
s.linkTrackVars="None";
s.linkTrackEvents="None";

//	Internal version number representing internal customised version of code
s.appMeasurementVersion="1.4.1_20141023";

s.cookieDomainPeriods = "3";
s.fpCookieDomainPeriods = "3";
s.currencyCode = "GBP";
s.channel="ChASE";  //  BTL - TBD

//	Exit link tracking
s.trackExternalLinks=true;

	//  BTL - latest setting?
s.linkInternalFilters="local,cms,tel:,javascript:,nationwide.co.uk,nationet.com,axa-directcp.co.uk,landg.com,onlineips.co.uk,nationwideannuityservice.co.uk,u-k-i-insurance.com,lvgirqp.co.uk,kampyle.com/feedback_form";
s.linkLeaveQueryString=false;

//	Download link tracking
s.trackDownloadLinks=true;
s.linkDownloadFileTypes="exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx,dmg";

//	The Web Analytics Team's functions
//  BTL - this (and other cookie-related stuff - search for "navigation") is related to Nav Tracking - TBD
	var nwa = {};
	nwa.cookieExpire = function(n) {
        return s.Util.cookieWrite(n, "", -1)
    }

/* Plugin Config */
s.usePlugins=true;
s.s_doPlugins = function(s) {
	/* Add calls to plugins here */
	
	//  BTL - delete as prefix is pre-specified
	//	Prefix s.pageName with "ynw:" (if it doesn't already contain that string)
	/*
	if (s.pageName)	{
		sPfx = "ynw:";
		sPg = sPfx + s.pageName;
		bPfx = s.pageName.indexOf(sPfx) > -1;
		s.pageName = bPfx ? s.pageName : sPg;		//	IF/ELSE
	}
	*/
	
	//	Capture vertical pixels viewed
	var ppvArray = s.getPercentPageViewed(s.pageName); 
	s.prop75 = ppvArray[3];

	//	Capture previous page name value
	s.prop19=s.getPreviousValue(s.pageName,'gpv_p19','');

	//	Capture internal code version number
	if(s.appMeasurementVersion){s.prop41=s.appMeasurementVersion;} else {s.prop41='unknown';}

	//	Capture Exact Target params
	s.pageURL = s.pageURL || document.location.href;
	s.campaign = s.Util.getQueryParam("et_cid", s.pageURL.toLowerCase());	//	campaign ID
	s.eVar33 = s.Util.getQueryParam("et_rid", s.pageURL.toLowerCase());		//	recipient ID
	
	//	Link-tracking enhanced code
	if (s.linkType)
	{
		s.linkTrackVars = (s.linkTrackVars == "None") ? "prop70" : s.apl(s.linkTrackVars,"prop70",",",2);

			s.linkTrackVars = s.apl(s.linkTrackVars,"prop69",",",2);
			s.linkTrackVars = s.apl(s.linkTrackVars,"prop73",",",2);

			s.prop70="D=pageName";

			//sets prop69 to either pev1 or pev2 prefixed with a value to indicate link type
			switch(s.linkType){
				case 'd':
				s.prop69 = 'D="d|"+pev1';
				break;

				case 'e':
				s.prop69 = 'D="e|"+pev1';
				break;

				case 'o':
				s.prop69 = 'D="o|"+pev2';
				break;
			}
    } else if (!s.linkType) {
        s.prop70 = "";
        s.prop69 = "";
        s.linkTrackVars = "None";
	}

	//	Pick up "navigation-tracking" cookie value from previous page
	s.contextData['navigation'] = s.Util.cookieRead("navigation");
	nwa.cookieExpire("navigation");

	//	Pick up "deferred" event from previous page (e.g., search result click-through (event100))
	var deferredVariables = s.Util.cookieRead("deferred");
	var item = s.split(deferredVariables,":");
	s[item[0]]=s.apl(s[item[0]],item[1],',',1);
	nwa.cookieExpire("deferred");

	//	Sub-section		eVar	prop
	//	Sub-section 1	eVar17	prop21
	if(s.prop21&&!s.eVar17)s.eVar17 = "D=c21";
	//	Sub-section 2	eVar18	prop22
	if(s.prop22&&!s.eVar18)s.eVar18 = "D=c22";
	//	Sub-section 3	eVar19	prop23
	if(s.prop23&&!s.eVar19)s.eVar19 = "D=c23";

	//	Visitor ID
	s.prop71 = "D=s_vi";

}
s.doPlugins=s.s_doPlugins;

//	Parse DDL
var dprop;  //  declare variable for processing DDL

//	set variables that will always be passed
var wa_std = function() {

	if ( typeof (digitalData) != 'undefined' ) {
		try { if ( dprop = digitalData.page.pageInfo.pageName ) { s.contextData['page.pageInfo.pageName'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.page.pageInfo.nbs_page_responsive_state ) { s.contextData['page.pageInfo.nbs_page_responsive_state'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.page.pageInfo.nbs_page_responsive_orientation ) { s.contextData['page.pageInfo.nbs_page_responsive_orientation'] = dprop;}} catch(e) {};
	}
}

//	set variables that will be passed with 'page view'
var wa_view = function() {
	if ( typeof (digitalData) != 'undefined'  ) {
		//	get 'standard' variables
		wa_std();
	
		try { if ( dprop = digitalData.page.category.primaryCategory ) { s.contextData['page.category.primaryCategory'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.page.category.nbs_sub_category_1 ) { s.contextData['page.category.nbs_sub_category_1'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.page.category.nbs_sub_category_2 ) { s.contextData['page.category.nbs_sub_category_2'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.page.category.nbs_sub_category_3 ) { s.contextData['page.category.nbs_sub_category_3'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_application_module.nbs_resumed_application_flag ) { s.contextData['nbs_application_module.nbs_resumed_application_flag'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_application_module.nbs_resumed_application_initial_page ) { s.contextData['nbs_application_module.nbs_resumed_application_initial_page'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_application_module.nbs_resumed_application_last_save_date ) { s.contextData['nbs_application_module.nbs_resumed_application_last_save_date'] = dprop;}} catch(e) {};
		dprop = digitalData.nbs_error_user;  for (dind in dprop) { if ( dprop[dind] ) { s.contextData['nbs_error_user_' + dind] = dprop[dind]; } }
		dprop = digitalData.nbs_error_user;  for (dind in dprop) { if ( dprop[dind] ) { s.contextData['nbs_error_user_' + dind] = dprop[dind]; } }
		dprop = digitalData.nbs_error_system;  for (dind in dprop) { if ( dprop[dind] ) { s.contextData['nbs_error_system_' + dind] = dprop[dind]; } }
		dprop = digitalData.nbs_error_system;  for (dind in dprop) { if ( dprop[dind] ) { s.contextData['nbs_error_system_' + dind] = dprop[dind]; } }
		dprop = digitalData.nbs_error_business;  for (dind in dprop) { if ( dprop[dind] ) { s.contextData['nbs_error_business_' + dind] = dprop[dind]; } }
		dprop = digitalData.nbs_error_business;  for (dind in dprop) { if ( dprop[dind] ) { s.contextData['nbs_error_business_' + dind] = dprop[dind]; } }
		try { if ( dprop = digitalData.nbs_product.nbs_product_type ) { s.contextData['nbs_product.nbs_product_type'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_savings.nbs_sav_name ) { s.contextData['nbs_product_savings.nbs_sav_name'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_savings.nbs_sav_offer ) { s.contextData['nbs_product_savings.nbs_sav_offer'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_savings.nbs_sav_offer_bonusrate ) { s.contextData['nbs_product_savings.nbs_sav_offer_bonusrate'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_savings.nbs_sav_offer_withdrawals ) { s.contextData['nbs_product_savings.nbs_sav_offer_withdrawals'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_savings.nbs_sav_fee_annual ) { s.contextData['nbs_product_savings.nbs_sav_fee_annual'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_savings.nbs_sav_fee_monthly ) { s.contextData['nbs_product_savings.nbs_sav_fee_monthly'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_customer_number ) { s.contextData['nbs_user.nbs_user_customer_number'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_customer_status ) { s.contextData['nbs_user.nbs_user_customer_status'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_address_type ) { s.contextData['nbs_user.nbs_user_address_type'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_postcode ) { s.contextData['nbs_user.nbs_user_postcode'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_bfpo_number ) { s.contextData['nbs_user.nbs_user_bfpo_number'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_gender ) { s.contextData['nbs_user.nbs_user_gender'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_dateofbirth ) { s.contextData['nbs_user.nbs_user_dateofbirth'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_city ) { s.contextData['nbs_user.nbs_user_city'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_income ) { s.contextData['nbs_user.nbs_user_income'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_savings.nbs_sav_application_product_type ) { s.contextData['nbs_app_savings.nbs_sav_application_product_type'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_savings.nbs_sav_application_type ) { s.contextData['nbs_app_savings.nbs_sav_application_type'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_savings.nbs_sav_application_route ) { s.contextData['nbs_app_savings.nbs_sav_application_route'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_savings.nbs_sav_application_id ) { s.contextData['nbs_app_savings.nbs_sav_application_id'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_savings.nbs_sav_application_starting_date ) { s.contextData['nbs_app_savings.nbs_sav_application_starting_date'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_savings.nbs_sav_initial_deposit_selected ) { s.contextData['nbs_app_savings.nbs_sav_initial_deposit_selected'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_savings.nbs_sav_initial_deposit_amt ) { s.contextData['nbs_app_savings.nbs_sav_initial_deposit_amt'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_savings.nbs_sav_initial_deposit_bank ) { s.contextData['nbs_app_savings.nbs_sav_initial_deposit_bank'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_savings.nbs_sav_paperless_selected ) { s.contextData['nbs_app_savings.nbs_sav_paperless_selected'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_savings.nbs_sav_application_continuation ) { s.contextData['nbs_app_savings.nbs_sav_application_continuation'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_savings.nbs_sav_econtracting_eligible ) { s.contextData['nbs_app_savings.nbs_sav_econtracting_eligible'] = dprop;}} catch(e) {};
	}
	
	//	Make the call ...
	s.t();

	//	... dump to Console for validation ...
	try{ 
		console.log(JSON.stringify(s.contextData, null, '\t')); 
	} catch(e) { 
		msg = "Error showing DDL: " + e + "\n" + "Activate console or developer tools." + "\n" + JSON.stringify(s.contextData, null, '\t'));
		alert(msg);
	}
	
	//  ... and reset everything
//	s.contextData = '';
	dprop = '';
}

//	set variables that will be passed with 'action' (i.e. link-tracking)
var wa_action = function(evtNm) {
	if ( typeof (digitalData) != 'undefined'  ) {
		//	get 'standard' variables
		wa_std();
		
		dprop = digitalData.nbs_user_input;  for (dind in dprop) { if ( dprop[dind] ) { s.contextData['nbs_user_input_' + dind] = dprop[dind]; } }
		dprop = digitalData.nbs_user_input;  for (dind in dprop) { if ( dprop[dind] ) { s.contextData['nbs_user_input_' + dind] = dprop[dind]; } }
		dprop = digitalData.nbs_user_input;  for (dind in dprop) { if ( dprop[dind] ) { s.contextData['nbs_user_input_' + dind] = dprop[dind]; } }
		dprop = digitalData.nbs_user_input;  for (dind in dprop) { if ( dprop[dind] ) { s.contextData['nbs_user_input_' + dind] = dprop[dind]; } }
		dprop = digitalData.nbs_document_viewed;  for (dind in dprop) { if ( dprop[dind] ) { s.contextData['nbs_document_viewed_' + dind] = dprop[dind]; } }
		dprop = digitalData.nbs_document_viewed;  for (dind in dprop) { if ( dprop[dind] ) { s.contextData['nbs_document_viewed_' + dind] = dprop[dind]; } }
		dprop = digitalData.nbs_system_response;  for (dind in dprop) { if ( dprop[dind] ) { s.contextData['nbs_system_response_' + dind] = dprop[dind]; } }
		dprop = digitalData.nbs_system_response;  for (dind in dprop) { if ( dprop[dind] ) { s.contextData['nbs_system_response_' + dind] = dprop[dind]; } }
		dprop = digitalData.nbs_system_response;  for (dind in dprop) { if ( dprop[dind] ) { s.contextData['nbs_system_response_' + dind] = dprop[dind]; } }
		dprop = digitalData.nbs_element_interaction;  for (dind in dprop) { if ( dprop[dind] ) { s.contextData['nbs_element_interaction_' + dind] = dprop[dind]; } }
		dprop = digitalData.nbs_element_interaction;  for (dind in dprop) { if ( dprop[dind] ) { s.contextData['nbs_element_interaction_' + dind] = dprop[dind]; } }
	}
	
	//	Make the call ...
	s.tl(true, 'o', evtNm);

	//	... dump to Console for validation ...
	alert(JSON.stringify(s.contextData));
	
	//  ... and reset everything
//	s.contextData = '';
	dprop = '';
}

/* References to plugins here */
/*
* Utility Function: split v1.5 - split a string (JS 1.0 compatible)
*/
s.split=new Function("l","d",""
+"var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x"
+"++]=l.substring(0,i);l=l.substring(i+d.length);}return a");

/*
* Plugin: getPercentPageViewed v1.4
*/
s.handlePPVevents=new Function("",""
+"if(!s.getPPVid)return;var dh=Math.max(Math.max(s.d.body.scrollHeigh"
+"t,s.d.documentElement.scrollHeight),Math.max(s.d.body.offsetHeight,"
+"s.d.documentElement.offsetHeight),Math.max(s.d.body.clientHeight,s."
+"d.documentElement.clientHeight)),vph=s.w.innerHeight||(s.d.documen"
+"tElement.clientHeight||s.d.body.clientHeight),st=s.w.pageYOffset||"
+"(s.d.documentElement.scrollTop||s.d.body.scroll"
+"Top),vh=st+vph,pv=Math.min(Math.round(vh/dh*100),100),c=s.c_r('s_pp"
+"v'),a=(c.indexOf(',')>-1)?c.split(',',4):[],id=(a.length>0)?(a[0]):"
+"escape(s.getPPVid),cv=(a.length>1)?parseInt(a[1]):(0),p0=(a.length>"
+"2)?parseInt(a[2]):(pv),cy=(a.length>3)?parseInt(a[3]):(0),cn=(pv>0)"
+"?(id+','+((pv>cv)?pv:cv)+','+p0+','+((vh>cy)?vh:cy)):'';s.c_w('s_pp"
+"v',cn);");
s.getPercentPageViewed=new Function("pid",""
+"pid=pid?pid:'-';var s=this,ist=!s.getPPVid?true:false;if(typeof(s.l"
+"inkType)!='undefined'&&s.linkType!='e')return'';var v=s.c_r('s_ppv'"
+"),a=(v.indexOf(',')>-1)?v.split(',',4):[];if(a.length<4){for(var i="
+"3;i>0;i--){a[i]=(i<a.length)?(a[i-1]):('');}a[0]='';}a[0]=unescape("
+"a[0]);s.getPPVpid=pid;s.c_w('s_ppv',escape(pid));if(ist){s.getPPVid"
+"=(pid)?(pid):(s.pageName?s.pageName:document.location.href);s.c_w('"
+"s_ppv',escape(s.getPPVid));if(s.w.addEventListener){s.w.addEventL"
+"istener('load',s.handlePPVevents,false);s.w.addEventListener('scro"
+"ll',s.handlePPVevents,false);s.w.addEventListener('resize',s.handl"
+"ePPVevents,false);}else if(s.w.attachEvent){s.w.attachEvent('onlo"
+"ad',s.handlePPVevents);s.w.attachEvent('onscroll',s.handlePPVevent"
+"s);s.w.attachEvent('onresize',s.handlePPVevents);}}return(pid!='-'"
+")?(a):(a[1]);");


/*
* Plugin: getPreviousValue_v1.0 - return previous value of designated
* variable (requires split utility)
*/
s.getPreviousValue=new Function("v","c","el",""
+"var s=this,t=new Date,i,j,r='';t.setTime(t.getTime()+1800000);if(el"
+"){if(s.events){i=s.split(el,',');j=s.split(s.events,',');for(x in i"
+"){for(y in j){if(i[x]==j[y]){if(s.c_r(c)) r=s.c_r(c);v?s.c_w(c,v,t)"
+":s.c_w(c,'no value',t);return r}}}}}else{if(s.c_r(c)) r=s.c_r(c);v?"
+"s.c_w(c,v,t):s.c_w(c,'no value',t);return r}");

//Plugin Utility: apl v1.1
s.apl=new Function("l","v","d","u","var s=this,m=0;if(!l)l='';if(u){var i,n,a=s.split(l,d);for(i=0;i<a.length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCase()));}}if(!m)l=l?l+d+v:v;return l");

/*
 ============== DO NOT ALTER ANYTHING BELOW THIS LINE ! ===============

 AppMeasurement for JavaScript version: 1.4.1
 Copyright 1996-2013 Adobe, Inc. All Rights Reserved
 More info available at http://www.omniture.com
*/
function AppMeasurement(){var s=this;s.version="1.4.1";var w=window;if(!w.s_c_in)w.s_c_il=[],w.s_c_in=0;s._il=w.s_c_il;s._in=w.s_c_in;s._il[s._in]=s;w.s_c_in++;s._c="s_c";var k=w.sb;k||(k=null);var m=w,i,o;try{i=m.parent;for(o=m.location;i&&i.location&&o&&""+i.location!=""+o&&m.location&&""+i.location!=""+m.location&&i.location.host==o.host;)m=i,i=m.parent}catch(p){}s.eb=function(s){try{console.log(s)}catch(a){}};s.ta=function(s){return""+parseInt(s)==""+s};s.replace=function(s,a,c){if(!s||s.indexOf(a)<
0)return s;return s.split(a).join(c)};s.escape=function(b){var a,c;if(!b)return b;b=encodeURIComponent(b);for(a=0;a<7;a++)c="+~!*()'".substring(a,a+1),b.indexOf(c)>=0&&(b=s.replace(b,c,"%"+c.charCodeAt(0).toString(16).toUpperCase()));return b};s.unescape=function(b){if(!b)return b;b=b.indexOf("+")>=0?s.replace(b,"+"," "):b;try{return decodeURIComponent(b)}catch(a){}return unescape(b)};s.Va=function(){var b=w.location.hostname,a=s.fpCookieDomainPeriods,c;if(!a)a=s.cookieDomainPeriods;if(b&&!s.cookieDomain&&
!/^[0-9.]+$/.test(b)&&(a=a?parseInt(a):2,a=a>2?a:2,c=b.lastIndexOf("."),c>=0)){for(;c>=0&&a>1;)c=b.lastIndexOf(".",c-1),a--;s.cookieDomain=c>0?b.substring(c):b}return s.cookieDomain};s.c_r=s.cookieRead=function(b){b=s.escape(b);var a=" "+s.d.cookie,c=a.indexOf(" "+b+"="),e=c<0?c:a.indexOf(";",c);b=c<0?"":s.unescape(a.substring(c+2+b.length,e<0?a.length:e));return b!="[[B]]"?b:""};s.c_w=s.cookieWrite=function(b,a,c){var e=s.Va(),d=s.cookieLifetime,f;a=""+a;d=d?(""+d).toUpperCase():"";c&&d!="SESSION"&&
d!="NONE"&&((f=a!=""?parseInt(d?d:0):-60)?(c=new Date,c.setTime(c.getTime()+f*1E3)):c==1&&(c=new Date,f=c.getYear(),c.setYear(f+5+(f<1900?1900:0))));if(b&&d!="NONE")return s.d.cookie=b+"="+s.escape(a!=""?a:"[[B]]")+"; path=/;"+(c&&d!="SESSION"?" expires="+c.toGMTString()+";":"")+(e?" domain="+e+";":""),s.cookieRead(b)==a;return 0};s.C=[];s.B=function(b,a,c){if(s.ma)return 0;if(!s.maxDelay)s.maxDelay=250;var e=0,d=(new Date).getTime()+s.maxDelay,f=s.d.qb,g=["webkitvisibilitychange","visibilitychange"];
if(!f)f=s.d.rb;if(f&&f=="prerender"){if(!s.X){s.X=1;for(c=0;c<g.length;c++)s.d.addEventListener(g[c],function(){var a=s.d.qb;if(!a)a=s.d.rb;if(a=="visible")s.X=0,s.delayReady()})}e=1;d=0}else c||s.q("_d")&&(e=1);e&&(s.C.push({m:b,a:a,t:d}),s.X||setTimeout(s.delayReady,s.maxDelay));return e};s.delayReady=function(){var b=(new Date).getTime(),a=0,c;for(s.q("_d")&&(a=1);s.C.length>0;){c=s.C.shift();if(a&&!c.t&&c.t>b){s.C.unshift(c);setTimeout(s.delayReady,parseInt(s.maxDelay/2));break}s.ma=1;s[c.m].apply(s,
c.a);s.ma=0}};s.setAccount=s.sa=function(b){var a,c;if(!s.B("setAccount",arguments))if(s.account=b,s.allAccounts){a=s.allAccounts.concat(b.split(","));s.allAccounts=[];a.sort();for(c=0;c<a.length;c++)(c==0||a[c-1]!=a[c])&&s.allAccounts.push(a[c])}else s.allAccounts=b.split(",")};s.foreachVar=function(b,a){var c,e,d,f,g="";d=e="";if(s.lightProfileID)c=s.H,(g=s.lightTrackVars)&&(g=","+g+","+s.ba.join(",")+",");else{c=s.c;if(s.pe||s.linkType)if(g=s.linkTrackVars,e=s.linkTrackEvents,s.pe&&(d=s.pe.substring(0,
1).toUpperCase()+s.pe.substring(1),s[d]))g=s[d].pb,e=s[d].ob;g&&(g=","+g+","+s.z.join(",")+",");e&&g&&(g+=",events,")}a&&(a=","+a+",");for(e=0;e<c.length;e++)d=c[e],(f=s[d])&&(!g||g.indexOf(","+d+",")>=0)&&(!a||a.indexOf(","+d+",")>=0)&&b(d,f)};s.J=function(b,a,c,e,d){var f="",g,j,w,q,i=0;b=="contextData"&&(b="c");if(a){for(g in a)if(!Object.prototype[g]&&(!d||g.substring(0,d.length)==d)&&a[g]&&(!c||c.indexOf(","+(e?e+".":"")+g+",")>=0)){w=!1;if(i)for(j=0;j<i.length;j++)g.substring(0,i[j].length)==
i[j]&&(w=!0);if(!w&&(f==""&&(f+="&"+b+"."),j=a[g],d&&(g=g.substring(d.length)),g.length>0))if(w=g.indexOf("."),w>0)j=g.substring(0,w),w=(d?d:"")+j+".",i||(i=[]),i.push(w),f+=s.J(j,a,c,e,w);else if(typeof j=="boolean"&&(j=j?"true":"false"),j){if(e=="retrieveLightData"&&d.indexOf(".contextData.")<0)switch(w=g.substring(0,4),q=g.substring(4),g){case "transactionID":g="xact";break;case "channel":g="ch";break;case "campaign":g="v0";break;default:s.ta(q)&&(w=="prop"?g="c"+q:w=="eVar"?g="v"+q:w=="list"?
g="l"+q:w=="hier"&&(g="h"+q,j=j.substring(0,255)))}f+="&"+s.escape(g)+"="+s.escape(j)}}f!=""&&(f+="&."+b)}return f};s.Xa=function(){var b="",a,c,e,d,f,g,j,w,i="",k="",m=c="";if(s.lightProfileID)a=s.H,(i=s.lightTrackVars)&&(i=","+i+","+s.ba.join(",")+",");else{a=s.c;if(s.pe||s.linkType)if(i=s.linkTrackVars,k=s.linkTrackEvents,s.pe&&(c=s.pe.substring(0,1).toUpperCase()+s.pe.substring(1),s[c]))i=s[c].pb,k=s[c].ob;i&&(i=","+i+","+s.z.join(",")+",");k&&(k=","+k+",",i&&(i+=",events,"));s.events2&&(m+=(m!=
""?",":"")+s.events2)}s.AudienceManagement&&s.AudienceManagement.isReady()&&(b+=s.J("d",s.AudienceManagement.getEventCallConfigParams()));for(c=0;c<a.length;c++){d=a[c];f=s[d];e=d.substring(0,4);g=d.substring(4);!f&&d=="events"&&m&&(f=m,m="");if(f&&(!i||i.indexOf(","+d+",")>=0)){switch(d){case "supplementalDataID":d="sdid";break;case "timestamp":d="ts";break;case "dynamicVariablePrefix":d="D";break;case "visitorID":d="vid";break;case "marketingCloudVisitorID":d="mid";break;case "analyticsVisitorID":d=
"aid";break;case "audienceManagerLocationHint":d="aamlh";break;case "audienceManagerBlob":d="aamb";break;case "authState":d="as";break;case "pageURL":d="g";if(f.length>255)s.pageURLRest=f.substring(255),f=f.substring(0,255);break;case "pageURLRest":d="-g";break;case "referrer":d="r";break;case "vmk":case "visitorMigrationKey":d="vmt";break;case "visitorMigrationServer":d="vmf";s.ssl&&s.visitorMigrationServerSecure&&(f="");break;case "visitorMigrationServerSecure":d="vmf";!s.ssl&&s.visitorMigrationServer&&
(f="");break;case "charSet":d="ce";break;case "visitorNamespace":d="ns";break;case "cookieDomainPeriods":d="cdp";break;case "cookieLifetime":d="cl";break;case "variableProvider":d="vvp";break;case "currencyCode":d="cc";break;case "channel":d="ch";break;case "transactionID":d="xact";break;case "campaign":d="v0";break;case "latitude":d="lat";break;case "longitude":d="lon";break;case "resolution":d="s";break;case "colorDepth":d="c";break;case "javascriptVersion":d="j";break;case "javaEnabled":d="v";
break;case "cookiesEnabled":d="k";break;case "browserWidth":d="bw";break;case "browserHeight":d="bh";break;case "connectionType":d="ct";break;case "homepage":d="hp";break;case "events":m&&(f+=(f!=""?",":"")+m);if(k){g=f.split(",");f="";for(e=0;e<g.length;e++)j=g[e],w=j.indexOf("="),w>=0&&(j=j.substring(0,w)),w=j.indexOf(":"),w>=0&&(j=j.substring(0,w)),k.indexOf(","+j+",")>=0&&(f+=(f?",":"")+g[e])}break;case "events2":f="";break;case "contextData":b+=s.J("c",s[d],i,d);f="";break;case "lightProfileID":d=
"mtp";break;case "lightStoreForSeconds":d="mtss";s.lightProfileID||(f="");break;case "lightIncrementBy":d="mti";s.lightProfileID||(f="");break;case "retrieveLightProfiles":d="mtsr";break;case "deleteLightProfiles":d="mtsd";break;case "retrieveLightData":s.retrieveLightProfiles&&(b+=s.J("mts",s[d],i,d));f="";break;default:s.ta(g)&&(e=="prop"?d="c"+g:e=="eVar"?d="v"+g:e=="list"?d="l"+g:e=="hier"&&(d="h"+g,f=f.substring(0,255)))}f&&(b+="&"+d+"="+(d.substring(0,3)!="pev"?s.escape(f):f))}d=="pev3"&&s.g&&
(b+=s.g)}return b};s.u=function(s){var a=s.tagName;if(""+s.wb!="undefined"||""+s.ib!="undefined"&&(""+s.ib).toUpperCase()!="HTML")return"";a=a&&a.toUpperCase?a.toUpperCase():"";a=="SHAPE"&&(a="");a&&((a=="INPUT"||a=="BUTTON")&&s.type&&s.type.toUpperCase?a=s.type.toUpperCase():!a&&s.href&&(a="A"));return a};s.oa=function(s){var a=s.href?s.href:"",c,e,d;c=a.indexOf(":");e=a.indexOf("?");d=a.indexOf("/");if(a&&(c<0||e>=0&&c>e||d>=0&&c>d))e=s.protocol&&s.protocol.length>1?s.protocol:l.protocol?l.protocol:
"",c=l.pathname.lastIndexOf("/"),a=(e?e+"//":"")+(s.host?s.host:l.host?l.host:"")+(h.substring(0,1)!="/"?l.pathname.substring(0,c<0?0:c)+"/":"")+a;return a};s.D=function(b){var a=s.u(b),c,e,d="",f=0;if(a){c=b.protocol;e=b.onclick;if(b.href&&(a=="A"||a=="AREA")&&(!e||!c||c.toLowerCase().indexOf("javascript")<0))d=s.oa(b);else if(e)d=s.replace(s.replace(s.replace(s.replace(""+e,"\r",""),"\n",""),"\t","")," ",""),f=2;else if(a=="INPUT"||a=="SUBMIT"){if(b.value)d=b.value;else if(b.innerText)d=b.innerText;
else if(b.textContent)d=b.textContent;f=3}else if(b.src&&a=="IMAGE")d=b.src;if(d)return{id:d.substring(0,100),type:f}}return 0};s.tb=function(b){for(var a=s.u(b),c=s.D(b);b&&!c&&a!="BODY";)if(b=b.parentElement?b.parentElement:b.parentNode)a=s.u(b),c=s.D(b);if(!c||a=="BODY")b=0;if(b&&(a=b.onclick?""+b.onclick:"",a.indexOf(".tl(")>=0||a.indexOf(".trackLink(")>=0))b=0;return b};s.hb=function(){var b,a,c=s.linkObject,e=s.linkType,d=s.linkURL,f,g;s.ca=1;if(!c)s.ca=0,c=s.clickObject;if(c){b=s.u(c);for(a=
s.D(c);c&&!a&&b!="BODY";)if(c=c.parentElement?c.parentElement:c.parentNode)b=s.u(c),a=s.D(c);if(!a||b=="BODY")c=0;if(c){var j=c.onclick?""+c.onclick:"";if(j.indexOf(".tl(")>=0||j.indexOf(".trackLink(")>=0)c=0}}else s.ca=1;!d&&c&&(d=s.oa(c));d&&!s.linkLeaveQueryString&&(f=d.indexOf("?"),f>=0&&(d=d.substring(0,f)));if(!e&&d){var i=0,k=0,m;if(s.trackDownloadLinks&&s.linkDownloadFileTypes){j=d.toLowerCase();f=j.indexOf("?");g=j.indexOf("#");f>=0?g>=0&&g<f&&(f=g):f=g;f>=0&&(j=j.substring(0,f));f=s.linkDownloadFileTypes.toLowerCase().split(",");
for(g=0;g<f.length;g++)(m=f[g])&&j.substring(j.length-(m.length+1))=="."+m&&(e="d")}if(s.trackExternalLinks&&!e&&(j=d.toLowerCase(),s.ra(j))){if(!s.linkInternalFilters)s.linkInternalFilters=w.location.hostname;f=0;s.linkExternalFilters?(f=s.linkExternalFilters.toLowerCase().split(","),i=1):s.linkInternalFilters&&(f=s.linkInternalFilters.toLowerCase().split(","));if(f){for(g=0;g<f.length;g++)m=f[g],j.indexOf(m)>=0&&(k=1);k?i&&(e="e"):i||(e="e")}}}s.linkObject=c;s.linkURL=d;s.linkType=e;if(s.trackClickMap||
s.trackInlineStats)if(s.g="",c){e=s.pageName;d=1;c=c.sourceIndex;if(!e)e=s.pageURL,d=0;if(w.s_objectID)a.id=w.s_objectID,c=a.type=1;if(e&&a&&a.id&&b)s.g="&pid="+s.escape(e.substring(0,255))+(d?"&pidt="+d:"")+"&oid="+s.escape(a.id.substring(0,100))+(a.type?"&oidt="+a.type:"")+"&ot="+b+(c?"&oi="+c:"")}};s.Ya=function(){var b=s.ca,a=s.linkType,c=s.linkURL,e=s.linkName;if(a&&(c||e))a=a.toLowerCase(),a!="d"&&a!="e"&&(a="o"),s.pe="lnk_"+a,s.pev1=c?s.escape(c):"",s.pev2=e?s.escape(e):"",b=1;s.abort&&(b=
0);if(s.trackClickMap||s.trackInlineStats){a={};c=0;var d=s.cookieRead("s_sq"),f=d?d.split("&"):0,g,j,w;d=0;if(f)for(g=0;g<f.length;g++)j=f[g].split("="),e=s.unescape(j[0]).split(","),j=s.unescape(j[1]),a[j]=e;e=s.account.split(",");if(b||s.g){b&&!s.g&&(d=1);for(j in a)if(!Object.prototype[j])for(g=0;g<e.length;g++){d&&(w=a[j].join(","),w==s.account&&(s.g+=(j.charAt(0)!="&"?"&":"")+j,a[j]=[],c=1));for(f=0;f<a[j].length;f++)w=a[j][f],w==e[g]&&(d&&(s.g+="&u="+s.escape(w)+(j.charAt(0)!="&"?"&":"")+j+
"&u=0"),a[j].splice(f,1),c=1)}b||(c=1);if(c){d="";g=2;!b&&s.g&&(d=s.escape(e.join(","))+"="+s.escape(s.g),g=1);for(j in a)!Object.prototype[j]&&g>0&&a[j].length>0&&(d+=(d?"&":"")+s.escape(a[j].join(","))+"="+s.escape(j),g--);s.cookieWrite("s_sq",d)}}}return b};s.Za=function(){if(!s.nb){var b=new Date,a=m.location,c,e,d=e=c="",f="",g="",w="1.2",i=s.cookieWrite("s_cc","true",0)?"Y":"N",k="",n="";if(b.setUTCDate&&(w="1.3",(0).toPrecision&&(w="1.5",b=[],b.forEach))){w="1.6";e=0;c={};try{e=new Iterator(c),
e.next&&(w="1.7",b.reduce&&(w="1.8",w.trim&&(w="1.8.1",Date.parse&&(w="1.8.2",Object.create&&(w="1.8.5")))))}catch(o){}}c=screen.width+"x"+screen.height;d=navigator.javaEnabled()?"Y":"N";e=screen.pixelDepth?screen.pixelDepth:screen.colorDepth;f=s.w.innerWidth?s.w.innerWidth:s.d.documentElement.offsetWidth;g=s.w.innerHeight?s.w.innerHeight:s.d.documentElement.offsetHeight;try{s.b.addBehavior("#default#homePage"),k=s.b.ub(a)?"Y":"N"}catch(p){}try{s.b.addBehavior("#default#clientCaps"),n=s.b.connectionType}catch(r){}s.resolution=
c;s.colorDepth=e;s.javascriptVersion=w;s.javaEnabled=d;s.cookiesEnabled=i;s.browserWidth=f;s.browserHeight=g;s.connectionType=n;s.homepage=k;s.nb=1}};s.I={};s.loadModule=function(b,a){var c=s.I[b];if(!c){c=w["AppMeasurement_Module_"+b]?new w["AppMeasurement_Module_"+b](s):{};s.I[b]=s[b]=c;c.Fa=function(){return c.Ja};c.Ka=function(a){if(c.Ja=a)s[b+"_onLoad"]=a,s.B(b+"_onLoad",[s,c],1)||a(s,c)};try{Object.defineProperty?Object.defineProperty(c,"onLoad",{get:c.Fa,set:c.Ka}):c._olc=1}catch(e){c._olc=
1}}a&&(s[b+"_onLoad"]=a,s.B(b+"_onLoad",[s,c],1)||a(s,c))};s.q=function(b){var a,c;for(a in s.I)if(!Object.prototype[a]&&(c=s.I[a])){if(c._olc&&c.onLoad)c._olc=0,c.onLoad(s,c);if(c[b]&&c[b]())return 1}return 0};s.bb=function(){var b=Math.floor(Math.random()*1E13),a=s.visitorSampling,c=s.visitorSamplingGroup;c="s_vsn_"+(s.visitorNamespace?s.visitorNamespace:s.account)+(c?"_"+c:"");var e=s.cookieRead(c);if(a){e&&(e=parseInt(e));if(!e){if(!s.cookieWrite(c,b))return 0;e=b}if(e%1E4>v)return 0}return 1};
s.K=function(b,a){var c,e,d,f,g,w;for(c=0;c<2;c++){e=c>0?s.ia:s.c;for(d=0;d<e.length;d++)if(f=e[d],(g=b[f])||b["!"+f]){if(!a&&(f=="contextData"||f=="retrieveLightData")&&s[f])for(w in s[f])g[w]||(g[w]=s[f][w]);s[f]=g}}};s.Aa=function(b,a){var c,e,d,f;for(c=0;c<2;c++){e=c>0?s.ia:s.c;for(d=0;d<e.length;d++)f=e[d],b[f]=s[f],!a&&!b[f]&&(b["!"+f]=1)}};s.Ua=function(s){var a,c,e,d,f,g=0,w,i="",k="";if(s&&s.length>255&&(a=""+s,c=a.indexOf("?"),c>0&&(w=a.substring(c+1),a=a.substring(0,c),d=a.toLowerCase(),
e=0,d.substring(0,7)=="http://"?e+=7:d.substring(0,8)=="https://"&&(e+=8),c=d.indexOf("/",e),c>0&&(d=d.substring(e,c),f=a.substring(c),a=a.substring(0,c),d.indexOf("google")>=0?g=",q,ie,start,search_key,word,kw,cd,":d.indexOf("yahoo.co")>=0&&(g=",p,ei,"),g&&w)))){if((s=w.split("&"))&&s.length>1){for(e=0;e<s.length;e++)d=s[e],c=d.indexOf("="),c>0&&g.indexOf(","+d.substring(0,c)+",")>=0?i+=(i?"&":"")+d:k+=(k?"&":"")+d;i&&k?w=i+"&"+k:k=""}c=253-(w.length-k.length)-a.length;s=a+(c>0?f.substring(0,c):
"")+"?"+w}return s};s.U=!1;s.O=!1;s.Ia=function(b){s.marketingCloudVisitorID=b;s.O=!0;s.k()};s.R=!1;s.L=!1;s.Ca=function(b){s.analyticsVisitorID=b;s.L=!0;s.k()};s.T=!1;s.N=!1;s.Ea=function(b){s.audienceManagerLocationHint=b;s.N=!0;s.k()};s.S=!1;s.M=!1;s.Da=function(b){s.audienceManagerBlob=b;s.M=!0;s.k()};s.isReadyToTrack=function(){var b=!0,a=s.visitor;if(a&&a.isAllowed()){if(!s.U&&!s.marketingCloudVisitorID&&a.getMarketingCloudVisitorID&&(s.U=!0,s.marketingCloudVisitorID=a.getMarketingCloudVisitorID([s,
s.Ia]),s.marketingCloudVisitorID))s.O=!0;if(!s.R&&!s.analyticsVisitorID&&a.getAnalyticsVisitorID&&(s.R=!0,s.analyticsVisitorID=a.getAnalyticsVisitorID([s,s.Ca]),s.analyticsVisitorID))s.L=!0;if(!s.T&&!s.audienceManagerLocationHint&&a.getAudienceManagerLocationHint&&(s.T=!0,s.audienceManagerLocationHint=a.getAudienceManagerLocationHint([s,s.Ea]),s.audienceManagerLocationHint))s.N=!0;if(!s.S&&!s.audienceManagerBlob&&a.getAudienceManagerBlob&&(s.S=!0,s.audienceManagerBlob=a.getAudienceManagerBlob([s,
s.Da]),s.audienceManagerBlob))s.M=!0;if(s.U&&!s.O&&!s.marketingCloudVisitorID||s.R&&!s.L&&!s.analyticsVisitorID||s.T&&!s.N&&!s.audienceManagerLocationHint||s.S&&!s.M&&!s.audienceManagerBlob)b=!1}return b};s.j=k;s.l=0;s.callbackWhenReadyToTrack=function(b,a,c){var e;e={};e.Oa=b;e.Na=a;e.La=c;if(s.j==k)s.j=[];s.j.push(e);if(s.l==0)s.l=setInterval(s.k,100)};s.k=function(){var b;if(s.isReadyToTrack()){if(s.l)clearInterval(s.l),s.l=0;if(s.j!=k)for(;s.j.length>0;)b=s.j.shift(),b.Na.apply(b.Oa,b.La)}};s.Ga=
function(b){var a,c,e=k,d=k;if(!s.isReadyToTrack()){a=[];if(b!=k)for(c in e={},b)e[c]=b[c];d={};s.Aa(d,!0);a.push(e);a.push(d);s.callbackWhenReadyToTrack(s,s.track,a);return!0}return!1};s.Wa=function(){var b=s.cookieRead("s_fid"),a="",c="",e;e=8;var d=4;if(!b||b.indexOf("-")<0){for(b=0;b<16;b++)e=Math.floor(Math.random()*e),a+="0123456789ABCDEF".substring(e,e+1),e=Math.floor(Math.random()*d),c+="0123456789ABCDEF".substring(e,e+1),e=d=16;b=a+"-"+c}s.cookieWrite("s_fid",b,1)||(b=0);return b};s.t=s.track=
function(b,a){var c,e=new Date,d="s"+Math.floor(e.getTime()/108E5)%10+Math.floor(Math.random()*1E13),f=e.getYear();f="t="+s.escape(e.getDate()+"/"+e.getMonth()+"/"+(f<1900?f+1900:f)+" "+e.getHours()+":"+e.getMinutes()+":"+e.getSeconds()+" "+e.getDay()+" "+e.getTimezoneOffset());if(s.visitor){if(s.visitor.getAuthState)s.authState=s.visitor.getAuthState();if(!s.supplementalDataID&&s.visitor.getSupplementalDataID)s.supplementalDataID=s.visitor.getSupplementalDataID("AppMeasurement:"+s._in,s.expectSupplementalData?
!1:!0)}s.q("_s");if(!s.B("track",arguments)){if(!s.Ga(b)){a&&s.K(a);b&&(c={},s.Aa(c,0),s.K(b));if(s.bb()){if(!s.analyticsVisitorID&&!s.marketingCloudVisitorID)s.fid=s.Wa();s.hb();s.usePlugins&&s.doPlugins&&s.doPlugins(s);if(s.account){if(!s.abort){if(s.trackOffline&&!s.timestamp)s.timestamp=Math.floor(e.getTime()/1E3);e=w.location;if(!s.pageURL)s.pageURL=e.href?e.href:e;if(!s.referrer&&!s.Ba)s.referrer=m.document.referrer,s.Ba=1;s.referrer=s.Ua(s.referrer);s.q("_g")}if(s.Ya()&&!s.abort)s.Za(),f+=
s.Xa(),s.gb(d,f),s.q("_t"),s.referrer=""}}b&&s.K(c,1)}s.abort=s.supplementalDataID=s.timestamp=s.pageURLRest=s.linkObject=s.clickObject=s.linkURL=s.linkName=s.linkType=w.vb=s.pe=s.pev1=s.pev2=s.pev3=s.g=0}};s.tl=s.trackLink=function(b,a,c,e,d){s.linkObject=b;s.linkType=a;s.linkName=c;if(d)s.i=b,s.p=d;return s.track(e)};s.trackLight=function(b,a,c,e){s.lightProfileID=b;s.lightStoreForSeconds=a;s.lightIncrementBy=c;return s.track(e)};s.clearVars=function(){var b,a;for(b=0;b<s.c.length;b++)if(a=s.c[b],
a.substring(0,4)=="prop"||a.substring(0,4)=="eVar"||a.substring(0,4)=="hier"||a.substring(0,4)=="list"||a=="channel"||a=="events"||a=="eventList"||a=="products"||a=="productList"||a=="purchaseID"||a=="transactionID"||a=="state"||a=="zip"||a=="campaign")s[a]=void 0};s.tagContainerMarker="";s.gb=function(b,a){var c,e=s.trackingServer;c="";var d=s.dc,f="sc.",w=s.visitorNamespace;if(e){if(s.trackingServerSecure&&s.ssl)e=s.trackingServerSecure}else{if(!w)w=s.account,e=w.indexOf(","),e>=0&&(w=w.substring(0,
e)),w=w.replace(/[^A-Za-z0-9]/g,"");c||(c="2o7.net");d=d?(""+d).toLowerCase():"d1";c=="2o7.net"&&(d=="d1"?d="112":d=="d2"&&(d="122"),f="");e=w+"."+d+"."+f+c}c=s.ssl?"https://":"http://";d=s.AudienceManagement&&s.AudienceManagement.isReady();c+=e+"/b/ss/"+s.account+"/"+(s.mobile?"5.":"")+(d?"10":"1")+"/JS-"+s.version+(s.mb?"T":"")+(s.tagContainerMarker?"-"+s.tagContainerMarker:"")+"/"+b+"?AQB=1&ndh=1&pf=1&"+(d?"callback=s_c_il["+s._in+"].AudienceManagement.passData&":"")+a+"&AQE=1";s.Sa(c);s.Y()};
s.Sa=function(b){s.e||s.$a();s.e.push(b);s.aa=s.r();s.za()};s.$a=function(){s.e=s.cb();if(!s.e)s.e=[]};s.cb=function(){var b,a;if(s.fa()){try{(a=w.localStorage.getItem(s.da()))&&(b=w.JSON.parse(a))}catch(c){}return b}};s.fa=function(){var b=!0;if(!s.trackOffline||!s.offlineFilename||!w.localStorage||!w.JSON)b=!1;return b};s.pa=function(){var b=0;if(s.e)b=s.e.length;s.v&&b++;return b};s.Y=function(){if(!s.v)if(s.qa=k,s.ea)s.aa>s.G&&s.xa(s.e),s.ha(500);else{var b=s.Ma();if(b>0)s.ha(b);else if(b=s.na())s.v=
1,s.fb(b),s.jb(b)}};s.ha=function(b){if(!s.qa)b||(b=0),s.qa=setTimeout(s.Y,b)};s.Ma=function(){var b;if(!s.trackOffline||s.offlineThrottleDelay<=0)return 0;b=s.r()-s.wa;if(s.offlineThrottleDelay<b)return 0;return s.offlineThrottleDelay-b};s.na=function(){if(s.e.length>0)return s.e.shift()};s.fb=function(b){if(s.debugTracking){var a="AppMeasurement Debug: "+b;b=b.split("&");var c;for(c=0;c<b.length;c++)a+="\n\t"+s.unescape(b[c]);s.eb(a)}};s.Ha=function(){return s.marketingCloudVisitorID||s.analyticsVisitorID};
s.Q=!1;var n;try{n=JSON.parse('{"x":"y"}')}catch(r){n=null}n&&n.x=="y"?(s.Q=!0,s.P=function(s){return JSON.parse(s)}):w.$&&w.$.parseJSON?(s.P=function(s){return w.$.parseJSON(s)},s.Q=!0):s.P=function(){return null};s.jb=function(b){var a,c,e;if(s.Ha()&&b.length>2047&&(typeof XMLHttpRequest!="undefined"&&(a=new XMLHttpRequest,"withCredentials"in a?c=1:a=0),!a&&typeof XDomainRequest!="undefined"&&(a=new XDomainRequest,c=2),a&&s.AudienceManagement&&s.AudienceManagement.isReady()))s.Q?a.ja=!0:a=0;!a&&
s.ab&&(b=b.substring(0,2047));if(!a&&s.d.createElement&&s.AudienceManagement&&s.AudienceManagement.isReady()&&(a=s.d.createElement("SCRIPT"))&&"async"in a)(e=(e=s.d.getElementsByTagName("HEAD"))&&e[0]?e[0]:s.d.body)?(a.type="text/javascript",a.setAttribute("async","async"),c=3):a=0;if(!a)a=new Image,a.alt="";a.la=function(){try{if(s.ga)clearTimeout(s.ga),s.ga=0;if(a.timeout)clearTimeout(a.timeout),a.timeout=0}catch(b){}};a.onload=a.lb=function(){a.la();s.Ra();s.V();s.v=0;s.Y();if(a.ja){a.ja=!1;try{var b=
s.P(a.responseText);AudienceManagement.passData(b)}catch(c){}}};a.onabort=a.onerror=a.Ta=function(){a.la();(s.trackOffline||s.ea)&&s.v&&s.e.unshift(s.Qa);s.v=0;s.aa>s.G&&s.xa(s.e);s.V();s.ha(500)};a.onreadystatechange=function(){a.readyState==4&&(a.status==200?a.lb():a.Ta())};s.wa=s.r();if(c==1||c==2){var d=b.indexOf("?");e=b.substring(0,d);d=b.substring(d+1);d=d.replace(/&callback=[a-zA-Z0-9_.\[\]]+/,"");c==1?(a.open("POST",e,!0),a.send(d)):c==2&&(a.open("POST",e),a.send(d))}else if(a.src=b,c==3){if(s.ua)try{e.removeChild(s.ua)}catch(f){}e.firstChild?
e.insertBefore(a,e.firstChild):e.appendChild(a);s.ua=s.Pa}if(a.abort)s.ga=setTimeout(a.abort,5E3);s.Qa=b;s.Pa=w["s_i_"+s.replace(s.account,",","_")]=a;if(s.useForcedLinkTracking&&s.A||s.p){if(!s.forcedLinkTrackingTimeout)s.forcedLinkTrackingTimeout=250;s.W=setTimeout(s.V,s.forcedLinkTrackingTimeout)}};s.Ra=function(){if(s.fa()&&!(s.va>s.G))try{w.localStorage.removeItem(s.da()),s.va=s.r()}catch(b){}};s.xa=function(b){if(s.fa()){s.za();try{w.localStorage.setItem(s.da(),w.JSON.stringify(b)),s.G=s.r()}catch(a){}}};
s.za=function(){if(s.trackOffline){if(!s.offlineLimit||s.offlineLimit<=0)s.offlineLimit=10;for(;s.e.length>s.offlineLimit;)s.na()}};s.forceOffline=function(){s.ea=!0};s.forceOnline=function(){s.ea=!1};s.da=function(){return s.offlineFilename+"-"+s.visitorNamespace+s.account};s.r=function(){return(new Date).getTime()};s.ra=function(s){s=s.toLowerCase();if(s.indexOf("#")!=0&&s.indexOf("about:")!=0&&s.indexOf("opera:")!=0&&s.indexOf("javascript:")!=0)return!0;return!1};s.setTagContainer=function(b){var a,
c,e;s.mb=b;for(a=0;a<s._il.length;a++)if((c=s._il[a])&&c._c=="s_l"&&c.tagContainerName==b){s.K(c);if(c.lmq)for(a=0;a<c.lmq.length;a++)e=c.lmq[a],s.loadModule(e.n);if(c.ml)for(e in c.ml)if(s[e])for(a in b=s[e],e=c.ml[e],e)if(!Object.prototype[a]&&(typeof e[a]!="function"||(""+e[a]).indexOf("s_c_il")<0))b[a]=e[a];if(c.mmq)for(a=0;a<c.mmq.length;a++)e=c.mmq[a],s[e.m]&&(b=s[e.m],b[e.f]&&typeof b[e.f]=="function"&&(e.a?b[e.f].apply(b,e.a):b[e.f].apply(b)));if(c.tq)for(a=0;a<c.tq.length;a++)s.track(c.tq[a]);
c.s=s;break}};s.Util={urlEncode:s.escape,urlDecode:s.unescape,cookieRead:s.cookieRead,cookieWrite:s.cookieWrite,getQueryParam:function(b,a,c){var e;a||(a=s.pageURL?s.pageURL:w.location);c||(c="&");if(b&&a&&(a=""+a,e=a.indexOf("?"),e>=0&&(a=c+a.substring(e+1)+c,e=a.indexOf(c+b+"="),e>=0&&(a=a.substring(e+c.length+b.length+1),e=a.indexOf(c),e>=0&&(a=a.substring(0,e)),a.length>0))))return s.unescape(a);return""}};s.z=["supplementalDataID","timestamp","dynamicVariablePrefix","visitorID","marketingCloudVisitorID",
"analyticsVisitorID","audienceManagerLocationHint","authState","fid","vmk","visitorMigrationKey","visitorMigrationServer","visitorMigrationServerSecure","charSet","visitorNamespace","cookieDomainPeriods","fpCookieDomainPeriods","cookieLifetime","pageName","pageURL","referrer","contextData","currencyCode","lightProfileID","lightStoreForSeconds","lightIncrementBy","retrieveLightProfiles","deleteLightProfiles","retrieveLightData","pe","pev1","pev2","pev3","pageURLRest"];s.c=s.z.concat(["purchaseID",
"variableProvider","channel","server","pageType","transactionID","campaign","state","zip","events","events2","products","audienceManagerBlob","tnt"]);s.ba=["timestamp","charSet","visitorNamespace","cookieDomainPeriods","cookieLifetime","contextData","lightProfileID","lightStoreForSeconds","lightIncrementBy"];s.H=s.ba.slice(0);s.ia=["account","allAccounts","debugTracking","visitor","trackOffline","offlineLimit","offlineThrottleDelay","offlineFilename","usePlugins","doPlugins","configURL","visitorSampling",
"visitorSamplingGroup","linkObject","clickObject","linkURL","linkName","linkType","trackDownloadLinks","trackExternalLinks","trackClickMap","trackInlineStats","linkLeaveQueryString","linkTrackVars","linkTrackEvents","linkDownloadFileTypes","linkExternalFilters","linkInternalFilters","useForcedLinkTracking","forcedLinkTrackingTimeout","trackingServer","trackingServerSecure","ssl","abort","mobile","dc","lightTrackVars","maxDelay","expectSupplementalData","AudienceManagement"];for(i=0;i<=250;i++)i<76&&
(s.c.push("prop"+i),s.H.push("prop"+i)),s.c.push("eVar"+i),s.H.push("eVar"+i),i<6&&s.c.push("hier"+i),i<4&&s.c.push("list"+i);i=["latitude","longitude","resolution","colorDepth","javascriptVersion","javaEnabled","cookiesEnabled","browserWidth","browserHeight","connectionType","homepage"];s.c=s.c.concat(i);s.z=s.z.concat(i);s.ssl=w.location.protocol.toLowerCase().indexOf("https")>=0;s.charSet="UTF-8";s.contextData={};s.offlineThrottleDelay=0;s.offlineFilename="AppMeasurement.offline";s.wa=0;s.aa=0;
s.G=0;s.va=0;s.linkDownloadFileTypes="exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";s.w=w;s.d=w.document;try{s.ab=navigator.appName=="Microsoft Internet Explorer"}catch(t){}s.V=function(){if(s.W)w.clearTimeout(s.W),s.W=k;s.i&&s.A&&s.i.dispatchEvent(s.A);if(s.p)if(typeof s.p=="function")s.p();else if(s.i&&s.i.href)s.d.location=s.i.href;s.i=s.A=s.p=0};s.ya=function(){s.b=s.d.body;if(s.b)if(s.o=function(b){var a,c,e,d,f;if(!(s.d&&s.d.getElementById("cppXYctnr")||b&&b["s_fe_"+s._in])){if(s.ka)if(s.useForcedLinkTracking)s.b.removeEventListener("click",
s.o,!1);else{s.b.removeEventListener("click",s.o,!0);s.ka=s.useForcedLinkTracking=0;return}else s.useForcedLinkTracking=0;s.clickObject=b.srcElement?b.srcElement:b.target;try{if(s.clickObject&&(!s.F||s.F!=s.clickObject)&&(s.clickObject.tagName||s.clickObject.parentElement||s.clickObject.parentNode)){var g=s.F=s.clickObject;if(s.Z)clearTimeout(s.Z),s.Z=0;s.Z=setTimeout(function(){if(s.F==g)s.F=0},1E4);e=s.pa();s.track();if(e<s.pa()&&s.useForcedLinkTracking&&b.target){for(d=b.target;d&&d!=s.b&&d.tagName.toUpperCase()!=
"A"&&d.tagName.toUpperCase()!="AREA";)d=d.parentNode;if(d&&(f=d.href,s.ra(f)||(f=0),c=d.target,b.target.dispatchEvent&&f&&(!c||c=="_self"||c=="_top"||c=="_parent"||w.name&&c==w.name))){try{a=s.d.createEvent("MouseEvents")}catch(i){a=new w.MouseEvent}if(a){try{a.initMouseEvent("click",b.bubbles,b.cancelable,b.view,b.detail,b.screenX,b.screenY,b.clientX,b.clientY,b.ctrlKey,b.altKey,b.shiftKey,b.metaKey,b.button,b.relatedTarget)}catch(k){a=0}if(a)a["s_fe_"+s._in]=a.s_fe=1,b.stopPropagation(),b.kb&&b.kb(),
b.preventDefault(),s.i=b.target,s.A=a}}}}else s.clickObject=0}catch(m){s.clickObject=0}}},s.b&&s.b.attachEvent)s.b.attachEvent("onclick",s.o);else{if(s.b&&s.b.addEventListener){if(navigator&&(navigator.userAgent.indexOf("WebKit")>=0&&s.d.createEvent||navigator.userAgent.indexOf("Firefox/2")>=0&&w.MouseEvent))s.ka=1,s.useForcedLinkTracking=1,s.b.addEventListener("click",s.o,!0);s.b.addEventListener("click",s.o,!1)}}else setTimeout(s.ya,30)};s.ya()}
function s_gi(s){var w,k=window.s_c_il,m,i,o=s.split(","),p,n,r=0;if(k)for(m=0;!r&&m<k.length;){w=k[m];if(w._c=="s_c"&&(w.account||w.oun))if(w.account&&w.account==s)r=1;else{i=w.account?w.account:w.oun;i=w.allAccounts?w.allAccounts:i.split(",");for(p=0;p<o.length;p++)for(n=0;n<i.length;n++)o[p]==i[n]&&(r=1)}m++}r||(w=new AppMeasurement);w.setAccount?w.setAccount(s):w.sa&&w.sa(s);return w}AppMeasurement.getInstance=s_gi;window.s_objectID||(window.s_objectID=0);
function s_pgicq(){var s=window,w=s.s_giq,k,m,i;if(w)for(k=0;k<w.length;k++)m=w[k],i=s_gi(m.oun),i.setAccount(m.un),i.setTagContainer(m.tagContainerName);s.s_giq=0}s_pgicq();
