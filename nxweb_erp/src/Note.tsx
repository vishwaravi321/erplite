import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea, List, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { FrappeApp } from 'frappe-js-sdk';
import './Note.css';

function Note() {
  const [list, setList] = React.useState([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newNoteTitle, setNewNoteTitle] = React.useState('');
  const [newNoteContent, setNewNoteContent] = React.useState('');

  React.useEffect(() => {
    const frappe = new FrappeApp("http://5.75.229.51");
    const db = frappe.db();
    db.getDocList('Note', {
      fields: ['name', 'title', 'content'],
      limit: 10,
      asDict: true,
    })
    .then((docs) => {
      const updatedDocs = docs.map(doc => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(doc.content, 'text/html');
        const content = htmlDoc.querySelector('.ql-editor')?.textContent || doc.content;
        return { ...doc, content };
      });
      setList(updatedDocs);
    })
    .catch((error) => console.error(error));
  }, []);

  const handleCreateNote = () => {
    setIsDialogOpen(true);
  };

  const handleSaveNote = () => {
    const frappe = new FrappeApp("http://5.75.229.51");
    const db = frappe.db();
    const newNote = {
      title: newNoteTitle,
      content: newNoteContent,
    };
    db.createDoc('Note', {
      title: newNote.title,
      content: newNote.content,
      public:1
    })
    .then((doc) => console.log(doc))
    .catch((error) => console.error(error));
    setIsDialogOpen(false);
  };

  const handleCancelNote = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="create-button-container">
        <button className="create-button" onClick={handleCreateNote}>
          Create
        </button>
      </div>
      <div className="note-container">
        {list.map((data) => (
          <Card className="note-card">
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {data.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data.content}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </div>
      <Dialog open={isDialogOpen} onClose={handleCancelNote}>
        <DialogTitle className="dialog-title">Create a New Note</DialogTitle>
        <DialogContent className="dialog-content">
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            id="content"
            label="Content"
            type="text"
            fullWidth
            variant="standard"
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleCancelNote}>Cancel</Button>
          <Button onClick={handleSaveNote}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Note;