'use client';

import { Pagination } from 'flowbite-react';
import React from 'react';

type Props = {
    currentPage: number;
    pageCount: number;
    // Function to call when a new page is selected.
    pageChanged: (page: number) => void;
}

export default function AppPagination({ currentPage, pageCount, pageChanged }: Props) {
  return (
    <Pagination
        currentPage={currentPage}
        onPageChange={(newPage) => pageChanged(newPage)}
        totalPages={pageCount}
        layout='pagination'
        showIcons={true}
        className='text-blue-500 mb-5'
    />
  );
}
