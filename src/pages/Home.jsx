import React, { useRef, useState } from 'react';
import StudentForm from '../components/studentForm';
import StudentTable from '../components/StudentTable';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const footerRef = useRef();

  return (
    <div className="min-h-screen bg-blue-100">
      <Header footerRef={footerRef} />
      <StudentForm
        selectedStudent={selectedStudent}
        clearSelection={() => setSelectedStudent(null)}
      />
      <StudentTable onEdit={setSelectedStudent} />
      <Footer ref={footerRef} />
    </div>
  );
};

export default Home;
