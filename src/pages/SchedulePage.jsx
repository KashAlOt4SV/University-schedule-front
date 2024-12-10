import React, { useState, useEffect } from 'react';
import { Container, Button, MenuItem, Select, InputLabel, FormControl, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import axios from 'axios';
import ScheduleTable from '../components/ScheduleTable';
import { useSelector } from 'react-redux';
import getUserRole from '../components/jwt_decode';
import ProtectedRoute from '../components/ProtectedRoute';

const SchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [classTypes] = useState(['Лекция', 'Практическое занятие', 'Лабораторная работа']);
  const [audiences, setAudiences] = useState([]);
  const buildings = Array.from({ length: 14 }, (_, index) => (index + 1).toString()); // Список корпусов
  const [filteredAudiences, setFilteredAudiences] = useState([]); // Фильтрованный список аудиторий
  

  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedScheduleGroup, setSelectedScheduleGroup] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedScheduleTeacher, setSelectedScheduleTeacher] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [selectedClassType, setSelectedClassType] = useState('');
  const [teacherDisciplines, setTeacherDisciplines] = useState([]);
  const [selectedAudience, setSelectedAudience] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');

  const [filterApplied, setFilterApplied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Для подтверждения удаления
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');

  const token = localStorage.getItem('token');
  const [userRole, setRole] = useState(null);

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsData, teachersData, disciplinesData] = await Promise.all([
          axios.get('http://localhost:5000/api/groups', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/teachers', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/disciplines', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setGroups(groupsData.data);
        setTeachers(teachersData.data);
        setDisciplines(disciplinesData.data);
      } catch (error) {
        console.error('Error fetching groups, teachers or disciplines:', error);
      }
    };

    fetchData();
  }, []);

  // Загружаем аудитории с бэкенда
  useEffect(() => {
    const fetchAudiences = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/schedule/audience', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setAudiences(response.data);
      } catch (error) {
        console.error('Error fetching audiences:', error);
      }
    };
    fetchAudiences();
  }, [token]);

  // Функция для фильтрации аудиторий по корпусу
  const filterAudiencesByBuilding = (selectedBuilding) => {
    const selectedBuildingNumber = selectedBuilding.toString();
    return audiences.filter((audience) => {
      const audienceNumber = audience.number_of_audiences.toString();
      // Фильтруем аудитории, которые начинаются с выбранного корпуса
      // Если длина номера 4, то это одноцифровой корпус
      // Если длина номера 5, то это двухзначный корпус
      return (
        audienceNumber.startsWith(selectedBuildingNumber) &&
        (audienceNumber.length === 4 || audienceNumber.length === 5)
      );
    });
  };

  // Обновляем отфильтрованные аудитории при изменении выбранного корпуса
  useEffect(() => {
    if (selectedBuilding) {
      const filtered = filterAudiencesByBuilding(selectedBuilding);
      setFilteredAudiences(filtered);
    } else {
      setFilteredAudiences(audiences); // Если корпус не выбран, показываем все аудитории
    }
  }, [selectedBuilding, audiences]);

  // Обработчик изменения выбора корпуса
  const handleBuildingChange = (event) => {
    setSelectedBuilding(event.target.value);
  };

  useEffect(() => {
    if (filterApplied) {
      let url = 'http://localhost:5000/api/schedule';

      if (selectedTeacher) {
        url += `?teacherId=${selectedTeacher}`;
      }

      if (selectedGroup) {
        url += `?groupId=${selectedGroup}`;
      }

      axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          setSchedule(response.data);
        })
        .catch(error => {
          console.error('Error fetching schedule:', error);
        });
    }
  }, [filterApplied, selectedTeacher, selectedGroup, token]);

  const handleScheduleCellClick = (day, time, existingSchedule) => {
    setSelectedCell({ day, time });
  
    // Находим элемент расписания, соответствующий выбранной ячейке
    const scheduleItem = schedule.find(
      (item) => item.dayOfWeek === day && item.timeSlot === time
    );
  
    if (scheduleItem) {
      
      setSelectedScheduleTeacher(scheduleItem.teacherId);
      setSelectedScheduleGroup(scheduleItem.groupId);
      setSelectedDiscipline(scheduleItem.disciplineId);
      setSelectedClassType((scheduleItem.classType) ? scheduleItem.classType : null)
    } else {
        // Если элемента нет, очищаем поля
        setSelectedScheduleGroup('');
        setSelectedScheduleTeacher('');
        setSelectedDiscipline('');
        setSelectedClassType('');
    }
  
    setScheduleDialogOpen(true);
  };

  useEffect(() => {
    // Это будет срабатывать каждый раз, когда selectedScheduleTeacher, selectedScheduleGroup или selectedDiscipline изменяются
    if (selectedScheduleTeacher || selectedTeacher) {
      const teacher = teachers.find(t => t.id === (selectedTeacher ? selectedTeacher : selectedScheduleTeacher));
      if (teacher && teacher.Disciplines) {
        // Здесь мы получаем массив дисциплин по ID
        const teacherDisciplinesData = teacher.Disciplines.map(disciplineId => 
          disciplines.find(d => d.id === disciplineId) // Сопоставляем ID с полными данными дисциплин
        );
        setTeacherDisciplines(teacherDisciplinesData);
      }
    } else {
      setTeacherDisciplines(disciplines); // Если преподаватель не выбран, показываем все дисциплины
    }
  },  [selectedScheduleTeacher, selectedScheduleGroup, selectedDiscipline, teachers, disciplines, selectedTeacher]); // Убираем лишние зависимости

  useEffect(() => {
  }, [teacherDisciplines]); // Логируем состояние teacherDisciplines после его обновления

  const handleSave = () => {
    if (!(selectedGroup ? selectedGroup : selectedScheduleGroup) || !(selectedTeacher ? selectedTeacher : selectedScheduleTeacher) || !selectedDiscipline || !selectedClassType) {
      setSnackbarMessage('Ошибка: все поля должны быть заполнены.');
      setSnackbarType('error');
      setSnackbarOpen(true);
      return;
    }

    if (!selectedAudience || !selectedBuilding) {
      alert('Выберите корпус и аудиторию.');
      return;
    }

    console.log(selectedAudience)
  
    const scheduleData = {
      dayOfWeek: selectedCell.day,
      timeSlot: selectedCell.time,
      groupId: selectedGroup ? selectedGroup : selectedScheduleGroup,
      disciplineId: selectedDiscipline,
      teacherId: selectedTeacher ? selectedTeacher : selectedScheduleTeacher,
      classType: selectedClassType,
      audience: selectedAudience
    };
  
    if (selectedCell.id) {
      // Обновление существующего расписания
      axios.put(`http://localhost:5000/api/schedule/${selectedCell.id}`, scheduleData, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          // Обновляем расписание сразу в состоянии
          setSchedule(schedule.map(item =>
            item.id === response.data.id ? response.data : item
          ));
          setScheduleDialogOpen(false);
          setSnackbarMessage('Расписание успешно обновлено!');
          setSnackbarType('success');
          setSnackbarOpen(true);
        })
        .catch(error => {
          setSnackbarMessage(error.response && error.response.status === 400 ? error.response.data.message || 'Ошибка при обновлении расписания.' : 'Ошибка при обновлении расписания.');
          setSnackbarType('error');
          setSnackbarOpen(true);
        });
    } else {
      // Добавление нового расписания
      axios.post('http://localhost:5000/api/schedule', scheduleData, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          // Добавляем новое расписание в состояние
          setSchedule(prevSchedule => [...prevSchedule, response.data]);
          setScheduleDialogOpen(false);
          setSnackbarMessage('Расписание успешно добавлено!');
          setSnackbarType('success');
          setSnackbarOpen(true);
        })
        .catch(error => {
          setSnackbarMessage(error.response && error.response.status === 400 ? error.response.data.message || 'Ошибка при добавлении расписания.' : 'Ошибка при добавлении расписания.');
          setSnackbarType('error');
          setSnackbarOpen(true);
        });
    }
  };

  useEffect(() => {
    // Отслеживаем изменения в состоянии schedule и реагируем на них
    console.log('Updated schedule:', schedule);
  }, [schedule]);
  
  

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const handleScheduleCancel = () => {
    setScheduleDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleApplyFilter = () => {
    setFilterApplied(true);
    setDialogOpen(false);
  };

  const handleCancelFilter = () => {
    setSelectedTeacher('');
    setSelectedGroup('');
    setFilterApplied(false);
    setDialogOpen(false);
  };

  const handleDelete = () => {
    const scheduleToDelete = schedule.find(item => 
      selectedScheduleGroup &&
      selectedDiscipline &&
      selectedScheduleTeacher &&
      selectedCell.time &&
      selectedCell.day
    );
    if (scheduleToDelete) {
      // Отправляем запрос на сервер для удаления
      axios.delete(`http://localhost:5000/api/schedule/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          groupId: selectedScheduleGroup,
          disciplineId: selectedDiscipline,
          teacherId: selectedScheduleTeacher,
          timeSlot: selectedCell.time,
          dayOfWeek: selectedCell.day,
          classType: selectedClassType
        }
      })
      .then(() => {
        // Убираем удаленную запись из состояния
        setSchedule(schedule.filter(item => item.id !== scheduleToDelete.id));
        setDeleteDialogOpen(false);  // Закрытие модального окна
        setSnackbarMessage('Запись успешно удалена!');
        setSnackbarType('success');
        setSnackbarOpen(true);
      })
      .catch(error => {
        setSnackbarMessage('Ошибка при удалении записи.');
        setSnackbarType('error');
        setSnackbarOpen(true);
      });
    }
  };

  useEffect(() => {
    console.log("Updated schedule", schedule);
  }, [schedule]); // Следим за обновлениями расписания
  
  return (
    <Container>
      <h2>Расписание</h2>

      {!filterApplied ? (
        <Typography variant="h6" color="error" fontWeight="bold">
          Чтобы увидеть расписание, пожалуйста, <span style={{ color: 'red' }}>примените фильтр</span>
        </Typography>
      ) : (
        <Container>
          <ScheduleTable schedule={schedule} onCellClick={handleScheduleCellClick} userRole={userRole} />
          
          <ProtectedRoute requiredRole={userRole === "dispatcher" ? "dispatcher" : "admin"}>
            <Dialog open={scheduleDialogOpen} onClose={handleScheduleCancel}>
              <DialogTitle>{selectedCell?.id ? 'Редактировать расписание' : 'Добавить расписание'}</DialogTitle>
              <DialogContent>
                <FormControl fullWidth>
                  <InputLabel>Группа</InputLabel>
                  <Select
                    value={selectedGroup ? selectedGroup : selectedScheduleGroup}
                    onChange={(e) => setSelectedScheduleGroup(e.target.value)}
                    defaultValue={selectedGroup ? selectedGroup : null}
                    disabled={selectedGroup !== ''}
                    displayEmpty
                    style={{ marginBottom: '7px' }}
                  >
                    {groups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>{group.groupName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Преподаватель</InputLabel>
                  <Select
                    value={selectedTeacher ? selectedTeacher : selectedScheduleTeacher}
                    onChange={(e) => setSelectedScheduleTeacher(e.target.value)}
                    defaultValue={selectedTeacher ? selectedTeacher : null}
                    displayEmpty
                    disabled={selectedTeacher !== ''}
                    style={{ marginBottom: '7px' }}
                  >
                    {teachers.map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.id}>{teacher.FIO}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Дисциплина</InputLabel>
                  <Select
                    value={selectedDiscipline}
                    onChange={(e) => setSelectedDiscipline(e.target.value)}
                    displayEmpty
                    style={{ marginBottom: '7px' }}
                  >
                    {(teacherDisciplines && teacherDisciplines.length > 0 ? teacherDisciplines : disciplines).map((discipline) => (
                      <MenuItem key={discipline.id} value={discipline.id}>{discipline.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Тип занятия</InputLabel>
                  <Select
                    value={selectedClassType}
                    onChange={(e) => setSelectedClassType(e.target.value)}
                    displayEmpty
                    style={{ marginBottom: '7px' }}
                  >
                    {classTypes.map((classType) => (
                      <MenuItem key={classType} value={classType}>{classType}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Grid container spacing={2}>
              <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Корпус</InputLabel>
                <Select
                  value={selectedBuilding}
                  onChange={handleBuildingChange}
                  displayEmpty
                >
                  {buildings.map((building) => (
                    <MenuItem key={building} value={building}>
                      Корпус {building}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Аудитория</InputLabel>
                <Select
                  value={selectedAudience}
                  onChange={(e) => setSelectedAudience(e.target.value)}
                  displayEmpty
                  disabled={!selectedBuilding} // Блокируем, если корпус не выбран
                >
                  {/* Здесь мы фильтруем аудитории на основе выбранного корпуса */}
                  {filteredAudiences.map((audience) => (
                    <MenuItem key={audience.id} value={audience.number_of_audiences}>
                      {audience.number_of_audiences}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>                
              </DialogContent>
              <DialogActions>
                <Button onClick={handleScheduleCancel} color="secondary">Отменить</Button>
                <Button onClick={handleSave} color="primary">Сохранить</Button>

                {selectedCell && (
                  <Button onClick={() => setDeleteDialogOpen(true)} color="error">Удалить</Button>
                )}
              </DialogActions>
            </Dialog>
          </ProtectedRoute>
        </Container>
      )}

      <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>
        Применить фильтр
      </Button>

      <Dialog open={dialogOpen} onClose={handleCancelFilter}>
        <DialogTitle>Выберите фильтры</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Преподаватель</InputLabel>
                <Select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  displayEmpty
                  style={{ marginBottom: '7px' }}
                  disabled={selectedGroup !== ''}
                >
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.FIO}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Группа</InputLabel>
                <Select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  displayEmpty
                  style={{ marginBottom: '7px' }}
                  disabled={selectedTeacher !== ''}
                >
                  {groups.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.groupName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelFilter} color="secondary">Отменить</Button>
          <Button onClick={handleApplyFilter} color="primary">Применить фильтр</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarType}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Подтвердите удаление</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить это расписание?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">Отменить</Button>
          <Button onClick={() => { 
              handleDelete(); 
              handleScheduleCancel(); 
            }} color="primary">Удалить</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SchedulePage;