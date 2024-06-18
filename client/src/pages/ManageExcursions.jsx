import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { format } from 'date-fns';
import { AuthContext } from '../utils/AuthContext';

const PageContainer = styled.div`
  padding: 7rem 3rem 2rem 3rem;
  max-width: 75rem;
  margin: 0 auto;
`;

const Title = styled.p`
  font-weight: 500;
  font-size: 1.25rem;
  word-break: break-word;
  user-select: none;
  padding-bottom: 2rem;
`;

const ExcursionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ExcursionItem = styled.div`
  border: 1px solid #dddddd;
  border-radius: 0.25rem;
  padding: 1rem;
  width: calc(33.33% - 1rem);
`;

const ExcursionInfo = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #eee;
  margin-bottom: 1.5rem;
`;

const ExcursionName = styled.div`
  font-weight: 500;
  font-size: 1rem;
  word-break: break-word;
  user-select: none;
`;

const UserName = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
  color: #555;
  padding: 1rem 0rem;
`;

const ExcursionDate = styled.div`
  font-weight: 500;
  font-size: 1rem;
  word-break: break-word;
  user-select: none;
  margin: 0.5rem 0;
`;

const ConfirmButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition:
    background-color 0.3s,
    transform 0.3s;

  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const ManageExcursions = () => {
  // const { user } = useContext(AuthContext);
  const [excursions, setExcursions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExcursions = async () => {
      try {
        const response = await axios.get('http://localhost:1000/api/triptrack/registrations/admin/excursions');
        setExcursions(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchExcursions();
  }, []);

  const confirmRegistration = async (registrationId) => {
    try {
      await axios.put(`http://localhost:1000/api/triptrack/registrations/admin/confirm/${registrationId}`);
      setExcursions((prevExcursions) =>
        prevExcursions.map((excursion) =>
          excursion.registration_id === registrationId ? { ...excursion, confirmation: true } : excursion,
        ),
      );
    } catch (error) {
      console.error('Unable to confirm registration:', error.message);
      alert('Unable to confirm registration. Please try again later.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PageContainer>
      <Title>Manage Excursions</Title>
      <ExcursionsContainer>
        {excursions.map((excursion) => (
          <ExcursionItem key={excursion.registration_id}>
            <ExcursionInfo>
              <ExcursionName>{excursion.excursion_title}</ExcursionName>
              <UserName>User: {excursion.name}</UserName>
              <ExcursionDate>{format(new Date(excursion.date_time), 'yyyy.MM.dd HH:mm') + ' val.'}</ExcursionDate>
            </ExcursionInfo>
            <ConfirmButton
              onClick={() => confirmRegistration(excursion.registration_id)}
              disabled={excursion.confirmation}
            >
              {excursion.confirmation ? 'Confirmed' : 'Confirm'}
            </ConfirmButton>
          </ExcursionItem>
        ))}
      </ExcursionsContainer>
    </PageContainer>
  );
};

export default ManageExcursions;
