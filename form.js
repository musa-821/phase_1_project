// Server Endpoint
const API_URL = 'http://localhost:3000/students';


// UI State Management
let isEditing = false;
let editId = null;

// DOM Selectors
const studentForm = document.getElementById('student-form');
const nameInput = document.getElementById('name');
const rollInput = document.getElementById('roll');
const emailInput = document.getElementById('email');
const courseInput = document.getElementById('course');

const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const searchInput = document.getElementById('search-input');
const tableBody = document.getElementById('student-table-body');

// Initial load: Fetch records from json-server
document.addEventListener('DOMContentLoaded', fetchStudents);

// READ: Fetch all students from backend
async function fetchStudents() {
    try {
        const response = await fetch(API_URL);
        const students = await response.json();
        renderStudents(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Failed to load data from server.</td></tr>`;
    }
}

// CREATE or UPDATE form submission
studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentData = {
        name: nameInput.value.trim(),
        roll: rollInput.value.trim(),
        email: emailInput.value.trim(),
        course: courseInput.value.trim()
    };

    try {
        // Roll number duplicate check
        const response = await fetch(API_URL);
        const currentStudents = await response.json();
        const isDuplicate = currentStudents.some(s => s.roll.toLowerCase() === studentData.roll.toLowerCase() && s.id !== editId);
        
        if (isDuplicate) {
            alert("A student with this Roll Number already exists!");
            return;
        }

        if (isEditing) {
            // UPDATE: PUT request to server
            await fetch(`${API_URL}/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
            resetForm();
        } else {
            // CREATE: POST request to server
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
        }

        studentForm.reset();
        fetchStudents(); // Refresh UI table data
    } catch (error) {
        console.error("Error saving student:", error);
    }
});

// UI Table Rendering Logic
function renderStudents(students) {
    tableBody.innerHTML = '';
    
    if (students.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No student records found.</td></tr>`;
        return;
    }

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><b>${student.roll}</b></td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.course}</td>
            <td>
                <button class="btn btn-secondary btn-action" onclick="loadEditForm('${student.id}')">Edit</button>
                <button class="btn btn-danger btn-action" onclick="deleteStudent('${student.id}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Prepare Form for Editing
async function loadEditForm(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const student = await response.json();

        nameInput.value = student.name;
        rollInput.value = student.roll;
        emailInput.value = student.email;
        courseInput.value = student.course;

        isEditing = true;
        editId = id;
        formTitle.textContent = "Modify Student Profile";
        submitBtn.textContent = "Save Updates";
        cancelBtn.classList.remove('hidden');
    } catch (error) {
        console.error("Error loading student profile:", error);
    }
}

// DELETE: Remove record from server
async function deleteStudent(id) {
    if (confirm("Are you sure you want to delete this student record?")) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchStudents();
            if (isEditing && editId === id) resetForm();
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    }
}

// LIVE SEARCH: Utilizing json-server built-in query params (?q=)
searchInput.addEventListener('input', async (e) => {
    const term = e.target.value.trim();
    try {
        // json-server allows global text searching using the 'q' parameter
        const response = await fetch(`${API_URL}?q=${term}`);
        const filteredStudents = await response.json();
        renderStudents(filteredStudents);
    } catch (error) {
        console.error("Error during search filtering:", error);
    }
});

// Cancel UI Helper
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    isEditing = false;
    editId = null;
    studentForm.reset();
    formTitle.textContent = "Add New Student";
    submitBtn.textContent = "Add Student";
    cancelBtn.classList.add('hidden');
}