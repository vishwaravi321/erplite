import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { FrappeApp } from 'frappe-js-sdk';
import './Note.css';
import { FolderAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { FloatButton, Input } from 'antd';
import Grid from '@mui/material/Grid';
import { Button, Drawer,Divider } from 'antd';

const { TextArea } = Input;

function Note() {
  const [list, setList] = React.useState([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newNoteTitle, setNewNoteTitle] = React.useState('');
  const [newNoteContent, setNewNoteContent] = React.useState('');
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [currentNote, setCurrentNote] = React.useState(null);
  const [editedNoteContent, setEditedNoteContent] = React.useState('');

  const deleteNote = (name) => {
    const frappe = new FrappeApp("http://162.55.41.54");
    const db = frappe.db();
    db.deleteDoc('Note', name)
      .then((response) => {
        location.reload();
        console.log(response.message);
      })
      .catch((error) => console.error(error));
  };

  const editTitle = (name,title) => {
    const frappe = new FrappeApp("http://162.55.41.54");
    const db = frappe.db();
    db.updateDoc('Note', name, {
      title: title,
    })
      .then((doc) => {
        console.log(doc);
        setIsDrawerOpen(false);
      })
      .catch((error) => console.error(error));
  };
  

  const showDrawer = (note) => {
    setCurrentNote(note);
    setEditedNoteContent(note.content);
    setIsDrawerOpen(true);
  };

  const onDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleSaveDrawerNote = () => {
    const frappe = new FrappeApp("http://162.55.41.54");
    const db = frappe.db();
    db.updateDoc('Note', currentNote.name, {
      content: editedNoteContent,
    })
      .then((doc) => {
        console.log(doc);
        setIsDrawerOpen(false);
      })
      .catch((error) => console.error(error));
  };

  React.useEffect(() => {
    const frappe = new FrappeApp("http://162.55.41.54");
    const db = frappe.db();
    db.getDocList('Note', {
      fields: ['name', 'title', 'content'],
      orderBy: {
        field: 'creation',
        order: 'desc',
      },
      limit:1000,
      asDict: true,
    })
      .then((docs) => {
        const updatedDocs = docs.map((doc) => {
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
    const frappe = new FrappeApp("http://162.55.41.54");
    const db = frappe.db();
    const newNote = {
      title: newNoteTitle,
      content: newNoteContent,
    };
    db.createDoc('Note', {
      title: newNote.title,
      content: newNote.content,
      public: 1,
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
      <div className="note-container">
        <Grid container spacing={3}>
          {list.map((data) => (
            <Grid item xs={12} sm={6} md={4} key={data.name}>
              <Card className="note-card" elevation={3}>
                <CardActionArea onClick={() => showDrawer(data)}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {data.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {data.content}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <Divider orientation="left" plain>
                  Actions
                </Divider>
                <div className="note-actions">
                  <Button className="note-actions" onClick={() => editTitle(data.name,"ready")}>
                    <EditOutlined />
                  </Button>
                  <Button className="note-actions" onClick={() => deleteNote(data.name)}>
                    <DeleteOutlined />
                  </Button>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
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
          <TextArea
            rows={15}
            placeholder="Content"
            maxLength={1000}
            margin="dense"
            id="content"
            label="Content"
            type="text"
            variant="standard"
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button type="primary" onClick={handleCancelNote}>Cancel</Button>
          <Button type="primary" onClick={handleSaveNote}>Save</Button>
        </DialogActions>
      </Dialog>

      <Drawer
        title={currentNote?.title}
        width={520}
        onClose={onDrawerClose}
        open={isDrawerOpen}
      >
        <TextArea
          rows={30}
          placeholder="Content"
          maxLength={1000}
          margin="dense"
          id="content"
          label="Content"
          type="text"
          value={editedNoteContent}
          onChange={(e) => setEditedNoteContent(e.target.value)}
        /> 
        <div className="note-actions">
        <Button type="primary" onClick={handleSaveDrawerNote}>
          Update
        </Button>
        </div>
      </Drawer>

      <FloatButton
        icon={<FolderAddOutlined />}
        style={{ right: 24 }}
        type="primary"
        onClick={handleCreateNote}
      />
    </>
  );
}

export default Note;