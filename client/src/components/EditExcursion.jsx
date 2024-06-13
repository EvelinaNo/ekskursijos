import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import SyncLoader from 'react-spinners/SyncLoader';

const EditExcursionContainer = styled.div`
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

const FormTitle = styled.p`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
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
  font-size: 1rem;
`;

const Input = styled.input`
  height: 40px;
  padding: 5px;
  border: 1px solid rgba(221, 221, 221, 1);
  border-radius: 4px;
  outline: none;
  color: #333333;
  font-size: 1rem;

  &:focus {
    border-color: #000;
    outline: none;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 45px;
  padding: 10px;
  background-color: #ffffff;
  color: #000;
  font-size: 0.9rem;
  border: 1px solid #000000;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
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

const TypeSelect = styled.select`
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

const DateTimeField = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  & > input {
    flex: 1;
    margin-right: 8px;
  }
`;

const AddAndRemoveButton = styled.button`
  height: 40px;
  padding: 0 10px;
  background-color: #ffffff;
  color: #000;
  border: 1px solid #dddddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #dddddd;
  }
`;

const ErrorMessage = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  color: #990000;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
`;

const EditExcursion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    type: 'individual',
    date_times: [],
    duration: '',
    price: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchExcursion = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:1000/api/triptrack/excursions/${id}`);
        const excursion = response.data;
        setFormData({
          title: excursion.title,
          image: excursion.image,
          type: excursion.type,
          date_times: excursion.date_time, // Iš kiekvieno objekto ištraukiame tik data_time
          duration: excursion.duration,
          price: excursion.price,
        });
        console.log(excursion);
      } catch (error) {
        console.error('Error fetching excursion:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExcursion();
  }, [id]);



  const handleChange = (e, index) => {
    const newDateTimes = [...formData.date_times];
    newDateTimes[index] = e.target.value;
    setFormData({
      ...formData,
      date_times: newDateTimes,
    });
  };

  const addDateTime = () => {
    setFormData({
      ...formData,
      date_times: [...formData.date_times, ''],
    });
  };

  const removeDateTime = (index) => {
    const newDateTimes = [...formData.date_times];
    newDateTimes.splice(index, 1);
    setFormData({
      ...formData,
      date_times: newDateTimes,
    });
  };

  // Validacija
  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.title) {
      valid = false;
      newErrors.title = 'Title is required.';
    } else if (formData.title.length < 2 || formData.title.length > 50) {
      valid = false;
      newErrors.title = 'Title must be between 2 and 50 characters long.';
    }

    if (!formData.image) {
      valid = false;
      newErrors.image = 'Image URL is required.';
    }

    if (!formData.duration) {
      valid = false;
      newErrors.duration = 'Duration is required.';
    }

    if (!formData.price) {
      valid = false;
      newErrors.price = 'Price is required.';
    }

    formData.date_times.forEach((date_time, index) => {
      if (!date_time) {
        valid = false;
        newErrors[`date_time_${index}`] = 'Date and time is required.';
      }
    });

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
      await axios.patch(`http://localhost:1000/api/triptrack/excursions/${id}`, {
        title: formData.title,
        image: formData.image,
        type: formData.type,
        duration: formData.duration,
        price: formData.price,
      });

      // Update each date and time
      await axios.patch(`http://localhost:1000/api/triptrack/excursions/${id}/updateTimeSlot`, {
        date_times: formData.date_times, // Perduodame masyva
      });

      navigate(`/excursions/${id}`);
    } catch (error) {
      setErrors({ api: 'Error updating excursion: ' + error.message });
      console.error('Error updating excursion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditExcursionContainer>
      <FormTitle>Edit Excursion</FormTitle>
      <StyledForm onSubmit={handleSubmit}>
        <FormField>
          <Label htmlFor="name">Title:</Label>
          <Input
            type="text"
            id="name"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            minLength={2}
            maxLength={50}
            required
          />
          {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
        </FormField>
        <FormField>
          <Label htmlFor="image">Image URL:</Label>
          <Input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            required
          />
          {errors.image && <ErrorMessage>{errors.image}</ErrorMessage>}
        </FormField>
        <FormField>
          <Label htmlFor="type">Type:</Label>
          <TypeSelect
            id="type"
            name="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="group">Group</option>
            <option value="individual">Individual</option>
          </TypeSelect>
        </FormField>
        {formData.date_times &&
          formData.date_times.map((date_time, index) => (
            <FormField key={index}>
              <Label htmlFor={`date_time_${index}`}>Date and time:</Label>
              <DateTimeField>
                <Input
                  type="datetime-local"
                  id={`date_time_${index}`}
                  name={`date_time_${index}`}
                  value={date_time}
                  onChange={(e) => handleChange(e, index)}
                  required
                />
                {errors[`date_time_${index}`] && (
                  <ErrorMessage>{errors[`date_time_${index}`]}</ErrorMessage>
                )}
                <AddAndRemoveButton type="button" onClick={() => removeDateTime(index)}>
                  Remove
                </AddAndRemoveButton>
              </DateTimeField>
            </FormField>
          ))}
        <FormField>
          <AddAndRemoveButton type="button" onClick={addDateTime}>
            Add Date and Time
          </AddAndRemoveButton>
        </FormField>
        <FormField>
          <Label htmlFor="duration">Duration min:</Label>
          <Input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
          />
          {errors.duration && <ErrorMessage>{errors.duration}</ErrorMessage>}
        </FormField>
        <FormField>
          <Label htmlFor="price">Price:</Label>
          <Input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
          {errors.price && <ErrorMessage>{errors.price}</ErrorMessage>}
        </FormField>
        {errors.api && <ErrorMessage>{errors.api}</ErrorMessage>}
        <SubmitButton type="submit" disabled={loading}>
          {loading ? (
            <LoadingContainer>
              <SyncLoader size={8} color={'#000000'} />
            </LoadingContainer>
          ) : (
            'Update Excursion'
          )}
        </SubmitButton>
      </StyledForm>
    </EditExcursionContainer>
  );
};

export default EditExcursion;
