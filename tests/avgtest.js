var _ = require('lodash');

var calcAverage = function(rateArr){

        var coef = {
            1: 0,
            2: 1,
            3: 3    
        }

        if (rateArr.length === 0) {
        	return 0
        } else {
        	return _.sum( _.map(_.pluck(rateArr, 'value'), function (e) {return coef[e]})) / _.size(rateArr);
        }	

}

console.log('[]', calcAverage([]));

var data = [{value: 1}, {value: 2}, {value: 3}];
var data2 = [1, 2, 3];
var coef = {
            1: 0,
            2: 1,
            3: 3
        }


console.log('1, 2, 3,', calcAverage(data))
