import { useState, useEffect } from 'react';
import './App.css';
import { FrappeApp } from 'frappe-js-sdk';

function App() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const frappe = new FrappeApp("http://5.75.229.51");
    const db = frappe.db();
    db.getDocList('Sales Invoice', {
      fields: ['name', 'status', 'grand_total', 'customer', 'creation', 'modified_by'],
      limit: 10,
      asDict: true,
    })
    .then((docs) => {
      console.log(docs);
      setList(docs);
    })
    .catch((error) => console.error(error));
  }, []);

  return (
    <div className="App">
      <table className="list-view">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Status</th>
            <th>Amount</th>
            <th>ID</th>
            <th>User</th>
            <th>Created at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item.name}>
              <td>{item.customer}</td>
              <td>
                <div
                  className={`status-badge ${
                    item.status === 'Overdue'
                      ? 'status-cancelled'
                      : item.status === 'Unpaid'
                      ? 'status-on-the-way'
                      : item.status === 'Paid'
                      ? 'status-delivered'
                      : item.status === 'Ready'
                      ? 'status-ready'
                      : ''
                  }`}
                >
                  {item.status}
                </div>
              </td>
              <td>₹ {item.grand_total}</td>
              <td>{item.name}</td>
              <td>{item.modified_by}</td>
              <td>{item.creation}</td>
              <td>
                <div className="actions-container">
                  <button className="action-button-e">
                    <i className="fas fa-eye">E</i>
                  </button>
                  <button className="action-button-d">
                    <i className="fas fa-edit">D</i>
                  </button>
                  <button className="action-button-v">
                    <i className="fas fa-trash-alt">V</i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;