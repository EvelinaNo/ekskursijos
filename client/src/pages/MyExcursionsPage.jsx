import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../utils/AuthContext';
import styled from 'styled-components';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { DeleteModal } from '../components/DeleteModal';

const PageContainer = styled.div`
  padding: 7rem 3rem 2rem 3rem;
  max-width: 75rem;
  margin: 0 auto;
`;

const ExcursionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.p`
  font-weight: 500;
  font-size: 1.25rem;
  word-break: break-word;
  user-select: none;
  padding-bottom: 2rem;
  color: #666666;
`;

const ExcursionItem = styled.div`
  border: 1px solid #dddddd;
  border-radius: 0.25rem;
  padding: 1rem;
  width: calc(33.33% - 1rem);
`;

const ExcursionName = styled.div`
  font-weight: 500;
  font-size: 1rem;
  word-break: break-word;
  user-select: none;
  line-height: 1.5;
`;

const ExcursionDate = styled.div`
  font-weight: 500;
  font-size: 1rem;
  word-break: break-word;
  user-select: none;
  line-height: 1.5;
`;
const Status = styled.div`
  color: ${(props) => (props.isConfirmed ? 'green' : 'red')};
  line-height: 1.5;
`;

const Button = styled.button`
  background-color: #ffffff;
  color: #000;
  border: 1px solid #dddddd;
  padding: 0.5rem 1rem;
  margin: 1rem 1rem 1rem 0;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition:
    background-color 0.3s,
    color 0.3s,
    transform 0.3s;

  &:hover {
    background-color: #dddddd;
    transform: scale(1.05);
  }
`;

const MyExcursionsPage = () => {
  const { user } = useContext(AuthContext);
  const [deleteModalItemId, setDeleteModalItemId] = useState(null);
  const [excursions, setExcursions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExcursions = async () => {
      if (user && user.id) {
        try {
          const response = await axios.get(`http://localhost:1000/api/triptrack/users/${user.id}/my-excursions`);
          setExcursions(response.data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('User not found');
      }
    };

    if (user) {
      fetchExcursions();
    }
  }, [user]);
  console.log(excursions);

  const cancelRegistration = async (registrationId) => {
    try {
      await axios.delete(`http://localhost:1000/api/triptrack/users/${registrationId}`);
      // atšaukus registraciją, atnaujiname ekskursijų sąrašą
      const response = await axios.get(`http://localhost:1000/api/triptrack/users/my-excursions/${user.id}`);
      setExcursions(response.data);
    } catch (error) {
      console.error('Unable to cancel registration:', error.message);
      alert('Unable to cancel registration. Please try again later.');
    }
  };

  const handleChangeDate = (excursionId, registrationId) => {
    navigate(`/excursions/${excursionId}/register-edit/${registrationId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <PageContainer>
        <Title>My excursions</Title>
        <ExcursionsContainer>
          {excursions.length === 0 ? (
            <p>No registered excursions found.</p>
          ) : (
            excursions.map((excursion) => {
              const formatted_date_time = format(new Date(excursion.date_time), 'yyyy.MM.dd HH:mm') + ' val.';
              return (
                <ExcursionItem key={excursion.registration_id}>
                  <ExcursionName>{excursion.excursion_title}</ExcursionName>
                  <ExcursionDate>{formatted_date_time}</ExcursionDate>
                  <Status isConfirmed={excursion.confirmation}>
                    {excursion.confirmation ? 'Confirmed' : 'Not confirmed'}
                  </Status>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModalItemId(excursion.registration_id);
                    }}
                  >
                    Cancel registration
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChangeDate(excursion.excursion_id, excursion.registration_id);
                    }}
                  >
                    Change date
                  </Button>
                </ExcursionItem>
              );
            })
          )}
        </ExcursionsContainer>
        {deleteModalItemId && (
          <DeleteModal
            excursionId={deleteModalItemId}
            onClose={() => setDeleteModalItemId(null)}
            onDelete={() => {
              cancelRegistration(deleteModalItemId);
              setDeleteModalItemId(null);
            }}
          />
        )}
      </PageContainer>
    </>
  );
};

export default MyExcursionsPage;
