// ---------------------------------------------------------
// Visualize annotations
// ---------------------------------------------------------


var raw = $('#raw');
var well = $('#well');
var title = $('#title');
var prev = $('#prev');
var next = $('#next');
var cur = $('#cur');

var KEYS = ["name", "version", "protocol"];
var answer = {
    "name":$('#name'),
    "version":$('#version'),
    "protocol":$('#protocol'),
}

var contents = [];
var idx = 0;
// ---------------------------------------------------------
// Displaying
// ---------------------------------------------------------

var sequence_html = function(sequence, annotationsDict) {
    var ret = _.map(sequence, function(token, index) {
        return '<span class="token" id=tok_' + index + '> ' + token + ' </span>';
    });
    for (let key of KEYS) {
        var annotations = annotationsDict[key].split(",")
        for (var i = 0; i < annotations.length; i+=2) {
            var begin = parseInt(annotations[i]);
            var stop = parseInt(annotations[i+1]);
            ret[begin] = '<strong class="annotation-' + key + '">' + ret[begin];
            ret[stop -1 ] = ret[stop -1] + '</strong>';
        }
    }
    return ret.join(' ');
}



var show = function() {
    var annotationsDict = contents[idx]['annotations'];
    var tokens = contents[idx]['description'].split(">>");
    var values = contents[idx]['values'];

    seq_html = sequence_html(tokens, annotationsDict);
    well.html(seq_html);
    title.html('Description of <a href="https://nvd.nist.gov/vuln/detail/' + contents[idx]['cveid'] + '">' + contents[idx]['cveid'] + "</a>" );
    cur.html(1 + idx + "/" + contents.length);
    for (let key of KEYS) {
        answer[key].val(values[key]);
    }
};

// ---------------------------------------------------------
// Event handlers
// ---------------------------------------------------------

$("#prev").click(function() {
    idx = Math.max(0, idx - 1);
    show();
});


$("#next").click(function() {
    idx = Math.min(idx + 1, contents.length);
    show();
});


// Support keyboard shortcuts via, e.g. <.. data-key="1" />
$(document).on('keypress', function(e) {
    var key = e.key;
    const el = document.querySelector('[data-key="' + key + '"]');
    if (el) {
    e.preventDefault();
    el.click();
    }
});

// ---------------------------------------------------------
// Read file
// ---------------------------------------------------------

$(document).ready(function() {
    $('#file').bind('change', handleFileSelect);
});

function handleFileSelect(evt) {
    var file = evt.target.files[0]; // FileList object
    loadData(file);
}

function loadData(file) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
        var csv = event.target.result;
        var data = $.csv.toArrays(csv);
        var header = data.shift();
        var col2id = {};
        for (var [index, col] of header.entries()) {
            col2id[col] = index;
        }
        var html = '';
        html += '<tr>\r\n';
        for(let item of header) {
            html += '<th>' + item + '</th>\r\n';
        }
        html += '</tr>\r\n';
        for(let row of data) {
            html += '<tr>\r\n';
            for(let item of row) {
                html += '<td>' + item.replace(new RegExp('>>', 'g'), ' ') + '</td>\r\n';
            }
            html += '</tr>\r\n';

            contents.push({
                'cveid': row[col2id["cveid"]],
                'description': row[col2id["description"]],
                'annotations': {
                    'name': row[col2id["name-tag"]],
                    'version': row[col2id["version-tag"]],
                    'protocol': row[col2id["protocol-tag"]],
                },
                'values': {
                    'name': row[col2id["name"]],
                    'version': row[col2id["version"]],
                    'protocol': row[col2id["protocol"]],
                }
            });
        }
        $('#contents').html(html);
        show();
    };
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
}
