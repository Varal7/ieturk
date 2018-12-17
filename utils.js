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


// update when clicking on checkbox
var checkboxes = $("#form input:checkbox");
checkboxes.change(function() { show(); });
