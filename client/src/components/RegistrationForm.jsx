import { useState } from 'react';
import styled from 'styled-components';

import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/apis.js';

const RegistrationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 auto;
  align-items: center;
  width: 100%;
  max-width: 25rem;
  line-height: 36px;
  font-size: 1rem;
  color: #666666;
  padding: 50px 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 35rem;
  width: 100%;
  padding-top: 2rem;
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

const SubmitButton = styled.button`
  width: 100%;
  height: 45px;
  padding: 0.7rem;
  background-color: #fff;
  color: #000000;
  border: 1px solid #000000;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, transform 0.3s;
  margin-top: 20px;

  &:hover {
    background-color: #dddddd;
    color: #000000;
    border: 1px solid #dddddd;
    transform: scale(1.05);
  }
`;

const FormForSignIn = styled.p`
  display: flex;
  max-width: 535px;
  width: 100%;
  font-size: 16px;
  justify-content: center;
  margin-top: 15px;
  align-items: center;
  gap: 10px;
`;

const ErrorMessage = styled.p`
  color: #990000;
  line-height: 20px;
  font-size: 13px;
`;

const SignLink = styled(Link)`
color: #000;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (data.password !== data.repeatPassword) {
      setError('repeatPassword', {
        type: 'manual',
        message: 'Passwords do not match. Rewrite password.',
      });
      return;
    }

    try {
      await registerUser(data);
      setSuccessMessage('Registration successful!');
      //To do: fix path to login, when needed.
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('email', {
          type: 'manual',
          message: error.response.data.errors[0].msg,
        });
      } else {
        setServerError('Something went wrong. Please try again later');
      }
    }
  };

  return (
    <RegistrationContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormField>
          <Label htmlFor="name">Username</Label>
          <Input
            {...register('name', {
              required: true,
              minLength: 6,
              maxLength: 32,
            })}
          />
          {errors.name && <ErrorMessage>Username is required and must be between 6 and 32 characters</ErrorMessage>}
        </FormField>

        <FormField>
          <Label htmlFor="email">Email address</Label>
          <Input
            type="email"
            {...register('email', {
              required: true,
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </FormField>

        <FormField>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            {...register('password', {
              required: true,
              minLength: 8,
              maxLength: 128,
              pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&~#^_+=\-';,./|":<>?])[A-Za-z\d@$!%*?&~#^_+=\-';,./|":<>?]{8,128}$/,
            })}
          />
          {errors.password && (
            <ErrorMessage>
              Password must contain at least one uppercase letter, one lowercase letter, one number, and one special
              character
            </ErrorMessage>
          )}
        </FormField>

        <FormField>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input type="password" {...register('repeatPassword', { required: true })} />
          {errors.repeatPassword && <ErrorMessage>{errors.repeatPassword.message}</ErrorMessage>}
        </FormField>

        <SubmitButton type="submit">CREATE AN ACCOUNT</SubmitButton>
      </Form>
      <FormForSignIn>
        Do you already have an account? <SignLink to="/login">Sign in</SignLink>
      </FormForSignIn>
    </RegistrationContainer>
  );
}

export default RegistrationForm;
