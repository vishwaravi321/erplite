import { useState, useEffect } from 'react';
import { Modal, Button, Input, Result, Skeleton, Card, Drawer, Pagination, FloatButton } from 'antd';
import Grid from '@mui/material/Grid';
import { FrappeApp } from 'frappe-js-sdk';
import { FolderAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './Note.css';

const { TextArea } = Input;
const { Meta } = Card;

function Note() {
  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [editedNoteContent, setEditedNoteContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const pageSize = 9;

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

  const editTitle = (name, title) => {
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const frappe = new FrappeApp("http://162.55.41.54");
        const db = frappe.db();
        const docs = await db.getDocList('Note', {
          fields: ['name', 'title', 'content'],
          orderBy: {
            field: 'creation',
            order: 'desc',
          },
          limit: 1000,
          asDict: true,
        });
        const updatedDocs = docs.map((doc) => {
          const parser = new DOMParser();
          const htmlDoc = parser.parseFromString(doc.content, 'text/html');
          const content = htmlDoc.querySelector('.ql-editor')?.textContent || doc.content;
          return { ...doc, content };
        });
        setList(updatedDocs);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  

  const handleCreateNote = () => {
    setIsModalOpen(true);
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
    setIsModalOpen(false);
  };

  const handleCancelNote = () => {
    setIsModalOpen(false);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedList = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <div className="note-container">
      {loading?(
        <div><Skeleton active /></div>
      ) : error ? (
      <div>
        <Result
          status="500"
          title="500"
          subTitle={error.message}
        />
      </div>
      ) : (
        <>
        <Grid container spacing={3}>
          {paginatedList.map((data) => (
            <Grid item xs={12} sm={6} md={4} key={data.name}>
              <Card
                key={data.name}
                hoverable
                title={data.title}
                actions={[
                  <EditOutlined onClick={() => showDrawer(data)} key="edit" />,
                  <DeleteOutlined onClick={() => deleteNote(data.name)} key="delete" />,
                ]}
                className="block-card"
              >
                <Meta
                  style={{ overflow: 'hidden',height:'6em', maxHeight: '6em', textOverflow: 'ellipsis' }}
                  onClick={() => showDrawer(data)}
                  description={data.content}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
        </>
      )}
      </div>

      <Pagination
        current={currentPage}
        total={list.length}
        pageSize={pageSize}
        onChange={onPageChange}
        style={{ textAlign: 'center', marginTop: 20 }}
      />

      <Modal
        title="Create a New Note"
        open={isModalOpen}
        onOk={handleSaveNote}
        onCancel={handleCancelNote}
        okText="Save"
        cancelText="Cancel"
      >
        <Input
          placeholder="Title"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
        />
        <TextArea
          rows={15}
          placeholder="Content"
          // maxLength={100000}
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
        />
      </Modal>

      <Drawer
        title={currentNote?.title}
        width={520}
        onClose={onDrawerClose}
        open={isDrawerOpen}
        placement="right"
        closable={false}
        getContainer={false}
      >
        <TextArea
          rows={30}
          placeholder="Content"
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
