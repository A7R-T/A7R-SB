//renderer.js
const title = document.getElementById('note-title');
const content = document.getElementById('note-content');
const notesList = document.getElementById('notes-list');
const newNoteBtn = document.getElementById('new-note');
const newNoteBtnLeft = document.getElementById('new-note-left');
const toggleBtn = document.getElementById('toggle-sidebars');
const leftSidebar = document.querySelector('aside.left');
const rightSidebar = document.querySelector('aside.right');
const layout = document.querySelector('.layout');
let pinned = false;
let sidebarsForced = false;

toggleBtn.addEventListener('click', () => {
  pinned = !pinned;
  if (pinned) {
    layout.classList.add('pinned');
  } else {
    layout.classList.remove('pinned');
  }
});


newNoteBtn.addEventListener('click', async () => {
    currentNoteId = null;
    title.textContent = '';
    content.textContent = '';
    title.focus();
});
newNoteBtnLeft.addEventListener('click', async () => {
    currentNoteId = null;
    title.textContent = '';
    content.textContent = '';
    title.focus();
});
let currentNoteId = null;
let saveTimeout = null;



async function autoSaveNote() {

if (currentNoteId) {
    await window.electronAPI.updateNote(currentNoteId, title.innerText, content.innerText);
    const notes = await window.electronAPI.loadNotes();
    renderNotesList(notes);

} else {
    const newId = await window.electronAPI.saveNote(title.innerText, content.innerText);
    const notes = await window.electronAPI.loadNotes();
    renderNotesList(notes);
    currentNoteId = newId;
}

    const activeLi = notesList.querySelector(`li[data-id='${currentNoteId}']`);
    if (activeLi) activeLi.classList.add('active');
}

function scheduleAutoSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(autoSaveNote, 1000);
}

title.addEventListener('input', scheduleAutoSave);
content.addEventListener('input', scheduleAutoSave);

function renderNotesList(notes) {
    notesList.innerHTML = '';
    for (const note of notes) {

        const li = document.createElement('li');
        li.setAttribute('data-id', note.id);
        const span = document.createElement('span');

        span.textContent = note.title?.trim() ? note.title : 'untitled';

        span.addEventListener('click', async () => {
            currentNoteId = note.id;
            title.textContent = note.title;
            content.textContent = note.content;

            const allNotes = notesList.querySelectorAll('li');
            allNotes.forEach(li => li.classList.remove('active'));
            li.classList.add('active');
        });

        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑️';

        delBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            await window.electronAPI.deleteNote(note.id);
            const notes = await window.electronAPI.loadNotes();
            renderNotesList(notes);

            if (currentNoteId === note.id) {
                currentNoteId = null;
                title.textContent = '';
                content.textContent = '';
                title.focus();
            }
        });

        li.appendChild(span);
        li.appendChild(delBtn);
        notesList.appendChild(li);
        notesList.appendChild(newNoteBtn);

    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const notes = await window.electronAPI.loadNotes();
    renderNotesList(notes);
});