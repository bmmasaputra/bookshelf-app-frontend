const insertBookForm = document.getElementById("bookForm");
const searchBookForm = document.getElementById("searchBook");
const RENDER_EVENT = "render-book";
const books = [];

function isStorageAvailable() {
  return typeof Storage !== undefined;
}

function generateId() {
  return +new Date();
}

function generateBookObj(bookId, bookTitle, bookAuthor, bookYear, bookIsCompleted) {
  return {
    id: bookId,
    title: bookTitle,
    author: bookAuthor, 
    year: bookYear,
    isComplete: bookIsCompleted
  };
}

function addBook() {
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const bookYear = document.getElementById("bookFormYear").value;
  const bookCheckbox = document.getElementById("bookFormIsComplete");
  const bookIsCompleted = (bookCheckbox) => bookCheckbox.checked;

  const bookId = generateId();
  const bookObj = generateBookObj(bookId, bookTitle, bookAuthor, bookYear, bookIsCompleted(bookCheckbox));

  books.push(bookObj);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

window.addEventListener("DOMContentLoaded", () => {
  insertBookForm.addEventListener("submit", (e) => {
    addBook();
    e.preventDefault();
  });

  searchBookForm.addEventListener("submit", (e) => {
    searchBookForm();
    e.preventDefault();
  });

  if (isStorageAvailable()) {
    loadDataFromStorage();
  } else {
    alert("Browser anda tidak mendukung local storage");
  }
});

document.addEventListener(RENDER_EVENT, () => {
  
})