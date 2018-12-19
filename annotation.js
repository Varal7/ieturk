// ---------------------------------------------------------
// Global
// ---------------------------------------------------------

var keys = Object.keys(fieldName);
var annotations = {};
var values = {};
var key;

// ---------------------------------------------------------
// Create jQuery elements
// ---------------------------------------------------------

var raw = $('#raw');
var well = $('#well');
var submit = $('#submit');
var choice = $('#choice');
var keyname = $('#key-name');
var instructionTable = $('#instruction-table');

var form = $("#form");
var answer = {};
var tagHidden = {};
var noVal = {};
var radios = {};
// answerHiddenDuplicates value of answer but is needed because
// otherwise the data is not sent
var answerHidden = {};

var makeInstruction = function(key) {
    return ($(
        '<tr>')
        .append($('<td>').text(fieldName[key]))
        .append($('<td>').text(longDesc[key]))
    );
}

var makeChoice = function(key) {
    var input = ($(
        '<input>')
        .attr({
            'name': 'choice', 'id': key + "-choice",
            'value': key, 'type': 'radio', 'data-key': shortcutKey[key]
        })
        .text(fieldName[key])
    );
    radios[key] = input;
    var label = ($(
        '<label>')
        .addClass('btn btn-default')
        .text(fieldName[key])
        .append(input)
        .attr({'title': "Shortcut: " +  shortcutKey[key]})
    );
    return label;
}

var makeAnswerHidden = function(key) {
    var input = ($(
        '<input>')
        .attr({'type': 'hidden', 'name': key, 'id': key + "-hidden"})
    );
    answerHidden[key] = input;
    return input;
}

var makeTagHidden = function(key) {
    var input = ($(
        '<input>')
        .attr({'type': 'hidden', 'name': key + "-tag", 'id': key + "-tag"})
    );
    tagHidden[key] = input;
    return input;
}


var  makeFormRow = function(key) {
    var checkbox = ($(
        '<input>')
        .attr({'type': 'checkbox', 'id': "no-" + key})
        .addClass('form-check-input')
        .change(function() { show(); })
    );
    var label = ($(
        '<label>')
        .attr({'for': "no-" + key})
        .addClass('form-check-label')
        .text(' There is no ' + shortName[key])
    );

    var input = ($(
        '<input>')
        .attr({'type': 'text', 'disabled':'disabled', 'id': key})
        .addClass('form-control')
    );

    var div = ($(
        '<div>')
        .addClass('col-xs-12 col-sm-12 content')
        .append($('<label>')
            .attr({'for': key})
            .text(fieldName[key])
        )
        .append($('<div>')
            .addClass('form-row')
            .append($('<div>')
                .addClass('col-sm-8')
                .append(input)
            )
            .append($('<div>')
                .addClass('col-sm-4')
                .append($('<div>')
                    .addClass('form-check')
                    .append(checkbox)
                    .append(' ')
                    .append(label)
                )
            )
        )
    );
    answer[key] = input;
    noVal[key] = checkbox;
    return div;
}


var makeDom = function() {
    for (var key of keys) {
        form.append(makeFormRow(key));
        form.append(makeTagHidden(key));
        form.append(makeAnswerHidden(key));
        choice.append(makeChoice(key));
        annotations[key] = [];
        values[key] = "";
        instructionTable.append(makeInstruction(key));
    }
}

// ---------------------------------------------------------
// Annotation logic
// ---------------------------------------------------------

var old_annotations = [];


var get_annotation_id = function(token_id, annotations) {
    var found = annotations.findIndex(function(annotation) {
        return token_id >= annotation[0] && token_id < annotation[1];
    });
    return found;
};

var mouse_down = function(id) {
    var annotation_id = get_annotation_id(id, annotations[key]);
    if (annotation_id > -1) {
        delete_annotation(annotation_id);
        show();
    } else {
        first_token = id;
    }
};

var mouse_up = function(id) {
    if (first_token > -1) {
        if (first_token <= id) {
            add_annotation([first_token, id + 1]);
        } else {
            add_annotation([id, first_token + 1]);
        }
        first_token = -1;
        show();
    }
    clear_selection();
};

var clear_selection = function() {
    if (document.selection) {
        document.selection.empty();
    } else if ( window.getSelection ) {
        window.getSelection().removeAllRanges();
    }
};

var get_value = function() {
    var values = _.map(annotations[key], function(annotation) {
        return tokens.slice(annotation[0], annotation[1]).join(" ");
    });
    return values.join(" ");
};

var remove_all_annotations = function() {
    old_annotations = annotations[key].slice();
    annotations[key] = []
};

var delete_annotation = function(annotation_id) {
    if (annotation_id > -1) {
        old_annotations = annotations[key].slice();
        annotations[key].splice(annotation_id, 1);
    }
}

var add_annotation = function(annotation) {
    old_annotations = annotations[key].slice();
    annotations[key].push(annotation);
}

var toggle_old_new = function() {
    var new_annotations = annotations[key].slice();
    annotations[key] = old_annotations.slice();
    old_annotations = new_annotations;
}



// ---------------------------------------------------------
// Displaying
// ---------------------------------------------------------

var sequence_html = function(sequence, annotations) {
    var ret = _.map(sequence, function(token, index) {
        return '<span class="token" id=tok_' + index + '> '
            + token + ' </span>';
    });
    _.each(annotations, function(annotation) {
        ret[annotation[0]] = '<strong class="annotation">'
            + ret[annotation[0]];
        ret[annotation[1]-1] = ret[annotation[1]-1] + '</strong>';
    });

    return ret.join(' ');
}



var canSubmit = function() {
    for (var key of keys) {
        if (values[key] == "" && !noVal[key].is(":checked")) { return false; }
    }
    return true;
}

var show = function() {
    annotations[key].sort(function(a, b) {
        return a[0] - b[0];
    });
    //fill_annotated_values(datum);
    seq_html = sequence_html(tokens, annotations[key]);
    well.html(seq_html);
    values[key] = get_value();
    answer[key].val(values[key]);
    answerHidden[key].val(values[key]);
    tagHidden[key].val(annotations[key]);
    console.log(key);
    console.log(annotations[key]);
    keyname.html(shortName[key]);


    // Handler on tokens
    $(".token").mousedown(function() {
        mouse_down(parseInt($(this).attr('id').split("_")[1]));
    });
    $(".token").mouseup(function() {
        mouse_up(parseInt($(this).attr('id').split("_")[1]));
    });

    if (canSubmit()) {
        submit.removeAttr("disabled");
        submit.removeClass("btn-default");
        submit.addClass("btn-success");
    } else {
        submit.attr("disabled", "disabled");
        submit.removeClass("btn-success");
        submit.addClass("btn-default");
    }
};


makeDom();

// ---------------------------------------------------------
// Event handlers
// ---------------------------------------------------------

$("#undo").click(function() {
    toggle_old_new();
    show();
});


$("#remove").click(function() {
    remove_all_annotations();
    show();
});

//highlight selected category
var inputs = $("#choice input:radio");
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

// Instructions expand/collapse
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

// ---------------------------------------------------------
// Initialize
// ---------------------------------------------------------


key = keys[0];
radios[key].click();
var tokens = raw.text().split(">>");
raw.hide();
show();
