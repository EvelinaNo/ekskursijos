import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import SyncLoader from 'react-spinners/SyncLoader';
import { AuthContext } from '../utils/AuthContext';

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 auto;
  align-items: center;
  width: 100%;
  max-width: 700px;
  line-height: 36px;
  font-size: 20px;
  color: #666666;
  padding: 50px 30px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 3rem;
`;

const FormField = styled.div`
  font-size: 16px;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 16px;
`;

const Label = styled.label`
  height: 24px;
  margin-bottom: 7px;
  font-size: 16px;
`;

const Input = styled.input`
  height: 40px;
  padding: 5px;
  border: 1px solid rgba(221, 221, 221, 1);
  border-radius: 4px;
  outline: none;
  color: #333333;
  font-size: 16px;

  &:focus {
    border-color: #000;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  height: 200px;
  padding: 5px;
  border: 1px solid rgba(221, 221, 221, 1);
  border-radius: 4px;
  outline: none;
  color: #333333;
  font-size: 16px;
  resize: vertical;
  &:focus {
    border-color: #000;
    outline: none;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 45px;
  padding: 0.7rem;
  background-color: #fff;
  color: #000;
  border: 1px solid #000000;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s,
    transform 0.3s;
  margin-top: 20px;
  &:hover {
    background-color: #dddddd;
    color: #000000;
    border: 1px solid #dddddd;
    transform: scale(1.05);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ErrorMessage = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  color: #990000;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
`;

const AddReviewForm = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rating: '',
    comment: '',
  });
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const userId = user ? user.id : null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validacija
  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.rating || formData.rating < 1 || formData.rating > 10) {
      valid = false;
      newErrors.rating = 'Rating must be between 1 and 10.';
    }

    if (!formData.comment || formData.comment.length < 2 || formData.comment.length > 10000) {
      valid = false;
      newErrors.comment = 'Comment must be between 2 and 10000 characters long.';
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Do not proceed if the form is invalid
    }

    setLoading(true);

    try {
      const response = await axios.post(`http://localhost:1000/api/triptrack/excursions/${id}/addreview`, {
        rating: formData.rating,
        comment: formData.comment,
        user_id: userId,
        excursion_id: id,
      });
      console.log(response.data);

      navigate('/excursions');
    } catch (error) {
      setErrors({ api: 'Error creating review: ' + error.message });
      console.error('Error creating review:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReviewContainer>
      <StyledForm onSubmit={handleSubmit}>
        <FormField>
          <Label htmlFor="rating">Rating:</Label>
          <Input
            type="number"
            min="1"
            max="10"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
          />
          {errors && <ErrorMessage>{errors.rating}</ErrorMessage>}
        </FormField>

        <FormField>
          <Label htmlFor="comment">Comment:</Label>
          <TextArea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            minLength={2}
            maxLength={10000}
            required
          />
          {errors && <ErrorMessage>{errors.comment}</ErrorMessage>}
        </FormField>

        {errors && <ErrorMessage>{errors.api}</ErrorMessage>}

        {loading ? (
          <LoadingContainer>
            <SyncLoader color={'#dddddd'} loading={loading} size={20} />
          </LoadingContainer>
        ) : (
          <SubmitButton type="submit">Add review</SubmitButton>
        )}
      </StyledForm>
    </ReviewContainer>
  );
};

export default AddReviewForm;
