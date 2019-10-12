BROWSER.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    switch(request.cmd){
		case "getAuthorize":getAuthorize(sendResponse);break;
		case "doAuthorize":doAuthorize(sendResponse);break;
		case "findCoach": findCoach(request.email,sendResponse);break;
    }
    return true;
});
function findCoach(email,imFinish){
	gapi.auth.authorize(
		{
			
			client_id: '1018444700498-8v2eo61dh0s8nbf6e77sm6ha9dc76s8t.apps.googleusercontent.com',
			immediate: true,
			scope: 'https://www.googleapis.com/auth/spreadsheets.readonly'
		},
		function(key){
			gapi.client.load('sheets', 'v4', function(){
				var appendPre = console.log;
				gapi.client.sheets.spreadsheets.values.get({
					spreadsheetId: '1PxmCkRL57pFzZ1It7tbjbeJO3tmISk-x9E2oj8q8zbI',
					range: 'A1:C',
					key:"AIzaSyD8vJpbY_pM3OdZMrCfmV2pIaMhIomgREw",
				}).then(function(response) {
					var range = response.result;
					if (range.values.length > 0) {
						let find = false;
						for (i = 0; i < range.values.length; i++) {
							var row = range.values[i];
							appendPre(row[0] + ', ' + row[1],',',row[2]);
							if(row[1]==email){
								imFinish(row[2]);
								find = true;				
								break;
							}
						}
						if(!find){
							imFinish(false);
						}
					} else {
						appendPre('No data found.');
						imFinish(false);
					}
				}, function(response) {
					appendPre('Error: ' + response.result.error.message);
					imFinish(false);
				});
			});
			
		}
	)
}
BROWSER.identity.onSignInChanged.addListener(function (account, signedIn) {
	common.setLocal({'isSingedIn':signedIn});
});
function doAuthorize(sendResponse){
	chrome.identity.getAuthToken(
		{'interactive': true},
		function(token){
			console.log('this is the token: ', token);
			//window.gapi_onload = authorize;
			gapi.auth.authorize(
				{
					
					client_id: '1018444700498-8v2eo61dh0s8nbf6e77sm6ha9dc76s8t.apps.googleusercontent.com',
					immediate: true,
					scope: "https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/userinfo.email profile https://www.googleapis.com/auth/plus.me"
				
				},
				function(key){
					gapi.client.load('sheets', 'v4', gmailAPILoaded);
					console.log(gapi.auth2.getAuthInstance());
					
					//gapi.client.load('gmail', 'v1', gmailAPILoaded);
				}
			);
		}
	);
}
function getAuthorize(sendResponse){
	chrome.identity.getAuthToken({'interactive': true}, function(token) {
		console.log('user token: ' + token);
		let isSingedIn = false;
		if(token){
			isSingedIn = true;
		}
		common.setLocal({'isSingedIn':isSingedIn});
		sendResponse(isSingedIn);
	});
}
loadScript('https://apis.google.com/js/client.js');


function loadScript(url){
  var request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if(request.readyState !== 4) {
			return;
		}
		if(request.status !== 200){
			return;
		}
		eval(request.responseText);
	};
	request.open('GET', url);
	request.send();
}

function authorize(){
  gapi.auth.authorize(
		{
			
			client_id: '1018444700498-8v2eo61dh0s8nbf6e77sm6ha9dc76s8t.apps.googleusercontent.com',
			immediate: true,
			scope: 'https://www.googleapis.com/auth/spreadsheets.readonly'
		},
		function(key){
			gapi.client.load('sheets', 'v4', gmailAPILoaded);
			//gapi.client.load('gmail', 'v1', gmailAPILoaded);
		}
	);
}

function gmailAPILoaded(){
	var appendPre = console.log;
    gapi.client.sheets.spreadsheets.values.get({
		spreadsheetId: '1PxmCkRL57pFzZ1It7tbjbeJO3tmISk-x9E2oj8q8zbI',
		range: 'A1:C',
		key:"AIzaSyD8vJpbY_pM3OdZMrCfmV2pIaMhIomgREw",
	  }).then(function(response) {
		var range = response.result;
		if (range.values.length > 0) {
		  appendPre('Name, Major:');
		  for (i = 0; i < range.values.length; i++) {
			var row = range.values[i];
			// Print columns A and E, which correspond to indices 0 and 4.
			appendPre(row[0] + ', ' + row[1]);
		  }
		} else {
		  appendPre('No data found.');
		}
	  }, function(response) {
		appendPre('Error: ' + response.result.error.message);
	  });
}


/* here are some utility functions for making common gmail requests */
function getThreads(query, labels){
  return gapi.client.gmail.users.threads.list({
		userId: 'me',
		q: query, //optional query
		labelIds: labels //optional labels
	}); //returns a promise
}

//takes in an array of threads from the getThreads response
function getThreadDetails(threads){
  var batch = new gapi.client.newBatch();

	for(var ii=0; ii<threads.length; ii++){
		batch.add(gapi.client.gmail.users.threads.get({
			userId: 'me',
			id: threads[ii].id
		}));
	}

	return batch;
}

function getThreadHTML(threadDetails){
  var body = threadDetails.result.messages[0].payload.parts[1].body.data;
	return B64.decode(body);
}

function archiveThread(id){
  var request = gapi.client.request(
		{
			path: '/gmail/v1/users/me/threads/' + id + '/modify',
			method: 'POST',
			body: {
				removeLabelIds: ['INBOX']
			}
		}
	);

	request.execute();
}