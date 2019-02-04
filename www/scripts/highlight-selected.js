
document.onselectionchange = function() {
    
    window.setTimeout(function(){
        var text = window.getSelection().toString();

        if(text){
            $("#error, button").unmark();
            $("#error, button").mark(text, {
                "accuracy": "partially"
            });
        }
    },
    1000);
};