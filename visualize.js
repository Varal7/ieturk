// ---------------------------------------------------------
// Config
// ---------------------------------------------------------

var colors = [
    "#EAD379", "#67BCDB",  "#B3DE69", "#FCCDE5","#FFFFB3",
    "#BEBADA", "#80B1D3", "#FDB462",  "#D9D9D9", "#BC80BD"
];

// ---------------------------------------------------------
// Visualize annotations
// ---------------------------------------------------------

var raw = $('#raw');
var well = $('#well');
var title = $('#title');
var prev = $('#prev');
var next = $('#next');
var cur = $('#cur');
var form = $("#form");

var keys = [];
var key2id = {};
var answer = {};
var contents = [];
var idx = 0;

// ---------------------------------------------------------
// Create jQuery elements
// ---------------------------------------------------------

var makeFormRow = function(key) {
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
            .text(key)
        )
        .append($('<div>')
            .addClass('form-row')
            .append($('<div>')
                .addClass('col-sm-8')
                .append(input)
            )
            .append($('<div>')
                .addClass('disp col-sm-4')
                .append($('<strong>')
                    .addClass('annotation annotation-' + key2id[key])
                    .text(key)
                )
            )
        )
    );
    answer[key] = input;
    return div;
}



// ---------------------------------------------------------
// Displaying
// ---------------------------------------------------------

var sequence_html = function(sequence, annotationsDict) {
    var ret = _.map(sequence, function(token, index) {
        return '<span class="token" id=tok_' + index + '> ' + token + ' </span>';
    });
    for (let key of keys) {
        var annotations = annotationsDict[key].split(",")
        for (var i = 0; i < annotations.length; i+=2) {
            var begin = parseInt(annotations[i]);
            var stop = parseInt(annotations[i+1]);
            ret[begin] = '<strong class="annotation annotation-' + key2id[key] + '">' + ret[begin];
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
    cur.html(1 + idx + "/" + contents.length);
    for (let key of keys) {
        answer[key].val(values[key]);
        var index = key2id[key];
        $(".annotation-" + index).css("background-color", colors[index % colors.length]);
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
        // Read header
        var header = data.shift();
        var col2id = {};
        for (var [index, col] of header.entries()) {
            col2id[col] = index;
            var r = col.indexOf('-tag');
            if (r > 0) {
                keys.push(col.substring(0, r));
            }
        }
        for (var [index, key] of keys.entries()) { key2id[key] = index; }
        // Create header
        var html = '';
        html += '<thead>\r\n';
        html += '<tr>\r\n';
        html += '<th>id</th>\r\n';
        for(let item of header) {
            html += '<th>' + item + '</th>\r\n';
        }
        html += '</tr>\r\n';
        html += '</thead>\r\n';
        html += '<tbody>\r\n';
        // Fill in data
        for(let [index, row] of data.entries()) {
            html += '<tr class="entry" data-val="' + index + '">\r\n';
            html += '<td>' + (index + 1)  + '</td>\r\n';
            for(let item of row) {
                html += '<td>' + item.replace(new RegExp('>>', 'g'), ' ') + '</td>\r\n';
            }
            html += '</tr>\r\n';

            contents.push({
                'description': row[col2id["description"]],
                'annotations': keys.reduce(function(obj, key) {
                    obj[key] = row[col2id[key + "-tag"]]; return obj;
                }, {}),
                'values': keys.reduce(function(obj, key) {
                    obj[key] = row[col2id[key]]; return obj;
                }, {}),
            });
        }
        html += '</tbody>\r\n';
        // Create html
        $('#contents').html(html);
        for (var key of keys) {
            form.append(makeFormRow(key));
        }
        // Add handler on links
        $('.entry').click(function() {
            idx = parseInt($(this).attr('data-val'));
            show();
        });
        show();
    };
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
}
