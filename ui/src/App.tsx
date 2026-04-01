import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, GraduationCap, Calendar, CreditCard, Plus, Trash2, CheckCircle } from 'lucide-react';
import './App.css';

const API_URL = 'http://localhost:3000/api';

function App() {
  const [activeTab, setActiveTab] = useState('classes');
  const [parents, setParents] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState('Monday');

  const [parentForm, setParentForm] = useState({ name: '', phone: '', email: '' });
  const [studentForm, setStudentForm] = useState({ name: '', dob: '', gender: 'Male', currentGrade: '', parentId: '' });
  const [classForm, setClassForm] = useState({ name: '', subject: '', dayOfWeek: 'Monday', timeSlot: '', teacherName: '', maxStudents: 20 });
  const [subForm, setSubForm] = useState({ studentId: '', packageName: '', startDate: '', endDate: '', totalSessions: 10 });

  const fetchData = async () => {
    try {
      const [p, s, c, sub] = await Promise.all([
        axios.get(`${API_URL}/parents`),
        axios.get(`${API_URL}/students`),
        axios.get(`${API_URL}/classes?day=${selectedDay}`),
        axios.get(`${API_URL}/subscriptions`)
      ]);
      setParents(p.data);
      setStudents(s.data);
      setClasses(c.data);
      setSubscriptions(sub.data);
    } catch (err) {
      console.error('Error fetching data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDay]);

  const handleCreateParent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/parents`, parentForm);
      setParentForm({ name: '', phone: '', email: '' });
      fetchData();
      alert('Parent created!');
    } catch (err) {
      alert('Error creating parent');
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/students`, {
        ...studentForm,
        parentId: parseInt(studentForm.parentId)
      });
      setStudentForm({ name: '', dob: '', gender: 'Male', currentGrade: '', parentId: '' });
      fetchData();
      alert('Student created!');
    } catch (err) {
      alert('Error creating student');
    }
  };

  const handleRegisterClass = async (classId: number) => {
    const studentIdStr = prompt('Enter Student ID to register:');
    if (!studentIdStr) return;
    const studentId = parseInt(studentIdStr);
    try {
      await axios.post(`${API_URL}/classes/${classId}/register`, { studentId });
      fetchData();
      alert('Registered successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/subscriptions`, {
        ...subForm,
        studentId: parseInt(subForm.studentId),
        totalSessions: parseInt(subForm.totalSessions.toString())
      });
      fetchData();
      alert('Subscription created!');
    } catch (err) {
      alert('Error creating subscription');
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="container">
      <header className="header">
        <h1>TeenUp Dashboard</h1>
        <div className="tabs">
          <div className={`tab ${activeTab === 'classes' ? 'active' : ''}`} onClick={() => setActiveTab('classes')}>Classes</div>
          <div className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</div>
          <div className={`tab ${activeTab === 'subscriptions' ? 'active' : ''}`} onClick={() => setActiveTab('subscriptions')}>Subscriptions</div>
        </div>
      </header>

      {activeTab === 'classes' && (
        <div>
          <div className="grid">
            <div className="card">
              <h2><Plus size={20} /> Create New Class</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                await axios.post(`${API_URL}/classes`, { ...classForm, maxStudents: parseInt(classForm.maxStudents.toString()) });
                fetchData();
              }}>
                <input placeholder="Name" value={classForm.name} onChange={e => setClassForm({...classForm, name: e.target.value})} required />
                <input placeholder="Subject" value={classForm.subject} onChange={e => setClassForm({...classForm, subject: e.target.value})} required />
                <select value={classForm.dayOfWeek} onChange={e => setClassForm({...classForm, dayOfWeek: e.target.value})}>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input placeholder="Time Slot (e.g. 09:00-11:00)" value={classForm.timeSlot} onChange={e => setClassForm({...classForm, timeSlot: e.target.value})} required />
                <input placeholder="Teacher" value={classForm.teacherName} onChange={e => setClassForm({...classForm, teacherName: e.target.value})} required />
                <input type="number" placeholder="Max Students" value={classForm.maxStudents} onChange={e => setClassForm({...classForm, maxStudents: parseInt(e.target.value)})} required />
                <button type="submit">Create Class</button>
              </form>
            </div>
            
            <div className="card" style={{ gridColumn: 'span 2' }}>
              <h2><Calendar size={20} /> Weekly Schedule</h2>
              <div className="tabs">
                {days.map(d => (
                  <div key={d} className={`tab ${selectedDay === d ? 'active' : ''}`} onClick={() => setSelectedDay(d)}>{d}</div>
                ))}
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Class</th>
                    <th>Teacher</th>
                    <th>Registrations</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map(c => (
                    <tr key={c.id}>
                      <td>{c.timeSlot}</td>
                      <td>{c.name} ({c.subject})</td>
                      <td>{c.teacherName}</td>
                      <td>{c._count.registrations} / {c.maxStudents}</td>
                      <td><button onClick={() => handleRegisterClass(c.id)} className="secondary">Register Student</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="grid">
          <div className="card">
            <h2><Users size={20} /> Add Parent</h2>
            <form onSubmit={handleCreateParent}>
              <input placeholder="Name" value={parentForm.name} onChange={e => setParentForm({...parentForm, name: e.target.value})} required />
              <input placeholder="Phone" value={parentForm.phone} onChange={e => setParentForm({...parentForm, phone: e.target.value})} />
              <input type="email" placeholder="Email" value={parentForm.email} onChange={e => setParentForm({...parentForm, email: e.target.value})} required />
              <button type="submit">Add Parent</button>
            </form>
          </div>

          <div className="card">
            <h2><GraduationCap size={20} /> Add Student</h2>
            <form onSubmit={handleCreateStudent}>
              <input placeholder="Name" value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})} required />
              <input type="date" value={studentForm.dob} onChange={e => setStudentForm({...studentForm, dob: e.target.value})} required />
              <select value={studentForm.gender} onChange={e => setStudentForm({...studentForm, gender: e.target.value})}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input placeholder="Grade" value={studentForm.currentGrade} onChange={e => setStudentForm({...studentForm, currentGrade: e.target.value})} required />
              <select value={studentForm.parentId} onChange={e => setStudentForm({...studentForm, parentId: e.target.value})} required>
                <option value="">Select Parent</option>
                {parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button type="submit">Add Student</button>
            </form>
          </div>

          <div className="card" style={{ gridColumn: 'span 2' }}>
            <h2>All Students</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Parent</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.parent?.name}</td>
                    <td>{s.currentGrade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'subscriptions' && (
        <div className="grid">
          <div className="card">
            <h2><CreditCard size={20} /> New Subscription</h2>
            <form onSubmit={handleCreateSubscription}>
              <select value={subForm.studentId} onChange={e => setSubForm({...subForm, studentId: e.target.value})} required>
                <option value="">Select Student</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input placeholder="Package Name" value={subForm.packageName} onChange={e => setSubForm({...subForm, packageName: e.target.value})} required />
              <input type="date" placeholder="Start Date" value={subForm.startDate} onChange={e => setSubForm({...subForm, startDate: e.target.value})} required />
              <input type="date" placeholder="End Date" value={subForm.endDate} onChange={e => setSubForm({...subForm, endDate: e.target.value})} required />
              <input type="number" placeholder="Total Sessions" value={subForm.totalSessions} onChange={e => setSubForm({...subForm, totalSessions: parseInt(e.target.value)})} required />
              <button type="submit">Create</button>
            </form>
          </div>

          <div className="card" style={{ gridColumn: 'span 2' }}>
            <h2>Active Subscriptions</h2>
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Package</th>
                  <th>Sessions (Used/Total)</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map(sub => (
                  <tr key={sub.id}>
                    <td>{sub.student?.name}</td>
                    <td>{sub.packageName}</td>
                    <td>{sub.usedSessions} / {sub.totalSessions}</td>
                    <td>
                      <span className="badge">
                        {new Date(sub.endDate) > new Date() ? 'Active' : 'Expired'}
                      </span>
                    </td>
                    <td>
                      <button onClick={async () => {
                        await axios.patch(`${API_URL}/subscriptions/${sub.id}/use`);
                        fetchData();
                      }} className="secondary">Use Session</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
