import { styled } from 'styled-components';
import plusIcon from '../assets/plus.svg';


const Container = styled.div`
  position: relative;
  max-width: 15.625rem;
  width: 100%;
`

const Button = styled.button`
    border: 1px solid #DDDDDD;
    border-radius: 0.25rem;
    background: #ffffff;
    padding: 0.563rem 0.938rem 0.563rem 3rem;
    color: #d9d9d9;
    font-size:1rem;
    max-width: 15.625rem;
    width: 100%;
    text-align: left;
    &:hover {
      color: #000;
      border-color: #000;
      outline: none;
  }
`;

const StyledIcon = styled.img`
width:2rem;
  position: absolute;
  top: 50%;
  left: 0.8rem;
  transform: translateY(-50%);
  z-index: 4;
`

const CreateButton = ({ onClick, buttonTitle }) => {
  return (
    <Container>
        <Button onClick={onClick}>{buttonTitle}</Button>
        <StyledIcon src={plusIcon} />
    </Container>
);
};

export default CreateButton;