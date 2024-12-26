const output = document.querySelector("#output");
const form = document.querySelector("#add-user-form");
const findForm = document.querySelector("#find-user-form");
const sortButton = document.querySelector("#sort-users-btn");

let users = JSON.parse(localStorage.getItem("users")) || [];

// Add User
function addUser(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const name = formData.get("name");

  // Generate a unique ID that is always one more than the highest existing ID
  const id = users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1;

  // Add the new user to the array
  users.push({ id, name });

  // Save the updated array to localStorage
  saveUsersToLocalStorage();

  // Display the updated list of users
  displayUsers();

  this.reset();
}

// Delete User
function deleteUser(id) {
  // Filter out the user from the array
  users = users.filter((user) => user.id !== id);

  // Save the updated array to localStorage
  saveUsersToLocalStorage();

  // Display the updated list of users
  displayUsers();
}

// Update User
function updateUser(id) {
  const newName = prompt("Enter the new name:");
  if (newName) {
    const user = users.find((user) => user.id === id);
    if (user) {
      user.name = newName;

      // Save the updated array to localStorage
      saveUsersToLocalStorage();

      // Display the updated list of users
      displayUsers();
    }
  }
}

// Find User by ID or Keyword
function findUser(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const query = formData.get("query").toLowerCase();

  // Find by ID if query is a number
  if (!isNaN(query)) {
    const id = parseInt(query);
    const user = users.find((user) => user.id === id);
    if (user) {
      alert(`User Found: ${user.name}`);
    } else {
      alert("User not found!");
    }
  } else {
    // Find by keyword in names
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(query)
    );

    if (filteredUsers.length > 0) {
      alert(`Users Found: ${filteredUsers.map((u) => u.name).join(", ")}`);
    } else {
      alert("No users found with that keyword!");
    }
  }
  this.reset();
}

// Sort Users (A-Z and Z-A)
function sortUsers() {
  const currentSort = sortButton.dataset.sort || "asc";

  if (currentSort === "asc") {
    users.sort((a, b) => a.name.localeCompare(b.name)); // A-Z
    sortButton.dataset.sort = "desc";
    sortButton.textContent = "Sort Z-A";
  } else {
    users.sort((a, b) => b.name.localeCompare(a.name)); // Z-A
    sortButton.dataset.sort = "asc";
    sortButton.textContent = "Sort A-Z";
  }

  // Save the updated array to localStorage
  saveUsersToLocalStorage();

  // Display the updated list of users
  displayUsers();
}

// Display Users
function displayUsers() {
  output.innerHTML = "";

  users.forEach((user) => {
    const userEl = document.createElement("div");
    userEl.classList.add("user");
    userEl.setAttribute("draggable", true);
    userEl.setAttribute("data-id", user.id);

    userEl.innerHTML = `
      <span>${user.id}. ${user.name}</span>
      <div>
      <button class="update-btn" onclick="updateUser(${user.id})">Update</button>
      <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
      </div>
    `;
    output.appendChild(userEl);

    // Add drag events
    userEl.addEventListener("dragstart", handleDragStart);
    userEl.addEventListener("dragover", handleDragOver);
    userEl.addEventListener("drop", handleDrop);
    userEl.addEventListener("dragenter", handleDragEnter);
    userEl.addEventListener("dragleave", handleDragLeave);
  });
}

// Drag and Drop Functions
let draggedUser = null;

function handleDragStart(e) {
  draggedUser = e.target;
  e.dataTransfer.effectAllowed = "move";
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const target = e.target.closest(".user");

  if (target && target !== draggedUser) {
    const draggedIndex = users.findIndex((user) => user.id === parseInt(draggedUser.getAttribute("data-id")));
    const targetIndex = users.findIndex((user) => user.id === parseInt(target.getAttribute("data-id")));

    // Swap the users in the array
    const temp = users[draggedIndex];
    users[draggedIndex] = users[targetIndex];
    users[targetIndex] = temp;

    // Save to localStorage and re-display
    saveUsersToLocalStorage();
    displayUsers();
  }
}

function handleDragEnter(e) {
  e.preventDefault();
  e.target.classList.add("drag-over");
}

function handleDragLeave(e) {
  e.target.classList.remove("drag-over");
}

// Save users to localStorage
function saveUsersToLocalStorage() {
  localStorage.setItem("users", JSON.stringify(users));
}

// Event Listeners
form.addEventListener("submit", addUser);
findForm.addEventListener("submit", findUser);
sortButton.addEventListener("click", sortUsers);

// Display users on page load
displayUsers();