import styled from 'styled-components';

function ErrorPage() {
  const Container = styled.div`
    text-align: center;
    margin: 100px auto;
    padding: 20px;
    max-width: 600px;
    background-color: #fff;
  `;

  const Title = styled.h1`
    color: #333;
    font-size: 2rem;
    font-weight: 500;
    margin-bottom: 50px;
  `;

  const Text = styled.p`
    color: #666;
    margin: 20px 0;
    line-height: 1.5;
  `;

  const Link = styled.a`
    color: #333;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      text-decoration: none;
      color: #c7c6c6;
    }
  `;

  return (
    <Container>
      <Title>Oops! Something went wrong...</Title>
      <Text>Looks like the page you were searching for got lost in the Bermuda Triangle of the internet.</Text>
      <Text>
        Please go back to the <Link href="/">homepage</Link>.
      </Text>
    </Container>
  );
}

export default ErrorPage;
