/**
 * Created by Ольга on 30.04.2017.
 */
String.prototype.limit = function (limit, userParams) {
    var text = this
        , options = {
            ending: '...'  // что дописать после обрыва. HTML символ многоточия: &hellip;
            , words: true    // уважать ли целостность слов? 
        }
        , prop
        , lastSpace
        , processed = false
    ;

    if (limit !== parseInt(limit) || limit <= 0) return this;

    // применить userParams
    if (typeof userParams == 'object') {
        for (prop in userParams) {
            if (userParams.hasOwnProperty.call(userParams, prop)) {
                options[prop] = userParams[prop];
            }
        }
    }

    if (text.length <= limit) return text;    // по длине вписываемся и так

    text = text.slice(0, limit); // отрезать по лимиту
    lastSpace = text.lastIndexOf(" ");
    if (options.words && lastSpace > 0) {  // урезать ещё до границы целого слова
        text = text.substr(0, lastSpace);
    }
    return text + options.ending;
}
