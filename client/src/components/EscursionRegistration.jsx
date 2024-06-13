import { useContext, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { AuthContext } from '../utils/AuthContext';

const RegistrationContainer = styled.div`
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 3rem;
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

const Button = styled.button`
  width: 100%;
  height: 45px;
  padding: 0.7rem;
  background-color: #fff;
  color: #000000;
  border: 1px solid #000000;
  border-radius: 5px;
  font-size: 0.9rem;
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

const Select = styled.select`
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

const Option = styled.option`
  padding: 0.5rem;
`;

const ErrorMessage = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  color: #990000;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
`;

const ExcursionRegistration = () => {
  const navigate = useNavigate();
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date_time: '',
  });
  const [errors, setErrors] = useState({});
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const userId = user ? user.id : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await axios.get(`http://localhost:1000/api/triptrack/excursions/${id}/schedule`);
        const formattedDates = response.data.map((item) => ({
          ...item,
          formatted_date_time: format(new Date(item.date_time), 'yyyy.MM.dd HH:mm') + ' val.',
        }));
        setDates(formattedDates);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchDates();
  }, [id]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.name) {
      valid = false;
      newErrors.name = 'Name is required.';
    } else if (formData.name.length < 2 || formData.name.length > 50) {
      valid = false;
      newErrors.name = 'Name must be between 2 and 50 characters long.';
    }

    if (!formData.date_time) {
      valid = false;
      newErrors.date_time = 'Date and time is required.';
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Do not proceed if the form is invalid
    }
    try {
      // Išsiunciame duomenis i serveri
      await axios.post(`http://localhost:1000/api/triptrack/excursions/${id}/register`, {
        name: formData.name,
        date_time: formData.date_time,
        user_id: userId,
        excursion_id: id,
      });

      // Pranesimas apie sekminga registracija
      alert('Registration successful!');

      // Nukreipiame i ekskursiju puslapi
      navigate(`/excursions/${id}`);
    } catch (error) {
      // Pranesimas apie nesekminga registracija
      console.error('Registration failed:', error.message);
      alert('Registration failed. Please try again later.');
    }
  };

  return (
    <RegistrationContainer>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="name">Name:</Label>
          <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          <Label htmlFor="date_time">Date and time:</Label>
          <Select id="date_time" name="date_time" value={formData.date_time} onChange={handleChange} required>
            <Option value="">Select Date</Option>
            {dates.map((date) => (
              <Option key={date.date_time} value={date.date_time}>
                {date.formatted_date_time}
              </Option>
            ))}
          </Select>
          {errors.date_time && <ErrorMessage>{errors.date_time}</ErrorMessage>}
          <Button type="submit">Register</Button>
        </Form>
      )}
    </RegistrationContainer>
  );
};

export default ExcursionRegistration;
