const RENDER_EVENT = "render-book";
const SAVE_EVENT = "edit-book";
const STORAGE_KEY = "BOOKSHELF_APPS";
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

function toggleFormButtons(isEditMode) {
  console.log("toggle");
  const saveBookBtn = document.getElementById("bookFormSubmit");
  const saveEditBtn = document.getElementById("editFormSubmit");

  saveBookBtn.hidden = isEditMode;
  saveEditBtn.hidden = !isEditMode;
}

function resetForm() {
  const insertBookForm = document.getElementById("bookForm");
  insertBookForm.reset();
}

function populateFormWithBookData(book) {
  document.getElementById("bookFormTitle").value = book.title;
  document.getElementById("bookFormAuthor").value = book.author;
  document.getElementById("bookFormYear").value = book.year;

  const bookCheckbox = document.getElementById("bookFormIsComplete");
  bookCheckbox.checked = book.isComplete;
}

function handleSaveEdit(book) {
  const saveEditBtn = document.getElementById("editFormSubmit");
  const insertBookForm = document.getElementById("bookForm");

  const bookTitle = document.getElementById("bookFormTitle");
  const bookAuthor = document.getElementById("bookFormAuthor");
  const bookYear = document.getElementById("bookFormYear");
  const bookCheckbox = document.getElementById("bookFormIsComplete");

  const saveEditHandler = () => {
    book.title = bookTitle.value;
    book.author = bookAuthor.value;
    book.year = bookYear.value;
    book.isComplete = bookCheckbox.checked;

    insertBookForm.reset();

    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
    toggleFormButtons(false);
  };

  saveEditBtn.replaceWith(saveEditBtn.cloneNode(true));
  document
    .getElementById("editFormSubmit")
    .addEventListener("click", saveEditHandler);
}

function editBook(book) {
  toggleFormButtons(true);
  resetForm();

  populateFormWithBookData(book);

  handleSaveEdit(book);
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
  bookYear.setAttribute("data-testid", "bookItemYear");
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
    finishedButton.innerText = "Selesai Dibaca";

    finishedButton.addEventListener("click", () => {
      completedBook(book);
    });

    buttonContainer.append(finishedButton);
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("data-testid", "bookItemDeleteButton");
  deleteBtn.innerText = "Hapus";
  deleteBtn.addEventListener("click", () => {
    removeBook(book);
  });
  buttonContainer.append(deleteBtn);

  const editBtn = document.createElement("button");
  editBtn.setAttribute("data-testid", "bookItemEditButton");
  editBtn.innerText = "Edit Buku";
  editBtn.addEventListener("click", () => {
    editBook(book);
  });
  buttonContainer.append(editBtn);

  return bookContainer;
}

function saveData() {
  if (isStorageAvailable()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVE_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);

  if (data !== null) {
    data.forEach((book) => {
      books.push(book);
    });
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
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
    // searchBookForm();
    e.preventDefault();
  });

  if (isStorageAvailable()) {
    loadDataFromStorage();
  } else {
    alert("Browser anda tidak mendukung local storage");
  }
});

document.addEventListener(RENDER_EVENT, () => {
  const finishedBookRack = document.getElementById("completeBookList");
  const unfinishedBookRack = document.getElementById("incompleteBookList");

  finishedBookRack.innerHTML = "";
  unfinishedBookRack.innerHTML = "";

  books.forEach((book) => {
    const bookElement = makeBook(book);

    if (book.isComplete) finishedBookRack.append(bookElement);
    else unfinishedBookRack.append(bookElement);
  });
});

// document.addEventListener(SAVE_EVENT, () => {
//  alert("Buku Tersimpan");
// })