// ---------------------------------------------------------
// Allows annotations
// ---------------------------------------------------------


var raw = $('#raw');
var well = $('#well');
var submit = $('#submit');
var keyname = $('#key-name');

var answer = {
    "name":$('#name'),
    "version":$('#version'),
    "protocol":$('#protocol'),
}
var answerHidden = {
    "name":$('#name-hidden'),
    "version":$('#version-hidden'),
    "protocol":$('#protocol-hidden'),
}
var tagHidden = {
    "name":$('#name-tag'),
    "version":$('#version-tag'),
    "protocol":$('#protocol-tag'),
}
var annotations = {
    "name": [],
    "version": [],
    "protocol": [],
}
var values = {
    "name": "",
    "version": "",
    "protocol": "",
}


var tokens = raw.text().split(">>");

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
        return '<span class="token" id=tok_' + index + '> ' + token + ' </span>';
    });
    _.each(annotations, function(annotation) {
        ret[annotation[0]] = '<strong class="annotation">' + ret[annotation[0]];
        ret[annotation[1]-1] = ret[annotation[1]-1] + '</strong>';
    });

    return ret.join(' ');
}



var can_submit = function() {
    if (values["name"] == "") { return false; }
    if (values["version"] == "") { return false; }
    if (values["protocol"] == "") { return false; }
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
    console.log(annotations[key]);
    keyname.html(key);


    // Handler on tokens
    $(".token").mousedown(function() {
        mouse_down(parseInt($(this).attr('id').split("_")[1]));
    });
    $(".token").mouseup(function() {
        mouse_up(parseInt($(this).attr('id').split("_")[1]));
    });

    if (can_submit()) {
        submit.removeAttr("disabled");
        submit.removeClass("btn-default");
        submit.addClass("btn-success");
    } else {
        submit.attr("disabled", "disabled");
        submit.removeClass("btn-success");
        submit.addClass("btn-default");
    }
};

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


raw.hide();
show();
