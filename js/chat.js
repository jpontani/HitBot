/**
 * Created by TheMoose on 2/25/14.
 */

var version = 0.1;
var chatMessages = $("section.chatContent ul");
var li = 0;
var SELF = "MooseBot";

// @TODO: Create queue object.

var Queue = (function(){
    var q = [];
    var size = 0;
    return {
        enqueue: function(item) {
            // Add the item to the end of the queue.
            q[size++] = item;
        },
        dequeue: function(){
            //@TODO: return/remove next entry
        },
        peek: function() {
            // Simply peek at the next (front) item.
            return q[0];
        },
        length: (function() {
            return size;
        })()
    };
})();

var MooseBot = (function () {
    var botData = MooseDB;
    var commandQueue = [];
    var plugins = [];
    return {
        bot: (function(){
            return {
                errors: {},
                init: function() {
                    botData.open();
                },
                commandRespond: function(command) {
                    if (command.response == "") {
                        return;
                    }
                    var chat = $("#chatInput");
                    chat.html(command.response);
                    var e = jQuery.Event("keypress");
                    e.which = 13;
                    e.keyCode = 13;
                    chat.trigger(e);
                },
                handleCustomCommand: function(text, level, sender) {
                    var command = botData.getCommand(text, level, sender);
                    if (command != null) {
                        this.commandRespond(command);
                    }
                },
                isCustomCommand: function(cmd) {

                },
                doCommand: function(text, level, sender) {
                    var cmd = botData.getCommand(text);
                },
                handleChat: function(newMessageItem) {
                    var sender = newMessageItem.children[0].children[1].innerHTML;
                    var message = newMessageItem.children[0].children[2].innerHTML;
                    alert(message);
                    var level = 2;
                    if ($(newMessageItem).hasClass("admin")) {
                        level = 0;
                    }
                    else if ($(newMessageItem).hasClass("mod")) {
                        level = 1;
                    }
                    var parse = message.split(" ");
                    if (parse.substr(0, 1) == "!") {
                        if (parse.length == 1) {
                            // @TODO: Add command to queue.
                            this.bot.doCommand(parse[0], level, sender);
                        }
                    }
                }
            };
        })(),
        listen: function() {
            var items = $("section.chatContent ul li");
            if (items.length > li) {
                // Chat commands updated
                var bot = this.bot;
                alert(li + ":" + items.length);
                for (var i=li; i<items.length; i++) {
                    bot.handleChat(items[i]);
                }
                li = items.length;
            }
        },
        start: function() {
            this.bot.init();
            this.listen();
            botData.log("MooseBot version " + version + " initialized. Now accepting commands.");
        }
    };
})();

var findConnected = setInterval("findConnectedMessage()", 1000);

function findConnectedMessage() {
    // Start the bot once the chat has fully loaded. This way we ignore any previous commands that were entered prior to
    // the bot being available.
    var items = $("div.bufferTimestamp div.ng-binding");
    if (items.last().css("display") == "block") {
        clearInterval(findConnected);
        li = $("section.chatContent ul li").length;
        MooseBot.start();
        setInterval("MooseBot.listen()", 1000);
    }
}