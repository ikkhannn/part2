var bootcamp = {};
window.indexedDB = window.indexedDB || window.webkitIndexedDB ||
                window.mozIndexedDB;

if ('webkitIndexedDB' in window) {
  window.IDBTransaction = window.webkitIDBTransaction;
  window.IDBKeyRange = window.webkitIDBKeyRange;
}

bootcamp.indexedDB = {};
bootcamp.indexedDB.db = null;

bootcamp.indexedDB.onerror = function(e) {
  console.log(e);
};

bootcamp.indexedDB.open = function() {
  var version = 1;
  var request = indexedDB.open("todos", version);

  // We can only create Object stores in a versionchange transaction.
  request.onupgradeneeded = function(e) {
    var db = e.target.result;

    // A versionchange transaction is started automatically.
    e.target.transaction.onerror = bootcamp.indexedDB.onerror;

    if(db.objectStoreNames.contains("todo")) {
      db.deleteObjectStore("todo");
    }

    var store = db.createObjectStore("todo",
      {keyPath: "timeStamp"});
  };

  request.onsuccess = function(e) {
    bootcamp.indexedDB.db = e.target.result;
    bootcamp.indexedDB.getAllTodoItems();
  };

  request.onerror = bootcamp.indexedDB.onerror;
};

bootcamp.indexedDB.addTodo = function(todoText) {
  var db = bootcamp.indexedDB.db;
  var trans = db.transaction(["todo"], "readwrite");
  var store = trans.objectStore("todo");

  var data = {
    "text": todoText,
    "timeStamp": new Date().getTime()
  };

  var request = store.put(data);

  request.onsuccess = function(e) {
    bootcamp.indexedDB.getAllTodoItems();
  };

  request.onerror = function(e) {
    console.log("Error Adding: ", e);
  };
};

bootcamp.indexedDB.deleteTodo = function(id) {
  var db = bootcamp.indexedDB.db;
  var trans = db.transaction(["todo"], "readwrite");
  var store = trans.objectStore("todo");

  var request = store.delete(id);

  request.onsuccess = function(e) {
    bootcamp.indexedDB.getAllTodoItems();
  };

  request.onerror = function(e) {
    console.log("Error Adding: ", e);
  };
};

bootcamp.indexedDB.getAllTodoItems = function() {
  var todos = document.getElementById("todoItems");
  todos.innerHTML = "";

  var db = bootcamp.indexedDB.db;
  var trans = db.transaction(["todo"], "readwrite");
  var store = trans.objectStore("todo");

  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false)
      return;

    renderTodo(result.value);
    result.continue();
  };

  cursorRequest.onerror = bootcamp.indexedDB.onerror;
};

function renderTodo(row) {
  var todos = document.getElementById("todoItems");
  var li = document.createElement("li");
  var a = document.createElement("a");
  var t = document.createTextNode(row.text);
  var icon=document.createElement("i");
  icon.className="far fa-times-circle";

a.appendChild(icon);

  a.addEventListener("click", function() {
    bootcamp.indexedDB.deleteTodo(row.timeStamp);
  }, false);




  a.href = "#";
 a.className="delete-item item-icon";
  li.appendChild(t);
  li.appendChild(a);
  todos.appendChild(li);
}

function addTodo() {
  var todo = document.getElementById("todo");
  bootcamp.indexedDB.addTodo(todo.value);
  todo.value = "";
}

function init() {
  bootcamp.indexedDB.open();
}

window.addEventListener("DOMContentLoaded", init, false);
