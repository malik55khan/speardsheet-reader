window.onload = function(){
    $('.T-I.J-J5-Ji').click(function(){
        if($(this).text().toLowerCase()=='compose'){
            alert('compose clicked');
            init();
        }
    });
    var emailList = [];
    emailList['dignified.malik@gmail.com'] = "ankitgupta@yopmail.com";
    emailList['mindvirus55@gmail.com'] = "rajiv@yopmail.com";
    var cc = [];
    var formData = [];
    setInterval(function(){
        var allForms = $("form[method=POST]");
        for(var f=0;f<allForms.length;f++){
            var form = $(allForms[f]);
            setToCC(form);
            
        }
        console.log(cc);
       // console.log(allCcs);
    },3000);
    function setToCC(form){
        if(form.attr('enctype')=="multipart/form-data" && form.attr("method")=="POST"){
            var allReceipients = form.find("textarea[name='to']");
            
            for(var i=0;i<allReceipients.length;i++){
             //   console.log('rec-length=',allReceipients.length)
             $(allReceipients[i]).unbind('blur');
             $(allReceipients[i]).bind('blur',function(){
                 var divTxt = $(this).prev('div').html().trim();
                 if(divTxt){
                    var matches = $(this).prev('div').html().match(/email="([\s\S]*?)"/i);
                    var spans = $(this).parent('div').find('span:contains(Cc)');
                    if(typeof matches !=='undefined' && matches && matches[1]){
                        BROWSER.runtime.sendMessage({cmd: 'findCoach',email:matches[1]}, function (coach) {
                            let allCcs = form.find("textarea[name='cc']");
                            if(coach){
                                console.log(coach);
                                cc[matches[1]]=coach;
                                $(allCcs).val(coach);
                                $(allCcs).focus();
                                $(allReceipients[i]).focus();
                            }
                            
                        });
                         
                         for(var k=0;k<spans.length;k++){
                             if($(spans[k]).text()=="Cc"){
                                 //console.log(cc[matches[1]]);
                                 
                                 $(spans[k]).click();
                                 //console.log(allCcs);
                                 
                                 
                                 break;
                             }
                         }
                     }
                 }
                 
             });
         }
         
         }
    }
    function init(){
        setTimeout(function(){
        // console.log('inii start');
        // let allReceipients = $("textarea[name='to']");
        // for(var i=0;i<allReceipients.length;i++){
        //     $(allReceipients[i]).unbind('keypress');
        //     setTrigger(allReceipients[i],function(t){
        //         t.on('keyup',function(){
        //             console.log($(this).val());
        //         });
        //         console.log(t.val());
        //     });
        // }
        
        //console.log(allReceipients);
        
        
        
        // allReceipients.keyup(function(){
        //     console.log($(this).val());
        // });
        // allReceipients.focus(function(){
        //     console.log($(this).val());
        // });
    },1000);
        // $.forEachSeries(allReceipients,function(elem,cb){
        //     console.log(elem);
        //     $(elem).on('keypress',function(evt){bindPressKey(evt,elem)});
        //     $(elem).on('focus',function(evt){console.log(elem)});
        //     cb();
        // },function(){
        //     console.log('done');
        // });
    }
    init();
    function setTrigger(elem, callback) {
        var t = $(elem);
        window.setTimeout(function () {
            try {
                t.focus(), t.val("First Name"), t.focus();
                var _ = new Event("input", {
                    bubbles: !0,
                    cancelable: !0
                });
                t[0].dispatchEvent(_);
                var keyboardEvent = document.createEvent("KeyboardEvent");
                var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
                var e = jQuery.Event("keydown");
                e.which = 77; // m code value
                e.altKey = true; // Alt key pressed
                t.trigger(e).blur().focus();
                
                callback(t);
            } catch (e) {
                callback(t);
            }

        });
    }
};