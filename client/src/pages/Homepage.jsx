import styled from 'styled-components';
import { Excursions } from '../components/Excurcions';

const HomePageContainer = styled.div`
  padding: 5rem 3rem 2rem 3rem;
  max-width: 75rem;
  margin: 0 auto;
`;

const Title = styled.div`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-family: 'Poppins', sans-serif;
  line-height: 2rem;
`;

const Text = styled.p`
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  line-height: 1.5rem;
`;

function Homepage() {
  return (
    <HomePageContainer>
      <Title>Welcome to Vilnius Excursions!</Title>
      <Text>
        Explore the beautiful city of Vilnius with us! We offer unique tours to the historical and cultural landmarks of
        the capital of Lithuania. Learn more about the rich history of the city, visit its most beautiful places, and
        enjoy unforgettable experiences.
      </Text>
      <Excursions />
    </HomePageContainer>
  );
}

export default Homepage;
