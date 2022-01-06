// create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'budget_tracker' and set it to version 1
// name of the IndexedDB database you'd like to create (if it doesn't exist) or connect to (if it does exist)
const request = indexedDB.open('budget_tracker', 1);

// Like other database systems, the IndexedDB database itself doesn't hold the data. In IndexedDB, the container that stores the data is called an object store; SQL - tables; MongoDB - collections;
// this onupgradeneeded event will emit the first time we run this code and create the new_pizza object store. The event won't run again unless we delete the database from the browser or we change the version number in the .open() method to a value of 2, indicating that our database needs an update.
request.onupgradeneeded = function(event) {
    // save a reference to the database 
    const db = event.target.result;
    // create an object store (table) called `new_transaction`, set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('new_transaction', { autoIncrement: true });
  };

  // upon a successful 
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;
  
    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    if (navigator.onLine) {
      // we haven't created this yet, but we will soon, so let's comment it out for now
      // uploadPizza();
    }
  };
  
request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
  };