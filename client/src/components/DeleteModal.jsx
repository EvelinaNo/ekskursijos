import { styled } from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
  width: 30rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
`;

const Message = styled.p`
  font-size: 1rem;
  margin-top: 1rem;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 1rem;
`;

const Button = styled.button`
  width: 100px;
  height: 50px;
  padding: 10px;
  color: #ffffff;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 30px;

  &:hover {
    background-color: #dddddd;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: #ffffff;
  color: #000;
  border: 1px solid #000;
  &:hover {
    border: 1px solid #dddddd;
    transform: scale(1.05);
  }
`;

const CancelButton = styled(Button)`
  background-color: #ffffff;
  color: #000;
  border: 1px solid #dddddd;
  &:hover {
    transform: scale(1.05);
  }
`;

export const DeleteModal = ({ excursionId, onClose, onDelete }) => {
  const handleConfirmClick = () => {
    onDelete(excursionId);
    onClose();
  };

  const handleCancelClick = () => {
    onClose();
  };

  return (
    <ModalOverlay onClick={handleCancelClick}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>Delete Confirmation</Title>
        <Message>Are you sure you want to delete?</Message>
        <ButtonContainer>
          <ConfirmButton onClick={() => handleConfirmClick()}>Yes</ConfirmButton>
          <CancelButton onClick={handleCancelClick}>No</CancelButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};
