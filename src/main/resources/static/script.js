const API_BASE = "http://localhost:9092/students";

const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');
const msg = document.getElementById('message');
const err = document.getElementById('error');

let editMode = false;    // false => create, true => update
let editingId = null;

// Utility: show messages
function showMessage(text) { msg.textContent = text; err.textContent = ''; setTimeout(()=> msg.textContent='',3000); }
function showError(text) { err.textContent = text; msg.textContent = ''; setTimeout(()=> err.textContent='',4000); }

// Load all students and populate table
async function loadStudents() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch students');
    const students = await res.json();
    const tbody = document.querySelector('#studentsTable tbody');
    tbody.innerHTML = '';
    students.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.id}</td>
        <td>${escapeHtml(s.name)}</td>
        <td>${escapeHtml(s.email)}</td>
        <td>${escapeHtml(s.course)}</td>
        <td class="actions">
          <button onclick="startEdit(${s.id})">Edit</button>
          <button onclick="confirmDelete(${s.id})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    showError(e.message);
  }
}

// Create or Update on save
saveBtn.addEventListener('click', async () => {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const course = document.getElementById('course').value.trim();

  if (!name || !email || !course) {
    showError('Please fill all fields');
    return;
  }

  const payload = { name, email, course };

  try {
    if (!editMode) {
      // CREATE
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Create failed');
      const created = await res.json();
      showMessage('Created student id: ' + (created.id ?? 'unknown'));
    } else {
      // UPDATE
      const res = await fetch(`${API_BASE}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        if (res.status === 404) throw new Error('Student not found');
        else throw new Error('Update failed');
      }
      showMessage('Updated student id: ' + editingId);
      // exit edit mode
      stopEdit();
    }
    // reset form and refresh
    resetForm();
    loadStudents();
  } catch (e) {
    showError(e.message);
  }
});

// Start editing: fetch single student and populate form
async function startEdit(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error('Student not found');
    const student = await res.json();
    document.getElementById('studentId').value = student.id;
    document.getElementById('name').value = student.name || '';
    document.getElementById('email').value = student.email || '';
    document.getElementById('course').value = student.course || '';
    editMode = true;
    editingId = id;
    formTitle.textContent = 'Edit Student (ID: ' + id + ')';
    saveBtn.textContent = 'Update';
    cancelBtn.style.display = 'inline';
  } catch (e) {
    showError(e.message);
  }
}

// Cancel editing
cancelBtn.addEventListener('click', () => {
  stopEdit();
  resetForm();
});

function stopEdit() {
  editMode = false;
  editingId = null;
  formTitle.textContent = 'Add Student';
  saveBtn.textContent = 'Save';
  cancelBtn.style.display = 'none';
}

// Reset form fields
function resetForm() {
  document.getElementById('studentId').value = '';
  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('course').value = '';
}

// Confirm then delete
function confirmDelete(id) {
  if (!confirm('Delete student with id ' + id + ' ?')) return;
  deleteStudent(id);
}

async function deleteStudent(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showMessage('Deleted id: ' + id);
      loadStudents();
    } else if (res.status === 404) {
      showError('Student not found');
    } else {
      throw new Error('Delete failed');
    }
  } catch (e) {
    showError(e.message);
  }
}

// small helper to avoid XSS when injecting strings to table
function escapeHtml(str = '') {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// initial load
loadStudents();