var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

var html = `<span class="vN bfK a3q" email="ashavnirawal04@gmail.com" data-hovercard-id="ashavnirawal04@gmail.com" data-hovercard-owner-id="133"><div class="vT">Ashavni Rawal</div><div class="vM"></div></span>`;
console.log(html.match(/email="([\s\S]*?)"/i))


BROWSER.runtime.sendMessage({cmd: 'getAuthorize'}, function (signedIn) {
    if(signedIn){
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
    }else{
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        authorizeButton.onclick = handleAuthClick;
    }
});

function handleAuthClick(event) {
    BROWSER.runtime.sendMessage({cmd: 'doAuthorize'}, function (resp) {
        console.log(resp);
    });
    
  }