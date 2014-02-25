/**
 * Created by jpontani on 2/25/14.
 */


var CREATE = "CREATE TABLE IF NOT EXISTS ";
var TABLES = ["users(uid INTEGER PRIMARY KEY ASC, username VARCHAR(200), points INTEGER, level INTEGER)",
              "commands(cid INTEGER PRIMARY KEY ASC, command VARCHAR(50), response TEXT, level INTEGER)",
              ""];
var LootBot = function () {
    this.errors = [];
    this.data.db = null;

    this.data.open = function() {
        // 5MB of space should be plenty for basic text/numeric data.
        var dbSize = 5 * 1024 * 1024;
        this.db = openDatabase("LootBot", 1, "LootBot Data", dbSize);
    }

    this.data.setupTables = function() {
        var db = this.data.db;
        TABLES.forEach(function(table) {
            db.transaction(function(t){
                t.executeSql(CREATE + table);
            });
        });
    }

    this.data.onError = function (tx, e) {
    }

    this.data.onSuccess = function (tx, r) {
        // Re-render all available commands and users.
    }

    this.data.addCustomCommand = function (command, response, level) {
        // Add a custom text command
    }

    this.data.editCustomCommand = function (command, response, level) {
        // edit an existing custom text command
    }

    this.data.removeCustomCommand = function (command) {

    }

    this.init = function() {
        this.data.open();
        this.data.setupTables();
    }

    this.commandRespond = function(tx, rs) {
        if (rs.rows.length == 1) {
            var response = "LootBot: " + rs.rows.item(0).response;
            $("#chatInput").html(response);
            var e = jQuery.Event("keypress");
            e.which = 13;
            e.keyCode = 13;
            $("#chatInput").trigger(e);
        }
    }

    this.handleCustomCommand = function(command, level) {
        var db = this.data.db;
        var bot = this;
        db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM commands WHERE command=? AND level >= ?", [command, level], bot.commandRespond, bot.data.onError);
        });
    }

    this.handleChat = function(newMessageItem) {
        var sender = newMessageItem.find("span.name").html();
        var message = newMessageItem.find("span.message").html();
        var level = 2;
        if (newMessageItem.hasClass("admin")) {
            level = 0;
        }
        else if (newMessageItem.hasClass("mod")) {
            level = 1;
        }
        var parse = message.split(" ");
        if (parse.substr(0, 1) == "!") {
            if (parse.length == 1) {
                this.handleCustomCommand(parse[0], level);
            }
        }
    }
};