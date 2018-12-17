// Instructions expand/collapse
//
var key = "name";
var content = $('#instructionBody');
var trigger = $('#collapseTrigger');
content.hide();
$('.collapse-text').text('(Click to expand)');
trigger.click(function(){
content.toggle();
var isVisible = content.is(':visible');
if(isVisible){
    $('.collapse-text').text('(Click to collapse)');
}else{
    $('.collapse-text').text('(Click to expand)');
}
});
// end expand/collapse

//// highlight selected category
var inputs = $("#Inputs input:radio");
inputs.change(function(){
inputs.parent().removeClass("btn-success");
inputs.parent().addClass("btn-default");
if($(this).is(":checked")){
    key =  $(this).val();
    $(this).parent().removeClass("btn-default");
    $(this).parent().addClass("btn-success");
    show();
}else{
    $(this).parent().removeClass("btn-success");
    $(this).parent().addClass("btn-default");
}
});
// end highlight

//// shuffle using j and k
//var cur = "no";
//var next = {yes: "yesbut", "yesbut": "no", "no": "yes"};
//var prev = {yes: "no", "yesbut": "yes", "no": "yesbut"};

//var buttons = {
    //yes: $('#yes'),
    //yesbut: $('#yesbut'),
    //no: $('#no')
//};

//buttons[cur].click();
//$(document).on('keypress', function(e) {
    //if (e.key == 'j') {
        //cur = next[cur];
        //buttons[cur].click();
    //} else if (e.key == 'k') {
        //cur = prev[cur];
        //buttons[cur].click();
    ////} else if (e.key == 'Enter') {
    ////    $('#submit').click();
    //}
//});
