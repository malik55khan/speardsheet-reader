var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
BROWSER.runtime.sendMessage({cmd: 'getAuthorize'}, function (resp) {
    if(resp){
        console.log(resp);
    }else{
        
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
});
authorizeButton.onclick = handleAuthClick;
function handleAuthClick(event) {
    BROWSER.runtime.sendMessage({cmd: 'doAuthorize'}, function (resp) {
        console.log(resp);
    });
    
  }