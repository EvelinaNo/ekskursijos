import { useContext, useEffect, useState } from 'react';
import { ExcursionCard } from './ExcursionCard';
import styled from 'styled-components';
import axios from 'axios';
import { AuthContext } from '../utils/AuthContext';
import SyncLoader from 'react-spinners/SyncLoader';
import { DeleteModal } from '../components/DeleteModal';
import Search from '../components/Search';
import CreateButton from '../components/CreateButton';
import { useNavigate } from 'react-router-dom';

const ExcursionsPageContainer = styled.div`
  padding: 4rem 0rem;
  max-width: 75rem;
  margin: 0 auto;
`;

const ExcursionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 1.25rem;
  margin-top: 1.25rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  max-width: 77.5rem;
  margin: 0 auto;
`;

const Info = styled.p`
  font-size: 1.25rem;
  word-break: break-word;
  user-select: none;
  padding: 2rem 2rem 2rem 0;
`;

export const Excursions = () => {
  const [excursions, setExcursions] = useState([]);
  const [filteredExcursions, setFilteredExcursions] = useState([]);
  const [excursionsLoading, setExcursionsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [deleteModalItemId, setDeleteModalItemId] = useState(null);
  const [excursionSchedule, setExcursionSchedule] = useState({});
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    const fetchExcursions = async () => {
      try {
        const response = await axios.get('http://localhost:1000/api/triptrack/excursions');
        setExcursions(response.data);
        setFilteredExcursions(response.data);
        setExcursionsLoading(false);

        // Užklausiame ir isetinam kiekvienos ekskursijos schedule
        const schedules = await Promise.all(response.data.map((excursion) => fetchExcursionSchedule(excursion.id)));
        const scheduleMap = {};
        response.data.forEach((excursion, index) => {
          scheduleMap[excursion.id] = schedules[index];
        });
        setExcursionSchedule(scheduleMap);
      } catch (error) {
        console.error('Error fetching excursions:', error);
        setExcursionsLoading(false);
      }
    };

    fetchExcursions();
  }, []);

  useEffect(() => {
    // Ekskursijų filtravimo pagal pavadinimą ir datą funkcija
    const filterExcursions = () => {
      if (searchQuery.trim() === '') {
        setFilteredExcursions(excursions);
      } else {
        const filtered = excursions.filter((excursion) => {
          // Tikriname, ar kelionės pavadinimas ir data atitinka paieškos užklausą
          return (
            (excursion.title && excursion.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (excursion.date_time && excursion.date_time.includes(searchQuery)) ||
            (excursion.schedule &&
              excursion.schedule.some((scheduleItem) => {
                return scheduleItem && scheduleItem.toString().toLowerCase().includes(searchQuery.toLowerCase());
              }))
          );
        });
        setFilteredExcursions(filtered);
      }
    };

    filterExcursions();
  }, [searchQuery, excursions, excursionSchedule]);

  const fetchExcursionSchedule = async (excursionId) => {
    try {
      const response = await axios.get(`http://localhost:1000/api/triptrack/excursions/${excursionId}/schedule`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedule for excursion ${excursionId}:`, error);
      return [];
    }
  };

  const deleteExcursion = async (excursionId) => {
    try {
      await axios.delete(`http://localhost:1000/api/triptrack/excursions/${excursionId}`);
      const updatedExcursions = excursions.filter((excursion) => excursion.id !== excursionId);
      setExcursions(updatedExcursions);
    } catch (error) {
      console.error('Error deleting excursion:', error);
    }
  };


  return (
    <>
      <ExcursionsPageContainer>
        <ButtonsContainer>
          {user && user.role === 'admin' && (
            <CreateButton buttonTitle="Add excursion" onClick={() => navigate('/create')} />
          )}
          <Search onSearch={setSearchQuery} />
        </ButtonsContainer>
        <ExcursionsContainer>
          {excursionsLoading ? (
            <LoadingContainer>
              <SyncLoader color={'#dddddd'} loading={excursionsLoading} size={20} />
            </LoadingContainer>
          ) : filteredExcursions.length === 0 ? (
            <Info>No excursions available</Info>
          ) : (
            filteredExcursions.map((excursion) => (
              <ExcursionCard
                key={excursion.id ? `excursion-${excursion.id}` : null}
                {...excursion}
                isVisible={user && user.role === 'admin'}
                onDeleteModalOpen={() => setDeleteModalItemId(excursion.id)}
                hasReview={excursion.hasReview}
                schedule={excursionSchedule[excursion.id] || []} // Perduodame ekskursijos tvarkarasti
              />
            ))
          )}
        </ExcursionsContainer>
        {deleteModalItemId && (
          <DeleteModal
            excursionId={deleteModalItemId}
            onClose={() => setDeleteModalItemId(null)}
            onDelete={() => {
              deleteExcursion(deleteModalItemId);
              setDeleteModalItemId(null);
            }}
          />
        )}
      </ExcursionsPageContainer>
    </>
  );
};
