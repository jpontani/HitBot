/**
 * Created by TheMoose on 2/25/14.
 */

// In the following line, you should include the prefixes of implementations you want to test.
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// DON'T use "var indexedDB = ..." if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

var MooseDB = (function() {
    var mdb = null;
    return {
        db: (function(){
            return mdb;
        })(),
        log: function(msg, appendToElem) {
            $("#" + appendToElem).append("<div class='log-message'>" + msg + "</div>");
        },
        open: function() {
            var version = 1;
            var request = window.indexedDB.open("HitBot",version);
            request.onsuccess = function(e) {
                mdb = e.target.result;
            };
            request.onerror = function(e) {};
            request.onupgradeneeded = function(e) {
                this.log("The database store has been updated.");
            };
        },
        setupStores: function() {
            if (!mdb.objectStoreNames.contains("users")) {
                var userStore = mdb.createObjectStore("users", {keyPath: "username"})
                var commandStore = mdb.createObjectStore("commands", {keyPath: "command"});
            }
        },
        addCustomCommand: function (command, response, level) {
            // Add a custom text command
            var tx = mdb.transaction(["commands"], "readwrite");
            var store = tx.objectStore("commands");
            var request = store.put({
                "command": command,
                "response": response,
                "level": level
            });
            request.onsuccess = function(e) {
                this.log("Command '" + command + "' added successfully.", 'dashboardLog');
                return true;
            }
            request.onerror = function(e) {
                // @TODO: put an error message in the log on the dashboard
                this.log("Could not add command '" + command + "'.", 'dashboardLog');
                return false;
            }
        },
        editCustomCommand: function (command, response, level) {
            // edit an existing custom text command
        },
        removeCustomCommand: function (command) {

        },
        getCommandList: function() {},
        getCommand: function(command) {
            var tx = mdb.transaction(["commands"], "readwrite");
            var store = tx.objectStore("commands");
            var key = IDBKeyRange.only(command);
            var request = store.openCursor(key);
            request.onsuccess = function(e) {
                var result = e.target.result;
                if (!!result == false) {
                    return null;
                }
                return result;
            };
        }
    };
})();