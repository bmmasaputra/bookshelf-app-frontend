const RENDER_EVENT = "render-book";
const SAVE_EDIT = "edit-book";
const books = [];

function isStorageAvailable() {
  return typeof Storage !== undefined;
}

function generateId() {
  return +new Date();
}

function generateBookObj(
  bookId,
  bookTitle,
  bookAuthor,
  bookYear,
  bookIsCompleted
) {
  return {
    id: bookId,
    title: bookTitle,
    author: bookAuthor,
    year: bookYear,
    isComplete: bookIsCompleted,
  };
}

function addBook() {
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const bookYear = document.getElementById("bookFormYear").value;
  const bookCheckbox = document.getElementById("bookFormIsComplete");
  const bookIsCompleted = (bookCheckbox) => bookCheckbox.checked;

  const bookId = generateId();
  const bookObj = generateBookObj(
    bookId,
    bookTitle,
    bookAuthor,
    bookYear,
    bookIsCompleted(bookCheckbox)
  );

  books.push(bookObj);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoCompletedBook(book) {
  book.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function completedBook(book) {
  book.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookObj) {
  const bookIndex = books.findIndex((book) => book.id === bookObj.id);
  books.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function editBook(bookObj) {
  const saveBookBtn = document.getElementById("bookFormSubmit");
  const saveEditBtn = document.getElementById("editFormSubmit");

  saveBookBtn.hidden = true;
  saveEditBtn.hidden = false;
  
  const insertBookForm = document.getElementById("bookForm");
  insertBookForm.reset();
  
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const bookYear = document.getElementById("bookFormYear").value;
  const bookCheckbox = document.getElementById("bookFormIsComplete");
  const bookIsCompleted = (bookCheckbox) => bookCheckbox.checked;

}

function makeBook(book) {
  const bookContainer = document.createElement("div");
  bookContainer.setAttribute("data-bookid", book.id);
  bookContainer.setAttribute("class", "book");
  bookContainer.setAttribute("data-testid", "bookItem");

  const bookTitle = document.createElement("h3");
  bookTitle.setAttribute("data-testid", "bookItemTitle");
  bookTitle.innerText = book.title;
  bookContainer.append(bookTitle);

  const bookAuthor = document.createElement("p");
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");
  bookAuthor.innerText = book.author;
  bookContainer.append(bookAuthor);

  const bookYear = document.createElement("p");
  bookYear.setAttribute("bookItemYear");
  bookYear.innerText = book.year;
  bookContainer.append(bookYear);

  const buttonContainer = document.createElement("div");
  bookContainer.append(buttonContainer);

  if (book.isComplete) {
    const finishedButton = document.createElement("button");
    finishedButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    finishedButton.id = "finishedBtn";
    finishedButton.innerText = "Belum selesai dibaca";

    finishedButton.addEventListener("click", () => {
      undoCompletedBook(book);
    });

    buttonContainer.append(finishedButton);
  } else {
    const finishedButton = document.createElement("button");
    finishedButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    finishedButton.id = "finishedBtn";
    finishedButton.innerText = "Belum Selesai Dibaca";

    finishedButton.addEventListener("click", () => {
      completedBook(book);
    });

    buttonContainer.append(finishedButton);
  }

  const deleteBtn = createElement("button");
  deleteBtn.setAttribute("data-testid", "bookItemDeleteButton");
  deleteBtn.innerText = "Hapus";
  deleteBtn.addEventListener("click", () => {
    removeBook(book);
  });
  buttonContainer.append(deleteBtn);

  const editBtn = createElement("button");
  editBtn.setAttribute("data-testid", "bookItemEditButton");
  editBtn.innerText = "Edit Buku";
  editBtn.addEventListener("click", () => {
    editBook(book);
  });
  buttonContainer.append(editBtn);

  return bookContainer;
}

window.addEventListener("DOMContentLoaded", () => {
  const insertBookForm = document.getElementById("bookForm");
  const searchBookForm = document.getElementById("searchBook");

  insertBookForm.addEventListener("submit", (e) => {
    addBook();
    insertBookForm.reset();
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
  const finishedBookRack = document.getElementById("cempleteBookList");
  const unfinishedBookRack = document.getElementById("incompleteBookList");

  finishedBookRack.innerHTML = "";
  unfinishedBookRack.innerHTML = "";

  books.forEach((book) => {
    const bookElement = makeBook(book);

    if (book.isComplete) finishedBookRack.append(bookElement);
    else unfinishedBookRack.append(bookElement);
  });
});
