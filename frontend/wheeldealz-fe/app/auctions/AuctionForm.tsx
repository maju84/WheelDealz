'use client';

import { Button } from 'flowbite-react';
import React, { useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import Input from '../components/Input';
import DateInput from '../components/DateInput';
import { createAuction } from '../actions/GetAuctionsAction';
import { useRouter } from 'next/navigation';

export default function AuctionForm() {
  const router = useRouter();
  const { 
    control,  // Object for controlling input components, including rules for validation.
    handleSubmit, // Function to handle form submission, providing form data to a callback.
    setFocus, // Method to programmatically set focus on a specific form field.
    formState: { 
      isSubmitting, // Flag indicating if the form is currently in the process of being submitted.
      isValid, // Flag that is true if all form fields meet the validation criteria.
      isDirty, // Flag indicating if any field has been modified from its initial value.
      }} 
      = useForm(
        { mode: 'onTouched' } // trigger validation on access
    );

  useEffect(() => {
    setFocus('make'); // focus on make input when component mounts
  }, [setFocus]);   // trigger only once, when component mounts and setFocus changes


  const onSubmit = async (data: FieldValues) => {
    try {
      // endpoint expects endsAt, not auctionEnd
      const transformedAuctionData: FieldValues = {
        ...data,
        endsAt: data.auctionEnd,
      };
      delete transformedAuctionData.auctionEnd;

      const res = await createAuction(transformedAuctionData);
      if (res.error) {
        throw new Error(res.error);
      }
      router.push(`/auctions/details/${res.id}`); // todo 
    } catch (error) { 
      console.error('Error creating auction:', error);
    }
  };


  return (
    <form className='flex flex-col mt-3' onSubmit={handleSubmit(onSubmit)}>
      <Input label='Make' name='make' control={ control }
        rules={{ required: 'Make is required' }} />
      
      <Input label='Model' name='model' control={ control }
        rules={{ required: 'Model is required' }} />    

      <Input label='Color' name='color' control={ control }
          rules={{ required: 'Color is required' }} />   

      <div className='grid grid-cols-2 gap-3'>
        <Input label='Year' name='year' control={ control } type='number'
          rules={{ required: 'Year is required' }} />    

        <Input label='Mileage' name='mileage' control={ control } type='number'
          rules={{ required: 'Mileage is required' }} />
      </div>

      <Input label='Image URL' name='imageUrl' control={ control }
        rules={{ required: 'Image URL is required' }} />

      <div className='grid grid-cols-2 gap-3'>
        <Input label='Reserve Price or 0 if no reserve' name='reservePrice' control={ control } type='number'
          rules={{ required: 'Reserve Price is required' }} />
        <DateInput 
          label='Auction End Date and Time'
          name='auctionEnd'
          control={ control }
          dateFormat='dd MMMM yyyy hh:mm a'
          showTimeSelect
          rules={{ required: 'End Date is required' }} />
      </div>

      <div className='flex justify-between'>
        <Button outline color='gray'>Cancel</Button>
        <Button
          isProcessing={isSubmitting}
          disabled={!isValid || !isDirty}
          type='submit'
          outline color='success'>Submit</Button>
      </div>

    </form>
  );
}
