import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createStudent, updateStudent, getStudents } from '../api/studentApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentForm = ({ selectedStudent, clearSelection }) => {
  const queryClient = useQueryClient();

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (selectedStudent) {
      Object.keys(selectedStudent).forEach((key) => {
        setValue(key, selectedStudent[key]);
      });
    } else {
      reset();
    }
  }, [selectedStudent, setValue, reset]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (selectedStudent) {
        return await updateStudent(selectedStudent.id, data);
      } else {
        return await createStudent(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
      toast.success(
        selectedStudent ? 'Student updated successfully!' : 'Student created successfully!'
      );
      clearSelection();
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Something went wrong');
    },
  });

  const onSubmit = (data) => {
    const isDuplicate = students.some(
      (student) =>
        student.email === data.email && student.id !== selectedStudent?.id
    );

    if (isDuplicate) {
      toast.warning('A student with this email already exists.');
      return;
    }

    mutation.mutate(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4 mt-4 flex flex-col space-y-4 sm:p-6 md:p-8"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
          {selectedStudent ? 'Update Student' : 'Create Student'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                maxLength: { value: 20, message: 'Name must be under 20 characters' },
              })}
              placeholder="Enter name"
              className={`mt-1 p-2 text-m block w-full rounded-md border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              id="age"
              {...register('age', {
                valueAsNumber: true,
                min: { value: 1, message: 'Age must be at least 1' },
                max: { value: 110, message: 'Age must be less than 120' },
              })}
              placeholder="Enter age"
              className={`mt-1 p-2 text-m block w-full rounded-md border ${
                errors.age ? 'border-red-500' : 'border-gray-300'
              } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Invalid email address',
                },
              })}
              placeholder="Enter email"
              className={`mt-1 p-2 text-m block w-full rounded-md border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Course */}
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700">
              Course
            </label>
            <input
              id="course"
              {...register('course', {
                required: 'Course is required',
                minLength: { value: 2, message: 'Course must be at least 2 characters' },
              })}
              placeholder="Enter course"
              className={`mt-1 p-2 text-m block w-full rounded-md border ${
                errors.course ? 'border-red-500' : 'border-gray-300'
              } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.course && <p className="text-red-500 text-sm">{errors.course.message}</p>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
          >
            Submit
          </button>
          {selectedStudent && (
            <button
              type="button"
              onClick={() => {
                clearSelection();
                reset();
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default StudentForm;
