function arrToOptions(arr){
    return arr.map(function(v){
        return '<option value="' + v + '">' + v + '</option>';
    }).join('');
}