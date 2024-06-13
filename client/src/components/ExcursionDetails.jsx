import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { AuthContext } from '../utils/AuthContext';

const PageContainer = styled.div`
  padding: 7rem 3rem 2rem 3rem;
  max-width: 75rem;
  margin: 0 auto;
`;

const ExcursionDetailsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  max-width: 75rem;
  padding: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
`;

const DetailItem = styled.div`
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;

  h2 {
    font-size: 0.85rem;
    color: #818181;
    margin-bottom: 0.5rem;
    font-weight: normal;
  }

  p {
    font-size: 1.1rem;
    margin: 0.5rem 0;
  }
`;

const Details = styled.div`
  flex: 1;
`;

const ImageContainer = styled.div`
  width: 40%;
  margin-right: 20px;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 0.25rem;
`;

const IconContainer = styled.p`
  display: flex;
  gap: 0.5rem;
`;
const StyledIcon = styled.img`
  width: 2rem;
  &:hover {
    filter: brightness(0.5);
    transform: scale(0.9);
  }
`;

const Button = styled.button`
  background-color: #ffffff;
  color: #000;
  border: 1px solid #dddddd;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  transition:
    background-color 0.3s,
    color 0.3s,
    transform 0.3s;
  &:hover {
    background-color: #dddddd;
    transform: scale(1.05);
  }
`;

const ExcursionDetails = () => {
  const { id } = useParams();
  const [excursion, setExcursion] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  

  const [excursionSchedule, setExcursionSchedule] = useState([]);

  useEffect(() => {
    const fetchExcursionDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:1000/api/triptrack/excursions/${id}`);
        setExcursion(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch excursion details:', error);
      }
    };

    fetchExcursionDetails();
  }, [id]);

  useEffect(() => {
    // kreipimasis i serveri, kad gauti info apie datas ir laikus
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`http://localhost:1000/api/triptrack/schedule/${id}`);
        setExcursionSchedule(response.data); // iset'inam gautus duomenis i usestate
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchSchedule(); // funkcijos iskvietimas laiku gavimui
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!excursion) {
    return <p>Excursion not found</p>;
  }

  return (
    <PageContainer>
      <ExcursionDetailsContainer>
        {excursion && (
          <>
            <Details>
              <DetailItem>
                <h2>Title:</h2>
                <p>{excursion.title}</p>
              </DetailItem>
              <DetailItem>
                <h2>Type:</h2>
                <p>{excursion.type}</p>
              </DetailItem>
              <DetailItem>
                <h2>Duration:</h2>
                <p>{excursion.duration} min</p>
              </DetailItem>
              <DetailItem>
                <h2>Price:</h2>
                <p>{excursion.price} €</p>
              </DetailItem>
              <DetailItem>
                <h2>Rating:</h2>
                <p>{excursion.average_rating}</p>
              </DetailItem>
              {isAuthenticated && !isAdmin && (
                <DetailItem>
                  <>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/excursions/${id}/addreview`);
                      }}
                    >
                      Add Review
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/excursions/${id}/register`);
                      }}
                    >
                      Register
                    </Button>
                  </>
                </DetailItem>
              )}

            </Details>
            {excursion.image && (
              <ImageContainer>
                <Image src={excursion.image} alt={excursion.title} />
              </ImageContainer>
            )}
          </>
        )}
      </ExcursionDetailsContainer>
    </PageContainer>
  );
};

export default ExcursionDetails;
