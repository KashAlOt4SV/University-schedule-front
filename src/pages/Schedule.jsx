// Schedule.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSchedule, updateSchedule } from '../redux/slices/scheduleSlice.js';

const Schedule = () => {
  const dispatch = useDispatch();
  const schedule = useSelector((state) => state.schedule.schedule);
  const userRole = useSelector((state) => state.schedule.userRole);

  const [isEditing, setIsEditing] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState([]);

  useEffect(() => {
    dispatch(fetchSchedule());
  }, [dispatch]);

  useEffect(() => {
    setEditedSchedule(schedule);
  }, [schedule]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async (id, updatedData) => {
    await dispatch(updateSchedule({ id, updatedData }));
    setIsEditing(false);
  };

  return (
    <div>
      <h1>Расписание</h1>
      {schedule.length > 0 ? (
        <ul>
          {editedSchedule.map((item) => (
            <li key={item.id}>
              {isEditing && (userRole === 'Admin' || userRole === 'dispatcher') ? (
                <div>
                  <input
                    type="text"
                    value={item.subject}
                    onChange={(e) => setEditedSchedule((prev) =>
                      prev.map((i) =>
                        i.id === item.id ? { ...i, subject: e.target.value } : i
                      )
                    )}
                  />
                  <button onClick={() => handleSaveClick(item.id, { subject: item.subject })}>
                    Сохранить
                  </button>
                </div>
              ) : (
                <span>{item.subject}</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Расписание еще не загружено.</p>
      )}
      {userRole === 'Admin' || userRole === 'dispatcher' ? (
        <button onClick={handleEditClick}>Редактировать</button>
      ) : null}
    </div>
  );
};

export default Schedule;
