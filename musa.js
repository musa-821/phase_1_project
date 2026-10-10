// ===== STEP 1: THINGS WE NEED =====
var url = "http://localhost:3000/students";

let students = []; // our list of students lives here
let editId = null; // null = adding a student, otherwise = id of the student being edited

const form = document.getElementById("student-form");
const nameBox = document.getElementById("name");
const rollBox = document.getElementById("roll");
const emailBox = document.getElementById("email");
const courseBox = document.getElementById("course");
const clubsBox = document.getElementById("clubs");
const sportsBox = document.getElementById("sports");

const title = document.getElementById("form-title");
const saveButton = document.getElementById("submit-btn");
const cancelButton = document.getElementById("cancel-btn");
const searchBox = document.getElementById("search-input");
const table = document.getElementById("student-table-body");


// STEP 2: GET STUDENTS FROM THE SERVER 
async function loadStudents() {
  var response = await fetch(url);
  students = await response.json();
  showTable(students);
}

loadStudents(); // run it as soon as the page opens

// STEP 3: DRAW THE TABLE

function showTable(list) {
  table.innerHTML = "";

  if (list.length == 0) {
    table.innerHTML = "<tr><td colspan='7'>No student records found.</td></tr>";
  }

  for (var i = 0; i < list.length; i++) {
    var s = list[i];

    table.innerHTML =
      table.innerHTML +
      "<tr>" +
      "<td>" +
      s.roll +
      "</td>" +
      "<td>" +
      s.name +
      "</td>" +
      "<td>" +
      s.email +
      "</td>" +
      "<td>" +
      s.course +
      "</td>" +
      "<td>" +
      s.club +
      "</td>" +
      "<td>" +
      s.sport +
      "</td>" +
      "<td>" +
      "<button class='btn btn-secondary btn-action' onclick='startEdit(\"" +
      s.id +
      "\")'>Edit</button> " +
      "<button class='btn btn-danger btn-action' onclick='deleteStudent(\"" +
      s.id +
      "\")'>Delete</button>" +
      "</td>" +
      "</tr>";
  }
}

// STEP 4: SAVE (ADD OR EDIT) 
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  var newStudent = {
    name: nameBox.value.trim(),
    roll: rollBox.value.trim(),
    email: emailBox.value.trim(),
    course: courseBox.value.trim(),
    club: clubsBox.value.trim(),
    sport: sportsBox.value.trim(),

  };
  

  // Check if this roll number is already used by someone else
  for (var i = 0; i < students.length; i++) {
    var s = students[i];
    var sameRoll = s.roll.toLowerCase() == newStudent.roll.toLowerCase();
    var sameStudent = s.id == editId;

    if (sameRoll && !sameStudent) {
      alert("This Roll Number already exists!");
      return;
    }
  }

  if (editId == null) {
    // We are ADDING
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent),
    });
  } else {
    // We are EDITING
    await fetch(url + "/" + editId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent),
    });
  }

  resetForm();
  loadStudents();

});

// ===== STEP 5: EDIT BUTTON =====
function startEdit(id) {
  // Find the student in our list
  for (var i = 0; i < students.length; i++) {
    if (students[i].id == id) {
      nameBox.value = students[i].name;
      rollBox.value = students[i].roll;
      emailBox.value = students[i].email;
      courseBox.value = students[i].course;
      clubsBox.value = students[i].club;
      sportsBox.value = students[i].sport;
    }
  }

  editId = id;
  title.textContent = "Modify Student Profile";
  saveButton.textContent = "Save Updates";
  cancelButton.classList.remove("hidden");
}

// ===== STEP 6: DELETE BUTTON =====
async function deleteStudent(id) {
  var answer = confirm("Delete this student?");

  if (answer == true) {
    await fetch(url + "/" + id, { method: "DELETE" });

    if (editId == id) {
      resetForm();
    }
    loadStudents();
  }
}
// ===== STEP 8: CANCEL / RESET =====
cancelButton.addEventListener("click", resetForm);

function resetForm() {
  editId = null;
  form.reset();
  title.textContent = "Add New Student";
  saveButton.textContent = "Add Student";
  cancelButton.classList.add("hidden");
}
