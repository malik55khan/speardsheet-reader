class MyExtension{
    ccList =  [];
    constructor(){
        this.startEngine();
    }
    startEngine(){
        var _that = this;
        setInterval(function(){
            var allForms = extjQuery("form[method=POST]");
            _that.isAnyFormIsRemoved(allForms);
            for(var f=0;f<allForms.length;f++){
                var form = extjQuery(allForms[f]);
                if(form.attr('id') && form.attr('enctype')=="multipart/form-data" && form.attr("method")=="POST"){
                    if(typeof _that.ccList[form.attr('id')]=="undefined" && !_that.ccList[form.attr('id')] || _that.ccList[form.attr('id')].length===0){
                        _that.ccList[form.attr('id')] = [];
                        console.log('empty Called');
                    }
                    _that.setToCC(form);
                }
            }
            console.log(_that.ccList);
           // console.log(allCcs);
        },3000);
    }
    isAnyFormIsRemoved(composeForms){
        var _that = this;
        let composeFormsIds = [];
        var composeList = composeForms.filter((i,elem)=>{composeFormsIds.push(extjQuery(elem).attr('id'));});
        Object.keys(this.ccList).filter((id) => !composeFormsIds.includes(id)).forEach((elem) => delete _that.ccList[elem]);
    }

    setToCC(form){
        var allReceipients = form.find("textarea[name='to']");
        for(var i=0;i<allReceipients.length;i++){
            extjQuery(allReceipients[i]).unbind('blur');
            var _that = this;
            extjQuery(allReceipients[i]).bind('blur',function(){
                var divTxt = extjQuery(this).prev('div').html();
                if(typeof divTxt !=='undefined' && divTxt){
                    divTxt = divTxt.trim(); 
                    var matches = divTxt.match(/email="([\s\S]*?)"/i);
                    if(typeof matches !=='undefined' && matches && matches[1]){
                        _that.setCCValue(matches[1],form);
                        var spans =  extjQuery(this).parent('div').find('span:contains(Cc)');
                        for(var k=0;k<spans.length;k++){
                            if(extjQuery(spans[k]).text()=="Cc"){
                            extjQuery(spans[k]).click();
                            break;
                            }
                        }
                    }
                }
            });
        }
    }

    setCCValue(email,form){
        var _that = this;
        BROWSER.runtime.sendMessage({cmd: 'findCoach',email:email}, function (coach) {
            let allCcs = form.find("textarea[name='cc']");
           
            if(coach){
                console.log(coach);
                var isCCAlreadyExists = false;
                for(var j=0;j < _that.ccList[form.attr('id')].length;j++){
                    if(_that.ccList[form.attr('id')][j].coach==coach){
                        isCCAlreadyExists = true;
                        break;
                    }
                }
                if(!isCCAlreadyExists){
                    _that.ccList[form.attr('id')].push({email:email,coach:coach});
                    //console.log('IN-----',_that.ccList);
                    extjQuery(allCcs).val(coach);
                    extjQuery(allCcs).focus();
                    extjQuery("input[name='subjectbox']").focus();
                    form.find("textarea[name='to']").focus();
                }
            }
            
        });
    }
}
