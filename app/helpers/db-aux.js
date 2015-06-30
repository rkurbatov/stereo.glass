module.exports = {

    // use as dbAux.close.bind(mongoose)
    close: function (err) {
        if (err) console.log(err);
        this.disconnect();
    },

    // simple error logger
    showError: function (err) {
        if (err) console.log(err);
    },

    // returns null in case of error, result otherwise
    getResultOrNull: function (err, result) {
        if (err) {
            console.log(err);
            return null;
        } else {
            return result;
        }
    }
};