import React, { useState } from 'react';
import StudentForm from '../components/StudentForm';
import StudentTable from '../components/StudentTable';

const Home = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <StudentForm
        selectedStudent={selectedStudent}
        clearSelection={() => setSelectedStudent(null)}
      />
      <StudentTable onEdit={setSelectedStudent} />
    </div>
  );
};

export default Home;
