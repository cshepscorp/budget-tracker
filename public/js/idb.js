// create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'budget_tracker' and set it to version 1
// name of the IndexedDB database you'd like to create (if it doesn't exist) or connect to (if it does exist)
const request = indexedDB.open('budget_tracker', 1);

// Like other database systems, the IndexedDB database itself doesn't hold the data. In IndexedDB, the container that stores the data is called an object store; SQL - tables; MongoDB - collections;
// this onupgradeneeded event will emit the first time we run this code and create the new_transaction object store. The event won't run again unless we delete the database from the browser or we change the version number in the .open() method to a value of 2, indicating that our database needs an update.
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
  
    // check if app is online, if yes run uploadTransaction() function to send all local db data to api
    if (navigator.onLine) {
      // we haven't created this yet, but we will soon, so let's comment it out for now
      uploadTransaction();
    }
  };
  
request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
  };

// This function will be executed if we attempt to submit a new transaction and there's no internet connection
// This saveRecord() function will be used in the api.js file's form submission function if the fetch() function's .catch() method is executed (catch method is only executed on network failure!)
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions; transaction is a temporary connection to the database
    const transaction = db.transaction(['new_transaction'], 'readwrite');
  
    // access the object store for `new_transaction` -- this is wheere we'll be adding data
    const transactionObjectStore = transaction.objectStore('new_transaction');
  
    // add record to your store with add method
    transactionObjectStore.add(record);
  };

function uploadTransaction() {
    // open a new transaction to the database to read the data
    const transaction = db.transaction(['new_transaction'], 'readwrite');
  
    // access your object store
    const transactionObjectStore = transaction.objectStore('new_transaction');
  
    // get all records from store and set to a variable
    // .getAll() method is an asynchronous function that we have to attach an event handler to in order to retrieve the data
    const getAll = transactionObjectStore.getAll();
  
    // upon a successful .getAll() execution, run this function
    getAll.onsuccess = function() {
        // if there was data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) { // an array of all the data we retrieved from the new_transaction object store
        fetch('/api/transaction', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(serverResponse => {
            if (serverResponse.message) {
                throw new Error(serverResponse);
            }
            // open one more transaction
            const transaction = db.transaction(['new_transaction'], 'readwrite');
            // access the new_transaction object store
            const transactionObjectStore = transaction.objectStore('new_transaction');
            // clear all items in your store
            transactionObjectStore.clear();

            alert('All saved transactions have been submitted!');
            })
            .catch(err => {
            console.log(err);
            });
        }
    };

  }

// listen for app coming back online
window.addEventListener('online', uploadTransaction);