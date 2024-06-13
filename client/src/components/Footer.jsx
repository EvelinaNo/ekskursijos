import styled from 'styled-components';

const FooterContainer = styled.footer`
padding-top: 3rem;
padding-bottom: 1rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  
`;

function Footer() {
  return (
    <FooterContainer>
      Copywrite © 2024 TripTrack
    </FooterContainer>
  );
}

export default Footer;