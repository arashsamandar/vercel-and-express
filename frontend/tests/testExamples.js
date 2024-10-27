import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddBooksForm from './AddBooksForm';

// Mock alert function for the test
global.alert = jest.fn();

describe('AddBooksForm Component', () => {
    beforeEach(() => {
        render(<AddBooksForm />);
    });

    test('renders form with empty input fields initially', () => {
        expect(screen.getByLabelText(/Name/i)).toHaveValue('');
        expect(screen.getByLabelText(/Email/i)).toHaveValue('');
        expect(screen.getAllByLabelText(/Password/i)[0]).toHaveValue('');
        expect(screen.getAllByLabelText(/Password/i)[1]).toHaveValue('');
    });

    test('validates minimum input length of 5 characters', () => {
        const nameInput = screen.getByLabelText(/Name/i);
        fireEvent.change(nameInput, { target: { value: '123' } });
        expect(nameInput).toHaveClass('border-red-500');

        fireEvent.change(nameInput, { target: { value: '12345' } });
        expect(nameInput).not.toHaveClass('border-red-500');
    });

    test('displays validation styling when input is invalid', () => {
        const nameInput = screen.getByLabelText(/Name/i);
        fireEvent.change(nameInput, { target: { value: '123' } });
        expect(nameInput).toHaveClass('border-red-500');

        const emailInput = screen.getByLabelText(/Email/i);
        fireEvent.change(emailInput, { target: { value: '12' } });
        expect(emailInput).toHaveClass('border-red-500');
    });

    test('calls submitFormFunction on form submission', () => {
        const submitButton = screen.getByRole('button', { name: /submit/i });

        fireEvent.click(submitButton);
        expect(global.alert).toHaveBeenCalledWith('hello arash solomon');
    });

    test('form submission does not proceed with invalid input', () => {
        const nameInput = screen.getByLabelText(/Name/i);
        fireEvent.change(nameInput, { target: { value: '123' } });

        const submitButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitButton);

        expect(global.alert).not.toHaveBeenCalled();
    });
});
