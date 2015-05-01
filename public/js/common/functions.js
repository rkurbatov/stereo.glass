function catToHash(arr) {
    var result = {};

    arr.forEach(parseLeaves);

    function parseLeaves(el) {
        if (el.leaves) {
            el.leaves.forEach(function(item){
               result[item.value] = (!el.subCatName || el.subCatName === "") ? item.name : el.subCatName + ' - ' + item.name;
            });
        }
    }

    return result;
}

function catToHtml(arr) {
    return arr.map(workOnGroup).join('');

    function workOnGroup(el) {
        var preS, postS;
        if (el.subCatName !== '') {
            preS = '<optgroup label="' + el.subCatName + '">';
            postS = '</optroup>';
        }
        else {
            preS = '';
            postS = '';
        }

        return (preS + el.leaves.map(function (nel) {
            var subtext = nel.subtext ? ' data-subtext="' + nel.subtext + '"' : '',
                icon = nel.icon ? ' data-icon="' + nel.icon + '"' : '',
                name = nel.name ? nel.name : ''; // if name is undefined

            return '<option value="' + nel.value + '"' + subtext + icon + '>' + name + '</option>';

        }).join('') + postS);
    }
}