//renderer.js
const title = document.getElementById('note-title');
const content = document.getElementById('note-content');
const notesList = document.getElementById('notes-list');
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
        li.textContent = note.title?.trim() ? note.title : 'untitled';
        notesList.appendChild(li);

        li.addEventListener('click', async () => {
            currentNoteId = note.id;
            title.textContent = note.title;
            content.textContent = note.content;
        });
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const notes = await window.electronAPI.loadNotes();
    renderNotesList(notes);
});