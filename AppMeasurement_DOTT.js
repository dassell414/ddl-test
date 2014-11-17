/*****************************

 * NOTE:
 * 
 * NON-PRODUCTION CODE
 * This file does not represent production-grade code.
 * This file must not be used in a production system.
 * 
 * A production-grade file must be obtained from the
 * Nationwide Web Analytics team for use in any production-
 * grade system.
 * 
 * DEBUGGING CODE INCLUDED
 * This file includes code which generates messages in the
 * developer console of all modern browsers for debugging
 * purposes.
 * Access the console using the F12 key (or the relevant
 * menu entry).

*********************************/
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
s.appMeasurementVersion="1.4.1_20141117";

s.cookieDomainPeriods = "3";
s.fpCookieDomainPeriods = "3";
s.currencyCode = "GBP";
s.channel="discovery";  //  BTL - TBD

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
	
	//	BTL - set a pageName value to avoid errors
	if (!s.pageName)	{
		try { s.pageName = digitalData.page.pageInfo.pageName } catch(e) {};
		if (!s.pageName)	{
			try { s.pageName = "D=g" } catch(e) {};
		}
		if (!s.pageName)	{
			s.pageName = "Page name not found";
		}
	}
	
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

	//	Visitor ID
	s.prop71 = "D=s_vi";

}
s.doPlugins=s.s_doPlugins;

//	Parse DDL
var dprop;  //  declare variable for processing DDL

//	set variables that will always be passed
var wa_std = function() {
	//	start with new 's' object
	var s = s_gi(s_account);

	if ( typeof (digitalData) != 'undefined' ) {
		try { if ( dprop = digitalData.page.pageInfo.pageName ) { s.pageName = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.page.nbs_environment ) { s.contextData['page.nbs_environment'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.page.pageInfo.nbs_page_responsive_state ) { s.contextData['page.pageInfo.nbs_page_responsive_state'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.page.pageInfo.nbs_page_responsive_orientation ) { s.contextData['page.pageInfo.nbs_page_responsive_orientation'] = dprop;}} catch(e) {};
	}
}

//	set variables that will be passed with 'page view'
var wa_view = function() {
	if ( typeof (digitalData) != 'undefined'  ) {
		//	get 'standard' variables
		wa_std();
	
		try { if ( dprop = digitalData.nbs_application_module.nbs_resumed_application_flag ) { s.contextData['nbs_application_module.nbs_resumed_application_flag'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_application_module.nbs_resumed_application_initial_page ) { s.contextData['nbs_application_module.nbs_resumed_application_initial_page'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_application_module.nbs_resumed_application_last_save_date ) { s.contextData['nbs_application_module.nbs_resumed_application_last_save_date'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product.nbs_product_type ) { s.contextData['nbs_product.nbs_product_type'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_currentaccount.nbs_ca_name ) { s.contextData['nbs_product_currentaccount.nbs_ca_name'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_currentaccount.nbs_ca_offer ) { s.contextData['nbs_product_currentaccount.nbs_ca_offer'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_currentaccount.nbs_ca_fee_annual ) { s.contextData['nbs_product_currentaccount.nbs_ca_fee_annual'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_currentaccount.nbs_ca_fee_monthly ) { s.contextData['nbs_product_currentaccount.nbs_ca_fee_monthly'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_creditcard.nbs_cc_name ) { s.contextData['nbs_product_creditcard.nbs_cc_name'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_creditcard.nbs_cc_offer ) { s.contextData['nbs_product_creditcard.nbs_cc_offer'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_creditcard.nbs_cc_offer_bt ) { s.contextData['nbs_product_creditcard.nbs_cc_offer_bt'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_creditcard.nbs_cc_offer_bt_rate ) { s.contextData['nbs_product_creditcard.nbs_cc_offer_bt_rate'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_creditcard.nbs_cc_offer_bt_duration ) { s.contextData['nbs_product_creditcard.nbs_cc_offer_bt_duration'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_creditcard.nbs_cc_offer_purchase ) { s.contextData['nbs_product_creditcard.nbs_cc_offer_purchase'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_creditcard.nbs_cc_offer_purchase_rate ) { s.contextData['nbs_product_creditcard.nbs_cc_offer_purchase_rate'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_creditcard.nbs_cc_offer_purchase_duration ) { s.contextData['nbs_product_creditcard.nbs_cc_offer_purchase_duration'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_creditcard.nbs_cc_fee_annual ) { s.contextData['nbs_product_creditcard.nbs_cc_fee_annual'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_creditcard.nbs_cc_fee_monthly ) { s.contextData['nbs_product_creditcard.nbs_cc_fee_monthly'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_personalloan.nbs_pl_name ) { s.contextData['nbs_product_personalloan.nbs_pl_name'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_product_personalloan.nbs_pl_rate_headline ) { s.contextData['nbs_product_personalloan.nbs_pl_rate_headline'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_customer_number ) { s.contextData['nbs_user.nbs_user_customer_number'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_application_route_ibreg ) { s.contextData['nbs_user.nbs_user_application_route_ibreg'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_application_route_ownership ) { s.contextData['nbs_user.nbs_user_application_route_ownership'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_customer_status ) { s.contextData['nbs_user.nbs_user_customer_status'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_address_type ) { s.contextData['nbs_user.nbs_user_address_type'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_postcode ) { s.contextData['nbs_user.nbs_user_postcode'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_bfpo_number ) { s.contextData['nbs_user.nbs_user_bfpo_number'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_gender ) { s.contextData['nbs_user.nbs_user_gender'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_dateofbirth ) { s.contextData['nbs_user.nbs_user_dateofbirth'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_city ) { s.contextData['nbs_user.nbs_user_city'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_user_income ) { s.contextData['nbs_user.nbs_user_income'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_currentaccount.nbs_ca_application_product_type ) { s.contextData['nbs_app_currentaccount.nbs_ca_application_product_type'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_currentaccount.nbs_ca_application_id ) { s.contextData['nbs_app_currentaccount.nbs_ca_application_id'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_currentaccount.nbs_ca_application_starting_date ) { s.contextData['nbs_app_currentaccount.nbs_ca_application_starting_date'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_currentaccount.nbs_ca_decision_interim ) { s.contextData['nbs_app_currentaccount.nbs_ca_decision_interim'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_currentaccount.nbs_ca_decision_finalised ) { s.contextData['nbs_app_currentaccount.nbs_ca_decision_finalised'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_currentaccount.nbs_ca_initial_deposit_selected ) { s.contextData['nbs_app_currentaccount.nbs_ca_initial_deposit_selected'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_currentaccount.nbs_ca_initial_deposit_amt ) { s.contextData['nbs_app_currentaccount.nbs_ca_initial_deposit_amt'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_currentaccount.nbs_ca_initial_deposit_bank ) { s.contextData['nbs_app_currentaccount.nbs_ca_initial_deposit_bank'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_currentaccount.nbs_ca_paperless_selected ) { s.contextData['nbs_app_currentaccount.nbs_ca_paperless_selected'] = dprop;}} catch(e) {};
		try { dprop = digitalData.nbs_app_currentaccount.nbs_ca_benefit;  for (dind in dprop) { if ( dprop[dind].nbs_ca_benefit_name ) { s.contextData['nbs_app_currentaccount.nbs_ca_benefit_' + dind + '.nbs_ca_benefit_name'] = dprop[dind].nbs_ca_benefit_name; } } } catch(e) {};
		try { dprop = digitalData.nbs_app_currentaccount.nbs_ca_benefit;  for (dind in dprop) { if ( dprop[dind].nbs_ca_benefit_level ) { s.contextData['nbs_app_currentaccount.nbs_ca_benefit_' + dind + '.nbs_ca_benefit_level'] = dprop[dind].nbs_ca_benefit_level; } } } catch(e) {};
		try { dprop = digitalData.nbs_app_currentaccount.nbs_ca_benefit;  for (dind in dprop) { if ( dprop[dind].nbs_ca_benefit_eligible_app1 ) { s.contextData['nbs_app_currentaccount.nbs_ca_benefit_' + dind + '.nbs_ca_benefit_eligible_app1'] = dprop[dind].nbs_ca_benefit_eligible_app1; } } } catch(e) {};
		try { dprop = digitalData.nbs_app_currentaccount.nbs_ca_benefit;  for (dind in dprop) { if ( dprop[dind].nbs_ca_benefit_eligible_app2 ) { s.contextData['nbs_app_currentaccount.nbs_ca_benefit_' + dind + '.nbs_ca_benefit_eligible_app2'] = dprop[dind].nbs_ca_benefit_eligible_app2; } } } catch(e) {};
		try { if ( dprop = digitalData.nbs_app_currentaccount.nbs_ca_switch_selected ) { s.contextData['nbs_app_currentaccount.nbs_ca_switch_selected'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_currentaccount.nbs_ca_switch_completed ) { s.contextData['nbs_app_currentaccount.nbs_ca_switch_completed'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_currentaccount.nbs_ca_upgrade_path ) { s.contextData['nbs_app_currentaccount.nbs_ca_upgrade_path'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_currentaccount.nbs_ca_econtracting_eligible ) { s.contextData['nbs_app_currentaccount.nbs_ca_econtracting_eligible'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_currentaccount.nbs_ca_overdraft_offered ) { s.contextData['nbs_app_currentaccount.nbs_ca_overdraft_offered'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_currentaccount.nbs_ca_overdraft_selected ) { s.contextData['nbs_app_currentaccount.nbs_ca_overdraft_selected'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_currentaccount.nbs_ca_chequebook_requested ) { s.contextData['nbs_app_currentaccount.nbs_ca_chequebook_requested'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_creditcard.nbs_cc_application_product_type ) { s.contextData['nbs_app_creditcard.nbs_cc_application_product_type'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_creditcard.nbs_cc_application_id ) { s.contextData['nbs_app_creditcard.nbs_cc_application_id'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_creditcard.nbs_cc_application_continuation ) { s.contextData['nbs_app_creditcard.nbs_cc_application_continuation'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_creditcard.nbs_cc_application_starting_date ) { s.contextData['nbs_app_creditcard.nbs_cc_application_starting_date'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_creditcard.nbs_cc_econtracting_eligible ) { s.contextData['nbs_app_creditcard.nbs_cc_econtracting_eligible'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_creditcard.nbs_cc_internet_banking_setup_completed ) { s.contextData['nbs_app_creditcard.nbs_cc_internet_banking_setup_completed'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_creditcard.nbs_cc_limit_offered ) { s.contextData['nbs_app_creditcard.nbs_cc_limit_offered'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_creditcard.nbs_cc_limit_selected ) { s.contextData['nbs_app_creditcard.nbs_cc_limit_selected'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_creditcard.nbs_cc_decision_interim ) { s.contextData['nbs_app_creditcard.nbs_cc_decision_interim'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_creditcard.nbs_cc_decision_finalised ) { s.contextData['nbs_app_creditcard.nbs_cc_decision_finalised'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_creditcard.nbs_cc_approval_status ) { s.contextData['nbs_app_creditcard.nbs_cc_approval_status'] = dprop;}} catch(e) {};
		try { dprop = digitalData.nbs_app_creditcard.nbs_cc_balancetxfer;  for (dind in dprop) { if ( dprop[dind].nbs_cc_bt_amt ) { s.contextData['nbs_app_creditcard.nbs_cc_balancetxfer_' + dind + '.nbs_cc_bt_amt'] = dprop[dind].nbs_cc_bt_amt; } } } catch(e) {};
		try { dprop = digitalData.nbs_app_creditcard.nbs_cc_balancetxfer;  for (dind in dprop) { if ( dprop[dind].nbs_cc_bt_type ) { s.contextData['nbs_app_creditcard.nbs_cc_balancetxfer_' + dind + '.nbs_cc_bt_type'] = dprop[dind].nbs_cc_bt_type; } } } catch(e) {};
		try { dprop = digitalData.nbs_app_creditcard.nbs_cc_benefit;  for (dind in dprop) { if ( dprop[dind].nbs_cc_benefit_name ) { s.contextData['nbs_app_creditcard.nbs_cc_benefit_' + dind + '.nbs_cc_benefit_name'] = dprop[dind].nbs_cc_benefit_name; } } } catch(e) {};
		try { dprop = digitalData.nbs_app_creditcard.nbs_cc_benefit;  for (dind in dprop) { if ( dprop[dind].nbs_cc_benefit_level ) { s.contextData['nbs_app_creditcard.nbs_cc_benefit_' + dind + '.nbs_cc_benefit_level'] = dprop[dind].nbs_cc_benefit_level; } } } catch(e) {};
		try { dprop = digitalData.nbs_app_creditcard.nbs_cc_benefit;  for (dind in dprop) { if ( dprop[dind].nbs_cc_benefit_eligible ) { s.contextData['nbs_app_creditcard.nbs_cc_benefit_' + dind + '.nbs_cc_benefit_eligible'] = dprop[dind].nbs_cc_benefit_eligible; } } } catch(e) {};
		try { if ( dprop = digitalData.nbs_app_creditcard.nbs_cc_secondcardholder_selected ) { s.contextData['nbs_app_creditcard.nbs_cc_secondcardholder_selected'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_creditcard.nbs_cc_paperless_selected ) { s.contextData['nbs_app_creditcard.nbs_cc_paperless_selected'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_creditcard.nbs_cc_directdebit_supplied ) { s.contextData['nbs_app_creditcard.nbs_cc_directdebit_supplied'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_creditcard.nbs_cc_directdebit_bank ) { s.contextData['nbs_app_creditcard.nbs_cc_directdebit_bank'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_creditcard.nbs_cc_directdebit_sortcode ) { s.contextData['nbs_app_creditcard.nbs_cc_directdebit_sortcode'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_personalloan.nbs_pl_application_product_type ) { s.contextData['nbs_app_personalloan.nbs_pl_application_product_type'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_personalloan.nbs_pl_application_id ) { s.contextData['nbs_app_personalloan.nbs_pl_application_id'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_personalloan.nbs_pl_application_continuation ) { s.contextData['nbs_app_personalloan.nbs_pl_application_continuation'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_personalloan.nbs_pl_application_starting_date ) { s.contextData['nbs_app_personalloan.nbs_pl_application_starting_date'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_personalloan.nbs_pl_econtracting_eligible ) { s.contextData['nbs_app_personalloan.nbs_pl_econtracting_eligible'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_personalloan.nbs_pl_internet_banking_setup_completed ) { s.contextData['nbs_app_personalloan.nbs_pl_internet_banking_setup_completed'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_personalloan.nbs_pl_type ) { s.contextData['nbs_app_personalloan.nbs_pl_type'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_personalloan.nbs_pl_subtype ) { s.contextData['nbs_app_personalloan.nbs_pl_subtype'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_personalloan.nbs_pl_loan_amt ) { s.contextData['nbs_app_personalloan.nbs_pl_loan_amt'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_personalloan.nbs_pl_loan_duration ) { s.contextData['nbs_app_personalloan.nbs_pl_loan_duration'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_personalloan.nbs_pl_purpose ) { s.contextData['nbs_app_personalloan.nbs_pl_purpose'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_personalloan.nbs_pl_decision_interim ) { s.contextData['nbs_app_personalloan.nbs_pl_decision_interim'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_personalloan.nbs_pl_decision_finalised ) { s.contextData['nbs_app_personalloan.nbs_pl_decision_finalised'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_personalloan.nbs_pl_approval_status ) { s.contextData['nbs_app_personalloan.nbs_pl_approval_status'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_app_personalloan.nbs_pl_rate_offered ) { s.contextData['nbs_app_personalloan.nbs_pl_rate_offered'] = dprop;}} catch(e) {};
		try { if ( dprop = digitalData.nbs_user.nbs_journey_id ) { s.contextData['nbs_user.nbs_journey_id'] = dprop;}} catch(e) {};

		try { dprop = digitalData.nbs_error_user;  for (dind in dprop) { if ( dprop[dind].nbs_error_description ) { s.contextData['nbs_error_user_' + dind + '.nbs_error_description'] = dprop[dind].nbs_error_description; } } } catch(e) {};
		try { dprop = digitalData.nbs_error_user;  for (dind in dprop) { if ( dprop[dind].nbs_error_text ) { s.contextData['nbs_error_user_' + dind + '.nbs_error_text'] = dprop[dind].nbs_error_text; } } } catch(e) {};
		try { dprop = digitalData.nbs_error_system;  for (dind in dprop) { if ( dprop[dind].nbs_error_description ) { s.contextData['nbs_error_system_' + dind + '.nbs_error_description'] = dprop[dind].nbs_error_description; } } } catch(e) {};
		try { dprop = digitalData.nbs_error_system;  for (dind in dprop) { if ( dprop[dind].nbs_error_text ) { s.contextData['nbs_error_system_' + dind + '.nbs_error_text'] = dprop[dind].nbs_error_text; } } } catch(e) {};
		try { dprop = digitalData.nbs_error_business;  for (dind in dprop) { if ( dprop[dind].nbs_error_description ) { s.contextData['nbs_error_business_' + dind + '.nbs_error_description'] = dprop[dind].nbs_error_description; } } } catch(e) {};
		try { dprop = digitalData.nbs_error_business;  for (dind in dprop) { if ( dprop[dind].nbs_error_text ) { s.contextData['nbs_error_business_' + dind + '.nbs_error_text'] = dprop[dind].nbs_error_text; } } } catch(e) {};
		}
	
	//	Make the call ...
	s.t();

	//	... dump to Console for validation ...
	logJson();
	
	//  ... and reset everything
//	s.contextData = {};
	dprop = '';
}

//	set variables that will be passed with 'action' (i.e. link-tracking)
var wa_action = function(evtNm) {
	if ( typeof (digitalData) != 'undefined'  ) {
		//	get 'standard' variables
		wa_std();
		
		try { dprop = digitalData.nbs_user_input;  for (dind in dprop) { if ( dprop[dind].nbs_input_name ) { s.contextData['nbs_user_input_' + dind + '.nbs_input_name'] = dprop[dind].nbs_input_name; } } } catch(e) {};
		try { dprop = digitalData.nbs_user_input;  for (dind in dprop) { if ( dprop[dind].nbs_input_validation_status ) { s.contextData['nbs_user_input_' + dind + '.nbs_input_validation_status'] = dprop[dind].nbs_input_validation_status; } } } catch(e) {};
		try { dprop = digitalData.nbs_user_input;  for (dind in dprop) { if ( dprop[dind].nbs_input_validation_message ) { s.contextData['nbs_user_input_' + dind + '.nbs_input_validation_message'] = dprop[dind].nbs_input_validation_message; } } } catch(e) {};
		try { dprop = digitalData.nbs_user_input;  for (dind in dprop) { if ( dprop[dind].nbs_input_value ) { s.contextData['nbs_user_input_' + dind + '.nbs_input_value'] = dprop[dind].nbs_input_value; } } } catch(e) {};
		try { dprop = digitalData.nbs_user_input;  for (dind in dprop) { if ( dprop[dind].nbs_input_pii_flag ) { s.contextData['nbs_user_input_' + dind + '.nbs_input_pii_flag'] = dprop[dind].nbs_input_pii_flag; } } } catch(e) {};
		try { dprop = digitalData.nbs_document_viewed;  for (dind in dprop) { if ( dprop[dind].nbs_document_name ) { s.contextData['nbs_document_viewed_' + dind + '.nbs_document_name'] = dprop[dind].nbs_document_name; } } } catch(e) {};
		try { dprop = digitalData.nbs_document_viewed;  for (dind in dprop) { if ( dprop[dind].nbs_document_type ) { s.contextData['nbs_document_viewed_' + dind + '.nbs_document_type'] = dprop[dind].nbs_document_type; } } } catch(e) {};
		try { dprop = digitalData.nbs_system_response;  for (dind in dprop) { if ( dprop[dind].nbs_system_response_name ) { s.contextData['nbs_system_response_' + dind + '.nbs_system_response_name'] = dprop[dind].nbs_system_response_name; } } } catch(e) {};
		try { dprop = digitalData.nbs_system_response;  for (dind in dprop) { if ( dprop[dind].nbs_system_response_text ) { s.contextData['nbs_system_response_' + dind + '.nbs_system_response_text'] = dprop[dind].nbs_system_response_text; } } } catch(e) {};
		try { dprop = digitalData.nbs_system_response;  for (dind in dprop) { if ( dprop[dind].nbs_system_response_type ) { s.contextData['nbs_system_response_' + dind + '.nbs_system_response_type'] = dprop[dind].nbs_system_response_type; } } } catch(e) {};
		try { dprop = digitalData.nbs_element_interaction;  for (dind in dprop) { if ( dprop[dind].nbs_interaction_type ) { s.contextData['nbs_element_interaction_' + dind + '.nbs_interaction_type'] = dprop[dind].nbs_interaction_type; } } } catch(e) {};
		try { dprop = digitalData.nbs_element_interaction;  for (dind in dprop) { if ( dprop[dind].nbs_interaction_label ) { s.contextData['nbs_element_interaction_' + dind + '.nbs_interaction_label'] = dprop[dind].nbs_interaction_label; } } } catch(e) {};
	}
	
	//	Set linkTrackVars to pick up all Context Data Variables
	var cNm = "";
	var cNms = new Array();
	var cInd = 0;
	for (var c in s.contextData) { 
		cNms[cNms.length] = c;
	}
	cInd = cNms.length;
	if (cInd > 0) {
		for (nm in cNms) {
			cInd--;
			cNm += "contextData." + cNms[nm];
			cNm += ( ( cInd > 0 ) ? "," : "");
		}
	}
	if ( s.linkTrackVars === "None" || s.linkTrackVars === "") {
		s.linkTrackVars = cNm;
	} else {
		s.linkTrackVars += "," + cNm;
	}

	//	Make the call ...
	s.tl(true, 'o', evtNm);

	//	... dump to Console for validation ...
	logJson();
	
	//  ... and reset everything
//	s.contextData = {};
	dprop = '';
}

var logJson = function()	{
	obj = JSON.stringify(s.contextData, null, '\t');
	msg = "Log of DDL (parsed): " + "\n" + obj;
	try	{
		console.log(msg);
	}	catch(e)	{
		msg = "Error printing DDL to Developer Console: " + "\n\t" + e + "\n\n" + "Activate 'Console' or Developer Tools (try the F12 key)." + "\n\n" + msg;
		alert(msg);
	}
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

var mboxCopyright = "Copyright 1996-2014. Adobe Systems Incorporated. All rights reserved.";
var TNT = TNT || {};
TNT._internal = TNT._internal || {};
TNT._internal.nestedMboxes = [];
TNT._internal.isDomLoaded = false;

TNT.getGlobalMboxName = function () {
  return "target-global-mbox";
};

TNT.getGlobalMboxLocation = function () {
  return "";
};

TNT.isAutoCreateGlobalMbox = function () {
  return false;
};

TNT.getClientMboxExtraParameters = function () {
 return "";
};

TNT._internal._getGlobalMboxParameters = function () {
  var _getClass = {}.toString;
  var _possibleFunction = window.targetPageParams;
  var _functionResult = null;

  if (typeof(_possibleFunction) === 'undefined' || _getClass.call(_possibleFunction) !== '[object Function]') {
    return [];
  }

  try {
    _functionResult = _possibleFunction();
  } catch (_ignore) { }

  if (_functionResult === null) {
    return [];
  }

  if (_getClass.call(_functionResult) === '[object Array]') {
    return _functionResult;
  }

  if (_getClass.call(_functionResult) === '[object String]' && _functionResult.length > 0) {
    var _params = _functionResult.trim().split("&");
    for (var _index = 0; _index < _params.length; _index++) {
      if (_params[_index].indexOf('=') <= 0) {
        _params.splice(_index, 1);
        continue;
      }
      _params[_index] = decodeURIComponent(_params[_index]);
    }
    return _params;
  }

  if (_getClass.call(_functionResult) === '[object Object]') {
    return TNT._internal._extractParamsFromObject([], _functionResult);
  }

  return [];
};

TNT._internal._extractParamsFromObject = function (_nestedParams, _objectWithParams) {
  var _result = [];
  var _paramNamePrefix = _nestedParams.join('.');
  var _paramValue = undefined;

  for (_paramName in _objectWithParams) {
    if (!_objectWithParams.hasOwnProperty(_paramName)) {
     continue;
    }

    _paramValue = _objectWithParams[_paramName];

    if (typeof _paramValue === "object") {
     _nestedParams.push(_paramName);
     var _nestedResult = TNT._internal._extractParamsFromObject(_nestedParams, _paramValue);
     _nestedParams.pop();

     for (var _index = 0; _index < _nestedResult.length; _index++) {
       _result.push(_nestedResult[_index]);
     }
     continue;
   }

   _result.push((_paramNamePrefix.length > 0 ? _paramNamePrefix + '.' : '') + _paramName + '=' + _paramValue);
  }

  return _result;
};

 

/**
 * Builds the url of a request given the mbox server host, client code
 * and server type.
 * @PrivateClass
 *
 * @param _mboxServer host of the mbox server e.g.
 *   mbox-test.dev.tt.omtrdc.net
 */
mboxUrlBuilder = function(_mboxServer, _clientCode) {
  this._mboxServer = _mboxServer;
  this._clientCode = _clientCode;
  this._parameters = new Array();
  this._urlProcess = function(_url) { return _url; };
  this._basePath = null;
};

/**
 * Adds a new parameter regardless of whether or not it's present already, use with caution
 *
 * @param _name - parameter name, should not contain single or double quotes
 * @param _value - parameter value, should not be html escaped
 */
mboxUrlBuilder.prototype.addNewParameter = function (_name, _value) {
  this._parameters.push({name: _name, value: _value});
  return this;
};

/**
 * Adds a parameter if it's not already present
 *
 * @param _name - parameter name, should not contain single or double quotes
 * @param _value - parameter value, should not be html escaped
 */
mboxUrlBuilder.prototype.addParameterIfAbsent = function (_name, _value) {
  if (_value) {
    for (var _i = 0; _i < this._parameters.length; _i++) {
      var _parameter = this._parameters[_i];
      if (_parameter.name === _name) {
        return this;
      }
    }

    this.checkInvalidCharacters(_name);
    return this.addNewParameter(_name, _value);
  }
};

/**
 * Adds a parameter
 *
 * @param _name - parameter name, should not contain single or double quotes
 * @param _value - parameter value, should not be html escaped
 */
mboxUrlBuilder.prototype.addParameter = function(_name, _value) {
  this.checkInvalidCharacters(_name);

  for (var _i = 0; _i < this._parameters.length; _i++) {
    var _parameter = this._parameters[_i];
    if (_parameter.name === _name) {
      _parameter.value = _value;
      return this;
    }
  }

  return this.addNewParameter(_name, _value);
};

/**
 * @param _parameters An array with items of the form "name=value".
 */
mboxUrlBuilder.prototype.addParameters = function(_parameters) {
  if (!_parameters) {
    return this;
  }
  for (var _i = 0; _i < _parameters.length; _i++) {
    var _splitIndex = _parameters[_i].indexOf('=');
    if (_splitIndex == -1 || _splitIndex == 0) {
      continue;
    }
    this.addParameter(_parameters[_i].substring(0, _splitIndex),
      _parameters[_i].substring(_splitIndex + 1, _parameters[_i].length));
  }
  return this;
};

mboxUrlBuilder.prototype.setServerType = function(_type) {
  this._serverType = _type;
};

mboxUrlBuilder.prototype.setBasePath = function(_basePath) {
  this._basePath = _basePath;
};

/**
 * @param _action is a function that accepts a string parameter (url)
 * @return The new url string
 */
mboxUrlBuilder.prototype.setUrlProcessAction = function(_action) {
  this._urlProcess = _action;
};

mboxUrlBuilder.prototype.buildUrl = function() {
  var _path = this._basePath ? this._basePath :
    '/m2/' + this._clientCode + '/mbox/' + this._serverType;

  var _protocol = document.location.protocol == 'file:' ? 'http:' :
    document.location.protocol;

  var _url = _protocol + "//" + this._mboxServer + _path;

  var _separator = _url.indexOf('?') != -1 ? '&' : '?';
  for (var _i = 0; _i < this._parameters.length; _i++) {
    var _parameter = this._parameters[_i];
    _url += _separator + encodeURIComponent(_parameter.name) + '=' +
      encodeURIComponent(_parameter.value);
      _separator = '&';
  }
  return this._escapeQuote(this._urlProcess(_url));
};

/**
 * @return An array of objects with two properties "name" and "value"
 */
mboxUrlBuilder.prototype.getParameters = function() {
  return this._parameters;
};

mboxUrlBuilder.prototype.setParameters = function(_parameters) {
  this._parameters = _parameters;
};

mboxUrlBuilder.prototype.clone = function() {
  var _newUrlBuilder = new mboxUrlBuilder(this._mboxServer, this._clientCode);
  _newUrlBuilder.setServerType(this._serverType);
  _newUrlBuilder.setBasePath(this._basePath);
  _newUrlBuilder.setUrlProcessAction(this._urlProcess);
  for (var _i = 0; _i < this._parameters.length; _i++) {
    _newUrlBuilder.addParameter(this._parameters[_i].name,
      this._parameters[_i].value);
  }
  return _newUrlBuilder;
};

mboxUrlBuilder.prototype._escapeQuote = function(_text) {
  return _text.replace(/\"/g, '&quot;').replace(/>/g, '&gt;');
};

/**
  * Checks a parameter's name for prohibited chars
  */
 mboxUrlBuilder.prototype.checkInvalidCharacters = function (_name) {
   var _invalidCharacters = new RegExp('(\'|")');
   if (_invalidCharacters.exec(_name)) {
     throw "Parameter '" + _name + "' contains invalid characters";
   }
 };

/**
 * Fetches the content given the url builder by including the script using
 * document.write(..)
 * @PrivateClass
 */
mboxStandardFetcher = function() { };

mboxStandardFetcher.prototype.getType = function() {
  return 'standard';
};

mboxStandardFetcher.prototype.fetch = function(_urlBuilder) {
  _urlBuilder.setServerType(this.getType());

  document.write('<' + 'scr' + 'ipt src="' + _urlBuilder.buildUrl() +
    '" language="JavaScript"><' + '\/scr' + 'ipt>');
};

mboxStandardFetcher.prototype.cancel = function() { };

/**
 * Fetches the content given the url builder by creating the script dynamically
 * in the DOM.
 * @PrivateClass
 */
mboxAjaxFetcher = function() { };

mboxAjaxFetcher.prototype.getType = function() {
  return 'ajax';
};

mboxAjaxFetcher.prototype.fetch = function(_urlBuilder) {
  _urlBuilder.setServerType(this.getType());
  var _url = _urlBuilder.buildUrl();

  this._include = document.createElement('script');
  this._include.src = _url;

  document.body.appendChild(this._include);
};

mboxAjaxFetcher.prototype.cancel = function() { };

/**
 * A map of elements.
 *
 * @PrivateClass
 */
mboxMap = function() {
  this._backingMap = new Object();
  this._keys = new Array();
};

mboxMap.prototype.put = function(_key, _value) {
  if (!this._backingMap[_key]) {
    this._keys[this._keys.length] = _key;
  }
  this._backingMap[_key] = _value;
};

mboxMap.prototype.get = function(_key) {
  return this._backingMap[_key];
};

mboxMap.prototype.remove = function(_key) {
  this._backingMap[_key] = undefined;
  var _updatedKeys = [];

  for (var i = 0; i < this._keys.length; i++) {
    if (this._keys[i] !== _key) {
      _updatedKeys.push(this._keys[i])
    }
  }
  this._keys = _updatedKeys;
};

mboxMap.prototype.each = function(_action) {
  for (var _i = 0; _i < this._keys.length; _i++ ) {
    var _key = this._keys[_i];
    var _value = this._backingMap[_key];
    if (_value) {
      var _result = _action(_key, _value);
      if (_result === false) {
        break;
      }
    }
  }
};

mboxMap.prototype.isEmpty = function() {
  return this._keys.length === 0;
};

/**
 * Creates and updates mboxes.
 *
 * @param _mboxServer host of the mbox server e.g.
 *   mbox-test.dev.tt.omtrdc.net
 * @param _clientCode - client's code e.g. 'demo'
 * @param _factoryId - a unique string identifying this factory
 */
mboxFactory = function(_server, _clientCode, _factoryId) {
  this._pageLoaded = false;
  this._server = _server;
  this._factoryId = _factoryId;
  this._mboxes = new mboxList();

  mboxFactories.put(_factoryId, this);

  // mboxIsSupported is a client defined function to test if mbox is supported
  // on this platform (defaults to just returning true)
  this._supported =
    typeof document.createElement('div').replaceChild != 'undefined' &&
    (function() { return true; })() &&
    typeof document.getElementById != 'undefined' &&
    typeof (window.attachEvent || document.addEventListener ||
       window.addEventListener) != 'undefined' &&
       typeof encodeURIComponent  != 'undefined';
  this._enabled = this._supported &&
    mboxGetPageParameter('mboxDisable') == null;

  var _isDefaultFactory = _factoryId == 'default';
  // Cookie name convention is: if it's a default factory then it's just
  // 'mbox', otherwise it's
  // 'mbox-_factoryId'
  this._cookieManager = new mboxCookieManager(
    'mbox' +
      (_isDefaultFactory ? '' : ('-' + _factoryId)),
    (function() { return mboxCookiePageDomain(); })());

  
     this._enabled = this._enabled && this._cookieManager.isEnabled() &&
       (this._cookieManager.getCookie('disable') == null);
   

  if (this.isAdmin()) {
    this.enable();
  }

  this._listenForDomReady();
  this._mboxPageId = mboxGenerateId();
  this._mboxScreenHeight = mboxScreenHeight();
  this._mboxScreenWidth = mboxScreenWidth();
  this._mboxBrowserWidth = mboxBrowserWidth();
  this._mboxBrowserHeight = mboxBrowserHeight();
  this._mboxColorDepth = mboxScreenColorDepth();
  this._mboxBrowserTimeOffset = mboxBrowserTimeOffset();
  this._mboxSessionId = new mboxSession(this._mboxPageId,
    'mboxSession',
    'session', 31 * 60, this._cookieManager);
  this._mboxPCId = new mboxPC('PC',
    7776000, this._cookieManager);

  this._urlBuilder = new mboxUrlBuilder(_server, _clientCode);
  this._initGlobalParameters(this._urlBuilder, _isDefaultFactory);

  this._pageStartTime = new Date().getTime();
  this._pageEndTime = this._pageStartTime;

  var _self = this;
  this.addOnLoad(function() { _self._pageEndTime = new Date().getTime(); });
  if (this._supported) {
    // Checks that all mboxes have been successfully imported
    // and shows default content for any that failed
    this.addOnLoad(function() {
      _self._pageLoaded = true;
      _self.getMboxes().each(function(_mbox) {
        _mbox._disableWaitForNestedMboxes();
        _mbox.setFetcher(new mboxAjaxFetcher());
        _mbox.finalize(); });
      TNT._internal.nestedMboxes = [];
      TNT._internal.isDomLoaded = true;
    });


   if (this._enabled) {
    this.limitTraffic(100, 10368000);
    this._makeDefaultContentInvisible();
      this._mboxSignaler = new mboxSignaler(function(_mboxName, _parameters) {
        return _self.create(_mboxName, _parameters);
      }, this._cookieManager);
    }

  }
};




/**
 * @return true if the factory is enabled. If factory is disabled, the mboxes
 * are still created but they show default content only.
 */
mboxFactory.prototype.isEnabled = function() {
  return this._enabled;
};

/**
 * @return cause of mbox disabling
 */
mboxFactory.prototype.getDisableReason = function() {
  return this._cookieManager.getCookie('disable');
};

/**
 * @return true if the client's environment is supported (i.e. there's a way
 *   to access DOM elements via document.getElementById and event handling
 *   is supported)
 */
mboxFactory.prototype.isSupported = function() {
  return this._supported;
};

/**
 * Disables the factory for the specified duration.
 *
 * @param _duration - duration in seconds (optional)
 * @param _cause - cause of disable (optional)
 */
mboxFactory.prototype.disable = function(_duration, _cause) {
  if (typeof _duration == 'undefined') {
    _duration = 60 * 60;
  }

  if (typeof _cause == 'undefined') {
    _cause = 'unspecified';
  }

  if (!this.isAdmin()) {
    this._enabled = false;
    this._cookieManager.setCookie('disable', _cause, _duration);
  }
};

mboxFactory.prototype.enable = function() {
  this._enabled = true;
  this._cookieManager.deleteCookie('disable');
};

mboxFactory.prototype.isAdmin = function() {
  return document.location.href.indexOf('mboxEnv') != -1;
};

/**
 * Limits the traffic (by disabling the factory for certain users) to the given
 * level for the specified duration.
 */
mboxFactory.prototype.limitTraffic = function(_level, _duration) {

};

/**
 * Adds a function to be called with body onload.
 */
mboxFactory.prototype.addOnLoad = function(_function) {

  // This extra checking is so that if there is a race, where addOnLoad
  // is called as the onload functions are being called, we'll detect this
  // and correctly call the passed in function exactly once, after the dom
  // has loaded.

  if (this.isDomLoaded()) {
    _function();
  } else {
    var _calledFunction = false;
    var _wrapper = function() {
      if (_calledFunction) {
        return;
      }
      _calledFunction = true;
      _function();
    };

    this._onloadFunctions.push(_wrapper);

    if (this.isDomLoaded() && !_calledFunction) {
      _wrapper();
    }
  }
};

mboxFactory.prototype.getEllapsedTime = function() {
  return this._pageEndTime - this._pageStartTime;
};

mboxFactory.prototype.getEllapsedTimeUntil = function(_time) {
  return _time - this._pageStartTime;
};

/**
 * @return An mboxList object that contains the mboxes associated with this
 *   factory.
 */
mboxFactory.prototype.getMboxes = function() {
  return this._mboxes;
};

/**
 * @param _mboxId the id of the mbox, defaults to 0 if not specified.
 *
 * @return mbox with the specified _mboxName and _mboxId.
 */
mboxFactory.prototype.get = function(_mboxName, _mboxId) {
  return this._mboxes.get(_mboxName).getById(_mboxId || 0);
};

/**
 * Updates one or more mboxes with the name _mboxName
 *
 * @param _mboxName - name of the mbox
 * @param _parameters - array of 0 or more items of the form "name=value"
 *   (the values need to be escaped for inclusion in the url)
 */
mboxFactory.prototype.update = function(_mboxName, _parameters) {
  if (!this.isEnabled()) {
    return;
  }
  if (!this.isDomLoaded()) {
    var _self = this;
    this.addOnLoad(function() { _self.update(_mboxName, _parameters); });
    return;
  }
  if (this._mboxes.get(_mboxName).length() == 0) {
    throw "Mbox " + _mboxName + " is not defined";
  }
  this._mboxes.get(_mboxName).each(function(_mbox) {
    _mbox.getUrlBuilder().addParameter('mboxPage', mboxGenerateId());
    mboxFactoryDefault.setVisitorIdParameters(_mbox.getUrlBuilder(), _mboxName);
    _mbox.load(_parameters);
  });
};

/**
 * This method sets the value for the visitor Ids that come from the VisitorAPI.js
 */
mboxFactory.prototype.setVisitorIdParameters =  function(_url, _mboxName) {
  var imsOrgId = '1D4334B852784A2D0A490D44@AdobeOrg';

  if (typeof Visitor == 'undefined' || imsOrgId.length == 0) {
    return;
  }

  var visitor = Visitor.getInstance(imsOrgId);

  if (visitor.isAllowed()) {
    // calling a getter on the visitor may either return a value, or invoke
    // the callback, depending on if the value is immediately available.
    var addVisitorValueToUrl = function(param, getter, mboxName) {
      if (visitor[getter]) {
        var callback = function(value) {
          if (value) {
            _url.addParameter(param, value);
          }
        };
        var value;
        if (typeof mboxName != 'undefined') {
          value = visitor[getter]("mbox:" + mboxName);
        } else {
          value = visitor[getter](callback);
        }
        callback(value);
      }
    };

    addVisitorValueToUrl('mboxMCGVID', "getMarketingCloudVisitorID");
    addVisitorValueToUrl('mboxMCGLH', "getAudienceManagerLocationHint");
    addVisitorValueToUrl('mboxAAMB', "getAudienceManagerBlob");
    addVisitorValueToUrl('mboxMCAVID', "getAnalyticsVisitorID");
    addVisitorValueToUrl('mboxMCSDID', "getSupplementalDataID", _mboxName);
  }
};

/**
 * Creates an mbox called _mboxName.
 *
 * There is a small chance that an mbox with the same name is created after
 * we call update - we will ignore this chance.
 *
 * @param _mboxName - name of the mbox
 * @param _parameters - array of 0 or more items of the form "name=value"
 *   (the values need to be escaped for inclusion in the url)
 * @param _defaultNode - the DOM node that is the default content
 *                       the name of the DOM that is the default content
 *                       or is not specified, search bacwords for
 *                       mboxDefault class to use as default content
 */
mboxFactory.prototype.create = function(
  _mboxName, _parameters, _defaultNode) {

  if (!this.isSupported()) {
    return null;
  }
  var _url = this._urlBuilder.clone();
  _url.addParameter('mboxCount', this._mboxes.length() + 1);
  _url.addParameters(_parameters);

  this.setVisitorIdParameters(_url, _mboxName);

  var _mboxId = this._mboxes.get(_mboxName).length();
  var _divSuffix = this._factoryId + '-' + _mboxName + '-' + _mboxId;
  var _locator;

  if (_defaultNode) {
    _locator = new mboxLocatorNode(_defaultNode);
  } else {
    if (this._pageLoaded) {
      throw 'The page has already been loaded, can\'t write marker';
    }
    _locator = new mboxLocatorDefault(_divSuffix);
  }

  try {
    var _self = this;
    var _importName = 'mboxImported-' + _divSuffix;
    var _mbox = new mbox(_mboxName, _mboxId, _url, _locator, _importName);
    if (this._enabled) {
      _mbox.setFetcher(
        this._pageLoaded ? new mboxAjaxFetcher() : new mboxStandardFetcher());
    }

    _mbox.setOnError(function(_message, _type) {
      _mbox.setMessage(_message);
        _mbox.activate();
        if (!_mbox.isActivated()) {
          _self.disable(60 * 60, _message);
          window.location.reload(false);
        }


    });
    this._mboxes.add(_mbox);
  } catch (_e) {
    this.disable();
    throw 'Failed creating mbox "' + _mboxName + '", the error was: ' + _e;
  }

  var _now = new Date();
  _url.addParameter('mboxTime', _now.getTime() -
   (_now.getTimezoneOffset() * 60000));

  return _mbox;
};

mboxFactory.prototype.getCookieManager = function() {
  return this._cookieManager;
};

mboxFactory.prototype.getPageId = function() {
  return this._mboxPageId;
};

mboxFactory.prototype.getPCId = function() {
  return this._mboxPCId;
};

mboxFactory.prototype.getSessionId = function() {
  return this._mboxSessionId;
};

mboxFactory.prototype.getSignaler = function() {
  return this._mboxSignaler;
};

mboxFactory.prototype.getUrlBuilder = function() {
  return this._urlBuilder;
};

mboxFactory.prototype._initGlobalParameters = function(_url, _isDefaultFactory) {
  _url.addParameter('mboxHost', document.location.hostname)
    .addParameter('mboxSession', this._mboxSessionId.getId());
  if (!_isDefaultFactory) {
    _url.addParameter('mboxFactoryId', this._factoryId);
  }
  if (this._mboxPCId.getId() != null) {
    _url.addParameter('mboxPC', this._mboxPCId.getId());
  }
  _url.addParameter('mboxPage', this._mboxPageId);
  _url.addParameter('screenHeight', this._mboxScreenHeight);
  _url.addParameter('screenWidth', this._mboxScreenWidth);
  _url.addParameter('browserWidth', this._mboxBrowserWidth);
  _url.addParameter('browserHeight', this._mboxBrowserHeight);
  _url.addParameter('browserTimeOffset', this._mboxBrowserTimeOffset);
  _url.addParameter('colorDepth', this._mboxColorDepth);


  _url.addParameter('mboxXDomain', "enabled");


  _url.setUrlProcessAction(function(_url) {

    _url += '&mboxURL=' + encodeURIComponent(document.location);
    var _referrer = encodeURIComponent(document.referrer);
    if (_url.length + _referrer.length < 2000) {
      _url += '&mboxReferrer=' + _referrer;
    }

    _url += '&mboxVersion=' + mboxVersion;
    return _url;
  });
};

mboxFactory.prototype._mboxParametersClient = function() {
  return "";
};

/**
 * Causes all mbox default content to not be displayed:
 */
mboxFactory.prototype._makeDefaultContentInvisible = function() {
  document.write('<style>.' + 'mboxDefault'
    + ' { visibility:hidden; }</style>');
};

mboxFactory.prototype.isDomLoaded = function() {
  return this._pageLoaded;
};

mboxFactory.prototype._listenForDomReady = function() {
  if (this._onloadFunctions != null) {
    return;
  }
  this._onloadFunctions = new Array();

  var _self = this;
  (function() {
    var _eventName = document.addEventListener ? "DOMContentLoaded" : "onreadystatechange";
    var _loaded = false;
    var _ready = function() {
      if (_loaded) {
        return;
      }
      _loaded = true;
      for (var i = 0; i < _self._onloadFunctions.length; ++i) {
        _self._onloadFunctions[i]();
      }
    };

    if (document.addEventListener) {
      document.addEventListener(_eventName, function() {
        document.removeEventListener(_eventName, arguments.callee, false);
        _ready();
      }, false);

      window.addEventListener("load", function(){
        document.removeEventListener("load", arguments.callee, false);
        _ready();
      }, false);

    } else if (document.attachEvent) {
      if (self !== self.top) {
        document.attachEvent(_eventName, function() {
          if (document.readyState === 'complete') {
            document.detachEvent(_eventName, arguments.callee);
            _ready();
          }
        });
      } else {
        var _checkScrollable = function() {
          try {
           document.documentElement.doScroll('left');
            _ready();
          } catch (_domNotReady) {
            setTimeout(_checkScrollable, 13);
          }
        };
        _checkScrollable();
      }
    }

    if (document.readyState === "complete") {
      _ready();
    }

  })();
};

/**
 * Iterates all signal cookies (e.g. prefixed with mboxSignalPrefix), and
 * creates a signal mbox for each signal cookie.
 *
 * @param _createMboxMethod Takes two arguments, first is the name of the mbox,
 *   second is an array of parameters.
 * @PrivateClass
 */
mboxSignaler = function(_createMboxMethod, _cookieManager) {
  this._cookieManager = _cookieManager;
  var _signalCookieNames =
    _cookieManager.getCookieNames('signal-');
  for (var _i = 0; _i < _signalCookieNames.length; _i++) {
    var _cookieName = _signalCookieNames[_i];
    var _args = _cookieManager.getCookie(_cookieName).split('&');
    var _mbox = _createMboxMethod(_args[0], _args);
    _mbox.load();
    _cookieManager.deleteCookie(_cookieName);
  }
};

/**
 * Called from the imported div tag to signal that an mbox was clicked on.
 */
mboxSignaler.prototype.signal = function(_signalType, _mboxName /*,...*/) {
  this._cookieManager.setCookie('signal-' +
    _signalType, mboxShiftArray(arguments).join('&'), 45 * 60);
};

/**
 * Represents a list of mboxes.
 *
 * @PrivateClass
 */
mboxList = function() {
  this._mboxes = new Array();
};

mboxList.prototype.add = function(_mbox) {
  if (_mbox != null) {
    this._mboxes[this._mboxes.length] = _mbox;
  }
};

/**
 * @return a subset of this mbox list with items of the specified name.
 */
mboxList.prototype.get = function(_mboxName) {
  var _result = new mboxList();
  for (var _i = 0; _i < this._mboxes.length; _i++) {
    var _mbox = this._mboxes[_i];
    if (_mbox.getName() == _mboxName) {
      _result.add(_mbox);
    }
  }
  return _result;
};

mboxList.prototype.getById = function(_index) {
  return this._mboxes[_index];
};

mboxList.prototype.length = function() {
  return this._mboxes.length;
};

/**
 * @param _action a function that taken an mbox instance as parameter.
 */
mboxList.prototype.each = function(_action) {
  if (typeof _action !== 'function') {
    throw 'Action must be a function, was: ' + typeof(_action);
  }
  for (var _i = 0; _i < this._mboxes.length; _i++) {
    _action(this._mboxes[_i]);
  }
};

//
// Note this constructor also writes a node to the DOM, do not create
// after the page is loaded
//
mboxLocatorDefault = function(_name) {
  this._name = 'mboxMarker-' + _name;

  document.write('<div id="' + this._name +
    '" style="visibility:hidden;display:none">&nbsp;</div>');
};

mboxLocatorDefault.prototype.locate = function() {
  var _node = document.getElementById(this._name);
  while (_node != null) {
    // check is DOM_ELEMENT_NODE before testing class name
    if (_node.nodeType == 1) {
      if (_node.className == 'mboxDefault') {
        return _node;
      }
    }
    _node = _node.previousSibling;
  }

  return null;
};

mboxLocatorDefault.prototype.force = function() {
  // There was no default div, add an empty one
  var _div = document.createElement('div');
  _div.className = 'mboxDefault';

  var _marker = document.getElementById(this._name);
  if (_marker) {
    _marker.parentNode.insertBefore(_div, _marker);
  }

  return _div;
};

mboxLocatorNode = function(_DOMNode) {
  this._node = _DOMNode;
};

mboxLocatorNode.prototype.locate = function() {
  return typeof this._node == 'string' ?
    document.getElementById(this._node) : this._node;
};

mboxLocatorNode.prototype.force = function() {
  return null;
};

/*
 * Creates an mbox called '_mboxName' and attempts to load it
 *
 * @return the created mbox or null if the platform is not supported
 */
mboxCreate = function(_mboxName /*, ... */) {
  var _mbox = mboxFactoryDefault.create( _mboxName, mboxShiftArray(arguments));

  if (_mbox) {
    _mbox.load();
  }
  return _mbox;
};

/*
 * Creates and associates an mbox with a specified '_DOMNode'
 * The created mbox needs to be load()ed
 *
 * @param _defaultNode of default content
 *        - if null or empty string looks back for mboxDefault
 *        - if a string looks for a DOM node with the passed id
 *        - otherwise it is assumed to be a DOM node
 *
 * @return the created mbox or null if the platform is not supported
 */
mboxDefine = function(_defaultNode, _mboxName /*, ...*/) {
  var _mbox = mboxFactoryDefault.create(_mboxName,
    mboxShiftArray(mboxShiftArray(arguments)), _defaultNode);

  return _mbox;
};

mboxUpdate = function(_mboxName /*, ... */) {
  mboxFactoryDefault.update(_mboxName, mboxShiftArray(arguments));
};

/**
 * Class that is the base of all mbox types.
 * @PrivateClass
 *
 * @parm _name - name of mbox
 * @param _id - index of this mbox in the list of mboxes of the same name
 * @param _urlBuilder - used to build url of the request
 * @param _mboxLocator object must support
 *   DOMNode locate() which should return null until the DOMNode is found.
 *   DOMNode force() which as a last resort should attempt to create
 *                   a DOMNOde and return it or null
 * @param _importName id of the node containing offer content
 */
mbox = function(_name, _id, _urlBuilder, _mboxLocator, _importName) {
  this._timeout = null;
  this._activated = 0;
  this._locator = _mboxLocator;
  this._importName = _importName;
  this._contentFetcher = null;

  this._offer = new mboxOfferContent();
  this._div = null;
  this._urlBuilder = _urlBuilder;

  // Information to support debugging
  this.message = '';
  this._times = new Object();
  this._activateCount = 0;

  this._id = _id;
  this._name = _name;

  this._validateName();

  _urlBuilder.addParameter('mbox', _name)
    .addParameter('mboxId', _id);

  this._onError = function() {};
  this._onLoad = function() {};

  this._defaultDiv = null;
  // enabled for IE10+ only during page load
  this._waitForNestedMboxes = document.documentMode >= 10 && !TNT._internal.isDomLoaded;

  if (this._waitForNestedMboxes) {
    this._nestedMboxes = TNT._internal.nestedMboxes;
    this._nestedMboxes.push(this._name);
  }
};

mbox.prototype.getId = function() {
  return this._id;
};

mbox.prototype._validateName = function() {
  if (this._name.length > 250) {
    throw "Mbox Name " + this._name + " exceeds max length of "
      + "250 characters.";
  } else if (this._name.match(/^\s+|\s+$/g)) {
    throw "Mbox Name " + this._name + " has leading/trailing whitespace(s).";
  }
};

mbox.prototype.getName = function() {
  return this._name;
};

/**
 * @return an array of parameters
 */
mbox.prototype.getParameters = function() {
  var _parameters = this._urlBuilder.getParameters();
  var _result = new Array();
  for (var _i = 0; _i < _parameters.length; _i++) {
    // do not include internal parameters
    if (_parameters[_i].name.indexOf('mbox') != 0) {
      _result[_result.length] = _parameters[_i].name + '=' + _parameters[_i].value;
    }
  }
  return _result;
};

/**
 * Sets the action to execute when the offer has loaded.
 * To be used with mboxUpdate.
 */
mbox.prototype.setOnLoad = function(_action) {
  this._onLoad = _action;
  return this;
};

mbox.prototype.setMessage = function(_message) {
  this.message = _message;
  return this;
};

/**
 * @param _onError is a function that takes two string arguments:
 *   message, fetch type
 */
mbox.prototype.setOnError = function(_onError) {
  this._onError = _onError;
  return this;
};

mbox.prototype.setFetcher = function(_fetcher) {
  if (this._contentFetcher) {
    this._contentFetcher.cancel();
  }
  this._contentFetcher = _fetcher;
  return this;
};

mbox.prototype.getFetcher = function() {
  return this._contentFetcher;
};

/**
 * Loads mbox content.
 * @param _parameters - Optional parameters to be added to the request.
 */
mbox.prototype.load = function(_parameters) {
  if (this._contentFetcher == null) {
    return this;
  }

  this.setEventTime("load.start");
  this.cancelTimeout();
  this._activated = 0;

  var _urlBuilder = (_parameters && _parameters.length > 0) ?
    this._urlBuilder.clone().addParameters(_parameters) : this._urlBuilder;
  this._contentFetcher.fetch(_urlBuilder);

  var _self = this;
  this._timer = setTimeout(function() {
    _self._onError('browser timeout', _self._contentFetcher.getType());
  }, 15000);

  this.setEventTime("load.end");

  return this;
};

/*
 * Used by the server to signal that all assets have been loaded by
 * the browser.
 */
mbox.prototype.loaded = function() {
  this.cancelTimeout();
  if (!this.activate()) {
    var _self = this;
    setTimeout(function() { _self.loaded();  }, 100);
  }
};

/**
 * Called when the mbox has been successfully loaded to activate
 * the mbox for display.
 *
 * This call may fail if the DOM has not been fully constructed
 */
mbox.prototype.activate = function() {
  if (this._activated) {
    return this._activated;
  }
  this.setEventTime('activate' + ++this._activateCount + '.start');

  if (this._waitForNestedMboxes
    && this._nestedMboxes[this._nestedMboxes.length - 1] !== this._name) {
    return this._activated;
  }

  if (this.show()) {
    this.cancelTimeout();
    this._activated = 1;
  }
  this.setEventTime('activate' + this._activateCount + '.end');

  if (this._waitForNestedMboxes) {
    this._nestedMboxes.pop();
  }
  return this._activated;
};

/**
 * @return true if the mbox has been successfully activated
 */
mbox.prototype.isActivated = function() {
  return this._activated;
};

/**
 * Sets an offer into mbox.
 *
 * @param _offer Offer object that must have 'show(mbox)' method which
 * will be called to render this offer within the mbox passed in.
 *
 * The offer.show() method should return 1 on success and 0 on error.
 */
mbox.prototype.setOffer = function(_offer) {
  if (_offer && _offer.show && _offer.setOnLoad) {
    this._offer = _offer;
  } else {
    throw 'Invalid offer';
  }
  return this;
};

mbox.prototype.getOffer = function() {
  return this._offer;
};

/**
 * Shows the offer.
 *
 * @return 1 if it was possible to show the content, 0 otherwise.
 */
mbox.prototype.show = function() {
  this.setEventTime('show.start');
  var _result = this._offer.show(this);
  this.setEventTime(_result == 1 ? "show.end.ok" : "show.end");

  return _result;
};

/**
 * Shows the specified content in the mbox.
 *
 * @return 1 if it was possible to show the content, 0 otherwise.
 */
mbox.prototype.showContent = function(_content) {
  if (_content == null) {
    // content is not loaded into DOM yet
    return 0;
  }
  // div might be non-null but no longer in the DOM, so we check if the
  // parentNode exists
  if (this._div == null || !this._div.parentNode) {
    this._div = this.getDefaultDiv();
    if (this._div == null) {
      // default div is not in the DOM yet
      return 0;
    }
  }

  if (this._div != _content) {
    this._hideDiv(this._div);
    this._div.parentNode.replaceChild(_content, this._div);
    this._div = _content;
  }

  this._showDiv(_content);

  this._onLoad();

  // Content was successfully displayed in place of the previous content node
  return 1;
};

/**
 * Hides any fetched content and show Default Content associated
 * with the mbox if it is avaliable yet.
 *
 * @return 1 if it was possible to show the default content
 */
mbox.prototype.hide = function() {
  this.setEventTime('hide.start');
  var _result = this.showContent(this.getDefaultDiv());
  this.setEventTime(_result == 1 ? 'hide.end.ok' : 'hide.end.fail');
  return _result;
};

/**
 * Puts the mbox into a shown state, if that fails shows default content
 * Also cancels any timeouts associated with the mbox
 */
mbox.prototype.finalize = function() {
  this.setEventTime('finalize.start');
  this.cancelTimeout();

  if (this.getDefaultDiv() == null) {
    if (this._locator.force() != null) {
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

mbox.prototype.cancelTimeout = function() {
  if (this._timer) {
    clearTimeout(this._timer);
  }
  if (this._contentFetcher != null) {
    this._contentFetcher.cancel();
  }
};

mbox.prototype.getDiv = function() {
  return this._div;
};

/**
 * returns valid default div
 * (even if it's not present in the DOM anymore)
 */
mbox.prototype.getDefaultDiv = function() {
  if (this._defaultDiv == null) {
    this._defaultDiv = this._locator.locate();
  }
  return this._defaultDiv;
};

mbox.prototype.setEventTime = function(_event) {
  this._times[_event] = (new Date()).getTime();
};

mbox.prototype.getEventTimes = function() {
  return this._times;
};

mbox.prototype.getImportName = function() {
  return this._importName;
};

mbox.prototype.getURL = function() {
  return this._urlBuilder.buildUrl();
};

mbox.prototype.getUrlBuilder = function() {
  return this._urlBuilder;
};

mbox.prototype._isVisible = function(_div) {
  return _div.style.display != 'none';
};

mbox.prototype._showDiv = function(_div) {
  this._toggleDiv(_div, true);
};

mbox.prototype._hideDiv = function(_div) {
  this._toggleDiv(_div, false);
};

mbox.prototype._toggleDiv = function(_div, _visible) {
  _div.style.visibility = _visible ? "visible" : "hidden";
  _div.style.display = _visible ? "block" : "none";
};

mbox.prototype._disableWaitForNestedMboxes = function() {
  this._waitForNestedMboxes = false;
};

mbox.prototype.relocateDefaultDiv = function() {
  this._defaultDiv = this._locator.locate();
};

mboxOfferContent = function() {
  this._onLoad = function() {};
};

mboxOfferContent.prototype.show = function(_mbox) {
  var _result = _mbox.showContent(document.getElementById(_mbox.getImportName()));
  if (_result == 1) {
    this._onLoad();
  }
  return _result;
};

mboxOfferContent.prototype.setOnLoad = function(_onLoad) {
  this._onLoad = _onLoad;
};

/**
 * Ajax offer.
 */
mboxOfferAjax = function(_content) {
  this._content = _content;
  this._onLoad = function() {};
};

mboxOfferAjax.prototype.setOnLoad = function(_onLoad) {
  this._onLoad = _onLoad;
};

mboxOfferAjax.prototype.show = function(_mbox) {
  var _contentDiv = document.createElement('div');

  _contentDiv.id = _mbox.getImportName();
  _contentDiv.innerHTML = this._content;

  var _result = _mbox.showContent(_contentDiv);
  if (_result == 1) {
    this._onLoad();
  }
  return _result;
};

/**
 * Offer that shows default content.
 */
mboxOfferDefault = function() {
  this._onLoad = function() {};
};

mboxOfferDefault.prototype.setOnLoad = function(_onLoad) {
  this._onLoad = _onLoad;
};

mboxOfferDefault.prototype.show = function(_mbox) {
  var _result = _mbox.hide();
  if (_result == 1) {
    this._onLoad();
  }
  return _result;
};

mboxCookieManager = function mboxCookieManager(_name, _domain) {
  this._name = _name;
  // single word domains are not accepted in a cookie domain clause
  this._domain = _domain == '' || _domain.indexOf('.') == -1 ? '' :
    '; domain=' + _domain;
  this._cookiesMap = new mboxMap();
  this.loadCookies();
};

mboxCookieManager.prototype.isEnabled = function() {
  this.setCookie('check', 'true', 60);
  this.loadCookies();
  return this.getCookie('check') == 'true';
};

/**
 * Sets cookie inside of mbox cookies string.
 *
 * @param name Cookie name.
 * @param value Cookie value.
 * @param duration Cookie duration time in seconds.
 */
mboxCookieManager.prototype.setCookie = function(_name, _value, _duration) {
  if (typeof _name != 'undefined' && typeof _value != 'undefined' &&
    typeof _duration != 'undefined') {
    var _cookie = new Object();
    _cookie.name = _name;
    _cookie.value = escape(_value);
    // Store expiration time in seconds to save space.
    _cookie.expireOn = Math.ceil(_duration + new Date().getTime() / 1000);
    this._cookiesMap.put(_name, _cookie);
    this.saveCookies();
  }
};

mboxCookieManager.prototype.getCookie = function(_name) {
  var _cookie = this._cookiesMap.get(_name);
  return _cookie ? unescape(_cookie.value) : null;
};

mboxCookieManager.prototype.deleteCookie = function(_name) {
  this._cookiesMap.remove(_name);
  this.saveCookies();
};

mboxCookieManager.prototype.getCookieNames = function(_namePrefix) {
  var _cookieNames = new Array();
  this._cookiesMap.each(function(_name, _cookie) {
    if (_name.indexOf(_namePrefix) == 0) {
      _cookieNames[_cookieNames.length] = _name;
    }
  });
  return _cookieNames;
};

mboxCookieManager.prototype.saveCookies = function() {
  var _xDomainOnly = false;
  var _disabledCookieName = 'disable';
  var _cookieValues = new Array();
  var _maxExpireOn = 0;
  this._cookiesMap.each(function(_name, _cookie) {
   if(!_xDomainOnly || _name === _disabledCookieName) {
    _cookieValues[_cookieValues.length] = _name + '#' + _cookie.value + '#' +
      _cookie.expireOn;
    if (_maxExpireOn < _cookie.expireOn) {
      _maxExpireOn = _cookie.expireOn;
    }
   }
  });

  var _expiration = new Date(_maxExpireOn * 1000);
  document.cookie = this._name + '=' + _cookieValues.join('|') +
    
     '; expires=' + _expiration.toGMTString() +
    '; path=/' + this._domain;
};

mboxCookieManager.prototype.loadCookies = function() {
  this._cookiesMap = new mboxMap();
  var _cookieStart = document.cookie.indexOf(this._name + '=');
  if (_cookieStart != -1) {
    var _cookieEnd = document.cookie.indexOf(';', _cookieStart);
    if (_cookieEnd == -1) {
      _cookieEnd =  document.cookie.indexOf(',', _cookieStart);
      if (_cookieEnd == -1) {
        _cookieEnd = document.cookie.length;
      }
    }
    var _internalCookies = document.cookie.substring(
      _cookieStart + this._name.length + 1, _cookieEnd).split('|');

    var _nowInSeconds = Math.ceil(new Date().getTime() / 1000);
    for (var _i = 0; _i < _internalCookies.length; _i++) {
      var _cookie = _internalCookies[_i].split('#');
      if (_nowInSeconds <= _cookie[2]) {
        var _newCookie = new Object();
        _newCookie.name = _cookie[0];
        _newCookie.value = _cookie[1];
        _newCookie.expireOn = _cookie[2];
        this._cookiesMap.put(_newCookie.name, _newCookie);
      }
    }
  }
};

/**
 * Class representing the users Session Id
 *
 * Retrieves the users sessionId from the url or cookie
 * Uses the specified _randomId if no id is found
 * @PrivateClass
 */
mboxSession = function(_randomId, _idArg, _cookieName, _expireTime,
  _cookieManager) {
  this._idArg = _idArg;
  this._cookieName = _cookieName;
  this._expireTime = _expireTime;
  this._cookieManager = _cookieManager;

  this._newSession = false;

  this._id = typeof mboxForceSessionId != 'undefined' ?
    mboxForceSessionId : mboxGetPageParameter(this._idArg);

  if (this._id == null || this._id.length == 0) {
    this._id = _cookieManager.getCookie(_cookieName);
    if (this._id == null || this._id.length == 0) {
      this._id = _randomId;
      this._newSession = true;
    }
  }

  _cookieManager.setCookie(_cookieName, this._id, _expireTime);
};

/**
 * @return the users session id
 */
mboxSession.prototype.getId = function() {
  return this._id;
};

mboxSession.prototype.forceId = function(_forcedId) {
  this._id = _forcedId;

  this._cookieManager.setCookie(this._cookieName, this._id, this._expireTime);
};

/**
 * Class representing users PC Id.
 * @PrivateClass
 *
 * @param _randomId Randomly assigned ID to user PC.
 * @param _expireTime Expiration time in seconds for this PC ID.
 */
mboxPC = function(_cookieName, _expireTime, _cookieManager) {
  this._cookieName = _cookieName;
  this._expireTime = _expireTime;
  this._cookieManager = _cookieManager;

  this._id = typeof mboxForcePCId != 'undefined' ?
    mboxForcePCId : _cookieManager.getCookie(_cookieName);
  if (this._id != null) {
    _cookieManager.setCookie(_cookieName, this._id, _expireTime);
  }

};

/**
 * @return the PC id
 */
mboxPC.prototype.getId = function() {
  return this._id;
};

/**
 * @return True if forced ID value was set, false otherwise.
 */
mboxPC.prototype.forceId = function(_forcedId) {
  if (this._id != _forcedId) {
    this._id = _forcedId;
    this._cookieManager.setCookie(this._cookieName, this._id, this._expireTime);
    return true;
  }
  return false;
};

mboxGetPageParameter = function(_name) {
  var _result = null;
  var _parameterRegExp = new RegExp("\\?[^#]*" + _name + "=([^\&;#]*)");
  var _parameterMatch = _parameterRegExp.exec(document.location);

  if (_parameterMatch != null && _parameterMatch.length >= 2) {
    _result = _parameterMatch[1];
  }
  return _result;
};

mboxSetCookie = function(_name, _value, _duration) {
  return mboxFactoryDefault.getCookieManager().setCookie(_name, _value, _duration);
};

mboxGetCookie = function(_name) {
  return mboxFactoryDefault.getCookieManager().getCookie(_name);
};

mboxCookiePageDomain = function() {
  var _domain = (/([^:]*)(:[0-9]{0,5})?/).exec(document.location.host)[1];
  var _ipRegExp = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/;

  if (!_ipRegExp.exec(_domain)) {
    var _baseDomain =
      (/([^\.]+\.[^\.]{3}|[^\.]+\.[^\.]+\.[^\.]{2})$/).exec(_domain);
    if (_baseDomain) {
      _domain = _baseDomain[0];
      if (_domain.indexOf("www.") == 0) {
        _domain=_domain.substr(4);
      }
    }
  }

  return _domain ? _domain: "";
};

mboxShiftArray = function(_iterable) {
  var _result = new Array();
  for (var _i = 1; _i < _iterable.length; _i++) {
    _result[_result.length] = _iterable[_i];
  }
  return _result;
};

mboxGenerateId = function() {
  return (new Date()).getTime() + "-" + Math.floor(Math.random() * 999999);
};

mboxScreenHeight = function() {
  return screen.height;
};

mboxScreenWidth = function() {
  return screen.width;
};

mboxBrowserWidth = function() {
  return (window.innerWidth) ? window.innerWidth :
    document.documentElement ? document.documentElement.clientWidth :
      document.body.clientWidth;
};

mboxBrowserHeight = function() {
  return (window.innerHeight) ? window.innerHeight :
    document.documentElement ? document.documentElement.clientHeight :
      document.body.clientHeight;
};

mboxBrowserTimeOffset = function() {
  return -new Date().getTimezoneOffset();
};

mboxScreenColorDepth = function() {
  return screen.pixelDepth;
};

if (typeof mboxVersion == 'undefined') {
  var mboxVersion = 53;
  var mboxFactories = new mboxMap();
  var mboxFactoryDefault = new mboxFactory('nationwidebuildingso.tt.omtrdc.net', 'nationwidebuildingso',
    'default');
};

if (mboxGetPageParameter("mboxDebug") != null ||
  mboxFactoryDefault.getCookieManager()
    .getCookie("debug") != null) {
  setTimeout(function() {
    if (typeof mboxDebugLoaded == 'undefined') {
      alert('Could not load the remote debug.\nPlease check your connection'
        + ' to Test&amp;Target servers');
    }
  }, 60*60);
  document.write('<' + 'scr' + 'ipt language="Javascript1.2" src='
    + '"//admin5.testandtarget.omniture.com/admin/mbox/mbox_debug.jsp?mboxServerHost=nationwidebuildingso.tt.omtrdc.net'
    + '&clientCode=nationwidebuildingso"><' + '\/scr' + 'ipt>');
};




mboxScPluginFetcher = function(_clientCode, _siteCatalystCore) {
  this._clientCode = _clientCode;
  this._siteCatalystCore = _siteCatalystCore;
};

/**
 * @PrivateClass
 */
mboxScPluginFetcher.prototype._buildUrl = function(_urlBuilder) {
  _urlBuilder.setBasePath('/m2/' + this._clientCode + '/sc/standard');
  this._addParameters(_urlBuilder);

  var _url = _urlBuilder.buildUrl();
  _url += '&scPluginVersion=1';
  return _url;
};

/**
 * Deliberately ignores "pageURL","referrer"
 */
mboxScPluginFetcher.prototype._addParameters = function(_urlBuilder) {
  var _parametersToRead = [
    "dynamicVariablePrefix","visitorID","vmk","ppu","charSet",
    "visitorNamespace","cookieDomainPeriods","cookieLifetime","pageName",
    "currencyCode","variableProvider","channel","server",
    "pageType","transactionID","purchaseID","campaign","state","zip","events",
    "products","linkName","linkType","resolution","colorDepth",
    "javascriptVersion","javaEnabled","cookiesEnabled","browserWidth",
    "browserHeight","connectionType","homepage","pe","pev1","pev2","pev3",
    "visitorSampling","visitorSamplingGroup","dynamicAccountSelection",
    "dynamicAccountList","dynamicAccountMatch","trackDownloadLinks",
    "trackExternalLinks","trackInlineStats","linkLeaveQueryString",
    "linkDownloadFileTypes","linkExternalFilters","linkInternalFilters",
    "linkTrackVars","linkTrackEvents","linkNames","lnk","eo" ];

  for (var _i = 0; _i < _parametersToRead.length; _i++) {
    this._addParameterFromCore(_parametersToRead[_i], _urlBuilder);
  }

  for (var _i = 1; _i <= 75; _i++) {
    this._addParameterFromCore('prop' + _i, _urlBuilder);
    this._addParameterFromCore('eVar' + _i, _urlBuilder);
    this._addParameterFromCore('hier' + _i, _urlBuilder);
  }
};

mboxScPluginFetcher.prototype._addParameterFromCore = function(_name, _urlBuilder) {
  var _value = this._siteCatalystCore[_name];
  if (typeof _value === 'undefined' || _value === null || _value === '' || typeof _value === 'object') {
    return;
  }
  _urlBuilder.addParameter(_name, _value);
};

mboxScPluginFetcher.prototype.cancel = function() { };


mboxScPluginFetcher.prototype.fetch = function(_urlBuilder) {
  _urlBuilder.setServerType(this.getType());
  var _url = this._buildUrl(_urlBuilder);

  this._include = document.createElement('script');
  this._include.src = _url;

  document.body.appendChild(this._include);
};

mboxScPluginFetcher.prototype.getType = function() {
  return 'ajax';
};

/**
 * This function returns the plugin, or null if it was not loaded.
 */
function mboxLoadSCPlugin(_siteCatalystCore) {
  if (!_siteCatalystCore) {
    return null;
  }
  _siteCatalystCore.m_tt = function(_siteCatalystCore) {

    var _plugin = _siteCatalystCore.m_i('tt');

    _plugin._enabled = true;
    _plugin._clientCode = 'nationwidebuildingso';

    /** This method is called by the core when it's ready to make a request.
     * it cannot be obfuscated, since _t is a special name.  Hence the
     * strange syntax.
     */
    _plugin['_t'] = function() {
      if (!this.isEnabled()) {
        return;
      }

      var _mbox = this._createMbox();
      if (_mbox) {
        var _fetcher = new mboxScPluginFetcher(this._clientCode, this.s);
        _mbox.setFetcher(_fetcher);
        _mbox.load();
      }
    };

    _plugin.isEnabled = function() {
      return this._enabled && mboxFactoryDefault.isEnabled();
    };

    _plugin._createMbox = function() {
      var _mboxName = this._generateMboxName();
      var _div = document.createElement('DIV');
      return mboxFactoryDefault.create(_mboxName, new Array(), _div);
    };

    _plugin._generateMboxName = function() {
      var _isPurchase = this.s.events && this.s.events.indexOf('purchase') != -1;
      return 'SiteCatalyst: ' + (_isPurchase ? 'purchase' : 'event');
    };
  };

  return _siteCatalystCore.loadModule('tt');
};


mboxVizTargetUrl = function(_mboxName /*, ... */) {
  if (!mboxFactoryDefault.isEnabled()) {
    return;
  }

  var _urlBuilder = mboxFactoryDefault.getUrlBuilder().clone();
  _urlBuilder.setBasePath('/m2/' + 'nationwidebuildingso' + '/viztarget');

  _urlBuilder.addParameter('mbox', _mboxName);
  _urlBuilder.addParameter('mboxId', 0);
  _urlBuilder.addParameter('mboxCount',
    mboxFactoryDefault.getMboxes().length() + 1);

  var _now = new Date();
  _urlBuilder.addParameter('mboxTime', _now.getTime() -
    (_now.getTimezoneOffset() * 60000));

  _urlBuilder.addParameter('mboxPage', mboxGenerateId());

  var _parameters = mboxShiftArray(arguments);
  if (_parameters && _parameters.length > 0) {
    _urlBuilder.addParameters(_parameters);
  }

  _urlBuilder.addParameter('mboxDOMLoaded', mboxFactoryDefault.isDomLoaded());

  mboxFactoryDefault.setVisitorIdParameters(_urlBuilder, _mboxName);

  return _urlBuilder.buildUrl();
};

TNT.createGlobalMbox = function () {
  var _globalMboxName = "target-global-mbox";
  var _createGlobalMboxDiv = ("".length === 0);
  var _globalMboxDomElementId = "";
  var _globalMboxDiv;

  if (_createGlobalMboxDiv) {
    _globalMboxDomElementId = "mbox-" + _globalMboxName + "-" + mboxGenerateId();
    _globalMboxDiv = document.createElement("div");
    _globalMboxDiv.className = "mboxDefault";
    _globalMboxDiv.id = _globalMboxDomElementId;
    _globalMboxDiv.style.visibility = "hidden";
    _globalMboxDiv.style.display = "none";
    mboxFactoryDefault.addOnLoad(function(){
      document.body.insertBefore(_globalMboxDiv, document.body.firstChild);
    });
  }

  var _globalMbox = mboxFactoryDefault.create(_globalMboxName,
    TNT._internal._getGlobalMboxParameters(), _globalMboxDomElementId);

  if (_globalMbox != null) {
    _globalMbox.load();
  }
};
