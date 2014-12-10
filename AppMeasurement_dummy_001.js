s = new AppMeasurement();
s.account = s_account || "";
/* WARNING: Changing any of the below variables will cause drastic
changes to how your visitor data is collected. Changes should only be
made when instructed to do so by your account manager.*/
s.visitorNamespace = "nationwide";
s.trackingServer = "metrics.nationwide.co.uk";
s.linkTrackVars = "None";
s.linkTrackEvents = "None";

//An internal version number signifying which internal customised version of the code is being used.  This should change every time a new js file is deployed.  
s.appMeasurementVersion = "1.2.1_20141210_004";

s.cookieDomainPeriods = "3";
s.fpCookieDomainPeriods = "3";

///For automated tracking of exit links the following variables need to be set within the s_code:
s.trackExternalLinks = true;
s.linkInternalFilters = "local,cms,tel:,javascript:,nationet.com,landg.com,nationwideannuityservice.co.uk,u-k-i-insurance.com,kampyle.com,nationwide.onlineips.co.uk,onlinebanking.nationwide.co.uk,www.nationwide.co.uk,onlinemortgage.nationwide.co.uk,your.nationwide.co.uk,m.nationwide.co.uk,myvisaoffers.com,internal";
s.linkLeaveQueryString = false;

///For automated tracking of exit links the following variables need to be set within the s_code:
s.trackDownloadLinks = true;
s.linkDownloadFileTypes = "exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx,dmg";

///Click map is required, please set s.trackInlineStats to true within the s_code.
s.trackInlineStats = true;

//All pages should have the currency variable hardcoded to “GBP”
s.currencyCode = "GBP";

//Within the CMS, all pages should have the channel variable hardcoded to “Brochureware”
s.channel = "github";

//	"Run once" flag(s):
var qsp_camp_runonce = true;

var nwa = {};
nwa.cookieExpire = function (n) {
    return s.Util.cookieWrite(n, "", -1)
}

/* Plugin Config */
s.usePlugins = true;
s.s_doPlugins = function (s) {
    /* Add calls to plugins here */

    //Variable Purpose
    //The intention of this variable is to allow analysis of what content below the page fold has actually been seen.
    //Adobe Documentation
    //The Adobe documentation for this plug-in can be found here:
    //https://microsite.omniture.com/t2/help/en_US/sc/implement/index.html#getPercentPageViewed


    var ppvArray = s.getPercentPageViewed(s.pageName);
    //contains the total number of vertical pixels viewed
    s.prop75 = ppvArray[3];

    ///Capture previous page name value
    s.prop19 = s.getPreviousValue(s.pageName, 'gpv_p19', '');


    /* Provide code version change notes detail number */
    if (s.appMeasurementVersion) {
        s.contextData['nbs_version_sc'] = s.appMeasurementVersion;
    } else {
        s.contextData['nbs_version_sc'] = 'unknown';
    }

    //	4.8. Exact target Recipient ID (BTS-002) Must 
    //When the query string parameter “et_rid” is present in the URL the value should be captured into eVar33.
    s.pageURL = s.pageURL || document.location.href;
    s.eVar33 = s.Util.getQueryParam("et_rid", s.pageURL.toLowerCase());

    ///The link name (pev1 or pev2  ) variable is copied to prop69
    //If s.linkType is populated this indicates that s.tl is being used, so code will only execute for s.tl calls
    if (s.linkType) {

        //adds prop70, prop69 and prop73 to the s.linkTrackVars variable. Uses apl(append list) plugin
        s.linkTrackVars = (s.linkTrackVars == "None") ? "prop70" : s.apl(s.linkTrackVars, "prop70", ",", 2);

        s.linkTrackVars = s.apl(s.linkTrackVars, "prop69", ",", 2);

        s.linkTrackVars = s.apl(s.linkTrackVars, "prop73", ",", 2);

        //sets prop70 to page name
        s.prop70 = "D=pageName";

        //sets prop69 to either pev1 or pev2 prefixed with a value to indicate link type
        switch (s.linkType) {
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

    /*
	the dynamic short code syntax above (e.g. s.prop69 = 'D="d|"+pev1') is valid and we've tested that
	the value is recorded correctly. See blog post:
	http://blogs.adobe.com/digitalmarketing/analytics/trimming-the-fat-with-dynamic-variables/
	*/

    s.contextData['navigation'] = s.Util.cookieRead("navigation");

    //	Create array variable which lists the campaign parameters of interest
    var qsp_camp = [
        'cid', 'cmp_id', 'et_rid', 'et_cid', 'test_cid'];

    //	Loop through the entries in the "qsp_camp" array
    //	For each entry, test if a Query String Parameter exists with that name
    if (qsp_camp_runonce && qsp_camp && qsp_camp.length > 0) { //	check "runonce" flag, check array exists and has entries
        //        console.log("Starting loop");
        for (q in qsp_camp) {
            var a = qsp_camp[q];
            var b = "nbs_campaign";
            //        console.log("'q' is set to: " + q);
            //        console.log("'a' is set to: " + a);
            c = s.Util.getQueryParam(a.toLowerCase(), s.pageURL.toLowerCase());
            //        console.log("'c' is set to: " + c);
            if (c.length > 0) {
                s.contextData[b + "." + a] = c;
                if (s.linkType) {
                    s.linkTrackVars += ",contextData." + b + "." + a;
                    //        console.log("'s.linkTrackVars' is set to: " + s.linkTrackVars);
                }
            }
            //        console.log("'contextData' is set to: " + JSON.stringify(s.contextData));
        }
    } else if (!qsp_camp_runonce && qsp_camp && qsp_camp.length > 0) { //	if already run, wipe the CDVs
        //        console.log("Starting wipe of CDVs");
        for (q in qsp_camp) {
            var a = qsp_camp[q];
            var b = "nbs_campaign";
            //        console.log("'q' is set to: " + q);
            //        console.log("'a' is set to: " + a);
            //        console.log("'b' is set to: " + b);
            s.contextData[b + "." + a] = '';
            //        console.log("'contextData' is set to: " + JSON.stringify(s.contextData));
        }
    }

    if (!s.j) {
        nwa.cookieExpire("navigation");
        qsp_camp_runonce = false;
    }

    var deferredVariables = s.Util.cookieRead("deferred");
    var item = s.split(deferredVariables, ":");
    s[item[0]] = s.apl(s[item[0]], item[1], ',', 1);
    nwa.cookieExpire("deferred");

    //	Sub-section	eVar	prop
    //Sub-section 0	eVar1	Prop1
    if (s.prop1 && !s.eVar1) s.eVar1 = "D=c1";
    //Sub-section 0	eVar74	Prop74
    if (s.prop74 && !s.eVar74) s.eVar74 = "D=c74";
    //Sub-section 1	eVar17	prop21
    if (s.prop21 && !s.eVar17) s.eVar17 = "D=c21";
    //Sub-section 2	eVar18	prop22
    if (s.prop22 && !s.eVar18) s.eVar18 = "D=c22";
    //Sub-section 3	eVar19	prop23
    if (s.prop23 && !s.eVar19) s.eVar19 = "D=c23";

    //pass the visitor cookie ID into prop71
    s.prop71 = "D=s_vi";

    //        console.log("s.j is : " + s.j);
    //        console.log("s.timestamp is : " + s.timestamp);
    //        console.log("s.linktype is : " + s.linktype);
    //        console.log("s.J is : " + s.J);
    //        console.log("'navigation' cookie is: " + s.c_r('navigation'));

}
s.doPlugins = s.s_doPlugins;

/* References to plugins here */
/*
 * Utility Function: split v1.5 - split a string (JS 1.0 compatible)
 */
s.split = new Function("l", "d", "" + "var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x" + "++]=l.substring(0,i);l=l.substring(i+d.length);}return a");

/*
 * Plugin: getPercentPageViewed v1.4
 */
s.handlePPVevents = new Function("", "" + "if(!s.getPPVid)return;var dh=Math.max(Math.max(s.d.body.scrollHeigh" + "t,s.d.documentElement.scrollHeight),Math.max(s.d.body.offsetHeight," + "s.d.documentElement.offsetHeight),Math.max(s.d.body.clientHeight,s." + "d.documentElement.clientHeight)),vph=s.w.innerHeight||(s.d.documen" + "tElement.clientHeight||s.d.body.clientHeight),st=s.w.pageYOffset||" + "(s.d.documentElement.scrollTop||s.d.body.scroll" + "Top),vh=st+vph,pv=Math.min(Math.round(vh/dh*100),100),c=s.c_r('s_pp" + "v'),a=(c.indexOf(',')>-1)?c.split(',',4):[],id=(a.length>0)?(a[0]):" + "escape(s.getPPVid),cv=(a.length>1)?parseInt(a[1]):(0),p0=(a.length>" + "2)?parseInt(a[2]):(pv),cy=(a.length>3)?parseInt(a[3]):(0),cn=(pv>0)" + "?(id+','+((pv>cv)?pv:cv)+','+p0+','+((vh>cy)?vh:cy)):'';s.c_w('s_pp" + "v',cn);");
s.getPercentPageViewed = new Function("pid", "" + "pid=pid?pid:'-';var s=this,ist=!s.getPPVid?true:false;if(typeof(s.l" + "inkType)!='undefined'&&s.linkType!='e')return'';var v=s.c_r('s_ppv'" + "),a=(v.indexOf(',')>-1)?v.split(',',4):[];if(a.length<4){for(var i=" + "3;i>0;i--){a[i]=(i<a.length)?(a[i-1]):('');}a[0]='';}a[0]=unescape(" + "a[0]);s.getPPVpid=pid;s.c_w('s_ppv',escape(pid));if(ist){s.getPPVid" + "=(pid)?(pid):(s.pageName?s.pageName:document.location.href);s.c_w('" + "s_ppv',escape(s.getPPVid));if(s.w.addEventListener){s.w.addEventL" + "istener('load',s.handlePPVevents,false);s.w.addEventListener('scro" + "ll',s.handlePPVevents,false);s.w.addEventListener('resize',s.handl" + "ePPVevents,false);}else if(s.w.attachEvent){s.w.attachEvent('onlo" + "ad',s.handlePPVevents);s.w.attachEvent('onscroll',s.handlePPVevent" + "s);s.w.attachEvent('onresize',s.handlePPVevents);}}return(pid!='-'" + ")?(a):(a[1]);");


/*
 * Plugin: getPreviousValue_v1.0 - return previous value of designated
 * variable (requires split utility)
 */
s.getPreviousValue = new Function("v", "c", "el", "" + "var s=this,t=new Date,i,j,r='';t.setTime(t.getTime()+1800000);if(el" + "){if(s.events){i=s.split(el,',');j=s.split(s.events,',');for(x in i" + "){for(y in j){if(i[x]==j[y]){if(s.c_r(c)) r=s.c_r(c);v?s.c_w(c,v,t)" + ":s.c_w(c,'no value',t);return r}}}}}else{if(s.c_r(c)) r=s.c_r(c);v?" + "s.c_w(c,v,t):s.c_w(c,'no value',t);return r}");

//Plugin Utility: apl v1.1
s.apl = new Function("l", "v", "d", "u", "var s=this,m=0;if(!l)l='';if(u){var i,n,a=s.split(l,d);for(i=0;i<a.length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCase()));}}if(!m)l=l?l+d+v:v;return l");

//	DDL STUFF
//	version: 0.1.2
window.wa_action_whitelist = ["misc_interaction"]
window.wa_action_blacklist = ["user_input_complete"]


window.wa_component = (function () {

	// The full tree is not in the same format as the tree that is used by the code.  The full tree is a object allowing the sub-trees to be
	// selected by name.  The result of getCopyTemplate() is in-fact an array of objects whose 'name' properties indicate the name of the
	// node in question; just like the sub-nodes here.  Also array limits and whether elements are expired is in the method, not here.
	var fullTree = {
		page:[
			"nbs_environment",
			{name:"pageInfo",
				children:[
					"pageName",
					"nbs_page_responsive_state",
					"nbs_page_responsive_orientation"
				]
			},
			{name:"category",
				children:[
					"primaryCategory",
					"nbs_sub_category_1",
					"nbs_sub_category_2",
					"nbs_sub_category_3"
				]
			}
		],
		nbs_user:[
			"nbs_user_customer_number",
			"nbs_user_application_route",
			"nbs_user_application_route_ibreg",
			"nbs_user_application_route_ownership",
			"nbs_user_customer_status",
			"nbs_user_address_type",
			"nbs_user_postcode",
			"nbs_user_bfpo_number",
			"nbs_user_gender",
			"nbs_user_dateofbirth",
			"nbs_user_city",
			"nbs_user_income",
			"nbs_journey_id"
		],
		nbs_product:[
			"nbs_product_type"
		],
		nbs_product_savings:[
			"nbs_sav_acc_name",
			"nbs_sav_acc_category",
			"nbs_sav_acc_withdrawals",
			"nbs_sav_offer",
			"nbs_sav_offer_bonusrate",
			"nbs_sav_offer_withdrawals",
			"nbs_sav_fee_annual",
			"nbs_sav_fee_monthly"
		],
		nbs_product_creditcard:[
			"nbs_cc_name",
			"nbs_cc_offer",
			"nbs_cc_offer_bt",
			"nbs_cc_offer_bt_rate",
			"nbs_cc_offer_bt_duration",
			"nbs_cc_offer_purchase",
			"nbs_cc_offer_purchase_rate",
			"nbs_cc_offer_purchase_duration",
			"nbs_cc_fee_annual",
			"nbs_cc_fee_monthly"
		],
		nbs_product_currentaccount:[
			"nbs_ca_name",
			"nbs_ca_offer",
			"nbs_ca_fee_annual",
			"nbs_ca_fee_monthly"
		],
		nbs_product_personalloan:[
			"nbs_pl_name",
			"nbs_pl_rate_headline"
		],
		nbs_application_module:[
			"nbs_resumed_application_flag",
			"nbs_resumed_application_initial_page",
			"nbs_resumed_application_last_save_date"
		],
		nbs_app_savings:[
			"nbs_sav_application_product_type",
			"nbs_sav_application_id",
			"nbs_sav_application_starting_date",
			"nbs_sav_initial_deposit_selected",
			"nbs_sav_initial_deposit_amt",
			"nbs_sav_initial_deposit_bank",
			"nbs_sav_paperless_selected",
			"nbs_sav_application_continuation",
			"nbs_sav_econtracting_eligible"
		],
		nbs_app_creditcard:[
			"nbs_cc_application_product_type",
			"nbs_cc_application_id",
			"nbs_cc_application_continuation",
			"nbs_cc_application_starting_date",
			"nbs_cc_econtracting_eligible",
			"nbs_cc_internet_banking_setup_completed",
			"nbs_cc_limit_offered",
			"nbs_cc_limit_selected",
			"nbs_cc_decision_interim",
			"nbs_cc_decision_finalised",
			"nbs_cc_approval_status",
			{name:"nbs_cc_balancetxfer",
				children:[
					"nbs_cc_bt_amt",
					"nbs_cc_bt_type"
				]
			},
			"nbs_cc_secondcardholder_selected",
			"nbs_cc_paperless_selected",
			{name:"nbs_cc_benefit",
				children:[
					"nbs_cc_benefit_name",
					"nbs_cc_benefit_level",
					"nbs_cc_benefit_eligible"
				]
			},
			"nbs_cc_directdebit_supplied",
			"nbs_cc_directdebit_bank",
			"nbs_cc_directdebit_sortcode"
		],
		nbs_app_currentaccount:[
			"nbs_ca_application_product_type",
			"nbs_ca_application_id",
			"nbs_ca_application_starting_date",
			"nbs_ca_decision_interim",
			"nbs_ca_decision_finalised",
			"nbs_ca_initial_deposit_selected",
			"nbs_ca_initial_deposit_amt",
			"nbs_ca_initial_deposit_bank",
			"nbs_ca_paperless_selected",
			{name:"nbs_ca_benefit",
				children:[
					"nbs_ca_benefit_name",
					"nbs_ca_benefit_level",
					"nbs_ca_benefit_eligible_app1",
					"nbs_ca_benefit_eligible_app2"
				]
			},
			"nbs_ca_switch_selected",
			"nbs_ca_switch_completed",
			"nbs_ca_upgrade_path",
			"nbs_ca_econtracting_eligible",
			"nbs_ca_overdraft_offered",
			"nbs_ca_overdraft_selected",
			"nbs_ca_chequebook_requested"
		],
		nbs_app_personalloan:[
			"nbs_pl_application_product_type",
			"nbs_pl_application_id",
			"nbs_pl_application_continuation",
			"nbs_pl_application_starting_date",
			"nbs_pl_econtracting_eligible",
			"nbs_pl_internet_banking_setup_completed",
			"nbs_pl_type",
			"nbs_pl_subtype",
			"nbs_pl_loan_amt",
			"nbs_pl_loan_duration",
			"nbs_pl_purpose",
			"nbs_pl_decision_interim",
			"nbs_pl_decision_finalised",
			"nbs_pl_approval_status",
			"nbs_pl_rate_offered"
		],
		nbs_error_user:[
			"nbs_error_description",
			"nbs_error_text"
		],
		nbs_error_system:[
			"nbs_error_description",
			"nbs_error_text"
		],
		nbs_error_business:[
			"nbs_error_description",
			"nbs_error_text"
		],
		nbs_user_input:[
			"nbs_input_name",
			"nbs_input_validation_status",
			"nbs_input_validation_message",
			"nbs_input_value",
			"nbs_input_pii_flag"
		],
		nbs_document_viewed:[
			"nbs_document_name",
			"nbs_document_type"
		],
		nbs_system_response:[
			"nbs_system_response_name",
			"nbs_system_response_text",
			"nbs_system_response_type"
		],
		nbs_element_interaction:[
			"nbs_interaction_type",
			"nbs_interaction_label"
		],
		nbs_navigation:[
			"nbs_navigation_type",
			"nbs_navigation_title",
			"nbs_navigation_label"
		]
	}
	
	publicInterface = {}
	publicInterface.enable_logging = function () {persist_logging_setting (1)};
	publicInterface.disable_logging = function () {persist_logging_setting (0)};
	
	var jsonMissing = false
	
	var persist_logging_setting = function (setting)
	{
		var e = new Date;
		e.setTime(e.getTime() + 604800000)
		document.cookie = "wa_l=" + setting + "; path=/; expires=" + e.toGMTString()
	};
	
	var logging_enabled = function ()
	{
	   return (document.cookie+";").indexOf("wa_l=1;")>-1
	};	

	publicInterface.view = function () 
	{
		if (!window.s || !window.s.t) return
		clearAAData()
		
		// Page Name
		setPageName()
		
		// Products
		if (window.digitalData && window.digitalData.nbs_product && window.digitalData.nbs_product.nbs_product_type)
		{
			s.products = ""
			if (digitalData.nbs_product_savings)
				s.products = s.products + ";" + digitalData.nbs_product_savings.nbs_sav_acc_name + " (" + digitalData.nbs_product_savings.nbs_sav_acc_category + ")"
			else if (digitalData.nbs_product_currentaccount)
				s.products = s.products + ";" + digitalData.nbs_product_currentaccount.nbs_ca_name + " (" + digitalData.nbs_product_currentaccount.nbs_ca_category + ")"
			else if (digitalData.nbs_product_creditcard)
				s.products = s.products + ";" + digitalData.nbs_product_creditcard.nbs_cc_name + " (" + digitalData.nbs_product_creditcard.nbs_cc_category + ")"
			
		}
		
		// Context Data
		setContextData("nbs_page")
		s.t()
	}

	publicInterface.action = function (eventName, anchor) 
	{
		if (!window.s || !window.s.tl) return
		clearAAData()
		setPageName()
		message = ""
		s.linkTrackVars = ""
			
		if (typeof eventName == "undefined" || eventName=="")
			send_error ("ddl_action_error:[blank]", anchor)
		else if (eventName!="nbs_page" && setContextData(eventName))
		{
			message = eventName
		}
		else
		{
			send_error ("ddl_action_error:" + eventName, anchor)
			return
		}
		
		if (confirmAction(eventName))
		{
			s.linkTrackVars+=",pageName"
			callSTl (eventName, message, anchor)
			s.linkTrackVars="None"
		}	
	}

	var confirmAction = function (actionName)
	{
		var result = true
		var actionName = actionName.toLowerCase()
		if (typeof window.wa_action_whitelist == "object" && typeof window.wa_action_whitelist.length == "number" && window.wa_action_whitelist.length>0)
		{
			result = false
			for (var i=0, j=window.wa_action_whitelist.length; i<j; i++)
			{
				if (window.wa_action_whitelist[i].toLowerCase()==actionName)
				{
					result = true;
					break;
				}
			}
		}
		if (typeof window.wa_action_blacklist == "object" && typeof window.wa_action_blacklist.length == "number")
		{
			for (var i=0, j=window.wa_action_blacklist.length; i<j; i++)
			{
				if (window.wa_action_blacklist[i].toLowerCase()==actionName)
				{
					result = false;
					break;
				}
			}
		}
		return result
	}
	
	var setPageName = function ()
	{
		if (window.digitalData && window.digitalData.page && window.digitalData.page.pageInfo)
			s.pageName=window.digitalData.page.pageInfo.pageName
	}

	var send_error = function (message, anchor)
	{
		s.linkTrackVars="pageName"
		callSTl ("nbs_error", message, anchor)
		s.linkTrackVars="None"
	}
	
	var callSTl = function (eventName, message, anchor)
	{
		var pauseLinkTrack = typeof anchor != "undefined" && typeof anchor.href != "undefined" && anchor.href != ""
		if (pauseLinkTrack)
		{
			// See if forced link tracking is required
			if (confirmForceLinkTrack(eventName))
				s.tl(anchor, "o", message, null, 'navigate')
			else
				s.tl(anchor, "o", message)
		}				
		else
			s.tl(true, "o", message)
	}

	publicInterface.ddl_backup = function () 
	{
		if (typeof window.digitalData == "object")
		{
			if (typeof JSON.parse == "function")
				window.backup_digitalData = JSON.parse(JSON.stringify(window.digitalData));
			else
				jsonMissing = true
		}
		else
		{
			window.setPageName()
			window.send_error ("Object not found: digitalData")
		}
	}

	publicInterface.ddl_restore = function () 
	{
		if (typeof window.backup_digitalData == "object")
		{
			window.digitalData = window.backup_digitalData
			window.backup_digitalData=null
		}
		else if (jsonMissing)
		{
			window.send_error ("Object not found due to old browser: backup_digitalData")
		}
		else		
		{
			setPageName()
			send_error ("Object not found: backup_digitalData")
		}
	}

	var clearAAData = function ()
	{
		s.pageName = ""
		s.channel=""
		s.server=""
		s.products = ""
		for (var i=1; i<4; i++)
		{
			s["hier"+i]=""
			s["list"+i]=""
			s["prop"+i]=""
			s["eVar"+i]=""
		}
		for (var i=4; i<200; i++)
		{
			s["prop"+i]=""
			s["eVar"+i]=""
		}
		s.events=""
		s.contextData={}
	}

	var setContextData = function (rule)
	{
		if (typeof window.digitalData != "object") return;
		var template = getCopyTemplate(rule)
		if (!template) return false
		setContextDataRecursive (0, template, window.digitalData, "");
		
		if (logging_enabled() && console && typeof console.log == "function")
		{
			console.log("Log of DDL (parsed):")
			console.log("{")
			for (var variable in s.contextData)
			{
				if (s.contextData.hasOwnProperty(variable))
				{
					console.log ("          \"" + variable + "\": \"" + s.contextData[variable] + "\",")
				}
			}
			console.log("}")
		}
		return true
	}

	var setContextDataRecursive = function (depth, parentTemplate, parentDigitalData, parentContextDataPath)
	{
		if (depth>3) return
		
		for (var i=0, j=parentTemplate.length; i<j; i++)
		{
			var fieldTemplate = parentTemplate[i];
			if (typeof fieldTemplate == "string")
			{
				var fieldDigitalData = parentDigitalData[fieldTemplate]
				if (typeof fieldDigitalData != "undefined")
				{
					var path = parentContextDataPath + (parentContextDataPath!=""?".":"") + fieldTemplate
					s.contextData[path]=fieldDigitalData
					s.linkTrackVars+=",contextData." + path
				}
			} // Process leaf nodes (strings)
			else
			{
				var fieldName = fieldTemplate.name;
				var path = parentContextDataPath + (parentContextDataPath!=""?".":"") + fieldName
				var fieldDigitalData = parentDigitalData[fieldName]
				if (typeof fieldDigitalData != "undefined")
				{
					if (typeof fieldDigitalData.length == "number")
					{
						var arrayLimit = 1
						var isExpirable = true
						if (fieldTemplate.arrayLimit) arrayLimit = fieldTemplate.arrayLimit
						if (fieldTemplate.isExpirable) isExpirable = fieldTemplate.isExpirable
						for (var k = 0, l = fieldDigitalData.length; k < l; k++)
						{
							if (!isExpirable || (k<arrayLimit && typeof fieldDigitalData[k].nbs_sc_expired == "undefined"))
								setContextDataRecursive (depth + 1, fieldTemplate.children, fieldDigitalData[k], path + "_" + k)
							if (isExpirable) fieldDigitalData[k].nbs_sc_expired = 1
						}
					} // Process arrays
					else
					{
						setContextDataRecursive (depth + 1, fieldTemplate.children, fieldDigitalData, path)
					} // Process navigation down heirarchy
				} // Check node exists in data layer
			} // Process arrays and child nodes
		} // Loop through current list of nodes
	} // End recusive function

	var getCopyTemplate = function (rule)
	{	
		var common = [
				{name:"page", children:fullTree.page}
		]		
		if (rule=="nbs_page")
		{
			return common.concat([
				{name:"nbs_user",                   children:fullTree.nbs_user},
				{name:"nbs_product",                children:fullTree.nbs_product},
				{name:"nbs_product_savings",        children:fullTree.nbs_product_savings},
				{name:"nbs_product_creditcard",     children:fullTree.nbs_product_creditcard},
				{name:"nbs_product_currentaccount", children:fullTree.nbs_product_currentaccount},
				{name:"nbs_product_personalloan",   children:fullTree.nbs_product_personalloan},
				{name:"nbs_application_module",     children:fullTree.nbs_application_module},
				{name:"nbs_app_savings",            children:fullTree.nbs_app_savings},
				{name:"nbs_app_creditcard",         children:fullTree.nbs_app_creditcard},
				{name:"nbs_app_currentaccount",     children:fullTree.nbs_app_currentaccount},
				{name:"nbs_app_personalloan",       children:fullTree.nbs_app_personalloan},
				{name:"nbs_error_user",             children:fullTree.nbs_error_user,      arrayLimit:10},
				{name:"nbs_error_business",         children:fullTree.nbs_error_business,  arrayLimit:10},
				{name:"nbs_error_system",           children:fullTree.nbs_error_system,    arrayLimit:10}			
			])
		}
		if (rule=="user_input_complete") return common.concat([{name:"nbs_user_input",          children:fullTree.nbs_user_input}])
		if (rule=="document_viewed")     return common.concat([{name:"nbs_document_viewed",     children:fullTree.nbs_document_viewed}])
		if (rule=="system_response")     return common.concat([{name:"nbs_system_response",     children:fullTree.nbs_system_response}])
		if (rule=="misc_interaction")    return common.concat([{name:"nbs_element_interaction", children:fullTree.nbs_element_interaction}])
		if (rule=="nav_tracking")        return common.concat([{name:"nbs_navigation",          children:fullTree.nbs_navigation}])
		return null
	}

	var confirmForceLinkTrack = function (eventName)
	{
		if (eventName=="nav_tracking") return true
		return false
	}
	
	return publicInterface;
}());
window.wa_view = wa_component.view
window.wa_action = wa_component.action
window.wa_enable_logging = wa_component.enable_logging
window.wa_disable_logging = wa_component.disable_logging
window.ddl_backup = wa_component.ddl_backup
window.ddl_restore = wa_component.ddl_restore


/*
 ============== DO NOT ALTER ANYTHING BELOW THIS LINE ! ===============

 AppMeasurement for JavaScript version: 1.2.1
 Copyright 1996-2013 Adobe, Inc. All Rights Reserved
 More info available at http://www.omniture.com
*/
function AppMeasurement() {
    var s = this;
    s.version = "1.2.1";
    var w = window;
    if (!w.s_c_in) w.s_c_il = [], w.s_c_in = 0;
    s._il = w.s_c_il;
    s._in = w.s_c_in;
    s._il[s._in] = s;
    w.s_c_in++;
    s._c = "s_c";
    var k = w.fb;
    k || (k = null);
    var m = w,
        i, n;
    try {
        i = m.parent;
        for (n = m.location; i && i.location && n && "" + i.location != "" + n && m.location && "" + i.location != "" + m.location && i.location.host == n.host;) m = i, i = m.parent
    } catch (p) {}
    s.Sa = function (s) {
        try {
            console.log(s)
        } catch (a) {}
    };
    s.ja = function (s) {
        return "" + parseInt(s) == "" + s
    };
    s.replace = function (s, a, c) {
        if (!s || s.indexOf(a) < 0) return s;
        return s.split(a).join(c)
    };
    s.escape = function (b) {
        var a, c;
        if (!b) return b;
        b = encodeURIComponent(b);
        for (a = 0; a < 7; a++) c = "+~!*()'".substring(a, a + 1), b.indexOf(c) >= 0 && (b = s.replace(b, c, "%" + c.charCodeAt(0).toString(16).toUpperCase()));
        return b
    };
    s.unescape = function (b) {
        if (!b) return b;
        b = b.indexOf("+") >= 0 ? s.replace(b, "+", " ") : b;
        try {
            return decodeURIComponent(b)
        } catch (a) {}
        return unescape(b)
    };
    s.Ja = function () {
        var b = w.location.hostname,
            a = s.fpCookieDomainPeriods,
            c;
        if (!a) a = s.cookieDomainPeriods;
        if (b && !s.ca && !/^[0-9.]+$/.test(b) && (a = a ? parseInt(a) : 2, a = a > 2 ? a : 2, c = b.lastIndexOf("."), c >= 0)) {
            for (; c >= 0 && a > 1;) c = b.lastIndexOf(".", c - 1), a--;
            s.ca = c > 0 ? b.substring(c) : b
        }
        return s.ca
    };
    s.c_r = s.cookieRead = function (b) {
        b = s.escape(b);
        var a = " " + s.d.cookie,
            c = a.indexOf(" " + b + "="),
            e = c < 0 ? c : a.indexOf(";", c);
        b = c < 0 ? "" : s.unescape(a.substring(c + 2 + b.length, e < 0 ? a.length : e));
        return b != "[[B]]" ? b : ""
    };
    s.c_w = s.cookieWrite = function (b, a, c) {
        var e = s.Ja(),
            d = s.cookieLifetime,
            f;
        a = "" + a;
        d = d ? ("" + d).toUpperCase() : "";
        c && d != "SESSION" && d != "NONE" && ((f = a !=
            "" ? parseInt(d ? d : 0) : -60) ? (c = new Date, c.setTime(c.getTime() + f * 1E3)) : c == 1 && (c = new Date, f = c.getYear(), c.setYear(f + 5 + (f < 1900 ? 1900 : 0))));
        if (b && d != "NONE") return s.d.cookie = b + "=" + s.escape(a != "" ? a : "[[B]]") + "; path=/;" + (c && d != "SESSION" ? " expires=" + c.toGMTString() + ";" : "") + (e ? " domain=" + e + ";" : ""), s.cookieRead(b) == a;
        return 0
    };
    s.C = [];
    s.B = function (b, a, c) {
        if (s.da) return 0;
        if (!s.maxDelay) s.maxDelay = 250;
        var e = 0,
            d = (new Date).getTime() + s.maxDelay,
            f = s.d.cb,
            g = ["webkitvisibilitychange", "visibilitychange"];
        if (!f) f = s.d.eb;
        if (f && f == "prerender") {
            if (!s.M) {
                s.M = 1;
                for (c = 0; c < g.length; c++) s.d.addEventListener(g[c], function () {
                    var b = s.d.cb;
                    if (!b) b = s.d.eb;
                    if (b == "visible") s.M = 0, s.delayReady()
                })
            }
            e = 1;
            d = 0
        } else c || s.q("_d") && (e = 1);
        e && (s.C.push({
            m: b,
            a: a,
            t: d
        }), s.M || setTimeout(s.delayReady, s.maxDelay));
        return e
    };
    s.delayReady = function () {
        var b = (new Date).getTime(),
            a = 0,
            c;
        for (s.q("_d") && (a = 1); s.C.length > 0;) {
            c = s.C.shift();
            if (a && !c.t && c.t > b) {
                s.C.unshift(c);
                setTimeout(s.delayReady, parseInt(s.maxDelay / 2));
                break
            }
            s.da = 1;
            s[c.m].apply(s, c.a);
            s.da = 0
        }
    };
    s.setAccount = s.sa = function (b) {
        var a, c;
        if (!s.B("setAccount", arguments)) if (s.account = b, s.allAccounts) {
            a = s.allAccounts.concat(b.split(","));
            s.allAccounts = [];
            a.sort();
            for (c = 0; c < a.length; c++)(c == 0 || a[c - 1] != a[c]) && s.allAccounts.push(a[c])
        } else s.allAccounts = b.split(",")
    };
    s.W = function (b, a, c, e, d) {
        var f = "",
            g, j, w, q, i = 0;
        b == "contextData" && (b = "c");
        if (a) {
            for (g in a) if (!Object.prototype[g] && (!d || g.substring(0, d.length) == d) && a[g] && (!c || c.indexOf("," + (e ? e + "." : "") + g + ",") >= 0)) {
                w = !1;
                if (i) for (j = 0; j < i.length; j++) g.substring(0,
                i[j].length) == i[j] && (w = !0);
                if (!w && (f == "" && (f += "&" + b + "."), j = a[g], d && (g = g.substring(d.length)), g.length > 0)) if (w = g.indexOf("."), w > 0) j = g.substring(0, w), w = (d ? d : "") + j + ".", i || (i = []), i.push(w), f += s.W(j, a, c, e, w);
                else if (typeof j == "boolean" && (j = j ? "true" : "false"), j) {
                    if (e == "retrieveLightData" && d.indexOf(".contextData.") < 0) switch (w = g.substring(0, 4), q = g.substring(4), g) {
                        case "transactionID":
                            g = "xact";
                            break;
                        case "channel":
                            g = "ch";
                            break;
                        case "campaign":
                            g = "v0";
                            break;
                        default:
                            s.ja(q) && (w == "prop" ? g = "c" + q : w == "eVar" ? g = "v" + q : w == "list" ? g = "l" + q : w == "hier" && (g = "h" + q, j = j.substring(0, 255)))
                    }
                    f += "&" + s.escape(g) + "=" + s.escape(j)
                }
            }
            f != "" && (f += "&." + b)
        }
        return f
    };
    s.La = function () {
        var b = "",
            a, c, e, d, f, g, j, w, i = "",
            k = "",
            m = c = "";
        if (s.lightProfileID) a = s.P, (i = s.lightTrackVars) && (i = "," + i + "," + s.ma.join(",") + ",");
        else {
            a = s.e;
            if (s.pe || s.linkType) if (i = s.linkTrackVars, k = s.linkTrackEvents, s.pe && (c = s.pe.substring(0, 1).toUpperCase() + s.pe.substring(1), s[c])) i = s[c].pb, k = s[c].ob;
            i && (i = "," + i + "," + s.H.join(",") + ",");
            k && (k = "," + k + ",", i && (i += ",events,"));
            s.events2 && (m += (m != "" ? "," : "") + s.events2)
        }
        for (c = 0; c < a.length; c++) {
            d = a[c];
            f = s[d];
            e = d.substring(0, 4);
            g = d.substring(4);
            !f && d == "events" && m && (f = m, m = "");
            if (f && (!i || i.indexOf("," + d + ",") >= 0)) {
                switch (d) {
                    case "timestamp":
                        d = "ts";
                        break;
                    case "dynamicVariablePrefix":
                        d = "D";
                        break;
                    case "visitorID":
                        d = "vid";
                        break;
                    case "marketingCloudVisitorID":
                        d = "mid";
                        break;
                    case "analyticsVisitorID":
                        d = "aid";
                        break;
                    case "audienceManagerVisitorID":
                        d = "aamid";
                        break;
                    case "audienceManagerLocationHint":
                        d = "aamlh";
                        break;
                    case "pageURL":
                        d = "g";
                        if (f.length > 255) s.pageURLRest = f.substring(255), f = f.substring(0, 255);
                        break;
                    case "pageURLRest":
                        d = "-g";
                        break;
                    case "referrer":
                        d = "r";
                        break;
                    case "vmk":
                    case "visitorMigrationKey":
                        d = "vmt";
                        break;
                    case "visitorMigrationServer":
                        d = "vmf";
                        s.ssl && s.visitorMigrationServerSecure && (f = "");
                        break;
                    case "visitorMigrationServerSecure":
                        d = "vmf";
                        !s.ssl && s.visitorMigrationServer && (f = "");
                        break;
                    case "charSet":
                        d = "ce";
                        break;
                    case "visitorNamespace":
                        d = "ns";
                        break;
                    case "cookieDomainPeriods":
                        d = "cdp";
                        break;
                    case "cookieLifetime":
                        d = "cl";
                        break;
                    case "variableProvider":
                        d =
                            "vvp";
                        break;
                    case "currencyCode":
                        d = "cc";
                        break;
                    case "channel":
                        d = "ch";
                        break;
                    case "transactionID":
                        d = "xact";
                        break;
                    case "campaign":
                        d = "v0";
                        break;
                    case "resolution":
                        d = "s";
                        break;
                    case "colorDepth":
                        d = "c";
                        break;
                    case "javascriptVersion":
                        d = "j";
                        break;
                    case "javaEnabled":
                        d = "v";
                        break;
                    case "cookiesEnabled":
                        d = "k";
                        break;
                    case "browserWidth":
                        d = "bw";
                        break;
                    case "browserHeight":
                        d = "bh";
                        break;
                    case "connectionType":
                        d = "ct";
                        break;
                    case "homepage":
                        d = "hp";
                        break;
                    case "plugins":
                        d = "p";
                        break;
                    case "events":
                        m && (f += (f != "" ? "," : "") + m);
                        if (k) {
                            g = f.split(",");
                            f = "";
                            for (e = 0; e < g.length; e++) j = g[e], w = j.indexOf("="), w >= 0 && (j = j.substring(0, w)), w = j.indexOf(":"), w >= 0 && (j = j.substring(0, w)), k.indexOf("," + j + ",") >= 0 && (f += (f ? "," : "") + g[e])
                        }
                        break;
                    case "events2":
                        f = "";
                        break;
                    case "contextData":
                        b += s.W("c", s[d], i, d);
                        f = "";
                        break;
                    case "lightProfileID":
                        d = "mtp";
                        break;
                    case "lightStoreForSeconds":
                        d = "mtss";
                        s.lightProfileID || (f = "");
                        break;
                    case "lightIncrementBy":
                        d = "mti";
                        s.lightProfileID || (f = "");
                        break;
                    case "retrieveLightProfiles":
                        d = "mtsr";
                        break;
                    case "deleteLightProfiles":
                        d =
                            "mtsd";
                        break;
                    case "retrieveLightData":
                        s.retrieveLightProfiles && (b += s.W("mts", s[d], i, d));
                        f = "";
                        break;
                    default:
                        s.ja(g) && (e == "prop" ? d = "c" + g : e == "eVar" ? d = "v" + g : e == "list" ? d = "l" + g : e == "hier" && (d = "h" + g, f = f.substring(0, 255)))
                }
                f && (b += "&" + d + "=" + (d.substring(0, 3) != "pev" ? s.escape(f) : f))
            }
            d == "pev3" && s.g && (b += s.g)
        }
        return b
    };
    s.u = function (s) {
        var a = s.tagName;
        if ("" + s.nb != "undefined" || "" + s.Xa != "undefined" && ("" + s.Xa).toUpperCase() != "HTML") return "";
        a = a && a.toUpperCase ? a.toUpperCase() : "";
        a == "SHAPE" && (a = "");
        a && ((a == "INPUT" || a == "BUTTON") && s.type && s.type.toUpperCase ? a = s.type.toUpperCase() : !a && s.href && (a = "A"));
        return a
    };
    s.fa = function (s) {
        var a = s.href ? s.href : "",
            c, e, d;
        c = a.indexOf(":");
        e = a.indexOf("?");
        d = a.indexOf("/");
        if (a && (c < 0 || e >= 0 && c > e || d >= 0 && c > d)) e = s.protocol && s.protocol.length > 1 ? s.protocol : l.protocol ? l.protocol : "", c = l.pathname.lastIndexOf("/"), a = (e ? e + "//" : "") + (s.host ? s.host : l.host ? l.host : "") + (h.substring(0, 1) != "/" ? l.pathname.substring(0, c < 0 ? 0 : c) + "/" : "") + a;
        return a
    };
    s.D = function (b) {
        var a = s.u(b),
            c, e, d = "",
            f = 0;
        if (a) {
            c = b.protocol;
            e = b.onclick;
            if (b.href && (a == "A" || a == "AREA") && (!e || !c || c.toLowerCase().indexOf("javascript") < 0)) d = s.fa(b);
            else if (e) d = s.replace(s.replace(s.replace(s.replace("" + e, "\r", ""), "\n", ""), "\t", ""), " ", ""), f = 2;
            else if (a == "INPUT" || a == "SUBMIT") {
                if (b.value) d = b.value;
                else if (b.innerText) d = b.innerText;
                else if (b.textContent) d = b.textContent;
                f = 3
            } else if (b.src && a == "IMAGE") d = b.src;
            if (d) return {
                id: d.substring(0, 100),
                type: f
            }
        }
        return 0
    };
    s.kb = function (b) {
        for (var a = s.u(b), c = s.D(b); b && !c && a != "BODY";) if (b = b.parentElement ? b.parentElement : b.parentNode) a = s.u(b), c = s.D(b);
        if (!c || a == "BODY") b = 0;
        if (b && (a = b.onclick ? "" + b.onclick : "", a.indexOf(".tl(") >= 0 || a.indexOf(".trackLink(") >= 0)) b = 0;
        return b
    };
    s.Va = function () {
        var b, a, c = s.linkObject,
            e = s.linkType,
            d = s.linkURL,
            f, g;
        s.Q = 1;
        if (!c) s.Q = 0, c = s.j;
        if (c) {
            b = s.u(c);
            for (a = s.D(c); c && !a && b != "BODY";) if (c = c.parentElement ? c.parentElement : c.parentNode) b = s.u(c), a = s.D(c);
            if (!a || b == "BODY") c = 0;
            if (c) {
                var j = c.onclick ? "" + c.onclick : "";
                if (j.indexOf(".tl(") >= 0 || j.indexOf(".trackLink(") >= 0) c = 0
            }
        } else s.Q = 1;
        !d && c && (d = s.fa(c));
        d && !s.linkLeaveQueryString && (f = d.indexOf("?"), f >= 0 && (d = d.substring(0, f)));
        if (!e && d) {
            var i = 0,
                k = 0,
                m;
            if (s.trackDownloadLinks && s.linkDownloadFileTypes) {
                j = d.toLowerCase();
                f = j.indexOf("?");
                g = j.indexOf("#");
                f >= 0 ? g >= 0 && g < f && (f = g) : f = g;
                f >= 0 && (j = j.substring(0, f));
                f = s.linkDownloadFileTypes.toLowerCase().split(",");
                for (g = 0; g < f.length; g++)(m = f[g]) && j.substring(j.length - (m.length + 1)) == "." + m && (e = "d")
            }
            if (s.trackExternalLinks && !e && (j = d.toLowerCase(), s.ia(j))) {
                if (!s.linkInternalFilters) s.linkInternalFilters = w.location.hostname;
                f = 0;
                s.linkExternalFilters ? (f = s.linkExternalFilters.toLowerCase().split(","), i = 1) : s.linkInternalFilters && (f = s.linkInternalFilters.toLowerCase().split(","));
                if (f) {
                    for (g = 0; g < f.length; g++) m = f[g], j.indexOf(m) >= 0 && (k = 1);
                    k ? i && (e = "e") : i || (e = "e")
                }
            }
        }
        s.linkObject = c;
        s.linkURL = d;
        s.linkType = e;
        if (s.trackClickMap || s.trackInlineStats) if (s.g = "", c) {
            e = s.pageName;
            d = 1;
            c = c.sourceIndex;
            if (!e) e = s.pageURL, d = 0;
            if (w.s_objectID) a.id = w.s_objectID, c = a.type = 1;
            if (e && a && a.id && b) s.g = "&pid=" + s.escape(e.substring(0, 255)) + (d ? "&pidt=" + d : "") + "&oid=" + s.escape(a.id.substring(0, 100)) + (a.type ? "&oidt=" + a.type : "") + "&ot=" + b + (c ? "&oi=" + c : "")
        }
    };
    s.Ma = function () {
        var b = s.Q,
            a = s.linkType,
            c = s.linkURL,
            e = s.linkName;
        if (a && (c || e)) a = a.toLowerCase(), a != "d" && a != "e" && (a = "o"), s.pe = "lnk_" + a, s.pev1 = c ? s.escape(c) : "", s.pev2 = e ? s.escape(e) : "", b = 1;
        s.abort && (b = 0);
        if (s.trackClickMap || s.trackInlineStats) {
            a = {};
            c = 0;
            var d = s.cookieRead("s_sq"),
                f = d ? d.split("&") : 0,
                g, j, w;
            d = 0;
            if (f) for (g = 0; g < f.length; g++) j = f[g].split("="), e = s.unescape(j[0]).split(","), j = s.unescape(j[1]),
            a[j] = e;
            e = s.account.split(",");
            if (b || s.g) {
                b && !s.g && (d = 1);
                for (j in a) if (!Object.prototype[j]) for (g = 0; g < e.length; g++) {
                    d && (w = a[j].join(","), w == s.account && (s.g += (j.charAt(0) != "&" ? "&" : "") + j, a[j] = [], c = 1));
                    for (f = 0; f < a[j].length; f++) w = a[j][f], w == e[g] && (d && (s.g += "&u=" + s.escape(w) + (j.charAt(0) != "&" ? "&" : "") + j + "&u=0"), a[j].splice(f, 1), c = 1)
                }
                b || (c = 1);
                if (c) {
                    d = "";
                    g = 2;
                    !b && s.g && (d = s.escape(e.join(",")) + "=" + s.escape(s.g), g = 1);
                    for (j in a)!Object.prototype[j] && g > 0 && a[j].length > 0 && (d += (d ? "&" : "") + s.escape(a[j].join(",")) +
                        "=" + s.escape(j), g--);
                    s.cookieWrite("s_sq", d)
                }
            }
        }
        return b
    };
    s.Na = function () {
        if (!s.bb) {
            var b = new Date,
                a = m.location,
                c, e, d, f = d = e = c = "",
                g = "",
                w = "",
                i = "1.2",
                k = s.cookieWrite("s_cc", "true", 0) ? "Y" : "N",
                n = "",
                p = "",
                o = 0;
            if (b.setUTCDate && (i = "1.3", o.toPrecision && (i = "1.5", c = [], c.forEach))) {
                i = "1.6";
                d = 0;
                e = {};
                try {
                    d = new Iterator(e), d.next && (i = "1.7", c.reduce && (i = "1.8", i.trim && (i = "1.8.1", Date.parse && (i = "1.8.2", Object.create && (i = "1.8.5")))))
                } catch (r) {}
            }
            c = screen.width + "x" + screen.height;
            d = navigator.javaEnabled() ? "Y" : "N";
            e = screen.pixelDepth ? screen.pixelDepth : screen.colorDepth;
            g = s.w.innerWidth ? s.w.innerWidth : s.d.documentElement.offsetWidth;
            w = s.w.innerHeight ? s.w.innerHeight : s.d.documentElement.offsetHeight;
            b = navigator.plugins;
            try {
                s.b.addBehavior("#default#homePage"), n = s.b.lb(a) ? "Y" : "N"
            } catch (t) {}
            try {
                s.b.addBehavior("#default#clientCaps"), p = s.b.connectionType
            } catch (u) {}
            if (b) for (; o < b.length && o < 30;) {
                if (a = b[o].name) a = a.substring(0, 100) + ";", f.indexOf(a) < 0 && (f += a);
                o++
            }
            s.resolution = c;
            s.colorDepth = e;
            s.javascriptVersion = i;
            s.javaEnabled = d;
            s.cookiesEnabled = k;
            s.browserWidth = g;
            s.browserHeight = w;
            s.connectionType = p;
            s.homepage = n;
            s.plugins = f;
            s.bb = 1
        }
    };
    s.G = {};
    s.loadModule = function (b, a) {
        var c = s.G[b];
        if (!c) {
            c = w["AppMeasurement_Module_" + b] ? new w["AppMeasurement_Module_" + b](s) : {};
            s.G[b] = s[b] = c;
            c.ua = function () {
                return c.wa
            };
            c.xa = function (a) {
                if (c.wa = a) s[b + "_onLoad"] = a, s.B(b + "_onLoad", [s, c], 1) || a(s, c)
            };
            try {
                Object.defineProperty ? Object.defineProperty(c, "onLoad", {
                    get: c.ua,
                    set: c.xa
                }) : c._olc = 1
            } catch (e) {
                c._olc = 1
            }
        }
        a && (s[b + "_onLoad"] = a, s.B(b + "_onLoad", [s, c], 1) || a(s, c))
    };
    s.q = function (b) {
        var a, c;
        for (a in s.G) if (!Object.prototype[a] && (c = s.G[a])) {
            if (c._olc && c.onLoad) c._olc = 0, c.onLoad(s, c);
            if (c[b] && c[b]()) return 1
        }
        return 0
    };
    s.Qa = function () {
        var b = Math.floor(Math.random() * 1E13),
            a = s.visitorSampling,
            c = s.visitorSamplingGroup;
        c = "s_vsn_" + (s.visitorNamespace ? s.visitorNamespace : s.account) + (c ? "_" + c : "");
        var e = s.cookieRead(c);
        if (a) {
            e && (e = parseInt(e));
            if (!e) {
                if (!s.cookieWrite(c, b)) return 0;
                e = b
            }
            if (e % 1E4 > v) return 0
        }
        return 1
    };
    s.I = function (b, a) {
        var c, e, d, f, g, w;
        for (c = 0; c < 2; c++) {
            e = c > 0 ? s.$ : s.e;
            for (d = 0; d < e.length; d++) if (f = e[d], (g = b[f]) || b["!" + f]) {
                if (!a && (f == "contextData" || f == "retrieveLightData") && s[f]) for (w in s[f]) g[w] || (g[w] = s[f][w]);
                s[f] = g
            }
        }
    };
    s.qa = function (b, a) {
        var c, e, d, f;
        for (c = 0; c < 2; c++) {
            e = c > 0 ? s.$ : s.e;
            for (d = 0; d < e.length; d++) f = e[d], b[f] = s[f], !a && !b[f] && (b["!" + f] = 1)
        }
    };
    s.Ia = function (s) {
        var a, c, e, d, f, g = 0,
            w, i = "",
            k = "";
        if (s && s.length > 255 && (a = "" + s, c = a.indexOf("?"), c > 0 && (w = a.substring(c + 1), a = a.substring(0, c), d = a.toLowerCase(), e = 0, d.substring(0, 7) == "http://" ? e += 7 : d.substring(0, 8) == "https://" && (e += 8), c = d.indexOf("/", e), c > 0 && (d = d.substring(e, c), f = a.substring(c), a = a.substring(0, c), d.indexOf("google") >= 0 ? g = ",q,ie,start,search_key,word,kw,cd," : d.indexOf("yahoo.co") >= 0 && (g = ",p,ei,"), g && w)))) {
            if ((s = w.split("&")) && s.length > 1) {
                for (e = 0; e < s.length; e++) d = s[e], c = d.indexOf("="), c > 0 && g.indexOf("," + d.substring(0, c) + ",") >= 0 ? i += (i ? "&" : "") + d : k += (k ? "&" : "") + d;
                i && k ? w = i + "&" + k : k = ""
            }
            c = 253 - (w.length - k.length) - a.length;
            s = a + (c > 0 ? f.substring(0, c) : "") + "?" + w
        }
        return s
    };
    s.za = !1;
    s.Z = !1;
    s.ib = function (b) {
        s.marketingCloudVisitorID = b;
        s.Z = !0;
        s.z()
    };
    s.J = !1;
    s.X = !1;
    s.ta = function (b) {
        s.analyticsVisitorID = b;
        s.X = !0;
        s.z()
    };
    s.ya = !1;
    s.Y = !1;
    s.hb = function (b) {
        s.audienceManagerVisitorID = b;
        if (s.audienceManagerVisitorID && s.visitor.getAudienceManagerLocationHint) s.audienceManagerLocationHint = s.visitor.getAudienceManagerLocationHint();
        s.Y = !0;
        s.z()
    };
    s.isReadyToTrack = function () {
        var b = !0,
            a = s.visitor;
        if (a && a.isAllowed()) {
            if (!s.J && !s.analyticsVisitorID && a.getAnalyticsVisitorID && (s.analyticsVisitorID = a.getAnalyticsVisitorID([s, s.ta]), !s.analyticsVisitorID)) s.J = !0;
            if (s.za && !s.Z && !s.marketingCloudVisitorID || s.J && !s.X && !s.analyticsVisitorID || s.ya && !s.Y && !s.audienceManagerVisitorID) b = !1
        }
        return b
    };
    s.k = k;
    s.l = 0;
    s.callbackWhenReadyToTrack = function (b, a, c) {
        var e;
        e = {};
        e.Da = b;
        e.Ca = a;
        e.Aa = c;
        if (s.k == k) s.k = [];
        s.k.push(e);
        if (s.l == 0) s.l = setInterval(s.z, 100)
    };
    s.z = function () {
        var b;
        if (s.isReadyToTrack()) {
            if (s.l) clearInterval(s.l), s.l = 0;
            if (s.k != k) for (; s.k.length > 0;) b = s.k.shift(), b.Ca.apply(b.Da, b.Aa)
        }
    };
    s.va = function (b) {
        var a, c, e = k,
            d = k;
        if (!s.isReadyToTrack()) {
            a = [];
            if (b != k) for (c in e = {}, b) e[c] = b[c];
            d = {};
            s.qa(d, !0);
            a.push(e);
            a.push(d);
            s.callbackWhenReadyToTrack(s, s.track, a);
            return !0
        }
        return !1
    };
    s.Ka = function () {
        var b = s.cookieRead("s_fid"),
            a = "",
            c = "",
            e;
        e = 8;
        var d = 4;
        if (!b || b.indexOf("-") < 0) {
            for (b = 0; b < 16; b++) e = Math.floor(Math.random() * e), a += "0123456789ABCDEF".substring(e, e + 1), e = Math.floor(Math.random() * d), c += "0123456789ABCDEF".substring(e, e + 1), e = d = 16;
            b = a + "-" + c
        }
        s.cookieWrite("s_fid", b, 1) || (b = 0);
        return b
    };
    s.t = s.track = function (b, a) {
        var c, e = new Date,
            d = "s" + Math.floor(e.getTime() / 108E5) % 10 + Math.floor(Math.random() * 1E13),
            f = e.getYear();
        f = "t=" + s.escape(e.getDate() + "/" + e.getMonth() + "/" + (f < 1900 ? f + 1900 : f) + " " + e.getHours() + ":" + e.getMinutes() + ":" + e.getSeconds() + " " + e.getDay() + " " + e.getTimezoneOffset());
        s.q("_s");
        if (!s.B("track", arguments)) {
            if (!s.va(b)) {
                a && s.I(a);
                b && (c = {}, s.qa(c, 0), s.I(b));
                if (s.Qa()) {
                    if (!s.analyticsVisitorID && !s.marketingCloudVisitorID) s.fid = s.Ka();
                    s.Va();
                    s.usePlugins && s.doPlugins && s.doPlugins(s);
                    if (s.account) {
                        if (!s.abort) {
                            if (s.trackOffline && !s.timestamp) s.timestamp = Math.floor(e.getTime() / 1E3);
                            e = w.location;
                            if (!s.pageURL) s.pageURL = e.href ? e.href : e;
                            if (!s.referrer && !s.ra) s.referrer = m.document.referrer, s.ra = 1;
                            s.referrer = s.Ia(s.referrer);
                            s.q("_g")
                        }
                        s.Ma() && !s.abort && (s.Na(), f += s.La(), s.Ua(d, f));
                        s.abort || s.q("_t")
                    }
                }
                b && s.I(c, 1)
            }
            s.timestamp = s.linkObject = s.j = s.linkURL = s.linkName = s.linkType = w.mb = s.pe = s.pev1 = s.pev2 = s.pev3 = s.g = 0
        }
    };
    s.tl = s.trackLink = function (b, a, c, e, d) {
        s.linkObject = b;
        s.linkType = a;
        s.linkName = c;
        if (d) s.i = b, s.p = d;
        return s.track(e)
    };
    s.trackLight = function (b, a, c, e) {
        s.lightProfileID = b;
        s.lightStoreForSeconds = a;
        s.lightIncrementBy = c;
        return s.track(e)
    };
    s.clearVars = function () {
        var b, a;
        for (b = 0; b < s.e.length; b++) if (a = s.e[b], a.substring(0, 4) == "prop" || a.substring(0, 4) == "eVar" || a.substring(0, 4) == "hier" || a.substring(0, 4) == "list" || a == "channel" || a == "events" || a == "eventList" || a == "products" || a == "productList" || a == "purchaseID" || a == "transactionID" || a == "state" || a == "zip" || a == "campaign") s[a] = void 0
    };
    s.Ua = function (b, a) {
        var c, e = s.trackingServer;
        c = "";
        var d = s.dc,
            f = "sc.",
            w = s.visitorNamespace;
        if (e) {
            if (s.trackingServerSecure && s.ssl) e = s.trackingServerSecure
        } else {
            if (!w) w = s.account, e = w.indexOf(","), e >= 0 && (w = w.gb(0, e)), w = w.replace(/[^A-Za-z0-9]/g, "");
            c || (c = "2o7.net");
            d = d ? ("" + d).toLowerCase() : "d1";
            c == "2o7.net" && (d == "d1" ? d = "112" : d == "d2" && (d = "122"), f = "");
            e = w + "." + d + "." + f + c
        }
        c = s.ssl ? "https://" : "http://";
        c += e + "/b/ss/" + s.account + "/" + (s.mobile ? "5." : "") + "1/JS-" + s.version + (s.ab ? "T" : "") + "/" + b + "?AQB=1&ndh=1&" + a + "&AQE=1";
        s.Pa && (c = c.substring(0, 2047));
        s.Ga(c);
        s.N()
    };
    s.Ga = function (b) {
        s.c || s.Oa();
        s.c.push(b);
        s.O = s.r();
        s.pa()
    };
    s.Oa = function () {
        s.c = s.Ra();
        if (!s.c) s.c = []
    };
    s.Ra = function () {
        var b, a;
        if (s.T()) {
            try {
                (a = w.localStorage.getItem(s.R())) && (b = w.JSON.parse(a))
            } catch (c) {}
            return b
        }
    };
    s.T = function () {
        var b = !0;
        if (!s.trackOffline || !s.offlineFilename || !w.localStorage || !w.JSON) b = !1;
        return b
    };
    s.ga = function () {
        var b = 0;
        if (s.c) b = s.c.length;
        s.v && b++;
        return b
    };
    s.N = function () {
        if (!s.v) if (s.ha = k, s.S) s.O > s.F && s.na(s.c), s.V(500);
        else {
            var b = s.Ba();
            if (b > 0) s.V(b);
            else if (b = s.ea()) s.v = 1, s.Ta(b), s.Ya(b)
        }
    };
    s.V = function (b) {
        if (!s.ha) b || (b = 0), s.ha = setTimeout(s.N, b)
    };
    s.Ba = function () {
        var b;
        if (!s.trackOffline || s.offlineThrottleDelay <= 0) return 0;
        b = s.r() - s.la;
        if (s.offlineThrottleDelay < b) return 0;
        return s.offlineThrottleDelay - b
    };
    s.ea = function () {
        if (s.c.length > 0) return s.c.shift()
    };
    s.Ta = function (b) {
        if (s.debugTracking) {
            var a = "AppMeasurement Debug: " + b;
            b = b.split("&");
            var c;
            for (c = 0; c < b.length; c++) a += "\n\t" + s.unescape(b[c]);
            s.Sa(a)
        }
    };
    s.Ya = function (b) {
        var a;
        if (!a) a = new Image, a.alt = "";
        a.ba = function () {
            try {
                if (s.U) clearTimeout(s.U), s.U = 0;
                if (a.timeout) clearTimeout(a.timeout), a.timeout = 0
            } catch (b) {}
        };
        a.onload = a.$a = function () {
            a.ba();
            s.Fa();
            s.K();
            s.v = 0;
            s.N()
        };
        a.onabort = a.onerror = a.Ha = function () {
            a.ba();
            (s.trackOffline || s.S) && s.v && s.c.unshift(s.Ea);
            s.v = 0;
            s.O > s.F && s.na(s.c);
            s.K();
            s.V(500)
        };
        a.onreadystatechange = function () {
            a.readyState == 4 && (a.status == 200 ? a.$a() : a.Ha())
        };
        s.la = s.r();
        a.src = b;
        if (a.abort) s.U = setTimeout(a.abort, 5E3);
        s.Ea = b;
        s.jb = w["s_i_" + s.replace(s.account, ",", "_")] = a;
        if (s.useForcedLinkTracking && s.A || s.p) {
            if (!s.forcedLinkTrackingTimeout) s.forcedLinkTrackingTimeout = 250;
            s.L = setTimeout(s.K,
            s.forcedLinkTrackingTimeout)
        }
    };
    s.Fa = function () {
        if (s.T() && !(s.ka > s.F)) try {
            w.localStorage.removeItem(s.R()), s.ka = s.r()
        } catch (b) {}
    };
    s.na = function (b) {
        if (s.T()) {
            s.pa();
            try {
                w.localStorage.setItem(s.R(), w.JSON.stringify(b)), s.F = s.r()
            } catch (a) {}
        }
    };
    s.pa = function () {
        if (s.trackOffline) {
            if (!s.offlineLimit || s.offlineLimit <= 0) s.offlineLimit = 10;
            for (; s.c.length > s.offlineLimit;) s.ea()
        }
    };
    s.forceOffline = function () {
        s.S = !0
    };
    s.forceOnline = function () {
        s.S = !1
    };
    s.R = function () {
        return s.offlineFilename + "-" + s.visitorNamespace + s.account
    };
    s.r = function () {
        return (new Date).getTime()
    };
    s.ia = function (s) {
        s = s.toLowerCase();
        if (s.indexOf("#") != 0 && s.indexOf("about:") != 0 && s.indexOf("opera:") != 0 && s.indexOf("javascript:") != 0) return !0;
        return !1
    };
    s.setTagContainer = function (b) {
        var a, c, e;
        s.ab = b;
        for (a = 0; a < s._il.length; a++) if ((c = s._il[a]) && c._c == "s_l" && c.tagContainerName == b) {
            s.I(c);
            if (c.lmq) for (a = 0; a < c.lmq.length; a++) e = c.lmq[a], s.loadModule(e.n);
            if (c.ml) for (e in c.ml) if (s[e]) for (a in b = s[e], e = c.ml[e], e) if (!Object.prototype[a] && (typeof e[a] !=
                "function" || ("" + e[a]).indexOf("s_c_il") < 0)) b[a] = e[a];
            if (c.mmq) for (a = 0; a < c.mmq.length; a++) e = c.mmq[a], s[e.m] && (b = s[e.m], b[e.f] && typeof b[e.f] == "function" && (e.a ? b[e.f].apply(b, e.a) : b[e.f].apply(b)));
            if (c.tq) for (a = 0; a < c.tq.length; a++) s.track(c.tq[a]);
            c.s = s;
            break
        }
    };
    s.Util = {
        urlEncode: s.escape,
        urlDecode: s.unescape,
        cookieRead: s.cookieRead,
        cookieWrite: s.cookieWrite,
        getQueryParam: function (b, a, c) {
            var e;
            a || (a = s.pageURL ? s.pageURL : w.location);
            c || (c = "&");
            if (b && a && (a = "" + a, e = a.indexOf("?"), e >= 0 && (a = c + a.substring(e + 1) + c, e = a.indexOf(c + b + "="), e >= 0 && (a = a.substring(e + c.length + b.length + 1), e = a.indexOf(c), e >= 0 && (a = a.substring(0, e)), a.length > 0)))) return s.unescape(a);
            return ""
        }
    };
    s.H = ["timestamp", "dynamicVariablePrefix", "visitorID", "marketingCloudVisitorID", "analyticsVisitorID", "audienceManagerVisitorID", "audienceManagerLocationHint", "fid", "vmk", "visitorMigrationKey", "visitorMigrationServer", "visitorMigrationServerSecure", "charSet", "visitorNamespace", "cookieDomainPeriods", "fpCookieDomainPeriods", "cookieLifetime", "pageName",
        "pageURL", "referrer", "contextData", "currencyCode", "lightProfileID", "lightStoreForSeconds", "lightIncrementBy", "retrieveLightProfiles", "deleteLightProfiles", "retrieveLightData", "pe", "pev1", "pev2", "pev3", "pageURLRest"];
    s.e = s.H.concat(["purchaseID", "variableProvider", "channel", "server", "pageType", "transactionID", "campaign", "state", "zip", "events", "events2", "products", "tnt"]);
    s.ma = ["timestamp", "charSet", "visitorNamespace", "cookieDomainPeriods", "cookieLifetime", "contextData", "lightProfileID", "lightStoreForSeconds",
        "lightIncrementBy"];
    s.P = s.ma.slice(0);
    s.$ = ["account", "allAccounts", "debugTracking", "visitor", "trackOffline", "offlineLimit", "offlineThrottleDelay", "offlineFilename", "usePlugins", "doPlugins", "configURL", "visitorSampling", "s.visitorSamplingGroup", "linkObject", "linkURL", "linkName", "linkType", "trackDownloadLinks", "trackExternalLinks", "trackClickMap", "trackInlineStats", "linkLeaveQueryString", "linkTrackVars", "linkTrackEvents", "linkDownloadFileTypes", "linkExternalFilters", "linkInternalFilters", "useForcedLinkTracking",
        "forcedLinkTrackingTimeout", "trackingServer", "trackingServerSecure", "ssl", "abort", "mobile", "dc", "lightTrackVars", "maxDelay"];
    for (i = 0; i <= 75; i++) s.e.push("prop" + i), s.P.push("prop" + i), s.e.push("eVar" + i), s.P.push("eVar" + i), i < 6 && s.e.push("hier" + i), i < 4 && s.e.push("list" + i);
    i = ["resolution", "colorDepth", "javascriptVersion", "javaEnabled", "cookiesEnabled", "browserWidth", "browserHeight", "connectionType", "homepage", "plugins"];
    s.e = s.e.concat(i);
    s.H = s.H.concat(i);
    s.ssl = w.location.protocol.toLowerCase().indexOf("https") >= 0;
    s.charSet = "UTF-8";
    s.contextData = {};
    s.offlineThrottleDelay = 0;
    s.offlineFilename = "AppMeasurement.offline";
    s.la = 0;
    s.O = 0;
    s.F = 0;
    s.ka = 0;
    s.linkDownloadFileTypes = "exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";
    s.w = w;
    s.d = w.document;
    try {
        s.Pa = navigator.appName == "Microsoft Internet Explorer"
    } catch (o) {}
    s.K = function () {
        if (s.L) w.clearTimeout(s.L), s.L = k;
        s.i && s.A && s.i.dispatchEvent(s.A);
        if (s.p) if (typeof s.p == "function") s.p();
        else if (s.i && s.i.href) s.d.location = s.i.href;
        s.i = s.A = s.p = 0
    };
    s.oa = function () {
        s.b = s.d.body;
        if (s.b) if (s.o = function (b) {
            var a, c, e, d, f;
            if (!(s.d && s.d.getElementById("cppXYctnr") || b && b.Wa)) {
                if (s.aa) if (s.useForcedLinkTracking) s.b.removeEventListener("click", s.o, !1);
                else {
                    s.b.removeEventListener("click", s.o, !0);
                    s.aa = s.useForcedLinkTracking = 0;
                    return
                } else s.useForcedLinkTracking = 0;
                s.j = b.srcElement ? b.srcElement : b.target;
                try {
                    if (s.j && (s.j.tagName || s.j.parentElement || s.j.parentNode)) if (e = s.ga(), s.track(), e < s.ga() && s.useForcedLinkTracking && b.target) {
                        for (d = b.target; d && d != s.b && d.tagName.toUpperCase() !=
                            "A" && d.tagName.toUpperCase() != "AREA";) d = d.parentNode;
                        if (d && (f = d.href, s.ia(f) || (f = 0), c = d.target, b.target.dispatchEvent && f && (!c || c == "_self" || c == "_top" || c == "_parent" || w.name && c == w.name))) {
                            try {
                                a = s.d.createEvent("MouseEvents")
                            } catch (g) {
                                a = new w.MouseEvent
                            }
                            if (a) {
                                try {
                                    a.initMouseEvent("click", b.bubbles, b.cancelable, b.view, b.detail, b.screenX, b.screenY, b.clientX, b.clientY, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, b.button, b.relatedTarget)
                                } catch (i) {
                                    a = 0
                                }
                                if (a) a.Wa = 1, b.stopPropagation(), b.Za && b.Za(), b.preventDefault(),
                                s.i = b.target, s.A = a
                            }
                        }
                    }
                } catch (k) {}
                s.j = 0
            }
        }, s.b && s.b.attachEvent) s.b.attachEvent("onclick", s.o);
        else {
            if (s.b && s.b.addEventListener) {
                if (navigator && (navigator.userAgent.indexOf("WebKit") >= 0 && s.d.createEvent || navigator.userAgent.indexOf("Firefox/2") >= 0 && w.MouseEvent)) s.aa = 1, s.useForcedLinkTracking = 1, s.b.addEventListener("click", s.o, !0);
                s.b.addEventListener("click", s.o, !1)
            }
        } else setTimeout(s.oa, 30)
    };
    s.oa()
}

function s_gi(s) {
    var w, k = window.s_c_il,
        m, i = s.split(","),
        n, p, o = 0;
    if (k) for (m = 0; !o && m < k.length;) {
        w = k[m];
        if (w._c == "s_c" && w.account) if (w.account == s) o = 1;
        else {
            if (!w.allAccounts) w.allAccounts = w.account.split(",");
            for (n = 0; n < i.length; n++) for (p = 0; p < w.allAccounts.length; p++) i[n] == w.allAccounts[p] && (o = 1)
        }
        m++
    }
    o || (w = new AppMeasurement);
    w.setAccount(s);
    return w
}
AppMeasurement.getInstance = s_gi;
window.s_objectID || (window.s_objectID = 0);

function s_pgicq() {
    var s = window,
        w = s.s_giq,
        k, m, i;
    if (w) for (k = 0; k < w.length; k++) m = w[k], i = s_gi(m.oun), i.setAccount(m.un), i.setTagContainer(m.tagContainerName);
    s.s_giq = 0
}
s_pgicq();

var mboxCopyright = "Copyright 1996-2013. Adobe Systems Incorporated. All rights reserved.";
mboxUrlBuilder = function (a, b) {
    this.a = a;
    this.b = b;
    this.c = new Array();
    this.d = function (e) {
        return e;
    };
    this.f = null;
};
mboxUrlBuilder.prototype.addNewParameter = function (g, h) {
    this.c.push({
        name: g,
        value: h
    });
    return this;
};
mboxUrlBuilder.prototype.addParameterIfAbsent = function (g, h) {
    if (h) {
        for (var i = 0; i < this.c.length; i++) {
            var j = this.c[i];
            if (j.name === g) {
                return this;
            }
        }
        this.checkInvalidCharacters(g);
        return this.addNewParameter(g, h);
    }
};
mboxUrlBuilder.prototype.addParameter = function (g, h) {
    this.checkInvalidCharacters(g);
    for (var i = 0; i < this.c.length; i++) {
        var j = this.c[i];
        if (j.name === g) {
            j.value = h;
            return this;
        }
    }
    return this.addNewParameter(g, h);
};
mboxUrlBuilder.prototype.addParameters = function (c) {
    if (!c) {
        return this;
    }
    for (var i = 0; i < c.length; i++) {
        var k = c[i].indexOf('=');
        if (k == -1 || k == 0) {
            continue;
        }
        this.addParameter(c[i].substring(0, k), c[i].substring(k + 1, c[i].length));
    }
    return this;
};
mboxUrlBuilder.prototype.setServerType = function (l) {
    this.m = l;
};
mboxUrlBuilder.prototype.setBasePath = function (f) {
    this.f = f;
};
mboxUrlBuilder.prototype.setUrlProcessAction = function (n) {
    this.d = n;
};
mboxUrlBuilder.prototype.buildUrl = function () {
    var o = this.f ? this.f : '/m2/' + this.b + '/mbox/' + this.m;
    var p = document.location.protocol == 'file:' ? 'http:' : document.location.protocol;
    var e = p + "//" + this.a + o;
    var q = e.indexOf('?') != -1 ? '&' : '?';
    for (var i = 0; i < this.c.length; i++) {
        var j = this.c[i];
        e += q + encodeURIComponent(j.name) + '=' + encodeURIComponent(j.value);
        q = '&';
    }
    return this.r(this.d(e));
};
mboxUrlBuilder.prototype.getParameters = function () {
    return this.c;
};
mboxUrlBuilder.prototype.setParameters = function (c) {
    this.c = c;
};
mboxUrlBuilder.prototype.clone = function () {
    var s = new mboxUrlBuilder(this.a, this.b);
    s.setServerType(this.m);
    s.setBasePath(this.f);
    s.setUrlProcessAction(this.d);
    for (var i = 0; i < this.c.length; i++) {
        s.addParameter(this.c[i].name, this.c[i].value);
    }
    return s;
};
mboxUrlBuilder.prototype.r = function (t) {
    return t.replace(/\"/g, '&quot;').replace(/>/g, '&gt;');
};
mboxUrlBuilder.prototype.checkInvalidCharacters = function (g) {
    var u = new RegExp('(\'|")');
    if (u.exec(g)) {
        throw "Parameter '" + g + "' contains invalid characters";
    }
};
mboxStandardFetcher = function () {};
mboxStandardFetcher.prototype.getType = function () {
    return 'standard';
};
mboxStandardFetcher.prototype.fetch = function (v) {
    v.setServerType(this.getType());
    document.write('<' + 'scr' + 'ipt src="' + v.buildUrl() + '" language="JavaScript"><' + '\/scr' + 'ipt>');
};
mboxStandardFetcher.prototype.cancel = function () {};
mboxAjaxFetcher = function () {};
mboxAjaxFetcher.prototype.getType = function () {
    return 'ajax';
};
mboxAjaxFetcher.prototype.fetch = function (v) {
    v.setServerType(this.getType());
    var e = v.buildUrl();
    this.w = document.createElement('script');
    this.w.src = e;
    document.body.appendChild(this.w);
};
mboxAjaxFetcher.prototype.cancel = function () {};
mboxMap = function () {
    this.x = new Object();
    this.y = new Array();
};
mboxMap.prototype.put = function (z, h) {
    if (!this.x[z]) {
        this.y[this.y.length] = z;
    }
    this.x[z] = h;
};
mboxMap.prototype.get = function (z) {
    return this.x[z];
};
mboxMap.prototype.remove = function (z) {
    this.x[z] = undefined;
};
mboxMap.prototype.each = function (n) {
    for (var i = 0; i < this.y.length; i++) {
        var z = this.y[i];
        var h = this.x[z];
        if (h) {
            var A = n(z, h);
            if (A === false) {
                break;
            }
        }
    }
};
mboxFactory = function (B, b, C) {
    this.D = false;
    this.B = B;
    this.C = C;
    this.E = new mboxList();
    mboxFactories.put(C, this);
    this.F = typeof document.createElement('div').replaceChild != 'undefined' && (function () {
        return true;
    })() && typeof document.getElementById != 'undefined' && typeof (window.attachEvent || document.addEventListener || window.addEventListener) != 'undefined' && typeof encodeURIComponent != 'undefined';
    this.G = this.F && mboxGetPageParameter('mboxDisable') == null;
    var H = C == 'default';
    this.I = new mboxCookieManager('mbox' + (H ? '' : ('-' + C)), (function () {
        return mboxCookiePageDomain();
    })());
    this.G = this.G && this.I.isEnabled() && (this.I.getCookie('disable') == null);
    if (this.isAdmin()) {
        this.enable();
    }
    this.J();
    this.K = mboxGenerateId();
    this.L = mboxScreenHeight();
    this.M = mboxScreenWidth();
    this.N = mboxBrowserWidth();
    this.O = mboxBrowserHeight();
    this.P = mboxScreenColorDepth();
    this.Q = mboxBrowserTimeOffset();
    this.R = new mboxSession(this.K, 'mboxSession', 'session', 31 * 60, this.I);
    this.S = new mboxPC('PC', 7776000, this.I);
    this.v = new mboxUrlBuilder(B, b);
    this.T(this.v, H);
    this.U = new Date().getTime();
    this.V = this.U;
    var W = this;
    this.addOnLoad(function () {
        W.V = new Date().getTime();
    });
    if (this.F) {
        this.addOnLoad(function () {
            W.D = true;
            W.getMboxes().each(function (X) {
                X.setFetcher(new mboxAjaxFetcher());
                X.finalize();
            });
        });
        if (this.G) {
            this.limitTraffic(100, 10368000);
            this.Y();
            this.Z = new mboxSignaler(function (_, c) {
                return W.create(_, c);
            }, this.I);
        }
    }
};
mboxFactory.prototype.isEnabled = function () {
    return this.G;
};
mboxFactory.prototype.getDisableReason = function () {
    return this.I.getCookie('disable');
};
mboxFactory.prototype.isSupported = function () {
    return this.F;
};
mboxFactory.prototype.disable = function (ab, bb) {
    if (typeof ab == 'undefined') {
        ab = 60 * 60;
    }
    if (typeof bb == 'undefined') {
        bb = 'unspecified';
    }
    if (!this.isAdmin()) {
        this.G = false;
        this.I.setCookie('disable', bb, ab);
    }
};
mboxFactory.prototype.enable = function () {
    this.G = true;
    this.I.deleteCookie('disable');
};
mboxFactory.prototype.isAdmin = function () {
    return document.location.href.indexOf('mboxEnv') != -1;
};
mboxFactory.prototype.limitTraffic = function (cb, ab) {};
mboxFactory.prototype.addOnLoad = function (db) {
    if (this.isDomLoaded()) {
        db();
    } else {
        var eb = false;
        var fb = function () {
            if (eb) {
                return;
            }
            eb = true;
            db();
        };
        this.gb.push(fb);
        if (this.isDomLoaded() && !eb) {
            fb();
        }
    }
};
mboxFactory.prototype.getEllapsedTime = function () {
    return this.V - this.U;
};
mboxFactory.prototype.getEllapsedTimeUntil = function (hb) {
    return hb - this.U;
};
mboxFactory.prototype.getMboxes = function () {
    return this.E;
};
mboxFactory.prototype.get = function (_, ib) {
    return this.E.get(_).getById(ib || 0);
};
mboxFactory.prototype.update = function (_, c) {
    if (!this.isEnabled()) {
        return;
    }
    if (!this.isDomLoaded()) {
        var W = this;
        this.addOnLoad(function () {
            W.update(_, c);
        });
        return;
    }
    if (this.E.get(_).length() == 0) {
        throw "Mbox " + _ + " is not defined";
    }
    this.E.get(_).each(function (X) {
        X.getUrlBuilder().addParameter('mboxPage', mboxGenerateId());
        X.load(c);
    });
};
mboxFactory.prototype.setVisitorIdParameters = function (e) {
    var namespace = '';
    if (typeof Visitor == 'undefined' || typeof Visitor.ID_TYPE_AUTHENTICATED == 'undefined' || namespace.length == 0) {
        return;
    }
    var anonymousVisitorIdName = 'mboxMCVID';
    var globalVisitorIdName = 'mboxMCGVID';
    var customVisitorIdName = 'mboxMCCUSTID';
    var globalLocationHintName = 'mboxMCGLH';
    var visitor = Visitor.getInstance(namespace);
    if (visitor.isAllowed()) {
        var globalVisitorID = visitor.getGlobalVisitorID(function (callbackGlobalVisitorID) {
            e.addParameterIfAbsent(globalVisitorIdName, callbackGlobalVisitorID);
            if (callbackGlobalVisitorID) {
                e.addParameterIfAbsent(globalLocationHintName, visitor.getGlobalLocationHint());
            }
        });
        e.addParameterIfAbsent(globalVisitorIdName, globalVisitorID);
        var anonymousVisitorId = visitor.getAnonymousVisitorID(function (callbackAnonymousVisitorID) {
            e.addParameterIfAbsent(anonymousVisitorIdName, callbackAnonymousVisitorID);
        });
        e.addParameterIfAbsent(anonymousVisitorIdName, anonymousVisitorId);
        e.addParameterIfAbsent(customVisitorIdName, visitor.getAuthenticatedVisitorID());
        if (globalVisitorID) {
            e.addParameterIfAbsent(globalLocationHintName, visitor.getGlobalLocationHint());
        }
    }
};
mboxFactory.prototype.create = function (_, c, jb) {
    if (!this.isSupported()) {
        return null;
    }
    var e = this.v.clone();
    e.addParameter('mboxCount', this.E.length() + 1);
    e.addParameters(c);
    this.setVisitorIdParameters(e);
    var ib = this.E.get(_).length();
    var kb = this.C + '-' + _ + '-' + ib;
    var lb;
    if (jb) {
        lb = new mboxLocatorNode(jb);
    } else {
        if (this.D) {
            throw 'The page has already been loaded, can\'t write marker';
        }
        lb = new mboxLocatorDefault(kb);
    }
    try {
        var W = this;
        var mb = 'mboxImported-' + kb;
        var X = new mbox(_, ib, e, lb, mb);
        if (this.G) {
            X.setFetcher(this.D ? new mboxAjaxFetcher() : new mboxStandardFetcher());
        }
        X.setOnError(function (nb, l) {
            X.setMessage(nb);
            X.activate();
            if (!X.isActivated()) {
                W.disable(60 * 60, nb);
                window.location.reload(false);
            }
        });
        this.E.add(X);
    } catch (ob) {
        this.disable();
        throw 'Failed creating mbox "' + _ + '", the error was: ' + ob;
    }
    var pb = new Date();
    e.addParameter('mboxTime', pb.getTime() - (pb.getTimezoneOffset() * 60000));
    return X;
};
mboxFactory.prototype.getCookieManager = function () {
    return this.I;
};
mboxFactory.prototype.getPageId = function () {
    return this.K;
};
mboxFactory.prototype.getPCId = function () {
    return this.S;
};
mboxFactory.prototype.getSessionId = function () {
    return this.R;
};
mboxFactory.prototype.getSignaler = function () {
    return this.Z;
};
mboxFactory.prototype.getUrlBuilder = function () {
    return this.v;
};
mboxFactory.prototype.T = function (e, H) {
    e.addParameter('mboxHost', document.location.hostname).addParameter('mboxSession', this.R.getId());
    if (!H) {
        e.addParameter('mboxFactoryId', this.C);
    }
    if (this.S.getId() != null) {
        e.addParameter('mboxPC', this.S.getId());
    }
    e.addParameter('mboxPage', this.K);
    e.addParameter('screenHeight', this.L);
    e.addParameter('screenWidth', this.M);
    e.addParameter('browserWidth', this.N);
    e.addParameter('browserHeight', this.O);
    e.addParameter('browserTimeOffset', this.Q);
    e.addParameter('colorDepth', this.P);
    e.addParameter('mboxXDomain', "enabled");
    e.setUrlProcessAction(function (e) {
        e += '&mboxURL=' + encodeURIComponent(document.location);
        var qb = encodeURIComponent(document.referrer);
        if (e.length + qb.length < 2000) {
            e += '&mboxReferrer=' + qb;
        }
        e += '&mboxVersion=' + mboxVersion;
        return e;
    });
};
mboxFactory.prototype.rb = function () {
    return "";
};
mboxFactory.prototype.Y = function () {
    document.write('<style>.' + 'mboxDefault' + ' { visibility:hidden; }</style>');
};
mboxFactory.prototype.isDomLoaded = function () {
    return this.D;
};
mboxFactory.prototype.J = function () {
    if (this.gb != null) {
        return;
    }
    this.gb = new Array();
    var W = this;
    (function () {
        var sb = document.addEventListener ? "DOMContentLoaded" : "onreadystatechange";
        var tb = false;
        var ub = function () {
            if (tb) {
                return;
            }
            tb = true;
            for (var i = 0; i < W.gb.length; ++i) {
                W.gb[i]();
            }
        };
        if (document.addEventListener) {
            document.addEventListener(sb, function () {
                document.removeEventListener(sb, arguments.callee, false);
                ub();
            }, false);
            window.addEventListener("load", function () {
                document.removeEventListener("load", arguments.callee, false);
                ub();
            }, false);
        } else if (document.attachEvent) {
            if (self !== self.top) {
                document.attachEvent(sb, function () {
                    if (document.readyState === 'complete') {
                        document.detachEvent(sb, arguments.callee);
                        ub();
                    }
                });
            } else {
                var vb = function () {
                    try {
                        document.documentElement.doScroll('left');
                        ub();
                    } catch (wb) {
                        setTimeout(vb, 13);
                    }
                };
                vb();
            }
        }
        if (document.readyState === "complete") {
            ub();
        }
    })();
};
mboxSignaler = function (xb, I) {
    this.I = I;
    var yb = I.getCookieNames('signal-');
    for (var i = 0; i < yb.length; i++) {
        var zb = yb[i];
        var Ab = I.getCookie(zb).split('&');
        var X = xb(Ab[0], Ab);
        X.load();
        I.deleteCookie(zb);
    }
};
mboxSignaler.prototype.signal = function (Bb, _) {
    this.I.setCookie('signal-' + Bb, mboxShiftArray(arguments).join('&'), 45 * 60);
};
mboxList = function () {
    this.E = new Array();
};
mboxList.prototype.add = function (X) {
    if (X != null) {
        this.E[this.E.length] = X;
    }
};
mboxList.prototype.get = function (_) {
    var A = new mboxList();
    for (var i = 0; i < this.E.length; i++) {
        var X = this.E[i];
        if (X.getName() == _) {
            A.add(X);
        }
    }
    return A;
};
mboxList.prototype.getById = function (Cb) {
    return this.E[Cb];
};
mboxList.prototype.length = function () {
    return this.E.length;
};
mboxList.prototype.each = function (n) {
    if (typeof n != 'function') {
        throw 'Action must be a function, was: ' + typeof (n);
    }
    for (var i = 0; i < this.E.length; i++) {
        n(this.E[i]);
    }
};
mboxLocatorDefault = function (g) {
    this.g = 'mboxMarker-' + g;
    document.write('<div id="' + this.g + '" style="visibility:hidden;display:none">&nbsp;</div>');
};
mboxLocatorDefault.prototype.locate = function () {
    var Db = document.getElementById(this.g);
    while (Db != null) {
        if (Db.nodeType == 1) {
            if (Db.className == 'mboxDefault') {
                return Db;
            }
        }
        Db = Db.previousSibling;
    }
    return null;
};
mboxLocatorDefault.prototype.force = function () {
    var Eb = document.createElement('div');
    Eb.className = 'mboxDefault';
    var Fb = document.getElementById(this.g);
    Fb.parentNode.insertBefore(Eb, Fb);
    return Eb;
};
mboxLocatorNode = function (Gb) {
    this.Db = Gb;
};
mboxLocatorNode.prototype.locate = function () {
    return typeof this.Db == 'string' ? document.getElementById(this.Db) : this.Db;
};
mboxLocatorNode.prototype.force = function () {
    return null;
};
mboxCreate = function (_) {
    var X = mboxFactoryDefault.create(_, mboxShiftArray(arguments));
    if (X) {
        X.load();
    }
    return X;
};
mboxDefine = function (jb, _) {
    var X = mboxFactoryDefault.create(_, mboxShiftArray(mboxShiftArray(arguments)), jb);
    return X;
};
mboxUpdate = function (_) {
    mboxFactoryDefault.update(_, mboxShiftArray(arguments));
};
mbox = function (g, Hb, v, Ib, mb) {
    this.Jb = null;
    this.Kb = 0;
    this.lb = Ib;
    this.mb = mb;
    this.Lb = null;
    this.Mb = new mboxOfferContent();
    this.Eb = null;
    this.v = v;
    this.message = '';
    this.Nb = new Object();
    this.Ob = 0;
    this.Hb = Hb;
    this.g = g;
    this.Pb();
    v.addParameter('mbox', g).addParameter('mboxId', Hb);
    this.Qb = function () {};
    this.Rb = function () {};
    this.Sb = null;
};
mbox.prototype.getId = function () {
    return this.Hb;
};
mbox.prototype.Pb = function () {
    if (this.g.length > 250) {
        throw "Mbox Name " + this.g + " exceeds max length of " + "250 characters.";
    } else if (this.g.match(/^\s+|\s+$/g)) {
        throw "Mbox Name " + this.g + " has leading/trailing whitespace(s).";
    }
};
mbox.prototype.getName = function () {
    return this.g;
};
mbox.prototype.getParameters = function () {
    var c = this.v.getParameters();
    var A = new Array();
    for (var i = 0; i < c.length; i++) {
        if (c[i].name.indexOf('mbox') != 0) {
            A[A.length] = c[i].name + '=' + c[i].value;
        }
    }
    return A;
};
mbox.prototype.setOnLoad = function (n) {
    this.Rb = n;
    return this;
};
mbox.prototype.setMessage = function (nb) {
    this.message = nb;
    return this;
};
mbox.prototype.setOnError = function (Qb) {
    this.Qb = Qb;
    return this;
};
mbox.prototype.setFetcher = function (Tb) {
    if (this.Lb) {
        this.Lb.cancel();
    }
    this.Lb = Tb;
    return this;
};
mbox.prototype.getFetcher = function () {
    return this.Lb;
};
mbox.prototype.load = function (c) {
    if (this.Lb == null) {
        return this;
    }
    this.setEventTime("load.start");
    this.cancelTimeout();
    this.Kb = 0;
    var v = (c && c.length > 0) ? this.v.clone().addParameters(c) : this.v;
    this.Lb.fetch(v);
    var W = this;
    this.Ub = setTimeout(function () {
        W.Qb('browser timeout', W.Lb.getType());
    }, 15000);
    this.setEventTime("load.end");
    return this;
};
mbox.prototype.loaded = function () {
    this.cancelTimeout();
    if (!this.activate()) {
        var W = this;
        setTimeout(function () {
            W.loaded();
        }, 100);
    }
};
mbox.prototype.activate = function () {
    if (this.Kb) {
        return this.Kb;
    }
    this.setEventTime('activate' + ++this.Ob + '.start');
    if (this.show()) {
        this.cancelTimeout();
        this.Kb = 1;
    }
    this.setEventTime('activate' + this.Ob + '.end');
    return this.Kb;
};
mbox.prototype.isActivated = function () {
    return this.Kb;
};
mbox.prototype.setOffer = function (Mb) {
    if (Mb && Mb.show && Mb.setOnLoad) {
        this.Mb = Mb;
    } else {
        throw 'Invalid offer';
    }
    return this;
};
mbox.prototype.getOffer = function () {
    return this.Mb;
};
mbox.prototype.show = function () {
    this.setEventTime('show.start');
    var A = this.Mb.show(this);
    this.setEventTime(A == 1 ? "show.end.ok" : "show.end");
    return A;
};
mbox.prototype.showContent = function (Vb) {
    if (Vb == null) {
        return 0;
    }
    if (this.Eb == null || !this.Eb.parentNode) {
        this.Eb = this.getDefaultDiv();
        if (this.Eb == null) {
            return 0;
        }
    }
    if (this.Eb != Vb) {
        this.Wb(this.Eb);
        this.Eb.parentNode.replaceChild(Vb, this.Eb);
        this.Eb = Vb;
    }
    this.Xb(Vb);
    this.Rb();
    return 1;
};
mbox.prototype.hide = function () {
    this.setEventTime('hide.start');
    var A = this.showContent(this.getDefaultDiv());
    this.setEventTime(A == 1 ? 'hide.end.ok' : 'hide.end.fail');
    return A;
};
mbox.prototype.finalize = function () {
    this.setEventTime('finalize.start');
    this.cancelTimeout();
    if (this.getDefaultDiv() == null) {
        if (this.lb.force() != null) {
            this.setMessage('No default content, an empty one has been added');
        } else {
            this.setMessage('Unable to locate mbox');
        }
    }
    if (!this.activate()) {
        this.hide();
        this.setEventTime('finalize.end.hide');
    }
    this.setEventTime('finalize.end.ok');
};
mbox.prototype.cancelTimeout = function () {
    if (this.Ub) {
        clearTimeout(this.Ub);
    }
    if (this.Lb != null) {
        this.Lb.cancel();
    }
};
mbox.prototype.getDiv = function () {
    return this.Eb;
};
mbox.prototype.getDefaultDiv = function () {
    if (this.Sb == null) {
        this.Sb = this.lb.locate();
    }
    return this.Sb;
};
mbox.prototype.setEventTime = function (Yb) {
    this.Nb[Yb] = (new Date()).getTime();
};
mbox.prototype.getEventTimes = function () {
    return this.Nb;
};
mbox.prototype.getImportName = function () {
    return this.mb;
};
mbox.prototype.getURL = function () {
    return this.v.buildUrl();
};
mbox.prototype.getUrlBuilder = function () {
    return this.v;
};
mbox.prototype.Zb = function (Eb) {
    return Eb.style.display != 'none';
};
mbox.prototype.Xb = function (Eb) {
    this._b(Eb, true);
};
mbox.prototype.Wb = function (Eb) {
    this._b(Eb, false);
};
mbox.prototype._b = function (Eb, ac) {
    Eb.style.visibility = ac ? "visible" : "hidden";
    Eb.style.display = ac ? "block" : "none";
};
mboxOfferContent = function () {
    this.Rb = function () {};
};
mboxOfferContent.prototype.show = function (X) {
    var A = X.showContent(document.getElementById(X.getImportName()));
    if (A == 1) {
        this.Rb();
    }
    return A;
};
mboxOfferContent.prototype.setOnLoad = function (Rb) {
    this.Rb = Rb;
};
mboxOfferAjax = function (Vb) {
    this.Vb = Vb;
    this.Rb = function () {};
};
mboxOfferAjax.prototype.setOnLoad = function (Rb) {
    this.Rb = Rb;
};
mboxOfferAjax.prototype.show = function (X) {
    var bc = document.createElement('div');
    bc.id = X.getImportName();
    bc.innerHTML = this.Vb;
    var A = X.showContent(bc);
    if (A == 1) {
        this.Rb();
    }
    return A;
};
mboxOfferDefault = function () {
    this.Rb = function () {};
};
mboxOfferDefault.prototype.setOnLoad = function (Rb) {
    this.Rb = Rb;
};
mboxOfferDefault.prototype.show = function (X) {
    var A = X.hide();
    if (A == 1) {
        this.Rb();
    }
    return A;
};
mboxCookieManager = function mboxCookieManager(g, cc) {
    this.g = g;
    this.cc = cc == '' || cc.indexOf('.') == -1 ? '' : '; domain=' + cc;
    this.dc = new mboxMap();
    this.loadCookies();
};
mboxCookieManager.prototype.isEnabled = function () {
    this.setCookie('check', 'true', 60);
    this.loadCookies();
    return this.getCookie('check') == 'true';
};
mboxCookieManager.prototype.setCookie = function (g, h, ab) {
    if (typeof g != 'undefined' && typeof h != 'undefined' && typeof ab != 'undefined') {
        var ec = new Object();
        ec.name = g;
        ec.value = escape(h);
        ec.expireOn = Math.ceil(ab + new Date().getTime() / 1000);
        this.dc.put(g, ec);
        this.saveCookies();
    }
};
mboxCookieManager.prototype.getCookie = function (g) {
    var ec = this.dc.get(g);
    return ec ? unescape(ec.value) : null;
};
mboxCookieManager.prototype.deleteCookie = function (g) {
    this.dc.remove(g);
    this.saveCookies();
};
mboxCookieManager.prototype.getCookieNames = function (fc) {
    var gc = new Array();
    this.dc.each(function (g, ec) {
        if (g.indexOf(fc) == 0) {
            gc[gc.length] = g;
        }
    });
    return gc;
};
mboxCookieManager.prototype.saveCookies = function () {
    var hc = false;
    var ic = 'disable';
    var jc = new Array();
    var kc = 0;
    this.dc.each(function (g, ec) {
        if (!hc || g === ic) {
            jc[jc.length] = g + '#' + ec.value + '#' + ec.expireOn;
            if (kc < ec.expireOn) {
                kc = ec.expireOn;
            }
        }
    });
    var lc = new Date(kc * 1000);
    document.cookie = this.g + '=' + jc.join('|') + '; expires=' + lc.toGMTString() + '; path=/' + this.cc;
};
mboxCookieManager.prototype.loadCookies = function () {
    this.dc = new mboxMap();
    var mc = document.cookie.indexOf(this.g + '=');
    if (mc != -1) {
        var nc = document.cookie.indexOf(';', mc);
        if (nc == -1) {
            nc = document.cookie.indexOf(',', mc);
            if (nc == -1) {
                nc = document.cookie.length;
            }
        }
        var oc = document.cookie.substring(mc + this.g.length + 1, nc).split('|');
        var pc = Math.ceil(new Date().getTime() / 1000);
        for (var i = 0; i < oc.length; i++) {
            var ec = oc[i].split('#');
            if (pc <= ec[2]) {
                var qc = new Object();
                qc.name = ec[0];
                qc.value = ec[1];
                qc.expireOn = ec[2];
                this.dc.put(qc.name, qc);
            }
        }
    }
};
mboxSession = function (rc, sc, zb, tc, I) {
    this.sc = sc;
    this.zb = zb;
    this.tc = tc;
    this.I = I;
    this.uc = false;
    this.Hb = typeof mboxForceSessionId != 'undefined' ? mboxForceSessionId : mboxGetPageParameter(this.sc);
    if (this.Hb == null || this.Hb.length == 0) {
        this.Hb = I.getCookie(zb);
        if (this.Hb == null || this.Hb.length == 0) {
            this.Hb = rc;
            this.uc = true;
        }
    }
    I.setCookie(zb, this.Hb, tc);
};
mboxSession.prototype.getId = function () {
    return this.Hb;
};
mboxSession.prototype.forceId = function (vc) {
    this.Hb = vc;
    this.I.setCookie(this.zb, this.Hb, this.tc);
};
mboxPC = function (zb, tc, I) {
    this.zb = zb;
    this.tc = tc;
    this.I = I;
    this.Hb = typeof mboxForcePCId != 'undefined' ? mboxForcePCId : I.getCookie(zb);
    if (this.Hb != null) {
        I.setCookie(zb, this.Hb, tc);
    }
};
mboxPC.prototype.getId = function () {
    return this.Hb;
};
mboxPC.prototype.forceId = function (vc) {
    if (this.Hb != vc) {
        this.Hb = vc;
        this.I.setCookie(this.zb, this.Hb, this.tc);
        return true;
    }
    return false;
};
mboxGetPageParameter = function (g) {
    var A = null;
    var wc = new RegExp(g + "=([^\&]*)");
    var xc = wc.exec(document.location);
    if (xc != null && xc.length >= 2) {
        A = xc[1];
    }
    return A;
};
mboxSetCookie = function (g, h, ab) {
    return mboxFactoryDefault.getCookieManager().setCookie(g, h, ab);
};
mboxGetCookie = function (g) {
    return mboxFactoryDefault.getCookieManager().getCookie(g);
};
mboxCookiePageDomain = function () {
    var cc = (/([^:]*)(:[0-9]{0,5})?/).exec(document.location.host)[1];
    var yc = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/;
    if (!yc.exec(cc)) {
        var zc = (/([^\.]+\.[^\.]{3}|[^\.]+\.[^\.]+\.[^\.]{2})$/).exec(cc);
        if (zc) {
            cc = zc[0];
        }
    }
    return cc ? cc : "";
};
mboxShiftArray = function (Ac) {
    var A = new Array();
    for (var i = 1; i < Ac.length; i++) {
        A[A.length] = Ac[i];
    }
    return A;
};
mboxGenerateId = function () {
    return (new Date()).getTime() + "-" + Math.floor(Math.random() * 999999);
};
mboxScreenHeight = function () {
    return screen.height;
};
mboxScreenWidth = function () {
    return screen.width;
};
mboxBrowserWidth = function () {
    return (window.innerWidth) ? window.innerWidth : document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
};
mboxBrowserHeight = function () {
    return (window.innerHeight) ? window.innerHeight : document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
};
mboxBrowserTimeOffset = function () {
    return -new Date().getTimezoneOffset();
};
mboxScreenColorDepth = function () {
    return screen.pixelDepth;
};
if (typeof mboxVersion == 'undefined') {
    var mboxVersion = 44;
    var mboxFactories = new mboxMap();
    var mboxFactoryDefault = new mboxFactory('nationwidebuildingso.tt.omtrdc.net', 'nationwidebuildingso', 'default');
};
if (mboxGetPageParameter("mboxDebug") != null || mboxFactoryDefault.getCookieManager().getCookie("debug") != null) {
    setTimeout(function () {
        if (typeof mboxDebugLoaded == 'undefined') {
            alert('Could not load the remote debug.\nPlease check your connection' + ' to Test&amp;Target servers');
        }
    }, 60 * 60);
    document.write('<' + 'scr' + 'ipt language="Javascript1.2" src=' + '"http://admin5.testandtarget.omniture.com/admin/mbox/mbox_debug.jsp?mboxServerHost=nationwidebuildingso.tt.omtrdc.net' + '&clientCode=nationwidebuildingso"><' + '\/scr' + 'ipt>');
};
mboxScPluginFetcher = function (b, Bc) {
    this.b = b;
    this.Bc = Bc;
};
mboxScPluginFetcher.prototype.Cc = function (v) {
    v.setBasePath('/m2/' + this.b + '/sc/standard');
    this.Dc(v);
    var e = v.buildUrl();
    e += '&scPluginVersion=1';
    return e;
};
mboxScPluginFetcher.prototype.Dc = function (v) {
    var Ec = ["dynamicVariablePrefix", "visitorID", "vmk", "ppu", "charSet", "visitorNamespace", "cookieDomainPeriods", "cookieLifetime", "pageName", "currencyCode", "variableProvider", "channel", "server", "pageType", "transactionID", "purchaseID", "campaign", "state", "zip", "events", "products", "linkName", "linkType", "resolution", "colorDepth", "javascriptVersion", "javaEnabled", "cookiesEnabled", "browserWidth", "browserHeight", "connectionType", "homepage", "pe", "pev1", "pev2", "pev3", "visitorSampling", "visitorSamplingGroup", "dynamicAccountSelection", "dynamicAccountList", "dynamicAccountMatch", "trackDownloadLinks", "trackExternalLinks", "trackInlineStats", "linkLeaveQueryString", "linkDownloadFileTypes", "linkExternalFilters", "linkInternalFilters", "linkTrackVars", "linkTrackEvents", "linkNames", "lnk", "eo"];
    for (var i = 0; i < Ec.length; i++) {
        this.Fc(Ec[i], v);
    }
    for (var i = 1; i <= 75; i++) {
        this.Fc('prop' + i, v);
        this.Fc('eVar' + i, v);
        this.Fc('hier' + i, v);
    }
};
mboxScPluginFetcher.prototype.Fc = function (g, v) {
    var h = this.Bc[g];
    if (typeof (h) === 'undefined' || h === null || h === '') {
        return;
    }
    v.addParameter(g, h);
};
mboxScPluginFetcher.prototype.cancel = function () {};
mboxScPluginFetcher.prototype.fetch = function (v) {
    v.setServerType(this.getType());
    var e = this.Cc(v);
    this.w = document.createElement('script');
    this.w.src = e;
    document.body.appendChild(this.w);
};
mboxScPluginFetcher.prototype.getType = function () {
    return 'ajax';
};

function mboxLoadSCPlugin(Bc) {
    if (!Bc) {
        return null;
    }
    Bc.m_tt = function (Bc) {
        var Gc = Bc.m_i('tt');
        Gc.G = true;
        Gc.b = 'nationwidebuildingso';
        Gc['_t'] = function () {
            if (!this.isEnabled()) {
                return;
            }
            var X = this.Ic();
            if (X) {
                var Tb = new mboxScPluginFetcher(this.b, this.s);
                X.setFetcher(Tb);
                X.load();
            }
        };
        Gc.isEnabled = function () {
            return this.G && mboxFactoryDefault.isEnabled();
        };
        Gc.Ic = function () {
            var _ = this.Jc();
            var Eb = document.createElement('DIV');
            return mboxFactoryDefault.create(_, new Array(), Eb);
        };
        Gc.Jc = function () {
            var Kc = this.s.events && this.s.events.indexOf('purchase') != -1;
            return 'SiteCatalyst: ' + (Kc ? 'purchase' : 'event');
        };
    };
    return Bc.loadModule('tt');
};
mboxVizTargetUrl = function (_) {
    if (!mboxFactoryDefault.isEnabled()) {
        return;
    }
    var v = mboxFactoryDefault.getUrlBuilder().clone();
    v.setBasePath('/m2/' + 'nationwidebuildingso' + '/viztarget');
    v.addParameter('mbox', _);
    v.addParameter('mboxId', 0);
    v.addParameter('mboxCount', mboxFactoryDefault.getMboxes().length() + 1);
    var pb = new Date();
    v.addParameter('mboxTime', pb.getTime() - (pb.getTimezoneOffset() * 60000));
    v.addParameter('mboxPage', mboxGenerateId());
    var c = mboxShiftArray(arguments);
    if (c && c.length > 0) {
        v.addParameters(c);
    }
    v.addParameter('mboxDOMLoaded', mboxFactoryDefault.isDomLoaded());
    return v.buildUrl();
};
