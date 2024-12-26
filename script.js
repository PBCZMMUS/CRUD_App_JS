const output = document.querySelector("#output");
const form = document.querySelector("#add-user-form");
const findForm = document.querySelector("#find-user-form");
const sortButton = document.querySelector("#sort-users-btn");

let users = [];

// Add User
function addUser(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const name = formData.get("name");
  const id = users.length ? users[users.length - 1].id + 1 : 1;

  users.push({ id, name });
  displayUsers();
  this.reset();
}

// Delete User
function deleteUser(id) {
  users = users.filter((user) => user.id !== id);
  displayUsers();
}

// Update User
function updateUser(id) {
  const newName = prompt("Enter the new name:");
  if (newName) {
    const user = users.find((user) => user.id === id);
    if (user) {
      user.name = newName;
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

// Sort Users
function sortUsers() {
  users.sort((a, b) => a.name.localeCompare(b.name));
  displayUsers();
}

// Display Users
function displayUsers() {
  output.innerHTML = "";

  users.forEach((user) => {
    const userEl = document.createElement("div");
    userEl.classList.add("user");

    userEl.innerHTML = `
      <span>${user.id}. ${user.name}</span>
      <button class="update-btn" onclick="updateUser(${user.id})">Update</button>
      <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
    `;
    output.appendChild(userEl);
  });
}

// Event Listeners
form.addEventListener("submit", addUser);
findForm.addEventListener("submit", findUser);
sortButton.addEventListener("click", sortUsers);